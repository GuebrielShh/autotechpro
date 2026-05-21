const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());

// ── MIDDLEWARE PARA COOKIES Y GDPR ────────────────────────────────
app.use((req, res, next) => {
  // Middleware para manejo de cookies
  res.locals.userConsent = req.headers.cookie?.includes('gdpr_accepted=true') || false;
  next();
});


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
  returns: [],
  gdprConsents: [],
  coupons: [
    { code: 'BIENVENIDA20', discount: 20, maxUses: 100, used: 5, active: true, minAmount: 100000 },
    { code: 'DESCUENTO50K', discount: 15, maxUses: 50, used: 12, active: true, minAmount: 150000 },
    { code: 'REFERIDO10', discount: 10, maxUses: 999, used: 45, active: true, minAmount: 80000 }
  ],
  contacts: [],
  users: [
    { id: 'u1', email: 'maria@example.com', password: 'maria123', name: 'María González', clientId: 'c1', createdAt: '2026-01-15' },
    { id: 'u2', email: 'carlos@example.com', password: 'carlos123', name: 'Carlos Mendez', clientId: 'c2', createdAt: '2026-02-20' },
    { id: 'u3', email: 'ana@example.com', password: 'ana123', name: 'Ana Rodríguez', clientId: 'c3', createdAt: '2026-03-10' }
  ],
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
    },
    {
      id: 'c2',
      name: 'Carlos Mendez',
      email: 'carlos@example.com',
      phone: '301-987-6543',
      vehicle: { make: 'Toyota', model: 'Corolla', year: 2020, plate: 'XYZ-789', km: 32000 },
      tier: 'Plata',
      points: 650,
      lastServiceDate: '2026-03-20',
      nextRecommendedKm: 40000,
      totalSpent: 450000
    },
    {
      id: 'c3',
      name: 'Ana Rodríguez',
      email: 'ana@example.com',
      phone: '302-555-8765',
      vehicle: { make: 'Chevrolet', model: 'Spark', year: 2019, plate: 'DEF-456', km: 28500 },
      tier: 'Bronce',
      points: 300,
      lastServiceDate: '2026-04-01',
      nextRecommendedKm: 30000,
      totalSpent: 220000
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
  const { items, client, paymentMethod, gdprConsent, termsAccepted, returnsAccepted } = req.body;
  
  if (!items || !items.length || !client)
    return res.status(400).json({ success: false, error: 'Datos incompletos' });
  
  // Validar aceptación de términos y políticas
  if (!gdprConsent)
    return res.status(400).json({ success: false, error: 'Debe aceptar el tratamiento de datos personales' });
  if (!termsAccepted)
    return res.status(400).json({ success: false, error: 'Debe aceptar los términos y condiciones' });
  if (!returnsAccepted)
    return res.status(400).json({ success: false, error: 'Debe aceptar la política de devoluciones' });
  
  try {
    // Validación de límite de cantidad por producto (máx 5 unidades)
    const MAX_ITEMS_PER_PRODUCT = 5;
    const enriched = items.map(item => {
      if (item.qty > MAX_ITEMS_PER_PRODUCT)
        throw new Error(`Límite máximo ${MAX_ITEMS_PER_PRODUCT} unidades por producto. Intentaste: ${item.qty}`);
      
      const part = DB.parts.find(p => p.id === item.partId);
      if (!part || part.stock < item.qty) 
        throw new Error('Stock insuficiente: ' + part?.name);
      part.stock -= item.qty;
      return { ...part, qty: item.qty, subtotal: part.price * item.qty };
    });
    
    const total = enriched.reduce((s, i) => s + i.subtotal, 0);
    const order = {
      id: uuidv4(),
      orderNumber: 'ORD-' + Date.now().toString().slice(-8),
      client, items: enriched, total, paymentMethod,
      status: 'pagado',
      returnable: true,
      returnDeadline: new Date(Date.now() + 30*86400000).toISOString().split('T')[0], // 30 días
      estimatedDelivery: new Date(Date.now() + 3*86400000).toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      gdprConsent: true,
      termsAccepted: true,
      returnsAccepted: true
    };
    DB.orders.push(order);
    
    // Registrar consentimiento GDPR
    DB.gdprConsents.push({
      id: uuidv4(),
      clientEmail: client.email,
      orderNumber: order.orderNumber,
      termsAccepted,
      gdprConsent,
      returnsAccepted,
      acceptedAt: new Date().toISOString(),
      ipAddress: 'tracking' // En producción capturar IP real
    });
    
    res.status(201).json({
      success: true,
      ...order
    });
  } catch(e) {
    res.status(400).json({ 
      success: false,
      error: e.message 
    });
  }
});

