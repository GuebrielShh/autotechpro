const BASE = '/api';

export const getServices    = ()         => fetch(`${BASE}/services`).then(r => r.json());
export const getParts       = (s, c)     => fetch(`${BASE}/parts?search=${s||''}&category=${c||''}`).then(r => r.json());
export const getDates       = ()         => fetch(`${BASE}/appointments/dates`).then(r => r.json());
export const getSlots       = (date)     => fetch(`${BASE}/appointments/slots?date=${date}`).then(r => r.json());
export const getAppointment = (code)     => fetch(`${BASE}/appointments/${code}`).then(r => r.json());
export const getClient      = (id)       => fetch(`${BASE}/clients/${id}`).then(r => r.json());
export const getStats       = ()         => fetch(`${BASE}/stats`).then(r => r.json());

export const bookAppointment = (data) =>
  fetch(`${BASE}/appointments`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json());

export const placeOrder = (data) =>
  fetch(`${BASE}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(r => r.json());
