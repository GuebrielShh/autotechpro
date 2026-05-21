// ========================================
// COMPONENTE DE BANNER DE COOKIES
// ========================================
// Ejemplo de cómo implementar el banner de cookies y políticas en React

import { useState, useEffect } from 'react';
import { COOKIE_CONFIG, GDPR_CONFIG, setGDPRConsent, getCookieConsent, shouldShowCookieBanner } from './config.js';
import * as API from './api.js';

export const CookieBanner = ({ userEmail = 'anonymous' }) => {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [cookieSettings, setCookieSettings] = useState({
    essential: true, // Siempre true
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    if (shouldShowCookieBanner()) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = async () => {
    const fullConsent = {
      ...cookieSettings,
      analytics: true,
      marketing: true,
      preferences: true
    };
    
    await saveCookies(fullConsent);
  };

  const handleRejectAll = async () => {
    const minimalConsent = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    
    await saveCookies(minimalConsent);
  };

  const handleSavePreferences = async () => {
    await saveCookies(cookieSettings);
  };

  const saveCookies = async (settings) => {
    try {
      // Guardar en backend
      await API.saveCookieConsent(settings, userEmail);
      
      // Guardar localmente
      setGDPRConsent(settings, userEmail);
      
      setShowBanner(false);
      setShowDetails(false);
    } catch (error) {
      console.error('Error guardando preferencias de cookies:', error);
      alert('Error al guardar preferencias. Por favor, intenta de nuevo.');
    }
  };;

  if (!showBanner) return null;

  return (
    <div style={styles.bannerContainer}>
      {!showDetails ? (
        // Vista principal
        <div style={styles.banner}>
          <div style={styles.bannerContent}>
            <span style={styles.icon}>🍪</span>
            <div style={styles.textContainer}>
              <h3 style={styles.title}>Preferencias de Cookies y Datos</h3>
              <p style={styles.description}>
                Utilizamos cookies para mejorar tu experiencia. Puedes personalizar qué datos compartir con nosotros.
                Lee nuestra <a href="#privacy" style={styles.link}>Política de Privacidad</a> para más información.
              </p>
            </div>
          </div>

          <div style={styles.buttonGroup}>
            <button onClick={handleRejectAll} style={styles.buttonOutline}>
              Rechazar
            </button>
            <button onClick={() => setShowDetails(true)} style={styles.buttonSecondary}>
              Personalizar
            </button>
            <button onClick={handleAcceptAll} style={styles.buttonPrimary}>
              Aceptar Todo
            </button>
          </div>
        </div>
      ) : (
        // Vista detallada
        <div style={styles.banner}>
          <h3 style={styles.title}>🔒 Personalizar Cookies</h3>
          
          <div style={styles.cookieList}>
            {Object.entries(COOKIE_CONFIG.DESCRIPTIONS).map(([key, description]) => (
              <CookieToggle
                key={key}
                cookieKey={key.toLowerCase()}
                description={description}
                checked={cookieSettings[key.toLowerCase()]}
                onChange={(val) => {
                  // Essential siempre está activada
                  if (key === 'ESSENTIAL') return;
                  setCookieSettings({
                    ...cookieSettings,
                    [key.toLowerCase()]: val
                  });
                }}
                disabled={key === 'ESSENTIAL'}
              />
            ))}
          </div>

          <div style={styles.policies}>
            <p style={styles.smallText}>
              📜 <a href="#privacy" style={styles.link}>Política de Privacidad</a> | 
              <a href="#terms" style={styles.link}>Términos y Condiciones</a> | 
              <a href="#returns" style={styles.link}>Política de Devoluciones</a>
            </p>
          </div>

          <div style={styles.buttonGroup}>
            <button onClick={() => setShowDetails(false)} style={styles.buttonOutline}>
              Volver
            </button>
            <button onClick={handleSavePreferences} style={styles.buttonPrimary}>
              Guardar Preferencias
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Componente auxiliar para toggle de cookies
const CookieToggle = ({ cookieKey, description, checked, onChange, disabled }) => (
  <div style={styles.cookieItem}>
    <div style={styles.cookieTextContainer}>
      <p style={styles.cookieLabel}>
        {cookieKey === 'essential' ? '✓' : ''}
        {cookieKey.charAt(0).toUpperCase() + cookieKey.slice(1)}
        {disabled ? ' (Requerida)' : ''}
      </p>
      <p style={styles.cookieDescription}>{description}</p>
    </div>
    <input
      type="checkbox"
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      disabled={disabled}
      style={styles.checkbox}
    />
  </div>
);

// ========================================
// COMPONENTE DE VALIDACIÓN EN CHECKOUT
// ========================================

export const CheckoutValidation = ({ onValidation }) => {
  const [agreements, setAgreements] = useState({
    termsAccepted: false,
    gdprConsent: false,
    returnsAccepted: false
  });

  useEffect(() => {
    const allAccepted = Object.values(agreements).every(v => v === true);
    onValidation(allAccepted);
  }, [agreements]);

  return (
    <div style={styles.validationContainer}>
      <h3 style={styles.sectionTitle}>✅ Confirmaciones Requeridas</h3>
      
      <div style={styles.checkboxContainer}>
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={agreements.termsAccepted}
            onChange={(e) => setAgreements({...agreements, termsAccepted: e.target.checked})}
            style={styles.largeCheckbox}
          />
          <span>Acepto los <a href="#terms" style={styles.link}>Términos y Condiciones</a></span>
        </label>
        
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={agreements.gdprConsent}
            onChange={(e) => setAgreements({...agreements, gdprConsent: e.target.checked})}
            style={styles.largeCheckbox}
          />
          <span>Consiento el tratamiento de mis <a href="#privacy" style={styles.link}>datos personales</a></span>
        </label>
        
        <label style={styles.checkboxLabel}>
          <input
            type="checkbox"
            checked={agreements.returnsAccepted}
            onChange={(e) => setAgreements({...agreements, returnsAccepted: e.target.checked})}
            style={styles.largeCheckbox}
          />
          <span>He leído la <a href="#returns" style={styles.link}>Política de Devoluciones</a></span>
        </label>
      </div>

      {!Object.values(agreements).every(v => v) && (
        <div style={styles.warningBox}>
          ⚠️ Debes aceptar todas las políticas para continuar
        </div>
      )}
    </div>
  );
};

// ========================================
// ESTILOS
// ========================================

const styles = {
  // Banner de cookies
  bannerContainer: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
    animation: 'slideUp 0.3s ease-out'
  },
  
  banner: {
    background: 'white',
    border: '1px solid #e0e0e0',
    borderTop: '3px solid #D0021B',
    padding: '20px',
    margin: '0 auto',
    maxWidth: '1200px',
    boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
    fontFamily: '"DM Sans", sans-serif'
  },

  bannerContent: {
    display: 'flex',
    gap: '20px',
    marginBottom: '15px',
    alignItems: 'flex-start'
  },

  icon: {
    fontSize: '32px',
    flexShrink: 0
  },

  textContainer: {
    flex: 1
  },

  title: {
    margin: '0 0 8px 0',
    fontSize: '16px',
    fontWeight: '600',
    color: '#0A0A0A'
  },

  description: {
    margin: '0',
    fontSize: '13px',
    color: '#666',
    lineHeight: '1.5'
  },

  buttonGroup: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap'
  },

  buttonPrimary: {
    background: '#D0021B',
    color: 'white',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'background 0.2s'
  },

  buttonSecondary: {
    background: '#f0f0f0',
    color: '#0A0A0A',
    border: 'none',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'background 0.2s'
  },

  buttonOutline: {
    background: 'white',
    color: '#0A0A0A',
    border: '1px solid #ddd',
    padding: '10px 20px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: '600',
    transition: 'border-color 0.2s'
  },

  link: {
    color: '#D0021B',
    textDecoration: 'none',
    fontWeight: '600'
  },

  // Cookies detalladas
  cookieList: {
    marginBottom: '20px',
    border: '1px solid #f0f0f0',
    borderRadius: '8px',
    overflow: 'hidden'
  },

  cookieItem: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '15px',
    borderBottom: '1px solid #f0f0f0'
  },

  cookieTextContainer: {
    flex: 1,
    marginRight: '15px'
  },

  cookieLabel: {
    margin: '0 0 4px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0A0A0A'
  },

  cookieDescription: {
    margin: '0',
    fontSize: '12px',
    color: '#999'
  },

  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    flexShrink: 0
  },

  largeCheckbox: {
    width: '18px',
    height: '18px',
    cursor: 'pointer',
    marginRight: '10px',
    accentColor: '#D0021B'
  },

  policies: {
    marginBottom: '15px',
    paddingTop: '10px',
    borderTop: '1px solid #f0f0f0'
  },

  smallText: {
    margin: '0',
    fontSize: '12px',
    color: '#999'
  },

  // Validación checkout
  validationContainer: {
    padding: '20px',
    background: '#fff9f9',
    border: '1px solid #f0f0f0',
    borderRadius: '8px',
    marginBottom: '20px'
  },

  sectionTitle: {
    margin: '0 0 15px 0',
    fontSize: '14px',
    fontWeight: '600',
    color: '#0A0A0A'
  },

  checkboxContainer: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px'
  },

  checkboxLabel: {
    display: 'flex',
    alignItems: 'flex-start',
    cursor: 'pointer',
    fontSize: '13px',
    color: '#333',
    gap: '10px'
  },

  warningBox: {
    marginTop: '15px',
    padding: '12px',
    background: '#fff3cd',
    border: '1px solid #ffc107',
    borderRadius: '6px',
    fontSize: '12px',
    color: '#856404'
  }
};
