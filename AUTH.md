# 🔐 Sistema de Autenticación

## Overview

AutoTechPro ahora incluye un **sistema de login y registro** con perfiles de usuario personalizados. Cada usuario tiene su propia cuenta, historial de citas y datos de vehículo.

---

## 📝 Cuentas de Demo

### Usuario 1: María González
```
Email: maria@example.com
Contraseña: maria123
Vehículo: Honda Civic 2018
Estado: Oro (puntos: 1250)
```

### Usuario 2: Carlos Mendez
```
Email: carlos@example.com
Contraseña: carlos123
Vehículo: Toyota Corolla 2020
Estado: Plata (puntos: 650)
```

### Usuario 3: Ana Rodríguez
```
Email: ana@example.com
Contraseña: ana123
Vehículo: Chevrolet Spark 2019
Estado: Bronce (puntos: 300)
```

### 👤 Usuario de Inventario: Anthony
```
Email: anthony@autotechpro.com
Contraseña: anthony2026
Rol: Gerente de Inventario
Acceso: Gestión completa de stock y precios
```

---

## 🔧 Endpoints de Autenticación

### Registro
```javascript
POST /api/auth/register
{
  "name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "micontraseña123"
}

Respuesta:
{
  "success": true,
  "user": {
    "id": "u123456789",
    "email": "juan@example.com",
    "name": "Juan Pérez",
    "clientId": "c123456789"
  }
}
```

### Iniciar Sesión
```javascript
POST /api/auth/login
{
  "email": "maria@example.com",
  "password": "maria123"
}

Respuesta:
{
  "success": true,
  "user": {
    "id": "u1",
    "email": "maria@example.com",
    "name": "María González",
    "clientId": "c1"
  },
  "client": {
    "id": "c1",
    "name": "María González",
    "email": "maria@example.com",
    "phone": "300-123-4567",
    "vehicle": { ... },
    "tier": "Oro",
    "points": 1250,
    ...
  }
}
```

### Cerrar Sesión
```javascript
POST /api/auth/logout
{}

Respuesta:
{
  "success": true,
  "message": "Sesión cerrada"
}
```

### Verificar Autenticación
```javascript
GET /api/auth/me?userId=u1

Respuesta:
{
  "user": { ... },
  "client": { ... }
}
```

---

## 💾 Almacenamiento Local

El sistema guarda los datos en **localStorage** del navegador:

```javascript
// Usuario actual
localStorage.getItem('user')
// Retorna: { id, email, name, clientId }

// Datos del cliente
localStorage.getItem('client')
// Retorna: { id, name, email, phone, vehicle, tier, points, ... }
```

### Limpiar Sesión
```javascript
localStorage.removeItem('user')
localStorage.removeItem('client')
```

---

## 🎨 Interfaz de Login

### Página de Login
- Dos pestañas: **Inicia Sesión** y **Registrate**
- Validación de campos requeridos
- Mensajes de error claros
- Redirección automática al dashboard tras login

### Después de Iniciar Sesión
```
┌─────────────────────────────────────────────────┐
│ AUTOTECHPRO  [Home] [Servicios] [Tienda] [...]  │
│                          👤 María González [Salir]│
└─────────────────────────────────────────────────┘
```

- ✅ Nombre del usuario en la navbar
- ✅ Botón de "Salir" para desconectarse
- ✅ Carrito con cantidad de items
- ✅ Acceso a todas las páginas personalizadas

---

## 🔄 Flujo de Datos

```
┌─────────────┐
│   LOGIN     │
└──────┬──────┘
       │
       ├─► /api/auth/login
       │
       ├─► localStorage.setItem('user', ...)
       │
       ├─► localStorage.setItem('client', ...)
       │
       ├─► App.jsx renderiza con usuario
       │
       ├─► BookingPage pre-llena nombre + email
       │
       └─► ClientPortal muestra datos del usuario
```

---

## 📱 Funciones en client/src/api.js

```javascript
// Registro
const res = await API.register({
  name: "Juan",
  email: "juan@example.com",
  password: "pass123"
})

// Login
const res = await API.login("maria@example.com", "maria123")

// Logout
await API.logout()

// Verificar autenticación
const profile = await API.checkAuth("u1")
```

---

## 🔐 Características Implementadas

✅ **Registro de nuevos usuarios**
- Validación de email único
- Creación automática de perfil de cliente
- Asignación de tier "Bronce" inicial
- 0 puntos iniciales

✅ **Inicio de sesión**
- Validación de credenciales
- Retorno de datos de usuario y cliente
- Almacenamiento en localStorage

✅ **Cierre de sesión**
- Limpieza de localStorage
- Redirección a login
- Vaciado del carrito

✅ **Personalización por usuario**
- BookingPage: Pre-llena nombre y email
- ClientPortal: Muestra datos del usuario logueado
- Navbar: Muestra nombre del usuario
- Citas: Asociadas al email del usuario

---

## 🚀 Próximas Mejoras

### Seguridad (Producción)
- [ ] Hash de contraseñas (bcrypt)
- [ ] JWT tokens en lugar de localStorage
- [ ] Refresh tokens
- [ ] Rate limiting en login

### Funcionalidad
- [ ] Recuperación de contraseña por email
- [ ] Verificación de email al registrarse
- [ ] Autenticación con Google/Facebook
- [ ] Perfil editable del usuario

### Backend
- [ ] Base de datos persistente (MongoDB)
- [ ] Sesiones con cookies seguras
- [ ] Auditoría de accesos
- [ ] 2FA (Autenticación de dos factores)

---

## ⚠️ Notas Importantes

### En Desarrollo
- Las contraseñas se guardan en texto plano (❌ NUNCA EN PRODUCCIÓN)
- Los datos se pierden al reiniciar el servidor
- localStorage es visible en DevTools

### Para Producción
1. **USAR HTTPS obligatoriamente**
2. **Hash las contraseñas con bcrypt**
3. **Implementa JWT tokens**
4. **Usa base de datos segura (MongoDB, PostgreSQL)**
5. **Implementa validación en el backend**
6. **Activa CORS selectivamente**
7. **Rate limiting en endpoints de auth**

---

## 🧪 Testing

### Probar Registro
1. Ir a página de login
2. Click en "Registrate"
3. Ingresar nombre, email, contraseña
4. Click "Crear Cuenta"
5. Ir a "Inicia Sesión"
6. Ingresar credenciales nuevas

### Probar Login
1. Ingresar: maria@example.com / maria123
2. Verificar que se muestra "👤 María González"
3. Ir a "Mi Cuenta" - debe mostrar datos de María
4. Click en "Salir"
5. Debe regresar a login

### Probar Persistencia
1. Ingresar sesión
2. Actualizar página (F5)
3. Datos deben persistir (localStorage)
4. Cerrar localStorage en DevTools
5. Ingresar sesión nuevamente

---

## 📊 Estado de Implementación

| Feature | Status | Notes |
|---------|--------|-------|
| Login básico | ✅ | Funcional con 3 usuarios demo |
| Registro | ✅ | Crea usuario y cliente automáticamente |
| Logout | ✅ | Limpia sesión completamente |
| Persistencia | ✅ | Usa localStorage |
| Validación | ✅ | Campos y formato básico |
| Seguridad | ⚠️ | MVP only - necesita mejoras para prod |
| JWT | ❌ | Usar después de integrar BD |
| Recuperación de contraseña | ❌ | Pendiente |
| 2FA | ❌ | Pendiente |

---

**Última actualización:** 21 de mayo de 2026
**Versión:** 1.0 - MVP Authentication System
