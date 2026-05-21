# 🚗 AutoTechPro - Transformación Digital de Taller Mecánico

**AutoTechPro** es una plataforma e-business integral que transforma un taller mecánico tradicional en un negocio digital de alto nivel, ofreciendo agendamiento de citas, tienda online de repuestos, y portal de cliente con seguimiento en tiempo real.

![Estado](https://img.shields.io/badge/estado-desarrollo-yellow) ![Node.js](https://img.shields.io/badge/node-%3E%3D16-green) ![React](https://img.shields.io/badge/react-18.2-blue) ![Express](https://img.shields.io/badge/express-4.18-green)

---

## 📋 Tabla de Contenidos

- [Características](#características)
- [Requisitos](#requisitos)
- [Instalación](#instalación)
- [Ejecución](#ejecución)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [API REST](#api-rest)
- [Configuración](#configuración)
- [Contribuir](#contribuir)
- [Licencia](#licencia)

---

## ✨ Características

### 🎯 Para Clientes
- **Agendamiento Online 24/7** - Reserva citas en 4 pasos sin llamar
- **Tienda Online** - Compra repuestos originales con entrega en 3 días
- **Portal Personalizado** - Historial de servicios, puntos de lealtad, alertas de mantenimiento
- **Consulta de Citas** - Seguimiento en tiempo real con código de confirmación
- **Métodos de Pago** - Múltiples opciones (tarjeta, transferencia, billeteras digitales)

### 🛠️ Para Administración
- **6 Páginas Funcionales**
  - Inicio (Hero + Servicios principales)
  - Catálogo de Servicios
  - Tienda Online de Repuestos
  - Agendamiento de Citas
  - Consulta de Citas
  - Portal del Cliente

### 🔧 Stack Tecnológico
- **Backend**: Node.js + Express.js
- **Frontend**: React 18 + Vite
- **Base de Datos**: En memoria (MVP) - Preparado para MongoDB/PostgreSQL
- **Estilos**: CSS-in-JS (Bebas Neue + DM Sans)
- **APIs**: REST con CORS habilitado

---

## 🔧 Requisitos

Antes de iniciar, asegúrate de tener instalado:

- **Node.js** ≥ 16.0.0 ([Descargar](https://nodejs.org/))
- **npm** ≥ 8.0.0 (incluido con Node.js)
- **Git** ([Descargar](https://git-scm.com/))

### Verificar instalación:
```bash
node --version      # v16.x.x o superior
npm --version       # 8.x.x o superior
git --version       # Cualquier versión reciente
```

---

## 📦 Instalación

### 1. Clonar el Repositorio

```bash
git clone https://github.com/tu-usuario/autotechpro.git
cd autotechpro
```

### 2. Instalar Dependencias del Backend

```bash
npm install
```

**Dependencias instaladas:**
- `express` - Framework web
- `cors` - Cross-origin requests
- `uuid` - Generador de IDs únicos
- `nodemon` - Dev: auto-reload en cambios
- `concurrently` - Dev: ejecutar múltiples procesos

### 3. Instalar Dependencias del Frontend

```bash
cd client
npm install
cd ..
```

**Dependencias instaladas:**
- `react` - Librería UI
- `react-dom` - Binding React a DOM
- `vite` - Build tool ultrarrápido
- `@vitejs/plugin-react` - Plugin React para Vite

---

## 🚀 Ejecución

### Opción A: Ejecutar Todo (Recomendado)

```bash
npm run dev
```

Esto inicia **simultáneamente**:
- **Backend**: http://localhost:3001
- **Frontend**: http://localhost:5173

El frontend se conecta al backend automáticamente vía proxy de Vite.

### Opción B: Ejecutar por Separado

**Terminal 1 - Backend:**
```bash
npm run server
# Escucha en http://localhost:3001
```

**Terminal 2 - Frontend:**
```bash
cd client && npm run dev
# Escucha en http://localhost:5173
```

### Opción C: Build para Producción

```bash
# Compilar frontend
cd client
npm run build
cd ..

# Frontend estará en client/dist/
# Backend sirve automáticamente desde ese directorio
npm run server
```

---

## 📁 Estructura del Proyecto

```
autotechpro/
├── package.json                    ← Scripts: dev, server, client
├── .gitignore                      ← Archivo Git
├── README.md                       ← Este archivo
│
├── server/
│   ├── index.js                    ← API Express (9 rutas)
│   └── [futuros módulos...]
│
└── client/
    ├── package.json
    ├── vite.config.js             ← Config build + proxy /api
    ├── index.html                 ← Entry point HTML
    │
    └── src/
        ├── main.jsx               ← React entry point
        ├── api.js                 ← Funciones fetch al backend
        └── App.jsx                ← UI completa (2500+ líneas)
```

---

## 🔌 API REST

### Servicios

**GET** `/api/services`
```json
Retorna: [{ id, name, price, duration, category, desc }, ...]
```

### Repuestos

**GET** `/api/parts?search=filtro&category=Filtros`
```json
Retorna: [{ id, name, price, stock, brand, category, sku }, ...]
```

### Citas

**GET** `/api/appointments/dates`
- Retorna: Array de fechas disponibles

**GET** `/api/appointments/slots?date=2026-05-25`
- Retorna: Horarios disponibles para esa fecha

**POST** `/api/appointments`
```json
Body: {
  clientName, clientEmail, clientPhone,
  vehicle: { make, model, year, plate },
  serviceId, slotId, notes
}
Retorna: { confirmationCode, ... }
```

**GET** `/api/appointments/:code`
- Retorna: Datos completos de la cita

### Órdenes

**POST** `/api/orders`
```json
Body: {
  items: [{ partId, qty }, ...],
  client: { name, email },
  paymentMethod: "MercadoPago"|"PayU"|"Wompi"|"Tarjeta"
}
Retorna: { orderNumber, total, estimatedDelivery, ... }
```

### Clientes

**GET** `/api/clients/:id`
- Retorna: Datos del cliente + citas asociadas

### Estadísticas

**GET** `/api/stats`
```json
Retorna: { totalAppointments, totalOrders, revenue, servicesAvailable, partsInStock }
```

---

## ⚙️ Configuración

### Variables de Entorno (Futuras)

Crea un archivo `.env` en la raíz (no se sube a Git):

```env
# Backend
PORT=3001
NODE_ENV=development

# Pagos (cuando se implemente)
MERCADOPAGO_KEY=your_key
STRIPE_KEY=your_key

# Base de datos (cuando se migre)
DB_URL=mongodb://localhost:27017/autotechpro
```

### Configurar Proxy del Frontend

El archivo `client/vite.config.js` ya tiene configurado el proxy:

```javascript
proxy: {
  '/api': 'http://localhost:3001'
}
```

Esto hace que requests a `/api/*` se redirijan automáticamente al backend en desarrollo.

---

## 📝 Scripts Disponibles

```bash
# Proyecto Root
npm run dev           # Backend + Frontend simultáneamente
npm run server        # Solo backend (nodemon)
npm run client        # Solo frontend (vite)

# Cliente (desde client/)
npm run dev           # Vite dev server
npm run build         # Build optimizado
npm run preview       # Preview del build
```

---

## 🔐 Notas de Seguridad

⚠️ **Este es un MVP de demostración:**

- ✅ CORS habilitado solo para desarrollo
- ❌ Sin autenticación ni autorización
- ❌ Base de datos en memoria (se pierde al reiniciar)
- ❌ Sin validación exhaustiva de inputs
- ❌ Sin rate limiting

**Antes de producción:**
- [ ] Migrar a base de datos persistente (MongoDB/PostgreSQL)
- [ ] Implementar autenticación JWT
- [ ] Validar todos los inputs con Joi/Zod
- [ ] Agregar rate limiting
- [ ] Usar variables de entorno seguros
- [ ] HTTPS obligatorio
- [ ] Ocultar CORS en producción

---

## 🐛 Solución de Problemas

### Puerto 3001 o 5173 en uso

```bash
# Windows: Liberar puerto
netstat -ano | findstr :3001
taskkill /PID <PID> /F

# Mac/Linux: Liberar puerto
lsof -ti:3001 | xargs kill -9
```

### Node modules corrupto

```bash
rm -rf node_modules client/node_modules
npm install && cd client && npm install && cd ..
```

### Vite no conecta al backend

Verifica que `client/vite.config.js` tenga:
```javascript
server: {
  proxy: {
    '/api': 'http://localhost:3001'
  }
}
```

### "Cannot find module 'express'"

```bash
npm install
npm install --save-dev nodemon concurrently
```

---

## 📤 Subir a GitHub

### 1. Crear repositorio en GitHub

1. Ve a [GitHub.com](https://github.com/new)
2. Click en "New repository"
3. Nombre: `autotechpro`
4. Descripción: "Plataforma e-business para taller mecánico"
5. No inicialices con README (ya tienes uno)
6. Click "Create repository"

### 2. Conectar local con GitHub

```bash
cd c:\Users\guebr\autotechpro

git config --global user.name "Tu Nombre"
git config --global user.email "tu@email.com"

git init
git add .
git commit -m "🚀 Initial commit: MVP AutoTechPro"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/autotechpro.git
git push -u origin main
```

### 3. Verificar en GitHub

```bash
git remote -v  # Debería mostrar origin https://github.com/...
```

---

## 📚 Próximas Mejoras

- [ ] Base de datos: MongoDB/PostgreSQL
- [ ] Autenticación: JWT + Google/Facebook login
- [ ] Pagos reales: MercadoPago, PayU, Stripe
- [ ] Notificaciones: SMS, Email, WhatsApp
- [ ] Aplicación móvil: React Native
- [ ] IoT: Sensores RFID, GPS
- [ ] IA/ML: Predicción de fallas, recomendaciones
- [ ] CRM: Automatización de marketing
- [ ] ERP: Gestión financiera completa

---

## 👥 Contribuidores

- **Anthony Alberto Mestra Ríos**
- **Guebriel Gabriel Garces Ravel**
- **Hailyn Elena Pacheco Ríos**
- **Juan Felipe Rodriguez Paternina**

Cartagena-Bolívar, Colombia | Mayo 2026

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver archivo `LICENSE` para detalles.

---

## 📞 Soporte

Para reportar bugs o sugerir mejoras, abre un issue en el repositorio:
- [Issues de GitHub](https://github.com/TU_USUARIO/autotechpro/issues)

---

## 🎓 Documentación Adicional

El proyecto está basado en el estudio de caso **"El Bisturí Digital"** que detalla la transformación digital completa de un taller mecánico tradicional hacia un modelo e-business integrado.

### Componentes clave:
1. **Digitalización de Procesos Internos** (IoT, Automatización)
2. **Plataforma E-Commerce** (Web, App, Marketplaces)
3. **Ecosistema Digital** (Big Data, IA, CRM)
4. **Triángulo de Valor** (ERP, CRM, SCM)

---

**Última actualización**: 21 de mayo de 2026

✨ **Hecho con 💙 para la transformación digital** ✨