app.get('/api/orders/:email', (req, res) => {
  const orders = DB.orders.filter(o => o.client.email === req.params.email);
  res.json(orders);
});

// ── RUTAS CLIENTES ────────────────────────────────────────────────
app.get('/api/clients/:id', (req, res) => {
  const client = DB.clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Cliente no encontrado' });
  res.json({ ...client, appointments: DB.appointments.filter(a => a.clientEmail === client.email) });
});

app.put('/api/clients/:id', (req, res) => {
  const client = DB.clients.find(c => c.id === req.params.id);
  if (!client) return res.status(404).json({ error: 'Cliente no encontrado' });
  
  const { phone, vehicle } = req.body;
  
  if (phone) client.phone = phone;
  if (vehicle) {
    if (vehicle.make) client.vehicle.make = vehicle.make;
    if (vehicle.model) client.vehicle.model = vehicle.model;
    if (vehicle.year) client.vehicle.year = vehicle.year;
    if (vehicle.plate) client.vehicle.plate = vehicle.plate;
    if (vehicle.km !== undefined) client.vehicle.km = vehicle.km;
  }
  
  res.json({
    success: true,
    message: 'Datos actualizados correctamente',
    client: client
  });
});

// ── SISTEMA DE DEVOLUCIONES ──────────────────────────────────────
app.post('/api/returns/request', (req, res) => {
  const { orderId, reason, items } = req.body;
  
  if (!orderId || !reason || !items || !items.length)
    return res.status(400).json({ error: 'Datos incompletos para la devolución' });
  
  const order = DB.orders.find(o => o.id === orderId);
  if (!order) return res.status(404).json({ error: 'Orden no encontrada' });
  
  // Validar plazo de devolución (30 días)
  const orderDate = new Date(order.createdAt);
  const daysElapsed = Math.floor((Date.now() - orderDate) / (1000 * 60 * 60 * 24));
  
  if (daysElapsed > 30)
    return res.status(400).json({ 
      error: 'El plazo de devolución ha expirado (máximo 30 días desde la compra)',
      daysElapsed
    });
  
  // Validar items a devolver
  const returnItems = items.map(ri => {
    const orderItem = order.items.find(oi => oi.id === ri.itemId);
    if (!orderItem)
      throw new Error('Producto no encontrado en la orden');
    return {
      ...orderItem,
      qtyReturn: Math.min(ri.qty, orderItem.qty),
      refundAmount: orderItem.price * Math.min(ri.qty, orderItem.qty)
    };
  });
  
  const totalRefund = returnItems.reduce((s, i) => s + i.refundAmount, 0);
  
  const returnRequest = {
    id: uuidv4(),
    returnNumber: 'RET-' + Date.now().toString().slice(-8),
    orderId,
    orderNumber: order.orderNumber,
    clientEmail: order.client.email,
    reason,
    items: returnItems,
    totalRefund,
    status: 'pendiente', // pendiente -> aprobada -> rechazada -> procesada
    requestedAt: new Date().toISOString(),
    approvedAt: null,
    refundedAt: null
  };
  
  DB.returns.push(returnRequest);
  
  res.status(201).json({
    success: true,
    message: 'Solicitud de devolución recibida. Será revisada en 24-48 horas.',
    returnRequest
  });
});

// Obtener solicitudes de devolución del cliente
app.get('/api/returns/:clientEmail', (req, res) => {
  const returns = DB.returns.filter(r => r.clientEmail === req.params.clientEmail);
  res.json({
    totalRequests: returns.length,
    returns: returns.sort((a,b) => new Date(b.requestedAt) - new Date(a.requestedAt))
  });
});

// Obtener detalles de una devolución
app.get('/api/returns/details/:returnId', (req, res) => {
  const returnReq = DB.returns.find(r => r.id === req.params.returnId);
  if (!returnReq) return res.status(404).json({ error: 'Devolución no encontrada' });
  res.json(returnReq);
});

