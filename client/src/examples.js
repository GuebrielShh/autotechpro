// ========================================
// EJEMPLOS DE USO DE LAS NUEVAS FEATURES
// ========================================

// Estos ejemplos muestran cómo usar las nuevas validaciones,
// devoluciones, GDPR, cookies y políticas en AutoTechPro

// ─────────────────────────────────────────────────────────────
// 1. CREAR UNA ORDEN CON VALIDACIONES
// ─────────────────────────────────────────────────────────────

async function ejemplo_crear_orden_valida() {
  const API = await import('./src/api.js');
  const { validateOrderData } = await import('./src/config.js');
  
  const orderData = {
    items: [
      { partId: 'p1', qty: 2 },
      { partId: 'p2', qty: 3 }
    ],
    client: {
      id: 'c1',
      email: 'maria@example.com',
      name: 'María González'
    },
    paymentMethod: 'tarjeta',
    
    // ✅ VALIDACIONES REQUERIDAS
    termsAccepted: true,
    gdprConsent: true,
    returnsAccepted: true
  };
  
  // Validar localmente primero
  const validation = validateOrderData(orderData);
  
  if (validation.valid) {
    const result = await API.placeOrder(orderData);
    console.log('✅ Orden creada:', result.orderNumber);
    // ORD-1234567890
  } else {
    console.error('❌ Errores de validación:');
    validation.errors.forEach(err => console.error(' - ' + err));
  }
}

// ─────────────────────────────────────────────────────────────
// 2. VALIDACIÓN FALLIDA - SIN ACEPTAR TÉRMINOS
// ─────────────────────────────────────────────────────────────

async function ejemplo_orden_sin_gdpr() {
  const API = await import('./src/api.js');
  
  const orderData = {
    items: [{ partId: 'p1', qty: 2 }],
    client: { email: 'usuario@example.com' },
    paymentMethod: 'tarjeta',
    termsAccepted: true,
    gdprConsent: false,  // ❌ NO ACEPTA
    returnsAccepted: true
  };
  
  try {
    await API.placeOrder(orderData);
  } catch (error) {
    console.error('❌ Error esperado:', error.error);
    // "Debe aceptar el tratamiento de datos personales"
  }
}

// ─────────────────────────────────────────────────────────────
// 3. VALIDACIÓN FALLIDA - CANTIDAD EXCEDIDA
// ─────────────────────────────────────────────────────────────

async function ejemplo_cantidad_excedida() {
  const API = await import('./src/api.js');
  
  const orderData = {
    items: [
      { partId: 'p1', qty: 6 }  // ❌ LÍMITE ES 5
    ],
    client: { email: 'usuario@example.com' },
    gdprConsent: true,
    termsAccepted: true,
    returnsAccepted: true
  };
  
  try {
    await API.placeOrder(orderData);
  } catch (error) {
    console.error('❌ Error esperado:', error.error);
    // "Límite máximo 5 unidades por producto. Intentaste: 6"
  }
}

// ─────────────────────────────────────────────────────────────
// 4. SOLICITAR DEVOLUCIÓN (DENTRO DEL PLAZO)
// ─────────────────────────────────────────────────────────────

async function ejemplo_solicitar_devolucion() {
  const API = await import('./src/api.js');
  
  // Orden comprada hace 15 días (dentro de 30 días)
  const returnRequest = await API.requestReturn({
    orderId: 'order-123',
    reason: 'Producto llegó defectuoso',
    items: [
      { itemId: 'item-1', qty: 1 }
    ]
  });
  
  console.log('✅ Devolución creada:', returnRequest.returnNumber);
  // RET-2205211530
  
  console.log('Estado:', returnRequest.status);
  // pendiente
  
  console.log('Monto a reembolsar:', returnRequest.totalRefund);
  // 100000
}

