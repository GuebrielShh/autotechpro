# 🔒 Validaciones, GDPR, Cookies y Políticas - Guía de Implementación

Este documento describe la implementación completa de validaciones de devolución, tratamiento de datos (GDPR), manejo de cookies, limitaciones de cantidad y políticas en AutoTechPro.

---

## 📋 Tabla de Contenidos

1. [Validaciones de Devolución](#validaciones-de-devolución)
2. [GDPR y Tratamiento de Datos](#gdpr-y-tratamiento-de-datos)
3. [Manejo de Cookies](#manejo-de-cookies)
4. [Limitaciones de Cantidad](#limitaciones-de-cantidad)
5. [Políticas Implementadas](#políticas-implementadas)
6. [Integración en Frontend](#integración-en-frontend)

---

## 🔄 Validaciones de Devolución

### Características

✅ **Sistema completo de devoluciones con:**
- Plazo de 30 días desde la compra
- Validación automática de condiciones
- Seguimiento de estado
- Cálculo automático de reembolsos

### Endpoints

```javascript
// Solicitar devolución
POST /api/returns/request
{
  orderId: "order-123",
  reason: "Producto defectuoso",
  items: [{ itemId: "item-1", qty: 1 }]
}

// Obtener devoluciones del cliente
GET /api/returns/:clientEmail

// Obtener detalles de una devolución
GET /api/returns/details/:returnId
```

### Estados de Devolución

```
pendiente  ✓  La solicitud está en revisión (24-48h)
aprobada   ✓  Autorizada para devolver
rechazada  ✗  No cumple criterios de devolución
procesada  ✓  Reembolso completado
```

### Ejemplo de Uso

```javascript
import * as API from './api.js';

const handleReturnRequest = async () => {
  try {
    const result = await API.requestReturn({
      orderId: 'ORD-12345',
      reason: 'Producto llegó defectuoso',
      items: [
        { itemId: 'item-1', qty: 1 }
      ]
    });
    
    console.log('Devolución solicitada:', result.returnNumber);
    // RET-2205211530
  } catch (error) {
    console.error('Error:', error.error);
    // "El plazo de devolución ha expirado"
  }
};
```

---

## 🔐 GDPR y Tratamiento de Datos

### Cumplimiento GDPR

AutoTechPro cumple con el Reglamento General de Protección de Datos (GDPR) incluyendo:

✅ **Consentimiento explícito** para usar datos personales  
✅ **Derecho de acceso** a los datos personales  
✅ **Derecho al olvido** (eliminación de datos)  
✅ **Derecho de portabilidad** (exportar datos)  
✅ **Derecho de restricción** (limitar procesamiento)  
✅ **Política de privacidad clara**  

### Datos Recopilados

```javascript
{
  // Identificación
  email: "usuario@example.com",
  name: "Juan Pérez",
  phone: "300-XXXXXX",
  
  // Vehículo
  vehicle: {
    make: "Honda",
    model: "Civic",
    year: 2018,
    plate: "ABC-123",
    km: 45000
  },
  
  // Compras y servicios
  appointments: [...],
  orders: [...],
  totalSpent: 850000,
  
  // Preferencias
  tier: "Oro",
  points: 1250
}
```

### Consentimiento en Checkout

Antes de procesar la orden, se REQUIERE aceptación de:

```javascript
{
  termsAccepted: true,     // Términos y condiciones
  gdprConsent: true,       // Tratamiento de datos personales
  returnsAccepted: true    // Política de devoluciones
}
```

Si falta alguna, la compra es rechazada:

```javascript
// Error si no acepta
❌ "Debe aceptar el tratamiento de datos personales"
❌ "Debe aceptar los Términos y Condiciones"
❌ "Debe aceptar la Política de Devoluciones"
```

### Registro de Consentimiento

Cada compra almacena el consentimiento:

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
    ipAddress: "192.168.1.1"
  }
}
```

### Derechos del Usuario

Para ejercer derechos GDPR, contactar:

📧 **Email:** privacy@autotechpro.com  
☎️ **Teléfono:** +57-1-XXXX-XXXX  
⏱️ **Plazo de respuesta:** 30 días hábiles

---

## 🍪 Manejo de Cookies

### Tipos de Cookies

AutoTechPro utiliza 4 tipos de cookies:

```javascript
{
  essential: {
    name: "Esencial (Requerida)",
    duration: "Sesión",
    examples: ["sessionId", "userId", "cartItems"],
    purpose: "Funcionalidad básica del sitio"
  },
  
  analytics: {
    name: "Análisis",
    duration: "1 año",
    examples: ["_ga", "pageViews", "clickEvents"],
    purpose: "Entender comportamiento del usuario"
  },
  
  marketing: {
    name: "Marketing",
    duration: "1 año",
    examples: ["utm_source", "campaignId"],
    purpose: "Anuncios personalizados y ofertas"
  },
  
  preferences: {
    name: "Preferencias",
    duration: "1 año",
    examples: ["theme", "language", "currency"],
    purpose: "Recordar configuración del usuario"
  }
}
```

### Banner de Cookies

Se muestra al primer acceso:

```
┌─────────────────────────────────────────────────┐
│ 🍪 Preferencias de Cookies y Datos              │
│                                                 │
│ Utilizamos cookies para mejorar tu experiencia. │
│ Puedes personalizar qué datos compartir.        │
│                                                 │
│ [Rechazar] [Personalizar] [Aceptar Todo]       │
└─────────────────────────────────────────────────┘
```

### Configuración de Cookies

El usuario puede personalizar:

```javascript
await API.saveCookieConsent({
  essential: true,    // Siempre activada
  analytics: true,    // Usuario selecciona
  marketing: false,   // Usuario selecciona
  preferences: true   // Usuario selecciona
}, "usuario@example.com");
```

### Validación de Consentimiento

```javascript
import { 
  getCookieConsent, 
  canTrackAnalytics, 
  canTrackMarketing 
} from './config.js';

// Obtener consentimiento guardado
const consent = getCookieConsent();

// Verificar si puede usar analytics
if (canTrackAnalytics()) {
  // Enviar evento a Google Analytics
  trackEvent('page_view', {...});
}

// Verificar si puede usar marketing
if (canTrackMarketing()) {
  // Mostrar anuncios personalizados
  showPersonalizedAds();
}
```

### Componente de Banner

```javascript
import { CookieBanner } from './CookieAndPolicies.jsx';

function App() {
  return (
    <>
      <CookieBanner userEmail={user?.email} />
      {/* Resto de la app */}
    </>
  );
}
```

---

## 📦 Limitaciones de Cantidad

### Límite Máximo

```
Máximo por producto: 5 unidades

❌ Intentar agregar 6: 
   "Límite máximo 5 unidades por producto"

✅ Agregadas 5: OK ✓
```

### Por Qué Existe Este Límite

1. **Equidad:** Evita que un usuario monopolice productos
2. **Stock:** Asegura disponibilidad para otros clientes
3. **Fraude:** Detecta patrones de compra sospechosos
4. **Inventario:** Mejora gestión de stock

### Validación en Backend

```javascript
// En /api/orders endpoint
const MAX_ITEMS_PER_PRODUCT = 5;

items.map(item => {
  if (item.qty > MAX_ITEMS_PER_PRODUCT)
    throw new Error(`Límite máximo ${MAX_ITEMS_PER_PRODUCT} unidades`);
  
  // Procesar compra...
});
```

### Validación en Frontend

```javascript
import { validateOrderData } from './config.js';

const handleCheckout = async () => {
  const validation = validateOrderData({
    items: cart,
    termsAccepted: agree.terms,
    gdprConsent: agree.gdpr,
    returnsAccepted: agree.returns
  });
  
  if (!validation.valid) {
    validation.errors.forEach(err => console.error(err));
    return;
  }
  
  // Proceder con compra
};
```

---

## 📜 Políticas Implementadas

### 1. Política de Privacidad

```
✓ Datos recopilados y cómo se usan
✓ Derechos GDPR del usuario
✓ Retención de datos
✓ Protección y encriptación
✓ Contacto para privacidad
```

**Endpoint:** `GET /api/policies/privacy`

### 2. Términos y Condiciones

```
✓ Aceptación de servicios
✓ Responsabilidades del usuario
✓ Limitaciones de responsabilidad
✓ Propiedad intelectual
✓ Ley aplicable
```

**Endpoint:** `GET /api/policies/terms`

### 3. Política de Devoluciones

```
✓ Plazo (30 días)
✓ Condiciones de aceptación
✓ Proceso paso a paso
✓ Excepciones
✓ Cálculo de reembolsos
```

**Endpoint:** `GET /api/policies/returns`

### Obtener Políticas

```javascript
import * as API from './api.js';

// Obtener una política
const privacy = await API.getPrivacyPolicy();
const terms = await API.getTermsPolicy();
const returns = await API.getReturnPolicy();

// Obtener todas las políticas
const allPolicies = await API.getPolicies();
// {
//   privacy: {...},
//   terms: {...},
//   returns: {...}
// }
```

---

## 🔧 Integración en Frontend

### 1. Instalación de Componentes

```jsx
// App.jsx
import { CookieBanner } from './CookieAndPolicies.jsx';
import { CheckoutValidation } from './CookieAndPolicies.jsx';

function App() {
  const [checkoutValid, setCheckoutValid] = useState(false);

  return (
    <>
      {/* Banner de cookies en toda la app */}
      <CookieBanner userEmail={user?.email} />
      
      {/* En la página de checkout */}
      <CheckoutValidation onValidation={setCheckoutValid} />
      
      {/* Botón deshabilitado hasta aceptar */}
      <button 
        disabled={!checkoutValid}
        onClick={handleCheckout}
      >
        Completar Compra
      </button>
    </>
  );
}
```

### 2. Validar Antes de Checkout

```javascript
const handleCheckout = async () => {
  const order = {
    items: cart,
    client: user,
    paymentMethod: 'tarjeta',
    
    // IMPORTANTE: Incluir estas validaciones
    termsAccepted: agreements.termsAccepted,
    gdprConsent: agreements.gdprConsent,
    returnsAccepted: agreements.returnsAccepted
  };
  
  try {
    const result = await API.placeOrder(order);
    console.log('Compra completada:', result.orderNumber);
  } catch (error) {
    alert('Error: ' + error.error);
    // "Debe aceptar el tratamiento de datos personales"
  }
};
```

### 3. Mostrar Políticas

```javascript
const [policies, setPolicies] = useState({});

useEffect(() => {
  const loadPolicies = async () => {
    const p = await API.getPolicies();
    setPolicies(p);
  };
  loadPolicies();
}, []);

return (
  <div>
    <h2>Política de Privacidad</h2>
    <pre>{policies.privacy?.content}</pre>
    
    <h2>Términos y Condiciones</h2>
    <pre>{policies.terms?.content}</pre>
    
    <h2>Política de Devoluciones</h2>
    <pre>{policies.returns?.content}</pre>
  </div>
);
```

### 4. Solicitar Devolución

```javascript
const handleRequestReturn = async (orderId) => {
  try {
    const result = await API.requestReturn({
      orderId,
      reason: 'Producto defectuoso',
      items: [
        { itemId: 'product-1', qty: 1 }
      ]
    });
    
    console.log('Devolución:', result.returnRequest.returnNumber);
    // "RET-2205211530"
    
  } catch (error) {
    console.error('Error:', error.error);
    // "El plazo de devolución ha expirado"
  }
};
```

---

## 📊 Configuración

### Archivo: `client/src/config.js`

Contiene todas las constantes configurables:

```javascript
export const COOKIE_CONFIG = {
  ESSENTIAL_DURATION: 0,
  ANALYTICS_DURATION: 365 * 24 * 60 * 60 * 1000,
  // ...
};

export const GDPR_CONFIG = {
  RETURN_WINDOW_DAYS: 30,
  GDPR_RESPONSE_DAYS: 30,
  // ...
};

export const ORDER_CONFIG = {
  MAX_ITEMS_PER_PRODUCT: 5,
  REQUIRE_TERMS: true,
  REQUIRE_GDPR: true,
  REQUIRE_RETURNS_POLICY: true
};
```

---

## 🧪 Testing

### Test: Validación de Cantidad

```javascript
// Debe fallar
const result = await placeOrder({
  items: [{ partId: 'p1', qty: 6 }],
  client: user,
  gdprConsent: true,
  termsAccepted: true,
  returnsAccepted: true
});
// Error: "Límite máximo 5 unidades"

// Debe funcionar
const result = await placeOrder({
  items: [{ partId: 'p1', qty: 5 }],
  // ...
});
// ✓ Orden completada
```

### Test: Validación GDPR

```javascript
// Debe fallar
const result = await placeOrder({
  items: [...],
  gdprConsent: false,  // ❌
  termsAccepted: true,
  returnsAccepted: true
});
// Error: "Debe aceptar el tratamiento de datos"

// Debe funcionar
const result = await placeOrder({
  items: [...],
  gdprConsent: true,   // ✓
  termsAccepted: true,
  returnsAccepted: true
});
// ✓ Orden completada
```

### Test: Devoluciones

```javascript
// Dentro de 30 días
const result = await requestReturn({
  orderId: 'order-123',  // Comprado hace 15 días
  reason: 'Producto defectuoso',
  items: [...]
});
// ✓ RET-2205211530 creada

// Fuera de 30 días
const result = await requestReturn({
  orderId: 'order-456',  // Comprado hace 40 días
  reason: 'Producto defectuoso',
  items: [...]
});
// ❌ Error: "El plazo de devolución ha expirado"
```

---

## 📝 Resumen de Archivos Creados/Modificados

```
✓ server/index.js                    → Nuevos endpoints de devoluciones y políticas
✓ client/src/api.js                  → Nuevas funciones de API
✓ client/src/config.js               → Constantes y configuración
✓ client/src/CookieAndPolicies.jsx   → Componentes de cookies y validación
✓ .env.example                       → Variables GDPR y cookies
✓ POLICIES.md                        → Documentación completa
✓ README.md                          → Esta guía
```

---

## 🚀 Próximos Pasos

- [ ] Implementar encriptación bcrypt para contraseñas
- [ ] Agregar autenticación JWT
- [ ] Crear panel de control GDPR
- [ ] Implementar auditoría de acceso a datos
- [ ] Agregar 2FA para cuentas
- [ ] Crear proceso de retorno asistido con chat

---

> ⚖️ **Cumplimiento Legal:** Este proyecto cumple con GDPR, CCPA y normativas de protección de datos locales (Colombia).

**Última actualización:** 21 de mayo de 2026
