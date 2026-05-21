import { useState, useEffect } from 'react';
import * as API from './api.js';
import { COOKIE_CONFIG, GDPR_CONFIG } from './config.js';

// ─────────────────────────────────────────────────────────────────
// COMPONENTE COMPLETO: POLÍTICAS, COOKIES, SUSCRIPCIONES E INVENTARIO
// ─────────────────────────────────────────────────────────────────

export const PoliciesAndSettings = ({ userEmail = 'anonymous' }) => {
  const [activeTab, setActiveTab] = useState('policies');
  const [policies, setPolicies] = useState(null);
  const [cookieSettings, setCookieSettings] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false
  });
  const [subscription, setSubscription] = useState(null);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadData();
  }, [userEmail]);

  const loadData = async () => {
    try {
      const policiesData = await API.getPolicies();
      setPolicies(policiesData);
      
      const subData = await API.getSubscription(userEmail);
      setSubscription(subData);
      
      const invData = await API.getInventory();
      setInventory(invData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCookieSave = async () => {
    try {
      await API.saveCookieConsent(cookieSettings, userEmail);
      setMessage('✅ Preferencias de cookies guardadas');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Error guardando preferencias');
    }
  };

  const handleSubscribe = async (plan) => {
    try {
      const result = await API.subscribeToPlan(userEmail, plan);
      if (result.success) {
        setSubscription(result.subscription);
        setMessage(`✅ ¡Suscrito a ${plan}!`);
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('❌ Error al suscribirse');
    }
  };

  const handleCancelSubscription = async () => {
    if (!window.confirm('¿Estás seguro de que quieres cancelar la suscripción?')) return;
    try {
      const result = await API.cancelSubscription(userEmail);
      if (result.success) {
        setSubscription(null);
        setMessage('✅ Suscripción cancelada');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage('❌ Error cancelando suscripción');
    }
  };

  if (loading) return <div className="page"><p>Cargando...</p></div>;

  return (
    <div className="page">
      <div className="page-tag">⚙️ Configuración Legal</div>
      <h1 className="page-title">Políticas y Configuración</h1>
      <p className="page-sub">Gestiona tus cookies, devoluciones, suscripciones e inventario</p>

      {message && (
        <div style={{
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          borderRadius: '8px',
          padding: '12px 16px',
          marginBottom: '1.5rem',
          color: '#166534',
          fontSize: '14px'
        }}>
          {message}
        </div>
      )}

      {/* TABS */}
      <div style={{
        display: 'flex',
        gap: '1rem',
        marginBottom: '2rem',
        borderBottom: '1px solid #E5E7EB'
      }}>
        {[
          { id: 'policies', label: '📋 Políticas', icon: '📋' },
          { id: 'cookies', label: '🍪 Cookies & GDPR', icon: '🍪' },
          { id: 'returns', label: '↩️ Devoluciones', icon: '↩️' },
          { id: 'subscription', label: '🎁 Suscripciones', icon: '🎁' },
          { id: 'inventory', label: '📦 Inventario', icon: '📦' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              background: 'none',
              border: 'none',
              padding: '1rem',
              fontSize: '14px',
              fontWeight: activeTab === tab.id ? '600' : '500',
              color: activeTab === tab.id ? '#D0021B' : '#6B6B6B',
              borderBottom: activeTab === tab.id ? '2px solid #D0021B' : 'none',
              cursor: 'pointer',
              transition: 'all 0.15s'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* CONTENT */}
      {activeTab === 'policies' && <TabPolicies policies={policies} />}
      {activeTab === 'cookies' && (
        <TabCookies
          settings={cookieSettings}
          setSettings={setCookieSettings}
          onSave={handleCookieSave}
        />
      )}
      {activeTab === 'returns' && <TabReturns />}
      {activeTab === 'subscription' && (
        <TabSubscription
          subscription={subscription}
          onSubscribe={handleSubscribe}
          onCancel={handleCancelSubscription}
        />
      )}
      {activeTab === 'inventory' && <TabInventory inventory={inventory} />}
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// TAB: POLÍTICAS
// ─────────────────────────────────────────────────────────────────

const TabPolicies = ({ policies }) => (
  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
    {/* PRIVACIDAD */}
    <div className="card" style={{ padding: '2rem' }}>
      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        🔐 Política de Privacidad
      </h3>
      <p style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: '1.6', marginBottom: '1rem' }}>
        <strong>Datos recopilados:</strong><br />
        • Nombre y contacto<br />
        • Información de vehículo<br />
        • Historial de citas y compras<br />
        • Preferencias y comportamiento
      </p>
      <p style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: '1.6' }}>
        <strong>Tus derechos GDPR:</strong><br />
        ✓ Acceso a tus datos<br />
        ✓ Rectificación de datos inexactos<br />
        ✓ Derecho al olvido<br />
        ✓ Portabilidad de datos<br />
        ✓ Restricción de procesamiento
      </p>
      <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E5E7EB' }}>
        <p style={{ fontSize: '12px', color: '#999' }}>
          <strong>Contacto:</strong> privacy@autotechpro.com<br />
          <strong>Versión:</strong> {GDPR_CONFIG.PRIVACY_VERSION}<br />
          <strong>Efectiva desde:</strong> {GDPR_CONFIG.PRIVACY_EFFECTIVE_DATE}
        </p>
      </div>
    </div>

    {/* TÉRMINOS */}
    <div className="card" style={{ padding: '2rem' }}>
      <h3 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ⚖️ Términos y Condiciones
      </h3>
      <p style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: '1.6', marginBottom: '1rem' }}>
        <strong>Aceptas que:</strong><br />
        • Eres mayor de 18 años<br />
        • Usarás el servicio legalmente<br />
        • No distribuirás contenido prohibido<br />
        • Aceptas cambios en términos<br />
        • Respondes por tu actividad
      </p>
      <p style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: '1.6' }}>
        <strong>Limitaciones de responsabilidad:</strong><br />
        AutoTechPro no es responsable por daños indirectos derivados del uso del servicio.
      </p>
      <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid #E5E7EB' }}>
        <p style={{ fontSize: '12px', color: '#999' }}>
          <strong>Versión:</strong> {GDPR_CONFIG.TERMS_VERSION}<br />
          <strong>Efectiva desde:</strong> {GDPR_CONFIG.TERMS_EFFECTIVE_DATE}
        </p>
      </div>
    </div>

    {/* RETENCIÓN DE DATOS */}
    <div className="card" style={{ padding: '2rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>⏰ Retención de Datos</h3>
      <table style={{ width: '100%', fontSize: '13px', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid #E5E7EB' }}>
            <th style={{ textAlign: 'left', padding: '8px 0', fontWeight: '600' }}>Tipo</th>
            <th style={{ textAlign: 'right', padding: '8px 0', fontWeight: '600' }}>Días</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(GDPR_CONFIG.DATA_RETENTION_DAYS).map(([key, days]) => (
            <tr key={key} style={{ borderBottom: '1px solid #F3F4F6' }}>
              <td style={{ padding: '10px 0', color: '#6B6B6B' }}>
                {key.replace(/_/g, ' ')}
              </td>
              <td style={{ padding: '10px 0', textAlign: 'right', fontWeight: '500' }}>
                {days === 999999 ? 'Indefinido' : `${days} días`}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* CONTACTO LEGAL */}
    <div className="card" style={{ padding: '2rem' }}>
      <h3 style={{ marginBottom: '1rem' }}>📧 Contacto Legal</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '3px' }}>PRIVACIDAD</p>
          <a href={`mailto:${GDPR_CONFIG.CONTACT_EMAIL}`}
             style={{ color: '#D0021B', textDecoration: 'none', fontWeight: '600' }}>
            {GDPR_CONFIG.CONTACT_EMAIL}
          </a>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '3px' }}>SOPORTE</p>
          <a href={`mailto:${GDPR_CONFIG.SUPPORT_EMAIL}`}
             style={{ color: '#D0021B', textDecoration: 'none', fontWeight: '600' }}>
            {GDPR_CONFIG.SUPPORT_EMAIL}
          </a>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '3px' }}>DEVOLUCIONES</p>
          <a href={`mailto:${GDPR_CONFIG.RETURNS_EMAIL}`}
             style={{ color: '#D0021B', textDecoration: 'none', fontWeight: '600' }}>
            {GDPR_CONFIG.RETURNS_EMAIL}
          </a>
        </div>
        <div>
          <p style={{ fontSize: '12px', color: '#999', marginBottom: '3px' }}>LEGAL</p>
          <a href={`mailto:${GDPR_CONFIG.LEGAL_EMAIL}`}
             style={{ color: '#D0021B', textDecoration: 'none', fontWeight: '600' }}>
            {GDPR_CONFIG.LEGAL_EMAIL}
          </a>
        </div>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────
