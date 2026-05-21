const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ── BASE DE DATOS EN MEMORIA ──────────────────────────────────────

const generateSlots = () => {
  const slots = [];
  const today = new Date();
  for (let d = 1; d <= 14; d++) {
    const date = new Date(today);
    date.setDate(today.getDate() + d);
    if (date.getDay() === 0) continue;
    const dateStr = date.toISOString().split('T')[0];
    const times = ['08:00','09:00','10:00','11:00','14:00','15:00','16:00','17:00'];
    times.forEach(t => {
      if (Math.random() > 0.35)
        slots.push({ id: uuidv4(), date: dateStr, time: t, available: true });
    });
  }
  return slots;
};

const DB = {
  appointments: [],
  orders: [],
  reviews: [],
  coupons: [
    { code: 'BIENVENIDA20', discount: 20, maxUses: 100, used: 5, active: true, minAmount: 100000 },
    { code: 'DESCUENTO50K', discount: 15, maxUses: 50, used: 12, active: true, minAmount: 150000 },
    { code: 'REFERIDO10', discount: 10, maxUses: 999, used: 45, active: true, minAmount: 80000 }
  ],
  contacts: [],
  clients: [
    {
      id: 'c1',
      name: 'María González',
      email: 'maria@example.com',
      phone: '300-123-4567',
      vehicle: { make: 'Honda', model: 'Civic', year: 2018, plate: 'ABC-123', km: 45000 },
      tier: 'Oro',
      points: 1250,
      lastServiceDate: '2026-04-15',
      nextRecommendedKm: 55000,
      totalSpent: 850000
    }
  ],
  services: [
    { id:'s1', name:'Cambio de Aceite y Filtro',     price:85000,  duration:60,  category:'Mantenimiento', desc:'Aceite sintético 5W-30 con filtro de alta eficiencia' },
    { id:'s2', name:'Revisión de Frenos Completa',   price:180000, duration:120, category:'Seguridad',     desc:'Inspección de pastillas, discos y líquido de frenos' },
    { id:'s3', name:'Diagnóstico OBD-II',            price:65000,  duration:45,  category:'Diagnóstico',   desc:'Lectura de códigos de error con reporte digital' },
    { id:'s4', name:'Alineación y Balanceo',         price:95000,  duration:90,  category:'Neumáticos',    desc:'Alineación láser de 4 ruedas con balanceo computarizado' },
    { id:'s5', name:'Mantenimiento 50.000 km',       price:320000, duration:180, category:'Mantenimiento', desc:'Paquete completo: aceite, filtros, bujías, revisión general' },
    { id:'s6', name:'Sistema de Suspensión',         price:250000, duration:150, category:'Seguridad',     desc:'Amortiguadores, resortes y brazos de suspensión' },
    { id:'s7', name:'Cambio de Batería',             price:120000, duration:30,  category:'Eléctrico',     desc:'Batería AGM de alta capacidad con instalación' },
    { id:'s8', name:'Servicio de Aire Acondicionado',price:145000, duration:90,  category:'Climatización', desc:'Recarga de gas refrigerante y revisión del sistema' }
  ],
  parts: [
    { id:'p1', name:'Filtro de Aceite Bosch',        price:28000,  stock:45, brand:'Bosch',  category:'Filtros',     sku:'BOF-0451103376' },
    { id:'p2', name:'Pastillas de Freno Brembo',     price:85000,  stock:20, brand:'Brembo',  category:'Frenos',      sku:'BRE-P85020N' },
    { id:'p3', name:'Aceite Mobil 1 5W-30 4L',      price:95000,  stock:30, brand:'Mobil',   category:'Lubricantes', sku:'MOB-102997' },
    { id:'p4', name:'Bujías NGK Iridium (x4)',       price:120000, stock:15, brand:'NGK',     category:'Encendido',   sku:'NGK-ILKAR7L11' },
    { id:'p5', name:'Batería Optima RedTop 45Ah',    price:380000, stock:8,  brand:'Optima',  category:'Eléctrico',   sku:'OPT-8020-164' },
    { id:'p6', name:'Filtro de Aire K&N',            price:145000, stock:12, brand:'K&N',     category:'Filtros',     sku:'KN-33-2304' },
    { id:'p7', name:'Amortiguador KYB (par)',         price:290000, stock:6,  brand:'KYB',     category:'Suspensión',  sku:'KYB-344453' },
    { id:'p8', name:'Líquido de Frenos DOT 4 500ml', price:32000,  stock:40, brand:'ATE',     category:'Frenos',      sku:'ATE-039907' }
  ],
  availableSlots: generateSlots()
};

