# 📋 Políticas y Documentos Legales - AutoTechPro

## 📑 Documentos Incluidos

Este archivo documenta todas las políticas implementadas en AutoTechPro, incluyendo GDPR, devoluciones, cookies y protección de datos.

---

## 🔐 1. POLÍTICA DE PRIVACIDAD Y GDPR

### Datos Recopilados

AutoTechPro recopila datos personales para:

```
✓ Nombre completo y contacto
✓ Información de vehículo (marca, modelo, año, placa, km)
✓ Historial de citas y compras
✓ Información de pago
✓ Preferencias y comportamiento
```

### Derechos del Usuario (GDPR)

Cada usuario tiene derecho a:

- **Acceso**: Solicitar una copia de todos sus datos personales
- **Rectificación**: Corregir datos inexactos
- **Eliminación**: "Derecho al olvido" - solicitar borrado de datos
- **Portabilidad**: Exportar datos en formato estándar
- **Restricción**: Limitar cómo se usan sus datos
- **Oposición**: Rechazar procesamiento de datos para ciertos fines

### Contacto GDPR

```
Responsable de Datos: Departamento Legal
Email: privacy@autotechpro.com
Teléfono: +57-1-XXXX-XXXX
Dirección: [Dirección de oficina]
```

### Campos del Usuario Rastreados

```javascript
// Datos personales
{
  id: "u1",
  email: "usuario@example.com",
  name: "Nombre Completo",
  phone: "300-XXX-XXXX",
  createdAt: "2026-01-15",
  
  // Datos del vehículo
  vehicle: {
    make: "Honda",
    model: "Civic",
    year: 2018,
    plate: "ABC-123",
    km: 45000
  },
  
  // Datos de compras
  totalSpent: 850000,
  lastServiceDate: "2026-04-15",
  
  // Lealtad y puntos
  tier: "Oro",
  points: 1250
}
```

---

## 🔄 2. POLÍTICA DE DEVOLUCIONES

### Plazos de Devolución

| Tipo | Plazo | Condición |
|------|-------|-----------|
| **Repuestos** | 30 días | Producto sin usar |
| **Servicios** | N/A | Crédito de tienda (no reembolso) |
| **Electrónica** | 15 días | Empaque original intacto |
| **Especiales** | 7 días | Bajo solicitud |

### Proceso de Devolución

```
1. Cliente solicita devolución en el portal
   ↓
2. Sistema valida:
   - Dentro del plazo
   - Producto en condición original
   - Comprobante disponible
   ↓
3. Operador revisa (24-48 horas)
   ↓
4. Si aprobado:
   - Genera etiqueta de envío prepagada
   - Envía al cliente
   ↓
5. Cliente envía producto
   ↓
6. Almacén recibe y verifica
   ↓
7. Procesa reembolso (5-7 días hábiles)
```

### Condiciones de Aceptación

✅ **Aceptamos devolver:**
- Producto sin usar o dañado en transporte
- Empaque original y documentación
- Comprobante de compra

❌ **NO aceptamos:**
- Productos dañados por uso indebido
- Instalación incorrecta
- Fuera del plazo (>30 días)
- Sin empaque original
- Cambios de opinión tardíos

### Cálculo de Reembolso

```javascript
reembolso = precioProducto - (costo_retorno * 0)
            // La etiqueta de retorno es prepagada (SIN COSTO)

Ejemplo:
Precio comprado: $100,000
Costo retorno: $0 (prepagado)
Reembolso: $100,000 ✅
```

### Solicitud de Devolución (API)

```javascript
// En el frontend
const returnRequest = await API.requestReturn({
  orderId: "order-123",
  reason: "Producto defectuoso",
  items: [
    { itemId: "item-1", qty: 1 }
  ]
});

// Respuesta esperada
{
  success: true,
  message: "Solicitud recibida. Será revisada en 24-48 horas.",
  returnRequest: {
    id: "ret-123",
    returnNumber: "RET-2205211530",
    status: "pendiente",
    totalRefund: 100000,
    requestedAt: "2026-05-21T15:30:00Z",
    returnDeadline: "2026-06-20"
  }
}
```

### Estados de Devolución

```
pendiente   → La solicitud está en revisión
aprobada    → Autorizada para devolver
rechazada   → No cumple criterios
procesada   → Reembolso completado
```

### Garantía de Productos

Todos los productos incluyen:

- **Garantía de 1 año** por defectos de fábrica
- **Cobertura:** Reemplazo o reembolso completo
- **Requiere:** Embalaje original, documentación

---

## 🍪 3. POLÍTICA DE COOKIES

### Tipos de Cookies Utilizadas

