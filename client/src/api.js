const BASE = import.meta.env.VITE_API_URL || '/api'

export const getServices    = ()         => fetch(`${BASE}/services`).then(r => r.json())
export const getParts       = (s, c)     => fetch(`${BASE}/parts?search=${s||''}&category=${c||''}`).then(r => r.json())
export const getDates       = ()         => fetch(`${BASE}/appointments/dates`).then(r => r.json())
export const getSlots       = (date)     => fetch(`${BASE}/appointments/slots?date=${date}`).then(r => r.json())
export const getAppointment = (code)     => fetch(`${BASE}/appointments/${code}`).then(r => r.json())
export const getClient      = (id)       => fetch(`${BASE}/clients/${id}`).then(r => r.json())
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
