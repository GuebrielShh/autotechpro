// ========================================
// CONFIGURACIÓN DE COOKIES Y GDPR
// ========================================

export const COOKIE_CONFIG = {
  // Duración en milisegundos
  ESSENTIAL_DURATION: 0, // Sesión
  ANALYTICS_DURATION: 365 * 24 * 60 * 60 * 1000, // 1 año
  MARKETING_DURATION: 365 * 24 * 60 * 60 * 1000, // 1 año
  PREFERENCES_DURATION: 365 * 24 * 60 * 60 * 1000, // 1 año
  
  // Nombres de cookies
  NAMES: {
    ESSENTIAL: 'gdpr_essential',
    ANALYTICS: 'gdpr_analytics',
    MARKETING: 'gdpr_marketing',
    PREFERENCES: 'gdpr_preferences',
    CONSENT_RECORD: 'gdpr_consent_record'
  },
  
  // Descripciones para el usuario
  DESCRIPTIONS: {
    ESSENTIAL: 'Sesión y funcionalidad básica del sitio (requerida)',
    ANALYTICS: 'Análisis anónimo de comportamiento para mejorar UX',
    MARKETING: 'Anuncios personalizados y ofertas relevantes',
    PREFERENCES: 'Recordar idioma, tema y preferencias personales'
  }
};

export const GDPR_CONFIG = {
  // Política de privacidad (v1.0)
  PRIVACY_VERSION: '1.0',
  PRIVACY_EFFECTIVE_DATE: '2026-01-15',
  
  // Política de devoluciones (30 días)
  RETURN_WINDOW_DAYS: 30,
  RETURN_POLICY_VERSION: '1.0',
  
  // Política de términos y condiciones
  TERMS_VERSION: '1.0',
  TERMS_EFFECTIVE_DATE: '2026-01-15',
  
  // Contacto legal
  CONTACT_EMAIL: 'privacy@autotechpro.com',
  SUPPORT_EMAIL: 'support@autotechpro.com',
  RETURNS_EMAIL: 'returns@autotechpro.com',
  LEGAL_EMAIL: 'legal@autotechpro.com',
  
  // Plazo de respuesta a solicitudes GDPR (días hábiles)
  GDPR_RESPONSE_DAYS: 30,
  
  // Retención de datos
  DATA_RETENTION_DAYS: {
    ACTIVE_USER: 999999, // Mientras usuario esté activo
    INACTIVE_USER: 730, // 2 años de inactividad
    TRANSACTION_LOGS: 2555, // 7 años (requisito fiscal)
    COOKIES: 365 // 1 año
  }
};

export const ORDER_CONFIG = {
  // Validaciones de orden
  MAX_ITEMS_PER_PRODUCT: 5,
  MIN_ORDER_VALUE: 0,
  
  // Validaciones requeridas
  REQUIRE_TERMS: true,
  REQUIRE_GDPR: true,
  REQUIRE_RETURNS_POLICY: true,
  
  // Estados de devolución
  RETURN_STATUSES: {
    PENDING: 'pendiente',
    APPROVED: 'aprobada',
    REJECTED: 'rechazada',
    PROCESSED: 'procesada'
  }
};

export const VALIDATION_MESSAGES = {
  // Errores de cantidad
  QUANTITY_EXCEEDED: 'Límite máximo 5 unidades por producto',
  STOCK_INSUFFICIENT: 'Stock insuficiente para esta cantidad',
  
  // Errores de políticas
  TERMS_REQUIRED: 'Debe aceptar los Términos y Condiciones',
  GDPR_REQUIRED: 'Debe aceptar el tratamiento de datos personales',
  RETURNS_REQUIRED: 'Debe aceptar la Política de Devoluciones',
  
  // Errores de devolución
  RETURN_PERIOD_EXPIRED: 'El plazo de devolución ha expirado (máximo 30 días)',
  RETURN_INVALID_CONDITION: 'El producto no está en condición válida para devolución',
  RETURN_ALREADY_REQUESTED: 'Ya existe una solicitud de devolución para este producto',
  
  // Errores de cookies
  COOKIE_CONSENT_REQUIRED: 'Por favor, acepta las políticas de cookies',
  
  // Errores de datos
  INVALID_EMAIL: 'Email inválido',
  INVALID_PHONE: 'Teléfono inválido',
  INVALID_VEHICLE: 'Datos del vehículo incompletos'
};

// Funciones auxiliares
export const shouldShowCookieBanner = () => {
  const consent = localStorage.getItem(COOKIE_CONFIG.NAMES.CONSENT_RECORD);
  return !consent || JSON.parse(consent).expiresAt < new Date().toISOString();
};

export const getCookieConsent = () => {
  const consent = localStorage.getItem(COOKIE_CONFIG.NAMES.CONSENT_RECORD);
  if (!consent) return null;
  
  const parsed = JSON.parse(consent);
  
  // Verificar si ha expirado
  if (new Date(parsed.expiresAt) < new Date()) {
    localStorage.removeItem(COOKIE_CONFIG.NAMES.CONSENT_RECORD);
    return null;
  }
  
  return parsed;
};

export const setGDPRConsent = (types, clientEmail) => {
  const consent = {
    essential: true, // Siempre true
    analytics: types.analytics || false,
    marketing: types.marketing || false,
    preferences: types.preferences || false,
    clientEmail: clientEmail || 'anonymous',
    consentedAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString()
  };
  
  localStorage.setItem(COOKIE_CONFIG.NAMES.CONSENT_RECORD, JSON.stringify(consent));
  return consent;
};

export const canTrackAnalytics = () => {
  const consent = getCookieConsent();
  return consent?.analytics === true;
};

export const canTrackMarketing = () => {
  const consent = getCookieConsent();
  return consent?.marketing === true;
};

export const canSavePreferences = () => {
  const consent = getCookieConsent();
  return consent?.preferences === true;
};

export const getDaysUntilReturnDeadline = (orderDate) => {
  const order = new Date(orderDate);
  const deadline = new Date(order.getTime() + GDPR_CONFIG.RETURN_WINDOW_DAYS * 24 * 60 * 60 * 1000);
  const today = new Date();
  const daysLeft = Math.ceil((deadline - today) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysLeft);
};

export const isOrderReturnable = (orderDate) => {
  return getDaysUntilReturnDeadline(orderDate) > 0;
};

export const validateOrderData = (data) => {
  const errors = [];
  
  if (!data.termsAccepted) errors.push(VALIDATION_MESSAGES.TERMS_REQUIRED);
  if (!data.gdprConsent) errors.push(VALIDATION_MESSAGES.GDPR_REQUIRED);
  if (!data.returnsAccepted) errors.push(VALIDATION_MESSAGES.RETURNS_REQUIRED);
  
  if (!data.items || data.items.length === 0) {
    errors.push('El carrito está vacío');
  }
  
  data.items?.forEach((item, idx) => {
    if (item.qty > ORDER_CONFIG.MAX_ITEMS_PER_PRODUCT) {
      errors.push(`Producto ${idx + 1}: ${VALIDATION_MESSAGES.QUANTITY_EXCEEDED}`);
    }
  });
  
  return {
    valid: errors.length === 0,
    errors
  };
};
