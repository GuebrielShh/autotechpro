# 🚀 Guía de Despliegue a Producción

Tu proyecto está **100% listo para producción**. Elige tu plataforma de despliegue.

---

## ⚡ Opción 1: Railway (Recomendado)

Railway es más simple, sin limites de tiempo de inactividad.

### 1️⃣ Crear Cuenta

- Ve a [railway.app](https://railway.app)
- Click "Deploy" en la esquina superior derecha
- Selecciona "Deploy from GitHub repo"
- Autentica con tu cuenta de GitHub

### 2️⃣ Conectar Repositorio

1. Click en **"New Project"**
2. Selecciona **"Deploy from GitHub repo"**
3. Autoriza Railway para acceder a tu GitHub
4. Busca y selecciona **`autotechpro`**

### 3️⃣ Configurar Variables de Entorno

Railway detectará automáticamente tu `package.json`. En la sección **"Variables"** agrega:

```
NODE_ENV = production
PORT     = 3001
```

### 4️⃣ Configurar Build y Start

En **"Settings"** del servicio:

| Campo | Valor |
|-------|-------|
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |

### 5️⃣ Desplegar

Click en **"Deploy"**. En 2-3 minutos tendrás:

```
🎉 https://autotechpro-production-xxxx.railway.app
```

### Redesplegare Automático

Cada vez que hagas `git push`:

```bash
git add .
git commit -m "descripción del cambio"
git push
```

Railway detecta el push y redespliega automáticamente en ~1-2 minutos.

---

## 🎨 Opción 2: Render

Si Railway no funciona, Render es igual de simple.

### 1️⃣ Crear Cuenta

- Ve a [render.com](https://render.com)
- Click "Sign Up"
- Autentica con GitHub

### 2️⃣ Crear Web Service

1. Click en **"New +"**
2. Selecciona **"Web Service"**
3. Conecta tu repositorio `autotechpro`
4. Selecciona **"Node"** como entorno

### 3️⃣ Configurar Despliegue

Rellena estos campos:

| Campo | Valor |
|-------|-------|
| **Name** | `autotechpro` |
| **Build Command** | `npm run build` |
| **Start Command** | `npm start` |
| **Runtime** | `Node` |

### 4️⃣ Variables de Entorno

En **"Environment"** agrega:

```
NODE_ENV = production
```

### 5️⃣ Desplegar

Click en **"Create Web Service"**. En 3-5 minutos:

```
🎉 https://autotechpro.onrender.com
```

⚠️ **Nota:** El plan gratuito de Render duerme después de 15 min sin uso — la primera visita tarda ~30 seg.

---

## 🔄 Flujo de Trabajo Completo

```
Tu Computadora (Local)
         ↓
    git push
         ↓
   GitHub Repository
         ↓
  Railway/Render detecta push
         ↓
   Automáticamente redespliega
         ↓
    URL Pública (LIVE)
```

### Ejemplo Práctico

Hiciste cambios locales:

```powershell
# 1. Haz cambios en el código
# 2. Commit y push
git add .
git commit -m "✨ Agregar nueva funcionalidad"
git push

# 3. ¡Listo! En 1-2 minutos está en producción
# https://tu-app.railway.app o .onrender.com
```

---

## 🔐 Seguridad en Producción

Antes de hacer público, asegúrate de:

- [ ] Actualizar `.env.example` sin datos reales
- [ ] Nunca commitear `.env` (ya en `.gitignore`)
- [ ] HTTPS habilitado (automático en Railway/Render)
- [ ] Node.js ≥ 18 (configurado en `package.json`)
- [ ] BASE de datos persistente (próxima mejora)

---

## 📊 Monitoreo

### Railway
- **Logs:** Visible en el dashboard
- **Métricas:** CPU, Memoria, Network
- **Rollback:** Click para revertir a deploy anterior

### Render
- **Logs:** Tab "Logs" en el servicio
- **Eventos:** Ver historial de deploys
- **Métricas:** CPU, Memoria

---

## 🆘 Solución de Problemas

### "Build failed"

```bash
# En local, prueba el build
npm run build
cd client && npm run build
```

Si falla localmente, Railway también fallará. Soluciona primero en local.

### "Application error" o "503"

```bash
# En Railway/Render, check los logs
# Posibles causas:
# - Puerto no es 3001
# - NODE_ENV no es 'production'
# - package.json incorrecto
```

**Solución:**
- Verifica variables de entorno
- Revisa la sección Logs
- Redespliega con un click

### La app se ve vacía

Si ves una página en blanco:

1. Abre DevTools (F12)
2. Mira la consola por errores
3. Verifica que `/api/services` responde en Network

**Probable causa:** Build no incluyó archivos CSS/JS
- Solución: Revisa `client/vite.config.js` tiene `outDir: 'dist'`

---

## 📈 URLs Finales

Una vez desplegado:

```
🌐 Frontend: https://autotechpro-production.railway.app
🔌 API: https://autotechpro-production.railway.app/api/services
```

El backend sirve automáticamente el frontend buildado.

---

## 🎓 Próximas Mejoras Recomendadas

1. **Base de Datos Persistente**
   ```javascript
   // Cambiar de in-memory a MongoDB/PostgreSQL
   // Ver server/index.js línea 20-30
   ```

2. **Variables de Entorno**
   - `DATABASE_URL` para conexión a BD
   - `MERCADOPAGO_KEY` para pagos
   - `JWT_SECRET` para autenticación

3. **Autenticación**
   - JWT para clientes registrados
   - Roles de administrador

4. **Certificado SSL**
   - Railway/Render lo incluyen automáticamente ✅

---

## 📞 Soporte

- **Railway Support:** [railway.app/support](https://railway.app/support)
- **Render Support:** [render.com/support](https://render.com/support)
- **Tu Repository Issues:** Crea un issue en GitHub

---

**Status:** ✅ Proyecto listo para producción  
**Última actualización:** 21 de mayo de 2026

¡Felicidades por tu primer deployment! 🎉