// ─────────────────────────────────────────────────────────────
// 5. SOLICITAR DEVOLUCIÓN (FUERA DEL PLAZO) - ERROR
// ─────────────────────────────────────────────────────────────

async function ejemplo_devolucion_expirada() {
  const API = await import('./src/api.js');
  
  // Orden comprada hace 35 días (fuera de 30 días)
  try {
    await API.requestReturn({
      orderId: 'old-order-456',
      reason: 'Quiero devolverlo',
      items: [{ itemId: 'item-2', qty: 1 }]
    });
  } catch (error) {
    console.error('❌ Error esperado:', error.error);
    // "El plazo de devolución ha expirado (máximo 30 días desde la compra)"
  }
}

// ─────────────────────────────────────────────────────────────
// 6. OBTENER POLÍTICAS
// ─────────────────────────────────────────────────────────────

async function ejemplo_obtener_politicas() {
  const API = await import('./src/api.js');
  
  // Obtener todas las políticas
  const allPolicies = await API.getPolicies();
  
  console.log('📋 Política de Privacidad (v' + allPolicies.privacy.version + ')');
  console.log('Efectiva desde:', allPolicies.privacy.effectiveDate);
  console.log('Contenido:', allPolicies.privacy.content.substring(0, 100) + '...');
  
  console.log('\n📋 Términos y Condiciones (v' + allPolicies.terms.version + ')');
  console.log('Contenido:', allPolicies.terms.content.substring(0, 100) + '...');
  
  console.log('\n📋 Política de Devoluciones (v' + allPolicies.returns.version + ')');
  console.log('Contenido:', allPolicies.returns.content.substring(0, 100) + '...');
}

// ─────────────────────────────────────────────────────────────
// 7. GUARDAR CONSENTIMIENTO DE COOKIES
// ─────────────────────────────────────────────────────────────

async function ejemplo_guardar_cookies() {
  const API = await import('./src/api.js');
  
  // Usuario rechaza marketing, acepta analytics
  const result = await API.saveCookieConsent({
    essential: true,    // Siempre true
    analytics: true,    // Usuario aceptó
    marketing: false,   // Usuario rechazó
    preferences: true   // Usuario aceptó
  }, 'usuario@example.com');
  
  console.log('✅ Consentimiento guardado');
  console.log('Expires at:', result.consent.expiresAt);
  // 2027-05-21T10:30:00.000Z (1 año)
}

// ─────────────────────────────────────────────────────────────
// 8. USAR CONFIGURACIÓN DE COOKIES
// ─────────────────────────────────────────────────────────────

async function ejemplo_usar_config_cookies() {
  const {
    getCookieConsent,
    canTrackAnalytics,
    canTrackMarketing,
    getDaysUntilReturnDeadline,
    isOrderReturnable
  } = await import('./src/config.js');
  
  // Obtener consentimiento guardado
  const consent = getCookieConsent();
  if (consent) {
    console.log('✅ Cookies aceptadas');
    console.log('Analytics habilitada:', canTrackAnalytics());
    console.log('Marketing habilitada:', canTrackMarketing());
  } else {
    console.log('⚠️ Sin consentimiento de cookies');
  }
  
  // Verificar si orden puede devolverse
  const orderDate = '2026-05-01';
  const daysLeft = getDaysUntilReturnDeadline(orderDate);
  console.log(`Días para devolver: ${daysLeft}`);
  
  if (isOrderReturnable(orderDate)) {
    console.log('✅ Esta orden PUEDE devolverse');
  } else {
    console.log('❌ Esta orden NO PUEDE devolverse');
  }
}

// ─────────────────────────────────────────────────────────────
// 9. OBTENER DEVOLUCIONES DEL CLIENTE
// ─────────────────────────────────────────────────────────────