// ── RUTAS SERVICIOS ───────────────────────────────────────────────
app.get('/api/services', (req, res) => res.json(DB.services));

// ── RUTAS REPUESTOS ───────────────────────────────────────────────
app.get('/api/parts', (req, res) => {
  const { search, category } = req.query;
  let parts = DB.parts;
  if (search)    parts = parts.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.brand.toLowerCase().includes(search.toLowerCase()));
  if (category)  parts = parts.filter(p => p.category === category);
  res.json(parts);
});

// ── RUTAS CITAS ───────────────────────────────────────────────────
app.get('/api/appointments/slots', (req, res) => {
  const { date } = req.query;
  let slots = DB.availableSlots.filter(s => s.available);
  if (date) slots = slots.filter(s => s.date === date);
  res.json(slots);
});

app.get('/api/appointments/dates', (req, res) => {
  const dates = [...new Set(DB.availableSlots.filter(s => s.available).map(s => s.date))].sort();
  res.json(dates);
});

app.post('/api/appointments', (req, res) => {
  const { clientName, clientEmail, clientPhone, vehicle, serviceId, slotId, notes } = req.body;
  if (!clientName || !serviceId || !slotId)
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  const slot = DB.availableSlots.find(s => s.id === slotId);
  if (!slot || !slot.available)
    return res.status(409).json({ error: 'Horario no disponible' });
  const service = DB.services.find(s => s.id === serviceId);
  slot.available = false;
  const appt = {
    id: uuidv4(),
    confirmationCode: 'ATP-' + Math.random().toString(36).substr(2,6).toUpperCase(),
    clientName, clientEmail, clientPhone, vehicle,
    service, slot: { date: slot.date, time: slot.time },
    notes, status: 'confirmed',
    createdAt: new Date().toISOString()
  };
  DB.appointments.push(appt);
  res.status(201).json(appt);
});

app.get('/api/appointments/:code', (req, res) => {
  const appt = DB.appointments.find(a => a.confirmationCode === req.params.code.toUpperCase());
  if (!appt) return res.status(404).json({ error: 'Cita no encontrada' });
  res.json(appt);
});

// ── RUTAS ÓRDENES ─────────────────────────────────────────────────
app.post('/api/orders', (req, res) => {
  const { items, client, paymentMethod } = req.body;
  if (!items || !items.length || !client)
    return res.status(400).json({ error: 'Datos incompletos' });
  try {
    const enriched = items.map(item => {
      const part = DB.parts.find(p => p.id === item.partId);
      if (!part || part.stock < item.qty) throw new Error('Stock insuficiente: ' + part?.name);
      part.stock -= item.qty;
      return { ...part, qty: item.qty, subtotal: part.price * item.qty };
    });
    const total = enriched.reduce((s, i) => s + i.subtotal, 0);
    const order = {
      id: uuidv4(),
      orderNumber: 'ORD-' + Date.now().toString().slice(-8),
      client, items: enriched, total, paymentMethod,
      status: 'pagado',
      estimatedDelivery: new Date(Date.now() + 3*86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    };
    DB.orders.push(order);
    res.status(201).json(order);
  } catch(e) {
    res.status(400).json({ error: e.message });
  }
});

// ── RUTAS CLIENTES ────────────────────────────────────────────────
app.get('/api/clients/:id', (req, res) => {
  const client = DB.clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Cliente no encontrado' });
  res.json({ ...client, appointments: DB.appointments.filter(a => a.clientEmail === client.email) });
});

// ── STATS ─────────────────────────────────────────────────────────
app.get('/api/stats', (req, res) => {
  res.json({
    totalAppointments: DB.appointments.length,
    totalOrders:       DB.orders.length,
    revenue:           DB.orders.reduce((s, o) => s + o.total, 0),
    servicesAvailable: DB.services.length,
    partsInStock:      DB.parts.reduce((s, p) => s + p.stock, 0)
  });
});

// ── SISTEMA DE LEALTAD ────────────────────────────────────────────
app.get('/api/loyalty/status', (req, res) => {
  const client = DB.clients[0]; // Demo: siempre usa María
  res.json({
    points: client.points,
    pointsValue: Math.floor(client.points / 10) * 10, // $10 por cada 10 pts
    tier: client.tier,
    benefits: {
      'Bronce': '5% descuento',
      'Plata': '10% descuento',
      'Oro': '15% descuento',
      'Platinum': '20% descuento + Servicio gratis cada 5 servicios'
    },
    nextTierAt: 5000
  });
});

// ── VALORACIONES Y REVIEWS ────────────────────────────────────────
app.post('/api/reviews', (req, res) => {
  const { appointmentCode, rating, comment, clientName, clientEmail } = req.body;
  if (!appointmentCode || !rating || rating < 1 || rating > 5)
    return res.status(400).json({ error: 'Rating debe ser entre 1-5' });
  
  const review = {
    id: uuidv4(),
    appointmentCode,
    rating,
    comment: comment || '',
    clientName,
    clientEmail,
    createdAt: new Date().toISOString()
  };
  DB.reviews.push(review);
  
  // Agregar puntos de lealtad por review
  const client = DB.clients.find(c => c.email === clientEmail);
  if (client) client.points += 50; // 50 pts por review
  
  res.status(201).json(review);
});

app.get('/api/reviews', (req, res) => {
  const avgRating = DB.reviews.length > 0 
    ? (DB.reviews.reduce((s, r) => s + r.rating, 0) / DB.reviews.length).toFixed(1)
    : 'Sin reviews aún';
  
  res.json({
    averageRating: avgRating,
    totalReviews: DB.reviews.length,
    reviews: DB.reviews.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 10)
  });
});