// TAB: COOKIES & GDPR
// ─────────────────────────────────────────────────────────────────

const TabCookies = ({ settings, setSettings, onSave }) => (
  <div style={{ maxWidth: '700px' }}>
    <div className="card" style={{ padding: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem' }}>🍪 Preferencias de Cookies</h3>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        {/* ESSENTIAL */}
        <div style={{
          padding: '1rem',
          background: '#FEF2F2',
          border: '1px solid #FEE2E2',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: '600', marginBottom: '4px' }}>🔒 Esenciales</p>
              <p style={{ fontSize: '13px', color: '#6B6B6B' }}>
                Sesión y funcionalidad básica del sitio (requerida)
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.essential}
              disabled
              style={{ width: '20px', height: '20px', cursor: 'not-allowed' }}
            />
          </div>
        </div>

        {/* ANALYTICS */}
        <div style={{
          padding: '1rem',
          background: '#F0FDF4',
          border: '1px solid #DBEAFE',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: '600', marginBottom: '4px' }}>📊 Analítica</p>
              <p style={{ fontSize: '13px', color: '#6B6B6B' }}>
                {COOKIE_CONFIG.DESCRIPTIONS.ANALYTICS}
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.analytics}
              onChange={(e) => setSettings({ ...settings, analytics: e.target.checked })}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* MARKETING */}
        <div style={{
          padding: '1rem',
          background: '#FEF3C7',
          border: '1px solid #FDE68A',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: '600', marginBottom: '4px' }}>📢 Marketing</p>
              <p style={{ fontSize: '13px', color: '#6B6B6B' }}>
                {COOKIE_CONFIG.DESCRIPTIONS.MARKETING}
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.marketing}
              onChange={(e) => setSettings({ ...settings, marketing: e.target.checked })}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>
        </div>

        {/* PREFERENCES */}
        <div style={{
          padding: '1rem',
          background: '#EDE9FE',
          border: '1px solid #DDD6FE',
          borderRadius: '8px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ fontWeight: '600', marginBottom: '4px' }}>⚙️ Preferencias</p>
              <p style={{ fontSize: '13px', color: '#6B6B6B' }}>
                {COOKIE_CONFIG.DESCRIPTIONS.PREFERENCES}
              </p>
            </div>
            <input
              type="checkbox"
              checked={settings.preferences}
              onChange={(e) => setSettings({ ...settings, preferences: e.target.checked })}
              style={{ width: '20px', height: '20px', cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>

      <div style={{ marginTop: '2rem', display: 'flex', gap: '1rem' }}>
        <button
          onClick={onSave}
          style={{
            background: '#D0021B',
            color: '#fff',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          💾 Guardar Preferencias
        </button>
        <button
          onClick={() => setSettings({ essential: true, analytics: true, marketing: true, preferences: true })}
          style={{
            background: '#F5F5F5',
            border: '1px solid #E5E7EB',
            padding: '10px 20px',
            borderRadius: '6px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          ✓ Aceptar Todo
        </button>
      </div>

      <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #E5E7EB' }}>
        <p style={{ fontSize: '12px', color: '#6B6B6B' }}>
          <strong>Información:</strong> Las cookies esenciales siempre están habilitadas. Las demás pueden deshabilitarse en cualquier momento.
        </p>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────
// TAB: DEVOLUCIONES
// ─────────────────────────────────────────────────────────────────

const TabReturns = () => (
  <div style={{ maxWidth: '900px' }}>
    <div className="card" style={{ padding: '2rem' }}>
      <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
        ↩️ Política de Devoluciones
      </h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginBottom: '2rem' }}>
        <div>
          <h4 style={{ marginBottom: '1rem', color: '#D0021B' }}>⏱️ Plazo de Devolución</h4>
          <div style={{
            background: '#FEF2F2',
            padding: '1.5rem',
            borderRadius: '8px',
            textAlign: 'center'
          }}>
            <p style={{ fontSize: '36px', fontWeight: '700', color: '#D0021B', marginBottom: '0.5rem' }}>
              {GDPR_CONFIG.RETURN_WINDOW_DAYS} días
            </p>
            <p style={{ fontSize: '13px', color: '#6B6B6B' }}>
              desde la fecha de compra para solicitar devolución
            </p>
          </div>
        </div>

        <div>
          <h4 style={{ marginBottom: '1rem', color: '#D0021B' }}>📋 Condiciones</h4>
          <ul style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: '1.8' }}>
            <li>✓ Producto sin usar</li>
            <li>✓ Empaque original intacto</li>
            <li>✓ Comprobante de compra</li>
            <li>✓ Sin daños o desgaste</li>
          </ul>
        </div>
      </div>

      <div style={{
        background: '#F3F4F6',
        padding: '1.5rem',
        borderRadius: '8px',
        marginBottom: '1.5rem'
      }}>
        <h4 style={{ marginBottom: '1rem' }}>📧 Proceso de Devolución</h4>
        <ol style={{ fontSize: '13px', color: '#6B6B6B', lineHeight: '1.8', marginLeft: '1.5rem' }}>
          <li style={{ marginBottom: '0.5rem' }}>
            Envía correo a <strong>{GDPR_CONFIG.RETURNS_EMAIL}</strong> con:
            <ul style={{ marginTop: '0.5rem', marginLeft: '1rem' }}>
              <li>Número de pedido</li>
              <li>Motivo de devolución</li>
              <li>Foto del producto (si aplica)</li>
            </ul>
          </li>
          <li>Recibirás instrucciones de envío</li>
          <li>Inspecciona tu devolución (3-5 días hábiles)</li>
          <li>Procesa reembolso (5-10 días hábiles)</li>
        </ol>
      </div>

      <div style={{
        background: '#FEF3C7',
        border: '1px solid #FDE68A',
        padding: '1rem',
        borderRadius: '8px'
      }}>
        <p style={{ fontSize: '13px', color: '#92400E' }}>
          <strong>⚠️ Nota:</strong> Los gastos de envío no son reembolsables. Los productos dañados por mal uso pueden ser rechazados.
        </p>
      </div>
    </div>
  </div>
);

// ─────────────────────────────────────────────────────────────────
// TAB: SUSCRIPCIONES
// ─────────────────────────────────────────────────────────────────

const TabSubscription = ({ subscription, onSubscribe, onCancel }) => {
  const plans = [
    {
      id: 'basic',
      name: 'Básico',
      price: 0,
      period: 'Gratis',
      features: [
        'Acceso a servicios básicos',
        'Historial de citas',
        '1% de puntos en compras'
      ]
    },
    {
      id: 'silver',
      name: 'Plata',
      price: 29900,
      period: '/mes',
      features: [
        'Todo en Básico +',
        'Descuento 10% en servicios',
        '5% de puntos en compras',
        'Soporte prioritario',
        'Acceso a ofertas exclusivas'
      ],
      mostPopular: false
    },
    {
      id: 'gold',
      name: 'Oro',
      price: 59900,
      period: '/mes',
      features: [
        'Todo en Plata +',
        'Descuento 20% en servicios',
        '10% de puntos en compras',
        'Mantenimiento preventivo gratis',
        'Reservas prioritarias',
        'Asesor dedicado'
      ],
      mostPopular: true
    },
    {
      id: 'platinum',
      name: 'Platinum',
      price: 99900,
      period: '/mes',
      features: [
        'Todo en Oro +',
        'Descuento 30% en servicios',
        '15% de puntos en compras',
        'Servicio a domicilio',
        'Cambios de aceite gratis',
        'Revisión diagnóstica gratis',
        'Asesor VIP 24/7'
      ]
    }
  ];

  return (
    <div>
      {subscription && (
        <div style={{
          background: '#F0FDF4',
          border: '1px solid #BBF7D0',
          padding: '1.5rem',
          borderRadius: '8px',
          marginBottom: '2rem'
        }}>
          <p style={{ fontSize: '14px', color: '#166534', marginBottom: '1rem' }}>
            <strong>✅ Plan Actual:</strong> {subscription.plan.toUpperCase()}
          </p>
          <p style={{ fontSize: '13px', color: '#166534', marginBottom: '1rem' }}>
            Próxima renovación: {new Date(subscription.renewalDate).toLocaleDateString('es-CO')}
          </p>
          <button
            onClick={onCancel}
            style={{
              background: '#EF4444',
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '6px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            ❌ Cancelar Suscripción
          </button>
        </div>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '1.5rem'
      }}>
        {plans.map(plan => (
          <div
            key={plan.id}
            style={{
              border: plan.mostPopular ? '2px solid #D0021B' : '1px solid #E5E7EB',
              borderRadius: '8px',
              padding: '1.5rem',
              background: plan.mostPopular ? '#FEF2F2' : '#fff',
              position: 'relative'
            }}
          >
            {plan.mostPopular && (
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#D0021B',
                color: '#fff',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '11px',
                fontWeight: '700',
                textTransform: 'uppercase'
              }}>
                Más Popular
              </div>
            )}

            <h4 style={{ marginBottom: '0.5rem' }}>{plan.name}</h4>
            <div style={{ marginBottom: '1rem' }}>
              <span style={{ fontSize: '28px', fontWeight: '700', color: '#D0021B' }}>
                ${plan.price.toLocaleString('es-CO')}
              </span>
              <span style={{ fontSize: '13px', color: '#6B6B6B', marginLeft: '0.5rem' }}>
                {plan.period}
              </span>
            </div>

            <ul style={{
              fontSize: '13px',
              color: '#6B6B6B',
              lineHeight: '1.8',
              marginBottom: '1.5rem',
              listStyle: 'none'
            }}>
              {plan.features.map((feature, i) => (
                <li key={i} style={{ marginBottom: '0.5rem' }}>
                  ✓ {feature}
                </li>
              ))}
            </ul>

            {subscription?.plan === plan.id ? (
              <button
                disabled
                style={{
                  width: '100%',
                  padding: '10px',
                  background: '#D0D5DD',
                  color: '#6B6B6B',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'not-allowed'
                }}
              >
                Plan Actual
              </button>
            ) : (
              <button
                onClick={() => onSubscribe(plan.id)}
                style={{
                  width: '100%',
                  padding: '10px',
                  background: plan.mostPopular ? '#D0021B' : '#F5F5F5',
                  color: plan.mostPopular ? '#fff' : '#1A1A1A',
                  border: plan.mostPopular ? 'none' : '1px solid #E5E7EB',
                  borderRadius: '6px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {plan.price === 0 ? 'Actual' : 'Suscribirse'}
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

// ─────────────────────────────────────────────────────────────────
// TAB: INVENTARIO (Usuario Anthony)
// ─────────────────────────────────────────────────────────────────

const TabInventory = ({ inventory }) => (
  <div>
    <div style={{ marginBottom: '2rem', padding: '1rem', background: '#EDE9FE', borderRadius: '8px' }}>
      <p style={{ fontSize: '14px', color: '#5B21B6' }}>
        <strong>👤 Gerente de Inventario:</strong> Anthony<br />
        <small>Administra el inventario de repuestos y partes para AutoTechPro</small>
      </p>
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
      gap: '1.5rem'
    }}>
      {inventory && inventory.length > 0 ? (
        inventory.map(item => (
          <div key={item.id} className="card" style={{ padding: '1.5rem' }}>
            <div style={{ marginBottom: '1rem' }}>
              <h4 style={{ marginBottom: '0.5rem' }}>{item.name}</h4>
              <p style={{ fontSize: '12px', color: '#6B6B6B', marginBottom: '0.5rem' }}>
                📦 SKU: {item.sku}
              </p>
              <p style={{ fontSize: '13px', color: '#6B6B6B' }}>
                {item.description}
              </p>
            </div>

            <div style={{
              background: '#F9FAFB',
              padding: '1rem',
              borderRadius: '6px',
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '12px', color: '#6B6B6B' }}>Stock:</span>
                <span style={{
                  fontSize: '14px',
                  fontWeight: '700',
                  color: item.stock > 10 ? '#16A34A' : item.stock > 0 ? '#EA580C' : '#DC2626'
                }}>
                  {item.stock} unidades
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: '12px', color: '#6B6B6B' }}>Precio:</span>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#D0021B' }}>
                  ${item.price.toLocaleString('es-CO')}
                </span>
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '0.5rem',
              fontSize: '12px'
            }}>
              <span style={{
                background: item.stock > 20 ? '#D1FAE5' : '#FEE2E2',
                color: item.stock > 20 ? '#065F46' : '#991B1B',
                padding: '4px 8px',
                borderRadius: '4px'
              }}>
                {item.stock > 20 ? '✓ En stock' : item.stock > 0 ? '⚠ Bajo stock' : '✗ Agotado'}
              </span>
              <span style={{
                background: '#F3F4F6',
                color: '#6B6B6B',
                padding: '4px 8px',
                borderRadius: '4px'
              }}>
                {item.category}
              </span>
            </div>
          </div>
        ))
      ) : (
        <div style={{
          gridColumn: '1 / -1',
          textAlign: 'center',
          padding: '3rem',
          color: '#6B6B6B'
        }}>
          <p>📦 No hay items en inventario actualmente</p>
        </div>
      )}
    </div>
  </div>
);

export default PoliciesAndSettings;