async function ejemplo_obtener_devoluciones() {
  const API = await import('./src/api.js');
  
  const returns = await API.getReturns('maria@example.com');
  
  console.log(`Total de solicitudes: ${returns.totalRequests}`);
  // 3
  
  returns.returns.forEach(ret => {
    console.log(`\n- Solicitud ${ret.returnNumber}`);
    console.log(`  Estado: ${ret.status}`);
    console.log(`  Monto: $${ret.totalRefund}`);
    console.log(`  Solicitada: ${ret.requestedAt}`);
  });
}

// ─────────────────────────────────────────────────────────────
// 10. OBTENER DETALLES DE UNA DEVOLUCIÓN
// ─────────────────────────────────────────────────────────────

async function ejemplo_detalles_devolucion() {
  const API = await import('./src/api.js');
  
  const details = await API.getReturnDetails('return-id-123');
  
  console.log('📦 Solicitud de Devolución');
  console.log('Número:', details.returnNumber);
  console.log('Orden:', details.orderNumber);
  console.log('Razón:', details.reason);
  console.log('Estado:', details.status);
  console.log('Reembolso:', '$' + details.totalRefund);
  console.log('Productos:');
  
  details.items.forEach(item => {
    console.log(`  - ${item.name} x${item.qtyReturn} = $${item.refundAmount}`);
  });
}

// ─────────────────────────────────────────────────────────────
// CASOS DE USO COMPLETOS
// ─────────────────────────────────────────────────────────────

/**
 * FLUJO COMPLETO: Compra → Solicitud de Devolución → Reembolso
 */
async function flujo_completo_compra_devolucion() {
  const API = await import('./src/api.js');
  
  console.log('=== FLUJO: Compra con Devolución ===\n');
  
  // 1️⃣ CREAR ORDEN
  console.log('1️⃣ Cliente realiza compra...');
  const order = await API.placeOrder({
    items: [{ partId: 'p1', qty: 2 }],
    client: { email: 'maria@example.com', name: 'María' },
    paymentMethod: 'tarjeta',
    termsAccepted: true,
    gdprConsent: true,
    returnsAccepted: true
  });
  console.log('✅ Orden creada:', order.orderNumber);
  console.log('   Total: $' + order.total);
  console.log('   Plazo devolución: hasta', order.returnDeadline);
  
  // 2️⃣ VERIFICAR CONSENTIMIENTO GDPR
  console.log('\n2️⃣ Verificar consentimientos guardados...');
  console.log('✅ Términos aceptados: true');
  console.log('✅ GDPR consentido: true');
  console.log('✅ Política de devoluciones: true');
  
  // 3️⃣ SOLICITAR DEVOLUCIÓN
  console.log('\n3️⃣ Cliente solicita devolución (día 15)...');
  const returnReq = await API.requestReturn({
    orderId: order.id,
    reason: 'Producto defectuoso',
    items: [{ itemId: 'item-1', qty: 1 }]
  });
  console.log('✅ Devolución creada:', returnReq.returnNumber);
  console.log('   Estado:', returnReq.status);
  console.log('   Monto a reembolsar: $' + returnReq.totalRefund);
  
  // 4️⃣ VERIFICAR ESTADO
  console.log('\n4️⃣ Verificar estado de devolución...');
  const details = await API.getReturnDetails(returnReq.id);
  console.log('   Número:', details.returnNumber);
  console.log('   Estado:', details.status, '(Esperar 24-48h)');
  console.log('   Producto:', details.items[0].name);
  
  // 5️⃣ DESPUÉS DE APROBACIÓN (simulado)
  console.log('\n5️⃣ Operador aprueba devolución...');
  console.log('✅ Devolución APROBADA');
  console.log('📧 Email con etiqueta de envío prepagada');
  
  // 6️⃣ CLIENTE ENVÍA PRODUCTO
  console.log('\n6️⃣ Cliente envía producto...');
  console.log('📦 Enviado a almacén');
  
  // 7️⃣ PROCESAMIENTO
  console.log('\n7️⃣ Almacén recibe y verifica...');
  console.log('✅ Producto en condición original');
  
  // 8️⃣ REEMBOLSO
  console.log('\n8️⃣ Reembolso procesado...');
  console.log('💰 $' + returnReq.totalRefund + ' devuelto a cuenta (5-7 días)');
  console.log('✅ Estado: PROCESADA');
}