```javascript
{
  essential: {
    name: "Sesión y Funcionalidad",
    duration: "Sesión",
    required: true,
    purpose: "Mantener acceso de usuario, carrito, preferencias"
  },
  
  analytics: {
    name: "Análisis de Comportamiento",
    duration: "2 años",
    required: false,
    purpose: "Entender cómo usan el sitio, mejorar UX"
  },
  
  marketing: {
    name: "Marketing y Retargeting",
    duration: "1 año",
    required: false,
    purpose: "Mostrar anuncios relevantes, ofertas personalizadas"
  },
  
  preferences: {
    name: "Preferencias del Usuario",
    duration: "1 año",
    required: false,
    purpose: "Recordar idioma, tema, preferencias"
  }
}
```

### Banner de Cookies

AutoTechPro muestra un banner al primer acceso:

```
┌─────────────────────────────────────────┐
│ 🍪 Usamos cookies para mejorar tu        │
│    experiencia. Puedes configurarlas.   │
│                                         │
│ [Esencial] [Analytics] [Marketing] ... │
│                                         │
│ [Rechazar Todo] [Personalizar] [Aceptar]│
└─────────────────────────────────────────┘
```

### Gestión de Cookies

```javascript
// Guardar preferencias
const response = await API.saveCookieConsent({
  essential: true,    // Siempre activadas
  analytics: false,   // Usuario rechazó
  marketing: true,    // Usuario aceptó
  preferences: true   // Usuario aceptó
}, "usuario@example.com");

// Resultado en localStorage
localStorage.setItem('cookie_consent', {
  essential: true,
  analytics: false,
  marketing: true,
  preferences: true,
  expiresAt: "2027-05-21" // 1 año
});
```

### Cómo Desactivar Cookies

**En el navegador:**

- Chrome: ⋮ → Configuración → Privacidad → Cookies
- Firefox: ≡ → Opciones → Privacidad → Cookies
- Safari: Preferencias → Privacidad → Cookies

**En AutoTechPro:**
- Ir a Configuración → Privacidad
- Personalizar preferencias de cookies
- Cambios se aplican inmediatamente

---

## ✅ 4. ACEPTACIÓN DE TÉRMINOS EN CHECKOUT

### Validaciones en el Carrito

Antes de completar la compra, el usuario DEBE aceptar:

```javascript
{
  termsAccepted: {
    label: "Acepto los Términos y Condiciones",
    required: true,
    link: "/policies/terms"
  },
  
  gdprConsent: {
    label: "Acepto el tratamiento de mis datos personales",
    required: true,
    link: "/policies/privacy"
  },
  
  returnsAccepted: {
    label: "He leído y acepto la Política de Devoluciones",
    required: true,
    link: "/policies/returns"
  }
}
```

### Si No Acepta

```
❌ "Debe aceptar los términos y condiciones"
❌ "Debe aceptar el tratamiento de datos"
❌ "Debe aceptar la política de devoluciones"

✅ Botón de "Completar Compra" deshabilitado hasta aceptar
```

### Registro de Consentimiento

Cada compra guarda:

```javascript
{
  gdprConsent: {
    id: "gdpr-123",
    clientEmail: "maria@example.com",
    orderNumber: "ORD-12345",
    termsAccepted: true,
    gdprConsent: true,
    returnsAccepted: true,
    acceptedAt: "2026-05-21T15:30:00Z",
    ipAddress: "192.168.1.1",
    userAgent: "Mozilla/5.0..."
  }
}
```

---

## 📊 5. LIMITACIONES DE CANTIDAD

### Máximo de Unidades por Producto

```
Límite: 5 unidades por producto, por compra

❌ Intentar agregar 6 unidades:
   "Límite máximo 5 unidades por producto. Intentaste: 6"

✅ Agregadas 5 unidades:
   Cantidad: 5 ✓
   Subtotal: $500,000
```

### Por Qué Existe Este Límite

1. **Evitar Monopolio**: Un usuario no puede comprar todo el stock
2. **Equidad**: Permite que otros clientes accedan a productos
3. **Control de Fraude**: Detecta patrones sospechosos
4. **Gestión de Inventario**: Facilita control de stock

### Aplicación del Límite

```javascript
// Backend validación
if (item.qty > 5) {
  throw new Error(`Límite máximo 5 unidades por producto`);
}

// Frontend feedback
const addToCart = (product, qty) => {
  if (qty > 5) {
    showError('Máximo 5 unidades por producto');
    setQuantity(5);
    return;
  }
  // Agregar al carrito
};
```

---

## 🔒 6. PROTECCIÓN DE DATOS PERSONALES

### Encriptación

- **En Tránsito**: HTTPS/TLS (SSL Certificate)
- **En Reposo**: Almacenamiento encriptado en base de datos
- **Contraseñas**: Hash con bcrypt (recomendado para producción)

### Acceso a Datos

Solo personal autorizado puede acceder a:
- ❌ Contraseñas (nunca en texto plano)
- ✅ Email y nombre (para comunicación)
- ✅ Información de vehículo (para servicios)
- ✅ Historial de compras (para recomendaciones)

### Retención de Datos