// ── POLÍTICAS Y DOCUMENTOS LEGALES ────────────────────────────────
app.get('/api/policies/privacy', (req, res) => {
  res.json({
    policyName: 'Política de Privacidad',
    version: '1.0',
    effectiveDate: '2026-01-15',
    lastUpdated: '2026-05-21',
    content: `
# POLÍTICA DE PRIVACIDAD - AutoTechPro

## 1. Recopilación de Datos

AutoTechPro recopila información personal incluyendo:
- Nombre completo
- Correo electrónico
- Número de teléfono
- Información del vehículo (marca, modelo, año, placa, kilometraje)
- Historial de compras y servicios
- Datos de ubicación (opcional)

## 2. Uso de Datos

Los datos se utilizan para:
- Procesar pedidos y servicios
- Mejorar la experiencia del usuario
- Enviar notificaciones y ofertas personalizadas
- Mantener seguridad y prevenir fraude
- Análisis de comportamiento del cliente

## 3. Protección de Datos

- Datos encriptados en tránsito (HTTPS/TLS)
- Almacenamiento seguro en servidores protegidos
- Acceso restringido a personal autorizado
- Cumplimiento con GDPR y normativa local

## 4. Derechos del Usuario

Tienes derecho a:
- Acceder a tus datos personales
- Solicitar corrección de datos inexactos
- Solicitar eliminación de datos
- Exportar tus datos
- Revocar consentimiento en cualquier momento

## 5. Cookies

Utilizamos cookies para:
- Mantener sesiones de usuario
- Recordar preferencias
- Analizar uso del sitio
- Mejorar funcionalidad

Tipo de cookies:
- Sesión: Necesarias para funcionar
- Persistentes: Preferencias del usuario
- Analíticas: Comportamiento anónimo

## 6. Contacto

Para consultas sobre privacidad: privacy@autotechpro.com
Responsable: Departamento Legal
Teléfono: +57-1-XXXX-XXXX
    `
  });
});

app.get('/api/policies/terms', (req, res) => {
  res.json({
    policyName: 'Términos y Condiciones',
    version: '1.0',
    effectiveDate: '2026-01-15',
    lastUpdated: '2026-05-21',
    content: `
# TÉRMINOS Y CONDICIONES - AutoTechPro

## 1. Aceptación de Términos

Al usar AutoTechPro, aceptas estos términos completamente. Si no estás de acuerdo, no uses el servicio.

## 2. Servicios Ofrecidos

AutoTechPro ofrece:
- Agendamiento de citas para servicios mecánicos
- Venta de repuestos y accesorios
- Sistema de lealtad y puntos
- Recomendaciones de mantenimiento

## 3. Responsabilidades del Usuario

El usuario es responsable de:
- Proporcionar información correcta
- Mantener confidencialidad de credenciales
- Usar el servicio legalmente
- No interferir con la operación del sistema
- Pagar las órdenes completas

## 4. Limitación de Responsabilidad

AutoTechPro no es responsable por:
- Daños indirectos o consecuentes
- Pérdida de datos del usuario
- Interrupciones de servicio
- Contenido de terceros

## 5. Propiedad Intelectual

Todo contenido, diseños, y código pertenecen a AutoTechPro. 
Prohibido reproducir o usar sin autorización.

## 6. Modificaciones

AutoTechPro se reserva derecho de:
- Modificar servicios
- Cambiar precios
- Actualizar términos (aviso previo)
- Discontinuar servicios

## 7. Indemnización

El usuario acepta indemnizar a AutoTechPro por cualquier daño o reclamación derivada del uso del servicio.

## 8. Ley Aplicable

Estos términos se rigen por las leyes de Colombia y jurisdicción colombiana.
    `
  });
});

app.get('/api/policies/returns', (req, res) => {
  res.json({
    policyName: 'Política de Devoluciones',
    version: '1.0',
    effectiveDate: '2026-01-15',
    lastUpdated: '2026-05-21',
    content: `
# POLÍTICA DE DEVOLUCIONES Y GARANTÍA - AutoTechPro

## 1. Plazo de Devolución

- Repuestos: 30 días desde la compra
- Servicios: No reembolsable (aplica crédito de tienda)
- Electrónica: 15 días

## 2. Condiciones para Devolver

El producto debe:
- Estar en condición original
- No haber sido usado o instalado
- Contar con empaque original
- Incluir factura/comprobante

## 3. Proceso de Devolución

1. Solicitar devolución en el portal
2. Esperar aprobación (24-48 horas)
3. Recibir etiqueta de envío prepagada
4. Enviar producto
5. Recibir reembolso en 5-7 días hábiles

## 4. Excepciones

No aceptamos devoluciones por:
- Daño por uso indebido
- Instalación incorrecta
- Cambio de opinión (fuera de plazo)
- Productos descatalogados

## 5. Reembolsos

El reembolso cubre:
- Precio del producto
- NO cubre costo de envío original
- Sí cubre retorno (etiqueta prepagada)

## 6. Garantía

Productos defectuosos:
- Garantía de fábrica hasta 1 año
- Cubiertos dentro del plazo de devolución
- Reemplazo o reembolso completo

## 7. Servicios Mecánicos

Los servicios incluyen garantía de 30 días en:
- Mano de obra
- Piezas reemplazadas

Excepciones: Desgaste normal, cambios de conducción.

## 8. Contacto

Para solicitar devolución: returns@autotechpro.com
Teléfono: +57-1-XXXX-XXXX
WhatsApp: +57-xxx-xxx-xxxx
    `
  });
});

