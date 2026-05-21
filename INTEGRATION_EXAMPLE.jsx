// ════════════════════════════════════════════════════════════════
// EJEMPLO DE CÓMO INTEGRAR TODO EN TU APP.JSX
// ════════════════════════════════════════════════════════════════

import { useState } from 'react'
import * as API from './api.js'
import PoliciesAndSettings from './PoliciesAndSettings.jsx'

export default function AppExample() {
  const [page, setPage] = useState('home')
  const [user, setUser] = useState({ email: 'maria@example.com' })

  return (
    <div className="app">
      {/* NAVBAR CON ENLACE A POLÍTICAS */}
      <nav className="nav">
        <div className="nav-logo">
          AUTO<span>TECH</span>PRO
        </div>
        <div className="nav-links">
          <button onClick={() => setPage('home')} className={`nav-btn ${page === 'home' ? 'active' : ''}`}>
            Inicio
          </button>
          <button onClick={() => setPage('services')} className={`nav-btn ${page === 'services' ? 'active' : ''}`}>
            Servicios
          </button>
          <button onClick={() => setPage('shop')} className={`nav-btn ${page === 'shop' ? 'active' : ''}`}>
            Tienda
          </button>
          {/* ✨ NUEVO: Botón de Políticas y Configuración */}
          <button onClick={() => setPage('policies')} className={`nav-btn ${page === 'policies' ? 'active' : ''}`}>
            ⚙️ Configuración
          </button>
        </div>
        <button className="cart-btn">
          🛒 Carrito <span className="badge">0</span>
        </button>
      </nav>

      {/* CONTENIDO PRINCIPAL */}
      <main style={{ flex: 1 }}>
        {/* HOME PAGE */}
        {page === 'home' && (
          <div className="page">
            <h1>Bienvenido a AutoTechPro</h1>
            <p>Tu plataforma de servicios automotrices</p>
          </div>
        )}

        {/* SERVICIOS PAGE */}
        {page === 'services' && (
          <div className="page">
            <h1>Nuestros Servicios</h1>
            <p>Explora nuestras opciones...</p>
          </div>
        )}

        {/* TIENDA PAGE */}
        {page === 'shop' && (
          <div className="page">
            <h1>Tienda de Repuestos</h1>
            <p>Compra repuestos de calidad...</p>
          </div>
        )}

        {/* ✨ POLÍTICAS Y CONFIGURACIÓN PAGE */}
        {page === 'policies' && (
          <PoliciesAndSettings userEmail={user.email} />
        )}
      </main>

      {/* FOOTER CON ENLACES RÁPIDOS A POLÍTICAS */}
      <footer style={{
        background: '#F5F5F5',
        borderTop: '1px solid #E5E7EB',
        padding: '2rem',
        marginTop: 'auto'
      }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem' }}>
          {/* LEGAL LINKS */}
          <div>
            <h4 style={{ marginBottom: '1rem', fontWeight: '600' }}>📋 Legal</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <button
                  onClick={() => setPage('policies')}
                  style={{ background: 'none', border: 'none', color: '#D0021B', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Política de Privacidad
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPage('policies')}
                  style={{ background: 'none', border: 'none', color: '#D0021B', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Términos y Condiciones
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPage('policies')}
                  style={{ background: 'none', border: 'none', color: '#D0021B', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Política de Devoluciones
                </button>
              </li>
            </ul>
          </div>

          {/* COOKIES */}
          <div>
            <h4 style={{ marginBottom: '1rem', fontWeight: '600' }}>🍪 Cookies</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <button
                  onClick={() => setPage('policies')}
                  style={{ background: 'none', border: 'none', color: '#D0021B', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Gestionar Cookies
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPage('policies')}
                  style={{ background: 'none', border: 'none', color: '#D0021B', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Preferencias GDPR
                </button>
              </li>
            </ul>
          </div>

          {/* SUSCRIPCIONES */}
          <div>
            <h4 style={{ marginBottom: '1rem', fontWeight: '600' }}>🎁 Suscripciones</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <button
                  onClick={() => setPage('policies')}
                  style={{ background: 'none', border: 'none', color: '#D0021B', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Ver Planes
                </button>
              </li>
              <li>
                <button
                  onClick={() => setPage('policies')}
                  style={{ background: 'none', border: 'none', color: '#D0021B', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Mi Suscripción
                </button>
              </li>
            </ul>
          </div>

          {/* INVENTARIO */}
          <div>
            <h4 style={{ marginBottom: '1rem', fontWeight: '600' }}>📦 Inventario</h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <li>
                <button
                  onClick={() => setPage('policies')}
                  style={{ background: 'none', border: 'none', color: '#D0021B', cursor: 'pointer', textDecoration: 'underline' }}
                >
                  Ver Stock
                </button>
              </li>
              <li>
                <span style={{ fontSize: '12px', color: '#6B6B6B' }}>
                  Gerente: Anthony
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM INFO */}
        <div style={{
          marginTop: '2rem',
          paddingTop: '1.5rem',
          borderTop: '1px solid #D1D5DB',
          textAlign: 'center',
          color: '#6B6B6B',
          fontSize: '12px'
        }}>
          <p>© 2026 AutoTechPro. Todos los derechos reservados.</p>
          <p style={{ marginTop: '0.5rem' }}>
            📧 privacy@autotechpro.com | 📞 support@autotechpro.com | 🔄 returns@autotechpro.com
          </p>
        </div>
      </footer>
    </div>
  );
}

// ════════════════════════════════════════════════════════════════
// PASOS PARA IMPLEMENTAR EN TU APP.JSX ACTUAL:
// ════════════════════════════════════════════════════════════════

/*
1. Importa al inicio:
   import PoliciesAndSettings from './PoliciesAndSettings.jsx'

2. Agrega estado para la página actual (si no lo tienes):
   const [page, setPage] = useState('home')

3. En el navbar, agrega el botón:
   <button onClick={() => setPage('policies')} className={`nav-btn ${page === 'policies' ? 'active' : ''}`}>
     ⚙️ Configuración
   </button>

4. En el contenido principal, agrega:
   {page === 'policies' && <PoliciesAndSettings userEmail={user.email} />}

5. (Opcional) Agrega enlaces en el footer como en el ejemplo arriba.

¡Listo! Ahora tienes acceso a:
✅ Políticas de Privacidad
✅ Términos y Condiciones
✅ Política de Devoluciones
✅ Gestión de Cookies
✅ Suscripciones (Básico, Plata, Oro, Platinum)
✅ Inventario (Gerente: Anthony)
*/