```
Datos activos (usuario registrado):
- Se mantienen mientras exista la cuenta
- Usuario puede solicitar eliminación en cualquier momento

Datos inactivos (cuenta no usada >2 años):
- Se notifica al usuario
- Se elimina después de 30 días sin respuesta

Datos legales (transacciones):
- Se mantienen 7 años por ley fiscal
- Encriptados y con acceso restringido
```

---

## 📞 7. CONTACTO Y DERECHOS

### Solicitudes GDPR

Para ejercer tus derechos:

```
📧 Email: privacy@autotechpro.com
🎤 Teléfono: +57-1-XXXX-XXXX
💬 Whatsapp: +57-XXX-XXX-XXXX
📍 Portal: www.autotechpro.com/gdpr

Respuesta en: 30 días hábiles (requisito legal)
```

### Tipos de Solicitudes

| Solicitud | Plazo | Costo |
|-----------|-------|-------|
| Acceso a datos | 30 días | Gratis |
| Corrección | 30 días | Gratis |
| Eliminación | 30 días | Gratis |
| Portabilidad | 30 días | Gratis |
| Restricción | 30 días | Gratis |

---

## 📜 8. TÉRMINOS Y CONDICIONES

### Aceptación

Al registrarte o usar AutoTechPro, aceptas:

```javascript
{
  responsibilidades: [
    "Proporcionar información correcta",
    "No usar el servicio ilegalmente",
    "Mantener confidencialidad de credenciales",
    "No interferir con operación del sistema",
    "Pagar órdenes completas"
  ],
  
  limitaciones: [
    "AutoTechPro no es responsable por daños indirectos",
    "No asumimos responsabilidad por pérdida de datos",
    "Nos reservamos derecho a cambiar precios/servicios",
    "No respaldamos contenido de terceros"
  ],
  
  leySobernana: "Leyes de Colombia",
  jursidccion: "Tribunales Colombianos"
}
```

---

## 🚀 9. IMPLEMENTACIÓN TÉCNICA

### Endpoints Disponibles

```javascript
// Obtener todas las políticas
GET /api/policies/privacy
GET /api/policies/terms
GET /api/policies/returns

// Devoluciones
POST /api/returns/request
GET /api/returns/:clientEmail
GET /api/returns/details/:returnId

// Consentimiento
POST /api/consent/cookies

// Frontend API
await API.getPrivacyPolicy()
await API.getTermsPolicy()
await API.getReturnPolicy()
await API.requestReturn(data)
await API.saveCookieConsent(types, email)
```

### Funciones Frontend

```javascript
// Verificar aceptación antes de checkout
const handleCheckout = () => {
  if (!termsAccepted) {
    alert('❌ Debes aceptar los términos');
    return;
  }
  if (!gdprConsent) {
    alert('❌ Debes aceptar el tratamiento de datos');
    return;
  }
  if (!returnsAccepted) {
    alert('❌ Debes aceptar la política de devoluciones');
    return;
  }
  
  // Procesar pago
  processPayment();
};

// Guardar consentimiento GDPR
const saveConsent = async () => {
  const result = await API.saveCookieConsent({
    essential: true,
    analytics: userPrefs.analytics,
    marketing: userPrefs.marketing,
    preferences: userPrefs.preferences
  }, user.email);
  
  localStorage.setItem('cookie_consent', JSON.stringify(result.consent));
};
```

---

## ✨ 10. MEJORAS FUTURAS

### Seguridad
- [ ] Autenticación de dos factores (2FA)
- [ ] Biometría para acceso
- [ ] Auditoría de acceso a datos
- [ ] Sistema de alertas de seguridad

### GDPR
- [ ] Portal de auto-servicio GDPR
- [ ] Descargar datos en PDF/JSON
- [ ] Solicitudes automatizadas
- [ ] Verificación de identidad mejorada

### Devoluciones
- [ ] Rastreo de envío en tiempo real
- [ ] Fotos de condición del producto
- [ ] Devolución a domicilio (courier)
- [ ] Reembolso inmediato para clientes VIP

### Cookies
- [ ] Gestión granular de cookies
- [ ] Información visual de qué datos usan
- [ ] Consentimiento basado en propósito
- [ ] Revocación fácil de consentimiento

---

## 📝 Historial de Cambios

| Versión | Fecha | Cambios |
|---------|-------|---------|
| 1.0 | 21/05/2026 | Versión inicial - GDPR, Devoluciones, Cookies |
| 1.1 | TBD | Soporte para reclamaciones de garantía |
| 1.2 | TBD | API de autorización de devolución automática |

---

**Última Actualización**: 21 de mayo de 2026  
**Próxima Revisión**: 21 de noviembre de 2026  
**Responsable**: Departamento Legal & Privacidad

> ⚖️ El cumplimiento de estas políticas es obligatorio. Para consultas legales, contacta a `legal@autotechpro.com`