// Endpoints para aceptación de cookies
app.post('/api/consent/cookies', (req, res) => {
  const { cookieTypes, clientEmail } = req.body;
  
  if (!cookieTypes)
    return res.status(400).json({ error: 'Tipos de cookies no especificados' });
  
  const consent = {
    id: uuidv4(),
    clientEmail: clientEmail || 'anonymous',
    essential: cookieTypes.essential || false,
    analytics: cookieTypes.analytics || false,
    marketing: cookieTypes.marketing || false,
    preferences: cookieTypes.preferences || false,
    consentedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 365*86400000).toISOString() // 1 año
  };
  
  res.json({
    success: true,
    message: 'Preferencias de cookies guardadas',
    consent
  });
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

// ── AUTENTICACIÓN ─────────────────────────────────────────────────
app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name)
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  
  // Verificar si ya existe
  if (DB.users.find(u => u.email === email))
    return res.status(409).json({ error: 'El email ya está registrado' });
  
  const userId = 'u' + Date.now();
  const clientId = 'c' + Date.now();
  
  // Crear usuario
  const user = {
    id: userId,
    email,
    password, // En producción usar hash!
    name,
    clientId,
    createdAt: new Date().toISOString()
  };
  DB.users.push(user);
  
  // Crear cliente asociado
  const client = {
    id: clientId,
    name,
    email,
    phone: '',
    vehicle: { make: '', model: '', year: null, plate: '', km: 0 },
    tier: 'Bronce',
    points: 0,
    lastServiceDate: null,
    nextRecommendedKm: 10000,
    totalSpent: 0
  };
  DB.clients.push(client);
  
  res.status(201).json({
    success: true,
    user: { id: user.id, email: user.email, name: user.name, clientId: user.clientId }
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  
  const user = DB.users.find(u => u.email === email && u.password === password);
  if (!user)
    return res.status(401).json({ error: 'Credenciales inválidas' });
  
  const client = DB.clients.find(c => c.id === user.clientId);
  
  res.json({
    success: true,
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      clientId: user.clientId
    },
    client: client
  });
});

app.post('/api/auth/logout', (req, res) => {
  res.json({ success: true, message: 'Sesión cerrada' });
});