/**
 * FLUJO COMPLETO: Banner de Cookies → Personalización
 */
async function flujo_cookies_gdpr() {
  const API = await import('./src/api.js');
  const { 
    getCookieConsent, 
    canTrackAnalytics,
    VALIDATION_MESSAGES 
  } = await import('./src/config.js');
  
  console.log('=== FLUJO: Cookies y GDPR ===\n');
  
  // 1️⃣ USUARIO VISITA SITIO
  console.log('1️⃣ Usuario visita el sitio por primera vez...');
  console.log('🍪 Banner de cookies mostrado');
  
  // 2️⃣ USUARIO PERSONALIZA
  console.log('\n2️⃣ Usuario personaliza preferencias...');
  const consent = await API.saveCookieConsent({
    essential: true,
    analytics: true,
    marketing: false,
    preferences: true
  }, 'usuario@example.com');
  console.log('✅ Consentimiento guardado por:', 
    new Date(consent.consent.consentedAt).toLocaleString());
  console.log('   Durará hasta:', 
    new Date(consent.consent.expiresAt).toLocaleDateString());
  
  // 3️⃣ VERIFICAR CONSENTIMIENTO
  console.log('\n3️⃣ Verificar qué puede rastrearse...');
  const saved = getCookieConsent();
  console.log('✅ Analytics permitida:', canTrackAnalytics());
  console.log('❌ Marketing permitida:', saved?.marketing);
  
  // 4️⃣ EN CHECKOUT
  console.log('\n4️⃣ En proceso de compra...');
  console.log('📋 Mostrar checkboxes de aceptación:');
  console.log('   ☐ Acepto', VALIDATION_MESSAGES.TERMS_REQUIRED);
  console.log('   ☐ Acepto', VALIDATION_MESSAGES.GDPR_REQUIRED);
  console.log('   ☐ Acepto', VALIDATION_MESSAGES.RETURNS_REQUIRED);
  
  // 5️⃣ CREAR ORDEN CON CONSENTIMIENTO
  console.log('\n5️⃣ Crear orden (todos los checkboxes aceptados)...');
  const order = await API.placeOrder({
    items: [{ partId: 'p1', qty: 1 }],
    client: { email: 'usuario@example.com' },
    termsAccepted: true,
    gdprConsent: true,
    returnsAccepted: true,
    paymentMethod: 'tarjeta'
  });
  console.log('✅ Orden creada:', order.orderNumber);
  console.log('✅ Consentimientos registrados en la orden');
}

// ─────────────────────────────────────────────────────────────
// EJECUTAR EJEMPLOS
// ─────────────────────────────────────────────────────────────

console.log(`
╔════════════════════════════════════════════════════════════╗
║       EJEMPLOS DE USO - AutoTechPro (GDPR & DEVOLUCIONES) ║
╚════════════════════════════════════════════════════════════╝

Descomenta los ejemplos que quieres ejecutar en este archivo.

Ejemplos disponibles:
  ✓ ejemplo_crear_orden_valida()
  ✓ ejemplo_orden_sin_gdpr()
  ✓ ejemplo_cantidad_excedida()
  ✓ ejemplo_solicitar_devolucion()
  ✓ ejemplo_devolucion_expirada()
  ✓ ejemplo_obtener_politicas()
  ✓ ejemplo_guardar_cookies()
  ✓ ejemplo_usar_config_cookies()
  ✓ ejemplo_obtener_devoluciones()
  ✓ ejemplo_detalles_devolucion()
  ✓ flujo_completo_compra_devolucion()
  ✓ flujo_cookies_gdpr()

USO:
  node client/src/examples.js
`);
