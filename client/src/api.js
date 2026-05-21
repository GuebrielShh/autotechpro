const BASE = import.meta.env.VITE_API_URL || '/api'

export const getServices    = ()         => fetch(`${BASE}/services`).then(r => r.json())
export const getParts       = (s, c)     => fetch(`${BASE}/parts?search=${s||''}&category=${c||''}`).then(r => r.json())
export const getDates       = ()         => fetch(`${BASE}/appointments/dates`).then(r => r.json())
export const getSlots       = (date)     => fetch(`${BASE}/appointments/slots?date=${date}`).then(r => r.json())
export const getAppointment = (code)     => fetch(`${BASE}/appointments/${code}`).then(r => r.json())
export const getClient      = (id)       => fetch(`${BASE}/clients/${id}`).then(r => r.json())

export const updateClient = (id, data) =>
  fetch(`${BASE}/clients/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json())
export const getStats       = ()         => fetch(`${BASE}/stats`).then(r => r.json())

export const bookAppointment = (data) =>
  fetch(`${BASE}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json())

export const placeOrder = (data) =>
  fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json())

export const getLoyaltyStatus = () => 
  fetch(`${BASE}/loyalty/status`).then(r => r.json())

export const submitReview = (data) =>
  fetch(`${BASE}/reviews`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json())

export const getReviews = () =>
  fetch(`${BASE}/reviews`).then(r => r.json())

export const validateCoupon = (code, amount) =>
  fetch(`${BASE}/coupons/validate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, amount })
  }).then(r => r.json())

export const applyCoupon = (code, orderId) =>
  fetch(`${BASE}/coupons/apply`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, orderId })
  }).then(r => r.json())

export const getRecommendations = (clientId) =>
  fetch(`${BASE}/recommendations/${clientId}`).then(r => r.json())

export const submitContact = (data) =>
  fetch(`${BASE}/contact`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json())

// ── AUTENTICACIÓN ─────────────────────────────────────────────────
export const register = (data) =>
  fetch(`${BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json())

export const login = (email, password) =>
  fetch(`${BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  }).then(r => r.json())

export const logout = () =>
  fetch(`${BASE}/auth/logout`, { method: 'POST' }).then(r => r.json())

export const checkAuth = (userId) =>
  fetch(`${BASE}/auth/me?userId=${userId}`).then(r => r.json())

// ── DEVOLUCIONES Y POLÍTICA DE RETORNO ─────────────────────────────
export const requestReturn = (data) =>
  fetch(`${BASE}/returns/request`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json())

export const getReturns = (clientEmail) =>
  fetch(`${BASE}/returns/${clientEmail}`).then(r => r.json())

export const getReturnDetails = (returnId) =>
  fetch(`${BASE}/returns/details/${returnId}`).then(r => r.json())

// ── POLÍTICAS Y LEGAL ──────────────────────────────────────────────
export const getPolicies = () =>
  Promise.all([
    fetch(`${BASE}/policies/privacy`).then(r => r.json()),
    fetch(`${BASE}/policies/terms`).then(r => r.json()),
    fetch(`${BASE}/policies/returns`).then(r => r.json())
  ]).then(([privacy, terms, returns]) => ({
    privacy, terms, returns
  }))

export const getPrivacyPolicy = () =>
  fetch(`${BASE}/policies/privacy`).then(r => r.json())

export const getTermsPolicy = () =>
  fetch(`${BASE}/policies/terms`).then(r => r.json())

export const getReturnPolicy = () =>
  fetch(`${BASE}/policies/returns`).then(r => r.json())

// ── CONSENTIMIENTO GDPR Y COOKIES ──────────────────────────────────
export const saveCookieConsent = (cookieTypes, clientEmail) =>
  fetch(`${BASE}/consent/cookies`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cookieTypes, clientEmail })
  }).then(r => r.json())