// ── VERIFICAR SESIÓN ──────────────────────────────────────────────
app.get('/api/auth/me', (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(401).json({ error: 'No autenticado' });
  
  const user = DB.users.find(u => u.id === userId);
  if (!user) return res.status(404).json({ error: 'Usuario no encontrado' });
  
  const client = DB.clients.find(c => c.id === user.clientId);
  
  res.json({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      clientId: user.clientId
    },
    client: client
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

// ── SUSCRIPCIONES ─────────────────────────────────────────────────
DB.subscriptions = {};

app.get('/api/subscriptions/:email', (req, res) => {
  const sub = DB.subscriptions[req.params.email];
  res.json(sub || null);
});

app.post('/api/subscriptions/subscribe', (req, res) => {
  const { email, plan } = req.body;
  if (!email || !plan)
    return res.status(400).json({ error: 'Email y plan son requeridos' });
  
  const validPlans = ['basic', 'silver', 'gold', 'platinum'];
  if (!validPlans.includes(plan))
    return res.status(400).json({ error: 'Plan no válido' });
  
  const subscription = {
    email,
    plan,
    status: 'activo',
    startDate: new Date().toISOString(),
    renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    price: {
      basic: 0,
      silver: 29900,
      gold: 59900,
      platinum: 99900
    }[plan]
  };
  
  DB.subscriptions[email] = subscription;
  
  res.status(201).json({
    success: true,
    subscription
  });
});

app.post('/api/subscriptions/cancel', (req, res) => {
  const { email } = req.body;
  if (!email)
    return res.status(400).json({ error: 'Email es requerido' });
  
  delete DB.subscriptions[email];
  
  res.json({
    success: true,
    message: 'Suscripción cancelada'
  });
});

// ── INVENTARIO (Gerente: Anthony) ─────────────────────────────────
DB.inventory = [
  {
    id: 'inv1',
    name: 'Filtro de Aire K&N Premium',
    sku: 'KN-33-2304-PREM',
    category: 'Filtros',
    description: 'Filtro de aire lavable de alto rendimiento',
    price: 165000,
    stock: 18,
    minStock: 5,
    managedBy: 'Anthony',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'inv2',
    name: 'Pastillas de Freno Ceramic Brembo',
    sku: 'BRE-P85020-CERAM',
    category: 'Frenos',
    description: 'Pastillas cerámicas para máximo rendimiento',
    price: 125000,
    stock: 12,
    minStock: 8,
    managedBy: 'Anthony',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'inv3',
    name: 'Aceite Sintético Total 5W-40 5L',
    sku: 'TOT-5W40-5L',
    category: 'Lubricantes',
    description: 'Aceite sintético completo para motor',
    price: 135000,
    stock: 35,
    minStock: 10,
    managedBy: 'Anthony',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'inv4',
    name: 'Bujías Iridium NGK (Set 4)',
    sku: 'NGK-IRID-SET4',
    category: 'Encendido',
    description: 'Juego de 4 bujías iridio de larga duración',
    price: 145000,
    stock: 9,
    minStock: 5,
    managedBy: 'Anthony',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'inv5',
    name: 'Batería Optima Dual Purpose',
    sku: 'OPT-8040-180',
    category: 'Eléctrico',
    description: 'Batería doble propósito con ciclo profundo',
    price: 520000,
    stock: 4,
    minStock: 3,
    managedBy: 'Anthony',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'inv6',
    name: 'Líquido Refrigerante Valvoline',
    sku: 'VAL-COOL-1L',
    category: 'Refrigeración',
    description: 'Refrigerante de larga vida para todo tipo de motor',
    price: 45000,
    stock: 28,
    minStock: 10,
    managedBy: 'Anthony',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'inv7',
    name: 'Amortiguadores KYB Excel-G (par)',
    sku: 'KYB-EXCEL-PAIR',
    category: 'Suspensión',
    description: 'Amortiguadores de suspensión de calidad OEM',
    price: 340000,
    stock: 3,
    minStock: 2,
    managedBy: 'Anthony',
    lastUpdated: new Date().toISOString()
  },
  {
    id: 'inv8',
    name: 'Correa de Distribución Contitech',
    sku: 'CONTI-BELT-DIST',
    category: 'Motor',
    description: 'Correa de distribución de precisión alemana',
    price: 185000,
    stock: 6,
    minStock: 3,
    managedBy: 'Anthony',
    lastUpdated: new Date().toISOString()
  }
];

app.get('/api/inventory', (req, res) => {
  // Verificar que es Anthony o admin
  res.json(DB.inventory);
});

app.get('/api/inventory/:id', (req, res) => {
  const item = DB.inventory.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item no encontrado' });
  res.json(item);
});

app.put('/api/inventory/:id', (req, res) => {
  // Solo Anthony puede actualizar
  const { stock, price, minStock } = req.body;
  const item = DB.inventory.find(i => i.id === req.params.id);
  if (!item) return res.status(404).json({ error: 'Item no encontrado' });
  
  if (stock !== undefined) item.stock = stock;
  if (price !== undefined) item.price = price;
  if (minStock !== undefined) item.minStock = minStock;
  item.lastUpdated = new Date().toISOString();
  
  res.json({
    success: true,
    item
  });
});

app.post('/api/inventory', (req, res) => {
  // Solo Anthony puede crear
  const { name, sku, category, description, price, stock, minStock } = req.body;
  
  if (!name || !sku || !category || !price || stock === undefined)
    return res.status(400).json({ error: 'Campos requeridos' });
  
  const newItem = {
    id: uuidv4(),
    name, sku, category, description,
    price, stock, minStock: minStock || 5,
    managedBy: 'Anthony',
    lastUpdated: new Date().toISOString()
  };
  
  DB.inventory.push(newItem);
  res.status(201).json({
    success: true,
    item: newItem
  });
});

// ── PRODUCCIÓN: servir build de React ────────────────────────────
app.use(express.static(path.join(__dirname, '../client/dist')));
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, '../client/dist/index.html'))
);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`✅  AutoTechPro API → http://localhost:${PORT}`));