// ── CUPONES Y DESCUENTOS ──────────────────────────────────────────
app.post('/api/coupons/validate', (req, res) => {
  const { code, amount } = req.body;
  const coupon = DB.coupons.find(c => c.code === code.toUpperCase());
  
  if (!coupon) return res.status(404).json({ error: 'Cupón no encontrado' });
  if (!coupon.active) return res.status(400).json({ error: 'Cupón inactivo' });
  if (coupon.used >= coupon.maxUses) return res.status(400).json({ error: 'Cupón agotado' });
  if (amount < coupon.minAmount) return res.status(400).json({ error: `Monto mínimo $${coupon.minAmount}` });
  
  const discount = Math.floor((amount * coupon.discount) / 100);
  res.json({ valid: true, discount, discountPercent: coupon.discount, finalAmount: amount - discount });
});

app.post('/api/coupons/apply', (req, res) => {
  const { code, orderId } = req.body;
  const coupon = DB.coupons.find(c => c.code === code.toUpperCase());
  if (!coupon) return res.status(404).json({ error: 'Cupón no encontrado' });
  coupon.used++;
  res.json({ applied: true, message: `Cupón ${code} aplicado exitosamente` });
});

// ── RECOMENDACIONES DE MANTENIMIENTO ──────────────────────────────
app.get('/api/recommendations/:clientId', (req, res) => {
  const client = DB.clients.find(c => c.id === req.params.clientId);
  if (!client) return res.status(404).json({ error: 'Cliente no encontrado' });
  
  const recommendations = [];
  const km = client.vehicle.km;
  
  if (km % 10000 < 2000) recommendations.push({
    type: 'Mantenimiento',
    service: 'Cambio de Aceite y Filtro',
    reason: `Tu vehículo se acerca a los ${Math.ceil(km/10000)*10000} km`,
    price: 85000,
    urgency: 'URGENTE'
  });
  
  if (km % 50000 < 5000) recommendations.push({
    type: 'Mantenimiento Mayor',
    service: 'Mantenimiento 50.000 km',
    reason: `Mantenimiento preventivo programado`,
    price: 320000,
    urgency: 'ALTA'
  });
  
  if (km > 60000) recommendations.push({
    type: 'Revisión',
    service: 'Revisión de Frenos Completa',
    reason: `Revisar sistema de frenos después de 60k km`,
    price: 180000,
    urgency: 'MEDIA'
  });
  
  res.json({
    clientName: client.name,
    currentKm: km,
    recommendations: recommendations.length > 0 ? recommendations : [{ 
      type: 'Información',
      message: 'Tu vehículo está en buen estado. ¡Próxima revisión en ' + ((Math.ceil(km/10000)+1)*10000 - km) + ' km!'
    }]
  });
});

// ── FORMULARIO DE CONTACTO ────────────────────────────────────────
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  if (!name || !email || !subject || !message)
    return res.status(400).json({ error: 'Todos los campos son requeridos' });
  
  const contact = {
    id: uuidv4(),
    name, email, subject, message,
    status: 'nuevo',
    createdAt: new Date().toISOString()
  };
  DB.contacts.push(contact);
  
  // En producción, aquí se enviaría un email
  console.log(`📧 Nuevo contacto: ${name} (${email}) - ${subject}`);
  
  res.status(201).json({
    success: true,
    message: 'Tu mensaje ha sido recibido. Nos pondremos en contacto pronto.',
    ticketId: contact.id
  });
});

// ── PRODUCCIÓN: servir build de React ────────────────────────────
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '../client/dist/index.html'))
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅  AutoTechPro API → http://localhost:${PORT}`));