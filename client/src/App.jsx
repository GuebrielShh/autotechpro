import { useState, useEffect } from 'react'
import * as API from './api.js'

// ── HELPERS ───────────────────────────────────────────────────────
const fmt = (n) => new Intl.NumberFormat('es-CO', {
  style: 'currency', currency: 'COP',
  minimumFractionDigits: 0, maximumFractionDigits: 0
}).format(n)

// ── ESTILOS GLOBALES ──────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --red: #D0021B; --red-dark: #A30016; --red-light: #FFF0F0;
    --black: #0A0A0A; --gray-900: #1A1A1A; --gray-700: #3D3D3D;
    --gray-500: #6B6B6B; --gray-300: #C4C4C4; --gray-100: #F5F5F5;
    --white: #FFFFFF; --success: #16A34A;
    --font-display: 'Bebas Neue', sans-serif;
    --font-body: 'DM Sans', sans-serif;
    --radius: 8px; --radius-lg: 12px;
  }
  body { font-family: var(--font-body); background: var(--white); color: var(--gray-900); }
  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* NAV */
  .nav { background: var(--black); color: var(--white); display: flex; align-items: center; gap: 1rem; padding: 0 2rem; height: 60px; position: sticky; top: 0; z-index: 100; }
  .nav-logo { font-family: var(--font-display); font-size: 26px; letter-spacing: 2px; color: var(--white); cursor: pointer; flex-shrink: 0; }
  .nav-logo span { color: var(--red); }
  .nav-links { display: flex; flex: 1; }
  .nav-btn { background: none; border: none; color: #aaa; font-family: var(--font-body); font-size: 12px; font-weight: 500; padding: 0 0.9rem; height: 60px; cursor: pointer; text-transform: uppercase; letter-spacing: .5px; transition: color .15s, background .15s; }
  .nav-btn:hover { color: #fff; background: rgba(255,255,255,.06); }
  .nav-btn.active { color: #fff; border-bottom: 2px solid var(--red); }
  .cart-btn { background: var(--red); color: #fff; border: none; border-radius: 6px; padding: 8px 14px; cursor: pointer; font-weight: 600; font-size: 13px; display: flex; align-items: center; gap: 6px; }
  .cart-btn:hover { background: var(--red-dark); }
  .badge { background: #fff; color: var(--red); border-radius: 10px; padding: 1px 6px; font-size: 11px; font-weight: 700; }

  /* HERO */
  .hero { background: var(--black); color: #fff; padding: 5rem 2rem; display: flex; align-items: center; justify-content: space-between; gap: 3rem; min-height: 400px; flex-wrap: wrap; }
  .hero-tag { display: inline-block; background: var(--red); color: #fff; font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; padding: 4px 12px; border-radius: 4px; margin-bottom: 1.5rem; }
  .hero-title { font-family: var(--font-display); font-size: 68px; line-height: 1; letter-spacing: 2px; margin-bottom: 1rem; }
  .hero-title span { color: var(--red); }
  .hero-sub { color: #999; font-size: 15px; line-height: 1.6; max-width: 420px; margin-bottom: 2rem; }
  .hero-actions { display: flex; gap: 1rem; flex-wrap: wrap; }
  .hero-stats { display: flex; flex-direction: column; gap: 1.5rem; }
  .hero-stat { border-left: 3px solid var(--red); padding-left: 1.25rem; }
  .hero-stat-num { font-family: var(--font-display); font-size: 38px; color: #fff; }
  .hero-stat-label { color: #555; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; }

  /* BUTTONS */
  .btn { border: none; border-radius: var(--radius); padding: 12px 24px; font-weight: 600; font-size: 14px; cursor: pointer; transition: background .15s, transform .1s; font-family: var(--font-body); }
  .btn:hover { transform: translateY(-1px); }
  .btn-primary { background: var(--red); color: #fff; }
  .btn-primary:hover { background: var(--red-dark); }
  .btn-primary:disabled { opacity: .45; cursor: not-allowed; transform: none; }
  .btn-outline { background: transparent; color: var(--gray-700); border: 1.5px solid var(--gray-300); }
  .btn-outline:hover { border-color: var(--gray-700); }
  .btn-sm { padding: 7px 14px; font-size: 12px; }
  .btn-dark { background: var(--black); color: #fff; }
  .btn-dark:hover { background: var(--gray-700); }

  /* PAGE */
  .page { padding: 2.5rem 2rem; max-width: 1100px; margin: 0 auto; width: 100%; }
  .page-tag { font-size: 11px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; color: var(--red); margin-bottom: .4rem; }
  .page-title { font-family: var(--font-display); font-size: 40px; letter-spacing: 1px; margin-bottom: .25rem; }
  .page-sub { color: var(--gray-500); font-size: 14px; margin-bottom: 2rem; }

  /* CARDS */
  .card { background: #fff; border: .5px solid var(--gray-300); border-radius: var(--radius-lg); overflow: hidden; }

  /* SERVICES */
  .service-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(230px, 1fr)); gap: 1rem; }
  .service-card { padding: 1.4rem; border: .5px solid var(--gray-300); border-radius: var(--radius-lg); cursor: pointer; transition: border-color .15s, box-shadow .15s, transform .15s; display: flex; flex-direction: column; gap: .6rem; }
  .service-card:hover { border-color: var(--red); box-shadow: 0 4px 16px rgba(208,2,27,.1); transform: translateY(-2px); }
  .service-card.selected { border-color: var(--red); background: var(--red-light); }
  .service-name { font-weight: 600; font-size: 14px; }
  .service-desc { font-size: 12px; color: var(--gray-500); line-height: 1.4; }
  .service-meta { display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: .5rem; border-top: .5px solid var(--gray-100); }
  .service-price { font-weight: 700; font-size: 15px; color: var(--red); }
  .cat-badge { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 3px 8px; border-radius: 20px; background: var(--gray-100); color: var(--gray-700); }

  /* STEPS */
  .steps { display: flex; gap: 0; margin-bottom: 2rem; border-bottom: .5px solid var(--gray-300); }
  .step { display: flex; align-items: center; gap: 8px; padding: 1rem 1.25rem 1rem 0; font-size: 13px; color: var(--gray-500); border-bottom: 2px solid transparent; margin-bottom: -.5px; }
  .step.active { color: var(--red); border-bottom-color: var(--red); font-weight: 600; }
  .step.done { color: var(--success); }
  .step-num { width: 22px; height: 22px; border-radius: 50%; border: 1.5px solid currentColor; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; flex-shrink: 0; }
  .step-ok { background: var(--success); border-color: var(--success) !important; color: #fff !important; }

  /* FORM */
  .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  .form-group { display: flex; flex-direction: column; gap: 5px; }
  .form-group.full { grid-column: 1 / -1; }
  label { font-size: 12px; font-weight: 600; color: var(--gray-700); text-transform: uppercase; letter-spacing: .5px; }
  input, select, textarea { font-family: var(--font-body); font-size: 14px; border: 1px solid var(--gray-300); border-radius: var(--radius); padding: 10px 12px; outline: none; width: 100%; transition: border-color .15s, box-shadow .15s; }
  input:focus, select:focus, textarea:focus { border-color: var(--red); box-shadow: 0 0 0 3px rgba(208,2,27,.1); }
  textarea { resize: vertical; min-height: 80px; }

  /* SLOTS */
  .date-list { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 1.5rem; }
  .date-pill { padding: 7px 13px; border-radius: 20px; border: 1.5px solid var(--gray-300); font-size: 12px; cursor: pointer; transition: all .15s; background: #fff; text-transform: capitalize; }
  .date-pill:hover, .date-pill.sel { border-color: var(--red); color: var(--red); }
  .date-pill.sel { background: var(--red); color: #fff; }
  .slot-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(88px, 1fr)); gap: 8px; }
  .slot-btn { padding: 10px; border: 1.5px solid var(--gray-300); border-radius: var(--radius); font-size: 13px; font-weight: 500; cursor: pointer; background: #fff; transition: all .15s; }
  .slot-btn:hover, .slot-btn.sel { border-color: var(--red); color: var(--red); }
  .slot-btn.sel { background: var(--red); color: #fff; }

  /* PARTS */
  .parts-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(210px, 1fr)); gap: 1rem; }
  .part-card { padding: 1.2rem; border: .5px solid var(--gray-300); border-radius: var(--radius-lg); display: flex; flex-direction: column; gap: .45rem; transition: box-shadow .15s, border-color .15s; }
  .part-card:hover { box-shadow: 0 4px 12px rgba(0,0,0,.08); border-color: #999; }
  .part-brand { font-size: 10px; font-weight: 700; letter-spacing: 1.5px; text-transform: uppercase; color: var(--red); }
  .part-name { font-weight: 600; font-size: 13px; line-height: 1.3; }
  .part-sku { font-size: 10px; color: var(--gray-500); font-family: monospace; }
  .part-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; padding-top: .75rem; border-top: .5px solid var(--gray-100); }
  .part-price { font-weight: 700; font-size: 14px; }
  .part-stock { font-size: 11px; color: var(--success); font-weight: 500; }

  /* CART */
  .cart-panel { position: fixed; right: 0; top: 60px; width: 360px; height: calc(100vh - 60px); background: #fff; border-left: .5px solid var(--gray-300); z-index: 90; display: flex; flex-direction: column; box-shadow: -8px 0 24px rgba(0,0,0,.08); transform: translateX(100%); transition: transform .25s ease; }
  .cart-panel.open { transform: translateX(0); }
  .cart-header { padding: 1.25rem 1.5rem; border-bottom: .5px solid var(--gray-300); display: flex; align-items: center; justify-content: space-between; }
  .cart-title { font-family: var(--font-display); font-size: 24px; letter-spacing: 1px; }
  .cart-items { flex: 1; overflow-y: auto; padding: 1rem 1.5rem; display: flex; flex-direction: column; gap: 1rem; }
  .cart-item { display: flex; gap: 1rem; align-items: flex-start; }
  .cart-item-info { flex: 1; }
  .cart-item-name { font-size: 13px; font-weight: 600; }
  .cart-item-brand { font-size: 11px; color: var(--gray-500); }
  .cart-item-price { font-size: 13px; font-weight: 700; color: var(--red); margin-top: 4px; }
  .qty-ctrl { display: flex; align-items: center; gap: 6px; }
  .qty-btn { width: 24px; height: 24px; border-radius: 50%; border: 1px solid var(--gray-300); background: none; cursor: pointer; font-size: 14px; display: flex; align-items: center; justify-content: center; }
  .qty-btn:hover { background: var(--gray-100); }
  .cart-footer { padding: 1.5rem; border-top: .5px solid var(--gray-300); }
  .cart-total { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  .cart-total-val { font-family: var(--font-display); font-size: 28px; color: var(--red); }

  /* ALERTS */
  .alert { padding: 1rem 1.25rem; border-radius: var(--radius); font-size: 14px; margin-bottom: 1rem; }
  .alert-success { background: #F0FDF4; border: 1px solid #BBF7D0; color: #166534; }
  .alert-error   { background: #FFF0F0; border: 1px solid #FECACA; color: #991B1B; }
  .alert-info    { background: #EFF6FF; border: 1px solid #BFDBFE; color: #1E40AF; }

  /* CONFIRM */
  .confirm-box { text-align: center; padding: 3rem 2rem; }
  .confirm-code { font-family: var(--font-display); font-size: 36px; letter-spacing: 3px; color: var(--red); margin: 1rem 0; }
  .confirm-detail { background: var(--gray-100); border-radius: var(--radius); padding: 1.25rem; text-align: left; margin-top: 1.5rem; }
  .confirm-row { display: flex; justify-content: space-between; padding: 6px 0; font-size: 14px; border-bottom: .5px solid var(--gray-300); }
  .confirm-row:last-child { border-bottom: none; }
  .confirm-row-label { color: var(--gray-500); }
  .confirm-row-value { font-weight: 600; }

  /* STATS */
  .stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(170px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
  .stat-card { padding: 1.25rem; border: .5px solid var(--gray-300); border-radius: var(--radius-lg); }
  .stat-label { font-size: 10px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; color: var(--gray-500); margin-bottom: .5rem; }
  .stat-val { font-family: var(--font-display); font-size: 30px; }
  .stat-sub { font-size: 11px; color: var(--success); margin-top: 2px; }

  /* TABS */
  .tab-bar { display: flex; border-bottom: .5px solid var(--gray-300); margin-bottom: 1.5rem; }
  .tab-btn { padding: 10px 20px; border: none; background: none; cursor: pointer; font-size: 14px; font-weight: 500; color: var(--gray-500); border-bottom: 2px solid transparent; margin-bottom: -.5px; font-family: var(--font-body); transition: color .15s, border-color .15s; }
  .tab-btn.active { color: var(--red); border-bottom-color: var(--red); }

  /* SEARCH */
  .search-wrap { position: relative; }
  .search-wrap input { padding-left: 36px; border-radius: 20px; }
  .search-icon { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: var(--gray-500); font-size: 15px; pointer-events: none; }

  /* CAT PILLS */
  .cat-pills { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 1rem; }
  .cat-pill { padding: 5px 12px; border: 1px solid var(--gray-300); border-radius: 20px; font-size: 12px; font-weight: 500; cursor: pointer; transition: all .15s; background: #fff; color: var(--gray-700); }
  .cat-pill:hover { border-color: var(--red); color: var(--red); }
  .cat-pill.sel { background: var(--red); border-color: var(--red); color: #fff; }

  /* CLIENT CARD */
  .client-card { background: var(--black); color: #fff; border-radius: var(--radius-lg); padding: 2rem; margin-bottom: 2rem; }
  .client-tier { display: inline-flex; align-items: center; gap: 6px; background: rgba(255,215,0,.15); border: 1px solid rgba(255,215,0,.4); border-radius: 4px; padding: 4px 10px; font-size: 11px; font-weight: 700; color: gold; letter-spacing: 1px; margin-bottom: 1rem; }
  .client-name { font-family: var(--font-display); font-size: 30px; letter-spacing: 1px; margin-bottom: .25rem; }
  .client-sub { font-size: 13px; color: rgba(255,255,255,.5); }
  .points-val { font-family: var(--font-display); font-size: 36px; color: gold; }

  /* MISC */
  .pill { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 700; }
  .pill-success { background: #DCFCE7; color: #166534; }
  .pill-info    { background: #DBEAFE; color: #1E40AF; }
  .muted { color: var(--gray-500); font-size: 13px; }
  .pay-opts { display: flex; gap: 8px; flex-wrap: wrap; }
  .pay-opt { padding: 8px 14px; border: 1.5px solid var(--gray-300); border-radius: 6px; font-size: 12px; font-weight: 600; cursor: pointer; background: #fff; transition: all .15s; }
  .pay-opt.sel { border-color: var(--red); background: var(--red-light); color: var(--red); }
  .divider { border: none; border-top: .5px solid var(--gray-300); margin: 1.25rem 0; }
  .footer { background: var(--black); color: #555; padding: 2rem; margin-top: auto; font-size: 13px; }
  .footer-inner { max-width: 1100px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
  .footer-logo { font-family: var(--font-display); font-size: 22px; color: #fff; }
  .footer-logo span { color: var(--red); }
  .lookup-box { max-width: 480px; margin: 2rem auto; padding: 2rem; border: .5px solid var(--gray-300); border-radius: var(--radius-lg); text-align: center; }
  .appt-card { padding: 1rem 1.25rem; border: .5px solid var(--gray-300); border-radius: var(--radius); display: flex; gap: 1rem; align-items: flex-start; }
  .appt-date { background: var(--red); color: #fff; border-radius: 8px; padding: 8px 12px; text-align: center; min-width: 52px; flex-shrink: 0; }
  .appt-day { font-family: var(--font-display); font-size: 26px; line-height: 1; }
  .appt-month { font-size: 9px; text-transform: uppercase; letter-spacing: 1px; }
  .order-row { display: flex; justify-content: space-between; font-size: 13px; padding: 4px 0; }
  .order-total { display: flex; justify-content: space-between; font-weight: 700; font-size: 15px; margin-top: 8px; padding-top: 8px; border-top: 1px solid var(--gray-300); }
  
  /* LOGIN */
  .auth-container { max-width: 420px; margin: 4rem auto; padding: 3rem 2.5rem; border: .5px solid var(--gray-300); border-radius: var(--radius-lg); background: var(--white); }
  .auth-title { font-family: var(--font-display); font-size: 32px; letter-spacing: 1px; margin-bottom: 1.5rem; text-align: center; }
  .auth-tab { display: flex; gap: 1rem; margin-bottom: 2rem; border-bottom: .5px solid var(--gray-300); }
  .auth-tab button { flex: 1; padding: 12px; background: none; border: none; font-weight: 600; color: var(--gray-500); border-bottom: 2px solid transparent; cursor: pointer; }
  .auth-tab button.active { color: var(--red); border-bottom-color: var(--red); }
  .auth-field { margin-bottom: 1.25rem; }
  .auth-btn { width: 100%; background: var(--red); color: #fff; border: none; padding: 12px; border-radius: var(--radius); font-weight: 600; cursor: pointer; margin-top: 1rem; }
  .auth-btn:hover { background: var(--red-dark); }
  .auth-msg { text-align: center; font-size: 13px; color: var(--gray-500); margin-top: 1rem; }
  .auth-error { background: var(--red-light); color: var(--red); padding: 12px; border-radius: var(--radius); margin-bottom: 1rem; font-size: 13px; }
  .user-info { display: flex; align-items: center; gap: 8px; margin-left: auto; }
  .user-menu { display: flex; align-items: center; gap: 10px; }
  .user-name { color: #fff; font-weight: 500; font-size: 13px; }
`

// ── LOGIN PAGE ────────────────────────────────────────────────────
function LoginPage({ onLogin }) {
  const [tab, setTab] = useState('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    setError('')
    if (!email || !password) { setError('Completa todos los campos'); return; }
    setLoading(true)
    try {
      const res = await API.login(email, password)
      if (res.success) {
        localStorage.setItem('user', JSON.stringify(res.user))
        localStorage.setItem('client', JSON.stringify(res.client))
        onLogin(res.user)
      } else {
        setError(res.error || 'Error al iniciar sesión')
      }
    } catch(e) {
      setError('Error de conexión')
    }
    setLoading(false)
  }

  const handleRegister = async () => {
    setError('')
    if (!email || !password || !name) { setError('Completa todos los campos'); return; }
    if (password.length < 6) { setError('La contraseña debe tener mínimo 6 caracteres'); return; }
    setLoading(true)
    try {
      const res = await API.register({ email, password, name })
      if (res.success) {
        setEmail('')
        setPassword('')
        setName('')
        setTab('login')
        setError('')
      } else {
        setError(res.error || 'Error al registrarse')
      }
    } catch(e) {
      setError('Error de conexión')
    }
    setLoading(false)
  }

  return (
    <div className="page">
      <div className="auth-container">
        <div className="auth-title">AUTO<span style={{color:'var(--red)'}}>TECH</span>PRO</div>
        
        <div className="auth-tab">
          <button className={`${tab==='login'?'active':''}`} onClick={()=>setTab('login')}>Inicia Sesión</button>
          <button className={`${tab==='register'?'active':''}`} onClick={()=>setTab('register')}>Registrate</button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {tab === 'login' ? (
          <>
            <div className="auth-field">
              <label>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com" onKeyPress={e=>e.key==='Enter'&&handleLogin()}/>
            </div>
            <div className="auth-field">
              <label>Contraseña</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••" onKeyPress={e=>e.key==='Enter'&&handleLogin()}/>
            </div>
            <button className="auth-btn" onClick={handleLogin} disabled={loading}>{loading?'Cargando...':'Inicia Sesión'}</button>
            <div className="auth-msg">Prueba: maria@example.com / maria123</div>
          </>
        ) : (
          <>
            <div className="auth-field">
              <label>Nombre</label>
              <input type="text" value={name} onChange={e=>setName(e.target.value)} placeholder="Tu nombre completo"/>
            </div>
            <div className="auth-field">
              <label>Email</label>
              <input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="tu@email.com"/>
            </div>
            <div className="auth-field">
              <label>Contraseña</label>
              <input type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="Mínimo 6 caracteres"/>
            </div>
            <button className="auth-btn" onClick={handleRegister} disabled={loading}>{loading?'Cargando...':'Crear Cuenta'}</button>
          </>
        )}
      </div>
    </div>
  )
}

// ── BOOKING PAGE ──────────────────────────────────────────────────
function BookingPage({ user }) {
  const [step, setStep] = useState(1)
  const [services, setServices]   = useState([])
  const [dates, setDates]         = useState([])
  const [slots, setSlots]         = useState([])
  const [selService, setSelService] = useState(null)
  const [selDate, setSelDate]     = useState(null)
  const [selSlot, setSelSlot]     = useState(null)
  const [form, setForm]           = useState({ clientName: user?.name || '', clientEmail: user?.email || '', clientPhone:'', make:'', model:'', year:'', plate:'', notes:'' })
  const [loading, setLoading]     = useState(false)
  const [result, setResult]       = useState(null)
  const [error, setError]         = useState('')

  useEffect(() => { API.getServices().then(setServices) }, [])
  useEffect(() => { API.getDates().then(setDates) }, [])
  useEffect(() => {
    if (selDate) API.getSlots(selDate).then(setSlots)
    else setSlots([])
  }, [selDate])

  const upd = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const submit = async () => {
    if (!form.clientName || !form.clientEmail || !form.make || !form.model) {
      setError('Completa los campos requeridos'); return
    }
    setError(''); setLoading(true)
    const res = await API.bookAppointment({
      clientName: form.clientName, clientEmail: form.clientEmail,
      clientPhone: form.clientPhone,
      vehicle: { make: form.make, model: form.model, year: form.year, plate: form.plate },
      serviceId: selService.id, slotId: selSlot.id, notes: form.notes
    })
    setLoading(false)
    if (res.error) { setError(res.error); return }
    setResult(res); setStep(4)
  }

  const StepBar = () => (
    <div className="steps">
      {[['1','Servicio'],['2','Horario'],['3','Datos'],['4','Confirmación']].map(([n,label]) => {
        const num = +n; const done = step > num; const active = step === num
        return (
          <div key={n} className={`step ${active?'active':done?'done':''}`}>
            <div className={`step-num ${done?'step-ok':''}`}>{done?'✓':n}</div>
            {label}
          </div>
        )
      })}
    </div>
  )

  if (step === 4 && result) return (
    <div className="page">
      <StepBar />
      <div className="confirm-box">
        <div style={{fontSize:52,marginBottom:'1rem'}}>✅</div>
        <h2 style={{fontFamily:'var(--font-display)',fontSize:28}}>¡Cita confirmada!</h2>
        <p className="muted" style={{marginTop:4}}>Tu código de confirmación:</p>
        <div className="confirm-code">{result.confirmationCode}</div>
        <div className="confirm-detail">
          {[
            ['Servicio', result.service.name],
            ['Fecha', new Date(result.slot.date+'T12:00:00').toLocaleDateString('es-CO',{weekday:'long',day:'numeric',month:'long',year:'numeric'})],
            ['Hora', result.slot.time],
            ['Cliente', result.clientName],
            ['Vehículo', `${result.vehicle.make} ${result.vehicle.model} ${result.vehicle.year}`],
            ['Precio', fmt(result.service.price)],
          ].map(([l,v]) => (
            <div key={l} className="confirm-row">
              <span className="confirm-row-label">{l}</span>
              <span className="confirm-row-value">{v}</span>
            </div>
          ))}
        </div>
        <button className="btn btn-primary" style={{marginTop:'1.5rem'}}
          onClick={()=>{setStep(1);setSelService(null);setSelSlot(null);setSelDate(null);setResult(null);setForm({clientName:'',clientEmail:'',clientPhone:'',make:'',model:'',year:'',plate:'',notes:''})}}>
          Agendar otra cita
        </button>
      </div>
    </div>
  )

  return (
    <div className="page">
      <div className="page-tag">Agendamiento en línea</div>
      <h1 className="page-title">Agenda tu cita</h1>
      <p className="page-sub">Reserva en menos de 2 minutos.</p>
      <StepBar />

      {step === 1 && (
        <>
          <div className="service-grid">
            {services.map(s => (
              <div key={s.id} className={`service-card ${selService?.id===s.id?'selected':''}`} onClick={()=>setSelService(s)}>
                <div className="service-name">{s.name}</div>
                <div className="service-desc">{s.desc}</div>
                <span className="cat-badge">{s.category}</span>
                <div className="service-meta">
                  <span className="service-price">{fmt(s.price)}</span>
                  <span className="muted">⏱ {s.duration} min</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{marginTop:'1.5rem',display:'flex',justifyContent:'flex-end'}}>
            <button className="btn btn-primary" disabled={!selService} onClick={()=>setStep(2)}>
              Siguiente → Horario
            </button>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          {selService && <div className="alert alert-info" style={{marginBottom:'1rem'}}>
            <strong>{selService.name}</strong> · {fmt(selService.price)} · {selService.duration} min
          </div>}
          <p className="muted" style={{marginBottom:'1rem'}}>Elige una fecha disponible:</p>
          <div className="date-list">
            {dates.slice(0,10).map(d => {
              const obj = new Date(d+'T12:00:00')
              return (
                <button key={d} className={`date-pill ${selDate===d?'sel':''}`}
                  onClick={()=>{setSelDate(d);setSelSlot(null)}}>
                  {obj.toLocaleDateString('es-CO',{weekday:'short',day:'numeric',month:'short'})}
                </button>
              )
            })}
          </div>
          {selDate && (
            <>
              <p className="muted" style={{marginBottom:'1rem'}}>Horarios disponibles:</p>
              {slots.length === 0
                ? <div className="alert alert-error">No hay horarios disponibles.</div>
                : <div className="slot-grid">
                    {slots.map(sl => (
                      <button key={sl.id} className={`slot-btn ${selSlot?.id===sl.id?'sel':''}`}
                        onClick={()=>setSelSlot(sl)}>{sl.time}</button>
                    ))}
                  </div>
              }
            </>
          )}
          <div style={{marginTop:'1.5rem',display:'flex',justifyContent:'space-between'}}>
            <button className="btn btn-outline" onClick={()=>setStep(1)}>← Atrás</button>
            <button className="btn btn-primary" disabled={!selSlot} onClick={()=>setStep(3)}>
              Siguiente → Datos
            </button>
          </div>
        </>
      )}

      {step === 3 && (
        <>
          {selSlot && <div className="alert alert-info" style={{marginBottom:'1rem'}}>
            {selService?.name} · {new Date(selSlot.date+'T12:00:00').toLocaleDateString('es-CO',{weekday:'long',day:'numeric',month:'long'})} a las {selSlot.time}
          </div>}
          {error && <div className="alert alert-error">{error}</div>}
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'2rem'}}>
            <div>
              <p style={{fontWeight:600,marginBottom:'1rem',fontSize:13,textTransform:'uppercase',letterSpacing:1,color:'var(--gray-500)'}}>Datos personales</p>
              <div className="form-grid">
                <div className="form-group full"><label>Nombre *</label><input value={form.clientName} onChange={e=>upd('clientName',e.target.value)} placeholder="Juan Pérez"/></div>
                <div className="form-group"><label>Email *</label><input type="email" value={form.clientEmail} onChange={e=>upd('clientEmail',e.target.value)} placeholder="tu@email.com"/></div>
                <div className="form-group"><label>Teléfono</label><input value={form.clientPhone} onChange={e=>upd('clientPhone',e.target.value)} placeholder="300-000-0000"/></div>
              </div>
            </div>
            <div>
              <p style={{fontWeight:600,marginBottom:'1rem',fontSize:13,textTransform:'uppercase',letterSpacing:1,color:'var(--gray-500)'}}>Vehículo</p>
              <div className="form-grid">
                <div className="form-group"><label>Marca *</label><input value={form.make} onChange={e=>upd('make',e.target.value)} placeholder="Toyota"/></div>
                <div className="form-group"><label>Modelo *</label><input value={form.model} onChange={e=>upd('model',e.target.value)} placeholder="Corolla"/></div>
                <div className="form-group"><label>Año</label><input value={form.year} onChange={e=>upd('year',e.target.value)} placeholder="2022"/></div>
                <div className="form-group"><label>Placa</label><input value={form.plate} onChange={e=>upd('plate',e.target.value)} placeholder="ABC-123"/></div>
                <div className="form-group full"><label>Notas</label><textarea value={form.notes} onChange={e=>upd('notes',e.target.value)} placeholder="Describe el problema..."/></div>
              </div>
            </div>
          </div>
          <div style={{marginTop:'1.5rem',display:'flex',justifyContent:'space-between'}}>
            <button className="btn btn-outline" onClick={()=>setStep(2)}>← Atrás</button>
            <button className="btn btn-primary" onClick={submit} disabled={loading}>
              {loading ? 'Procesando...' : 'Confirmar cita ✓'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}

// ── STORE PAGE ────────────────────────────────────────────────────
function StorePage({ cart, setCart, user, onCheckout }) {
  const [parts, setParts]       = useState([])
  const [search, setSearch]     = useState('')
  const [catFilter, setCatFilter] = useState('')

  useEffect(() => {
    API.getParts(search, catFilter).then(setParts)
  }, [search, catFilter])

  const categories = ['Filtros','Frenos','Lubricantes','Encendido','Eléctrico','Suspensión']

  const addToCart = (part) =>
    setCart(prev => {
      const ex = prev.find(i => i.partId === part.id)
      if (ex) return prev.map(i => i.partId===part.id ? {...i,qty:i.qty+1} : i)
      return [...prev, { partId: part.id, qty: 1, part }]
    })

  const inCart = (id) => cart.find(i=>i.partId===id)?.qty || 0

  return (
    <div className="page">
      <div className="page-tag">Tienda en línea</div>
      <h1 className="page-title">Repuestos y accesorios</h1>
      <p className="page-sub">Piezas originales con entrega en 3 días hábiles.</p>

      <div style={{display:'flex',gap:'1rem',alignItems:'center',marginBottom:'1rem',flexWrap:'wrap'}}>
        <div className="search-wrap">
          <span className="search-icon">🔍</span>
          <input style={{width:250}} placeholder="Buscar repuesto o marca..."
            value={search} onChange={e=>setSearch(e.target.value)}/>
        </div>
      </div>

      <div className="cat-pills">
        <button className={`cat-pill ${!catFilter?'sel':''}`} onClick={()=>setCatFilter('')}>Todos</button>
        {categories.map(c=>(
          <button key={c} className={`cat-pill ${catFilter===c?'sel':''}`} onClick={()=>setCatFilter(c)}>{c}</button>
        ))}
      </div>

      <div className="parts-grid">
        {parts.map(p=>(
          <div key={p.id} className="part-card">
            <div className="part-brand">{p.brand}</div>
            <div className="part-name">{p.name}</div>
            <div className="part-sku">{p.sku}</div>
            <div className="part-footer">
              <div>
                <div className="part-price">{fmt(p.price)}</div>
                <div className="part-stock">✓ En stock ({p.stock})</div>
              </div>
              <div style={{textAlign:'right'}}>
                {inCart(p.id)>0 && <div style={{fontSize:11,color:'var(--red)',fontWeight:700,marginBottom:4}}>{inCart(p.id)} ×</div>}
                <button className="btn btn-dark btn-sm" onClick={()=>addToCart(p)}>+ Agregar</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── CART PANEL ────────────────────────────────────────────────────
function CartPanel({ cart, setCart, open, onClose, user, onCheckout }) {
  const [checkout, setCheckout]   = useState('cart')
  const [payMethod, setPayMethod] = useState('MercadoPago')
  const [buyerName, setBuyerName] = useState(user?.name || '')
  const [buyerEmail, setBuyerEmail] = useState(user?.email || '')
  const [order, setOrder]         = useState(null)
  const [loading, setLoading]     = useState(false)

  const total = cart.reduce((s,i) => s + i.part.price * i.qty, 0)
  const updQty = (pid, d) =>
    setCart(prev => prev.map(i=>i.partId===pid ? {...i,qty:Math.max(0,i.qty+d)} : i).filter(i=>i.qty>0))

  const handleCheckout = () => {
    if (!user) {
      onCheckout()
    } else {
      setCheckout('checkout')
    }
  }

  const pay = async () => {
    if (!buyerName || !buyerEmail) return
    setLoading(true)
    const res = await API.placeOrder({
      items: cart.map(i=>({partId:i.partId,qty:i.qty})),
      client: {name:buyerName,email:buyerEmail},
      paymentMethod: payMethod
    })
    setLoading(false)
    if (!res.error) { setOrder(res); setCart([]); setCheckout('done') }
  }

  return (
    <div className={`cart-panel ${open?'open':''}`}>
      <div className="cart-header">
        <div className="cart-title">Carrito</div>
        <button style={{background:'none',border:'none',cursor:'pointer',fontSize:18,color:'var(--gray-500)'}} onClick={onClose}>✕</button>
      </div>

      {checkout==='done' && order ? (
        <div style={{padding:'1.5rem',textAlign:'center'}}>
          <div style={{fontSize:48,marginBottom:'1rem'}}>✅</div>
          <div style={{fontFamily:'var(--font-display)',fontSize:22}}>¡Orden confirmada!</div>
          <div style={{fontFamily:'var(--font-display)',fontSize:18,color:'var(--red)',margin:'0.5rem 0'}}>{order.orderNumber}</div>
          <div style={{background:'var(--gray-100)',borderRadius:'var(--radius)',padding:'1rem',margin:'1rem 0'}}>
            {order.items.map(i=>(
              <div key={i.id} className="order-row"><span>{i.name} ×{i.qty}</span><span>{fmt(i.subtotal)}</span></div>
            ))}
            <div className="order-total"><span>Total</span><span style={{color:'var(--red)'}}>{fmt(order.total)}</span></div>
          </div>
          <p className="muted">Entrega estimada: {order.estimatedDelivery}</p>
          <button className="btn btn-primary" style={{marginTop:'1rem',width:'100%'}} onClick={()=>{setCheckout('cart');setOrder(null)}}>Nueva compra</button>
        </div>
      ) : checkout==='checkout' ? (
        <>
          <div className="cart-items">
            <div style={{background:'var(--gray-100)',borderRadius:'var(--radius)',padding:'1rem',marginBottom:'1rem'}}>
              <p style={{fontWeight:600,fontSize:12,textTransform:'uppercase',letterSpacing:1,color:'var(--gray-500)',marginBottom:'0.75rem'}}>Resumen</p>
              {cart.map(i=>(
                <div key={i.partId} className="order-row"><span>{i.part.name} ×{i.qty}</span><span>{fmt(i.part.price*i.qty)}</span></div>
              ))}
              <div className="order-total"><span>Total</span><span>{fmt(total)}</span></div>
            </div>
            <div className="form-group" style={{marginBottom:'0.75rem'}}>
              <label>Nombre *</label><input placeholder="Tu nombre" value={buyerName} onChange={e=>setBuyerName(e.target.value)}/>
            </div>
            <div className="form-group" style={{marginBottom:'1rem'}}>
              <label>Email *</label><input type="email" placeholder="tu@email.com" value={buyerEmail} onChange={e=>setBuyerEmail(e.target.value)}/>
            </div>
            <div>
              <p style={{fontWeight:600,fontSize:11,textTransform:'uppercase',letterSpacing:1,color:'var(--gray-500)',marginBottom:'0.5rem'}}>Método de pago</p>
              <div className="pay-opts">
                {['MercadoPago','PayU','Wompi','Tarjeta'].map(m=>(
                  <button key={m} className={`pay-opt ${payMethod===m?'sel':''}`} onClick={()=>setPayMethod(m)}>{m}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="cart-footer">
            <button className="btn btn-outline" style={{width:'100%',marginBottom:'0.75rem'}} onClick={()=>setCheckout('cart')}>← Volver</button>
            <button className="btn btn-primary" style={{width:'100%'}} disabled={!buyerName||!buyerEmail||loading} onClick={pay}>
              {loading?'Procesando...': `Pagar ${fmt(total)}`}
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="cart-items">
            {cart.length===0
              ? <div style={{textAlign:'center',padding:'3rem 1rem',color:'var(--gray-500)'}}>
                  <div style={{fontSize:40,marginBottom:'0.75rem',opacity:.3}}>🛒</div>
                  <p>Tu carrito está vacío</p>
                </div>
              : cart.map(i=>(
                <div key={i.partId} className="cart-item">
                  <div className="cart-item-info">
                    <div className="cart-item-brand">{i.part.brand}</div>
                    <div className="cart-item-name">{i.part.name}</div>
                    <div className="cart-item-price">{fmt(i.part.price * i.qty)}</div>
                  </div>
                  <div className="qty-ctrl">
                    <button className="qty-btn" onClick={()=>updQty(i.partId,-1)}>−</button>
                    <span style={{minWidth:20,textAlign:'center',fontWeight:600,fontSize:13}}>{i.qty}</span>
                    <button className="qty-btn" onClick={()=>updQty(i.partId,1)}>+</button>
                  </div>
                </div>
              ))
            }
          </div>
          {cart.length>0 && (
            <div className="cart-footer">
              <div className="cart-total">
                <span className="muted">Total</span>
                <span className="cart-total-val">{fmt(total)}</span>
              </div>
              <button className="btn btn-primary" style={{width:'100%'}} onClick={handleCheckout}>
                {user ? 'Proceder al pago →' : '🔐 Inicia sesión para comprar'}
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}

// ── LOOKUP PAGE ───────────────────────────────────────────────────
function LookupPage() {
  const [code, setCode] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError]   = useState('')

  const lookup = async () => {
    const res = await API.getAppointment(code)
    if (res.error) { setError('No se encontró ninguna cita con ese código.'); setResult(null) }
    else { setResult(res); setError('') }
  }

  return (
    <div className="page">
      <div className="page-tag">Estado de cita</div>
      <h1 className="page-title">Consultar cita</h1>
      <p className="page-sub">Ingresa tu código de confirmación para ver el estado.</p>
      <div className="lookup-box">
        <div style={{fontFamily:'var(--font-display)',fontSize:26,marginBottom:'0.5rem'}}>🔍 Buscar cita</div>
        <p className="muted" style={{marginBottom:'1rem'}}>Código de 9 caracteres — ej: ATP-XK7M2Q</p>
        <div style={{display:'flex',gap:'0.75rem'}}>
          <input value={code} onChange={e=>setCode(e.target.value.toUpperCase())}
            placeholder="ATP-XXXXXX" style={{flex:1,textAlign:'center',fontFamily:'monospace',fontSize:15,letterSpacing:2}}
            onKeyDown={e=>e.key==='Enter'&&lookup()}/>
          <button className="btn btn-primary" onClick={lookup}>Buscar</button>
        </div>
        {error && <div className="alert alert-error" style={{marginTop:'1rem'}}>{error}</div>}
      </div>
      {result && (
        <div style={{maxWidth:560,margin:'0 auto'}}>
          <div className="alert alert-success">✓ Cita encontrada — <strong>{result.confirmationCode}</strong></div>
          <div className="confirm-detail">
            {[
              ['Estado', <span key="s" className="pill pill-success">{result.status}</span>],
              ['Servicio', result.service.name],
              ['Fecha', new Date(result.slot.date+'T12:00:00').toLocaleDateString('es-CO',{weekday:'long',day:'numeric',month:'long',year:'numeric'})],
              ['Hora', result.slot.time],
              ['Cliente', result.clientName],
              ['Vehículo', `${result.vehicle.make} ${result.vehicle.model} ${result.vehicle.year||''}`],
              ['Precio', fmt(result.service.price)],
            ].map(([l,v])=>(
              <div key={l} className="confirm-row">
                <span className="confirm-row-label">{l}</span>
                <span className="confirm-row-value">{v}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

// ── CLIENT PORTAL ─────────────────────────────────────────────────
function ClientPortal({ user, client: initialClient }) {
  const [client, setClient] = useState(initialClient || null)
  const [stats, setStats]   = useState(null)
  const [tab, setTab]       = useState('perfil')
  const [editMode, setEditMode] = useState(false)
  const [editForm, setEditForm] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (initialClient) {
      setClient(initialClient)
      setEditForm({
        phone: initialClient.phone || '',
        make: initialClient.vehicle.make || '',
        model: initialClient.vehicle.model || '',
        year: initialClient.vehicle.year || '',
        plate: initialClient.vehicle.plate || '',
        km: initialClient.vehicle.km || 0
      })
    } else if (user?.clientId) {
      API.getClient(user.clientId).then(c => {
        setClient(c)
        setEditForm({
          phone: c.phone || '',
          make: c.vehicle.make || '',
          model: c.vehicle.model || '',
          year: c.vehicle.year || '',
          plate: c.vehicle.plate || '',
          km: c.vehicle.km || 0
        })
      })
    }
    API.getStats().then(setStats)
  }, [user, initialClient])

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await API.updateClient(user.clientId || client.id, {
        phone: editForm.phone,
        vehicle: {
          make: editForm.make,
          model: editForm.model,
          year: editForm.year,
          plate: editForm.plate,
          km: parseInt(editForm.km) || 0
        }
      })
      if (res.success) {
        setClient(res.client)
        setEditMode(false)
      }
    } catch(e) {
      console.error('Error al guardar:', e)
    }
    setSaving(false)
  }

  if (!client) return <div className="page"><p className="muted">Cargando...</p></div>

  const { km } = client.vehicle
  const nextKm = Math.ceil(km/5000)*5000
  const pct = Math.round(((km%5000)/5000)*100)

  return (
    <div className="page">
      <div className="page-tag">Portal del cliente</div>
      <h1 className="page-title">Mi AutoTech</h1>
      <p className="page-sub">Historial, citas, puntos y más desde un solo lugar.</p>

      <div className="client-card">
        <div className="client-tier">⭐ {client.tier}</div>
        <div className="client-name">{client.name}</div>
        <div className="client-sub">{client.vehicle.make} {client.vehicle.model} {client.vehicle.year} · {client.vehicle.plate}</div>
        <div style={{marginTop:'1.5rem'}}>
          <div style={{fontSize:10,textTransform:'uppercase',letterSpacing:1,color:'rgba(255,255,255,.4)',marginBottom:4}}>Puntos acumulados</div>
          <div className="points-val">{client.points.toLocaleString('es-CO')}</div>
          <div style={{fontSize:11,color:'rgba(255,255,255,.3)'}}>Canjea por descuentos</div>
        </div>
      </div>

      <div className="tab-bar">
        {[['perfil','Perfil'],['citas','Mis citas'],['stats','Dashboard']].map(([k,l])=>(
          <button key={k} className={`tab-btn ${tab===k?'active':''}`} onClick={()=>setTab(k)}>{l}</button>
        ))}
      </div>

      {tab==='perfil' && (
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1.5rem'}}>
          <div className="card" style={{padding:'1.5rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
              <h3 style={{fontWeight:600,fontSize:14}}>Datos personales</h3>
              {!editMode && <button className="btn btn-sm btn-outline" onClick={()=>setEditMode(true)}>Editar</button>}
            </div>
            {[['Nombre',client.name],['Email',client.email],['Teléfono',editMode ? editForm.phone : client.phone],['Membresía',client.tier]].map(([l,v])=>(
              <div key={l} className="confirm-row" style={{alignItems: l==='Teléfono' && editMode ? 'flex-start' : 'center'}}>
                <span className="confirm-row-label">{l}</span>
                {l==='Teléfono' && editMode ? (
                  <input type="tel" value={editForm.phone} onChange={e=>setEditForm({...editForm,phone:e.target.value})} style={{flex:1}}/>
                ) : (
                  <span className="confirm-row-value">{v}</span>
                )}
              </div>
            ))}
          </div>
          
          <div className="card" style={{padding:'1.5rem'}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:'1rem'}}>
              <h3 style={{fontWeight:600,fontSize:14}}>Vehículo</h3>
              {editMode && (
                <div style={{display:'flex',gap:'0.5rem'}}>
                  <button className="btn btn-sm btn-primary" onClick={handleSave} disabled={saving}>{saving?'Guardando...':'Guardar'}</button>
                  <button className="btn btn-sm btn-outline" onClick={()=>setEditMode(false)}>Cancelar</button>
                </div>
              )}
            </div>
            
            {editMode ? (
              <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'1rem'}}>
                <div className="form-group">
                  <label>Marca</label>
                  <input type="text" value={editForm.make} onChange={e=>setEditForm({...editForm,make:e.target.value})} placeholder="Honda, Toyota, etc."/>
                </div>
                <div className="form-group">
                  <label>Modelo</label>
                  <input type="text" value={editForm.model} onChange={e=>setEditForm({...editForm,model:e.target.value})} placeholder="Civic, Corolla, etc."/>
                </div>
                <div className="form-group">
                  <label>Año</label>
                  <input type="number" value={editForm.year} onChange={e=>setEditForm({...editForm,year:e.target.value})} placeholder="2020"/>
                </div>
                <div className="form-group">
                  <label>Placa</label>
                  <input type="text" value={editForm.plate} onChange={e=>setEditForm({...editForm,plate:e.target.value.toUpperCase()})} placeholder="ABC-123"/>
                </div>
                <div className="form-group" style={{gridColumn:'1 / -1'}}>
                  <label>Kilometraje actual</label>
                  <input type="number" value={editForm.km} onChange={e=>setEditForm({...editForm,km:e.target.value})} placeholder="0"/>
                </div>
              </div>
            ) : (
              <>
                {[['Marca',client.vehicle.make],['Modelo',client.vehicle.model],['Año',client.vehicle.year],['Placa',client.vehicle.plate],['Kilometraje',`${parseInt(client.vehicle.km).toLocaleString('es-CO')} km`]].map(([l,v])=>(
                  <div key={l} className="confirm-row"><span className="confirm-row-label">{l}</span><span className="confirm-row-value">{v}</span></div>
                ))}
                <div style={{marginTop:'1rem'}}>
                  <div style={{display:'flex',justifyContent:'space-between',fontSize:12,color:'var(--gray-500)',marginBottom:6}}>
                    <span>Próximo mantenimiento</span><span>{nextKm.toLocaleString('es-CO')} km</span>
                  </div>
                  <div style={{height:8,background:'var(--gray-100)',borderRadius:4,overflow:'hidden'}}>
                    <div style={{width:`${pct}%`,height:'100%',background:'var(--red)',borderRadius:4}}></div>
                  </div>
                  <div style={{fontSize:11,color:'var(--gray-500)',marginTop:4}}>{pct}% hacia el próximo cambio de aceite</div>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {tab==='citas' && (
        client.appointments.length===0
          ? <div style={{textAlign:'center',padding:'3rem',color:'var(--gray-500)'}}><div style={{fontSize:40,opacity:.3,marginBottom:'1rem'}}>📅</div><p>No hay citas registradas aún.</p></div>
          : <div style={{display:'flex',flexDirection:'column',gap:'0.75rem'}}>
              {client.appointments.map(a=>{
                const d = new Date(a.slot.date+'T12:00:00')
                return (
                  <div key={a.id} className="appt-card">
                    <div className="appt-date">
                      <div className="appt-month">{d.toLocaleDateString('es-CO',{month:'short'})}</div>
                      <div className="appt-day">{d.getDate()}</div>
                    </div>
                    <div style={{flex:1}}>
                      <div style={{fontWeight:600,fontSize:15}}>{a.service.name}</div>
                      <div className="muted" style={{marginTop:4}}>{a.slot.time} · {a.vehicle.make} {a.vehicle.model} · {a.confirmationCode}</div>
                      <div style={{marginTop:4}}><span className="pill pill-success">{a.status}</span></div>
                    </div>
                    <div style={{fontWeight:700,color:'var(--red)',fontSize:14}}>{fmt(a.service.price)}</div>
                  </div>
                )
              })}
            </div>
      )}

      {tab==='stats' && stats && (
        <>
          <div className="stats-grid">
            {[
              ['Citas','totalAppointments','este mes'],
              ['Órdenes','totalOrders','en tienda'],
              ['Servicios','servicesAvailable','disponibles'],
              ['Repuestos','partsInStock','en stock'],
            ].map(([label,key,sub])=>(
              <div key={key} className="stat-card">
                <div className="stat-label">{label}</div>
                <div className="stat-val">{stats[key]?.toLocaleString('es-CO')}</div>
                <div className="stat-sub">{sub}</div>
              </div>
            ))}
            <div className="stat-card">
              <div className="stat-label">Ingresos</div>
              <div className="stat-val" style={{fontSize:22}}>{fmt(stats.revenue)}</div>
              <div className="stat-sub">generados</div>
            </div>
          </div>
          <div className="alert alert-info">
            Métricas en tiempo real — se actualizan con cada cita y compra de la sesión actual.
          </div>
        </>
      )}
    </div>
  )
}

// ── HOME PAGE ─────────────────────────────────────────────────────
function HomePage({ onNavigate }) {
  return (
    <>
      <div className="hero">
        <div>
          <div className="hero-tag">🏆 Taller #1 en Cartagena</div>
          <h1 className="hero-title">AUTO<span>TECH</span>PRO</h1>
          <p className="hero-sub">Del taller tradicional al e-business de alto nivel. Agenda, compra y sigue tu vehículo en línea.</p>
          <div className="hero-actions">
            <button className="btn btn-primary" onClick={()=>onNavigate('agendar')}>Agendar cita →</button>
            <button className="btn btn-outline" style={{color:'#fff',borderColor:'rgba(255,255,255,.3)'}} onClick={()=>onNavigate('tienda')}>Ver tienda</button>
          </div>
        </div>
        <div className="hero-stats">
          {[['45%','Eficiencia operativa'],['99.5%','Precisión inventario'],['85%','Satisfacción cliente'],['4x','Valor de vida CLV']].map(([n,l])=>(
            <div key={l} className="hero-stat">
              <div className="hero-stat-num">{n}</div>
              <div className="hero-stat-label">{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="page">
        <div style={{textAlign:'center',marginBottom:'2rem'}}>
          <div className="page-tag">¿Qué necesitas hoy?</div>
          <h2 style={{fontFamily:'var(--font-display)',fontSize:36,letterSpacing:1,marginBottom:'0.25rem'}}>Servicios principales</h2>
          <p className="muted">Atención 24/7 desde nuestras plataformas digitales</p>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(210px,1fr))',gap:'1rem',marginBottom:'2.5rem'}}>
          {[
            {icon:'📅',title:'Agenda tu cita',desc:'Elige servicio, fecha y hora en 2 minutos.',action:'agendar',cta:'Agendar ahora'},
            {icon:'🛒',title:'Compra repuestos',desc:'Catálogo de piezas originales con entrega en 3 días.',action:'tienda',cta:'Ver tienda'},
            {icon:'🔍',title:'Consulta tu cita',desc:'Revisa el estado de tu servicio con tu código.',action:'consultar',cta:'Consultar'},
            {icon:'👤',title:'Mi cuenta',desc:'Historial, puntos y alertas de mantenimiento.',action:'cliente',cta:'Entrar'},
          ].map(c=>(
            <div key={c.title} className="card" style={{padding:'1.75rem',cursor:'pointer',transition:'box-shadow .15s,transform .15s'}}
              onMouseOver={e=>{e.currentTarget.style.boxShadow='0 8px 24px rgba(0,0,0,.1)';e.currentTarget.style.transform='translateY(-2px)'}}
              onMouseOut={e=>{e.currentTarget.style.boxShadow='';e.currentTarget.style.transform=''}}
              onClick={()=>onNavigate(c.action)}>
              <div style={{fontSize:36,marginBottom:'0.75rem'}}>{c.icon}</div>
              <h3 style={{fontWeight:600,fontSize:15,marginBottom:'0.5rem'}}>{c.title}</h3>
              <p className="muted" style={{lineHeight:1.5,marginBottom:'1.25rem'}}>{c.desc}</p>
              <button className="btn btn-primary btn-sm">{c.cta} →</button>
            </div>
          ))}
        </div>
        <div style={{background:'var(--black)',borderRadius:'var(--radius-lg)',padding:'2.5rem',color:'#fff',display:'flex',gap:'2rem',flexWrap:'wrap',alignItems:'center',justifyContent:'space-between'}}>
          <div>
            <div style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:'uppercase',color:'var(--red)',marginBottom:'0.5rem'}}>AutoCare Plus</div>
            <div style={{fontFamily:'var(--font-display)',fontSize:30,letterSpacing:1,marginBottom:'0.5rem'}}>Mantenimiento ilimitado</div>
            <p style={{color:'rgba(255,255,255,.5)',fontSize:14,maxWidth:380}}>Suscripción mensual: mantenimientos preventivos ilimitados, prioridad en agendamiento y 20% descuento en repuestos.</p>
          </div>
          <div style={{textAlign:'center'}}>
            <div style={{fontFamily:'var(--font-display)',fontSize:44,color:'var(--red)'}}>$89.900</div>
            <div style={{color:'rgba(255,255,255,.4)',fontSize:12}}>/ mes</div>
            <button className="btn btn-primary" style={{marginTop:'1rem'}} onClick={()=>onNavigate('agendar')}>Suscribirse →</button>
          </div>
        </div>
      </div>
    </>
  )
}

// ── SERVICES CATALOG ──────────────────────────────────────────────
function ServicesCatalog({ onBook }) {
  const [services, setServices] = useState([])
  useEffect(() => { API.getServices().then(setServices) }, [])
  const cats = [...new Set(services.map(s=>s.category))]
  return (
    <div className="page">
      <div className="page-tag">Nuestros servicios</div>
      <h1 className="page-title">Catálogo de servicios</h1>
      <p className="page-sub">Técnicos certificados y garantía en todos los trabajos.</p>
      {cats.map(cat=>(
        <div key={cat} style={{marginBottom:'2.5rem'}}>
          <h2 style={{fontFamily:'var(--font-display)',fontSize:26,letterSpacing:1,marginBottom:'1rem',display:'flex',alignItems:'center',gap:'0.75rem'}}>
            <span style={{width:4,height:24,background:'var(--red)',display:'inline-block',borderRadius:2}}></span>{cat}
          </h2>
          <div className="service-grid">
            {services.filter(s=>s.category===cat).map(s=>(
              <div key={s.id} className="service-card">
                <div className="service-name">{s.name}</div>
                <div className="service-desc">{s.desc}</div>
                <div className="service-meta">
                  <span className="service-price">{fmt(s.price)}</span>
                  <button className="btn btn-primary btn-sm" onClick={onBook}>Agendar →</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}

// ── ROOT APP ──────────────────────────────────────────────────────
export default function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('user')
    return stored ? JSON.parse(stored) : null
  })
  const [client, setClient] = useState(() => {
    const stored = localStorage.getItem('client')
    return stored ? JSON.parse(stored) : null
  })
  
  const [page, setPage] = useState('inicio')
  const [cartOpen, setCartOpen] = useState(false)
  const [cart, setCart] = useState([])
  const [loginRequired, setLoginRequired] = useState(false)
  const [nextPageAfterLogin, setNextPageAfterLogin] = useState(null)
  const cartCount = cart.reduce((s,i) => s+i.qty, 0)

  const nav = (p) => { setPage(p); setCartOpen(false); window.scrollTo(0,0) }
  
  const navRequiresLogin = (pageName) => {
    if (!user) {
      setLoginRequired(true)
      setNextPageAfterLogin(pageName)
    } else {
      nav(pageName)
    }
  }
  
  const handleLogin = (userData) => {
    setUser(userData)
    if (nextPageAfterLogin) {
      nav(nextPageAfterLogin)
      setNextPageAfterLogin(null)
    } else {
      nav('inicio')
    }
    setLoginRequired(false)
  }
  
  const handleLogout = () => {
    localStorage.removeItem('user')
    localStorage.removeItem('client')
    setUser(null)
    setClient(null)
    setCart([])
    nav('inicio')
  }

  if (loginRequired) {
    return (
      <>
        <style>{css}</style>
        <div className="app">
          <nav className="nav">
            <div className="nav-logo" onClick={()=>{ setLoginRequired(false); setNextPageAfterLogin(null) }}>AUTO<span>TECH</span>PRO</div>
            <div style={{marginLeft: 'auto'}}>
              <button className="btn btn-sm btn-outline" onClick={()=>{ setLoginRequired(false); setNextPageAfterLogin(null) }}>Volver</button>
            </div>
          </nav>
          <main style={{flex:1}}>
            <LoginPage onLogin={handleLogin}/>
          </main>
          <footer className="footer">
            <div className="footer-inner">
              <div className="footer-logo">AUTO<span>TECH</span>PRO</div>
              <div>Cartagena-Bolívar, Colombia · www.autotechpro.com</div>
              <div>© 2026 AutoTechPro</div>
            </div>
          </footer>
        </div>
      </>
    )
  }

  const userLinks = user 
    ? [['inicio','Inicio'],['servicios','Servicios'],['tienda','Tienda'],['agendar','Agendar cita'],['consultar','Mis citas'],['cliente','Mi cuenta']]
    : [['inicio','Inicio'],['servicios','Servicios'],['tienda','Tienda']]

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <nav className="nav">
          <div className="nav-logo" onClick={()=>nav('inicio')}>AUTO<span>TECH</span>PRO</div>
          <div className="nav-links">
            {userLinks.map(([k,l])=>(
              <button key={k} className={`nav-btn ${page===k?'active':''}`} onClick={()=>nav(k)}>{l}</button>
            ))}
          </div>
          <div className="user-menu">
            {user ? (
              <>
                <span className="user-name">👤 {user.name}</span>
                <button className="cart-btn" onClick={()=>setCartOpen(o=>!o)}>
                  🛒 {cartCount>0 && <span className="badge">{cartCount}</span>}
                </button>
                <button className="btn btn-sm btn-outline" onClick={handleLogout}>Salir</button>
              </>
            ) : (
              <>
                <button className="cart-btn" onClick={()=>setCartOpen(o=>!o)}>
                  🛒 {cartCount>0 && <span className="badge">{cartCount}</span>}
                </button>
                <button className="btn btn-sm btn-primary" onClick={()=>setLoginRequired(true)}>Inicia sesión</button>
              </>
            )}
          </div>
        </nav>

        <main style={{flex:1}}>
          {page==='inicio'    && <HomePage onNavigate={nav}/>}
          {page==='servicios' && <ServicesCatalog onBook={()=>navRequiresLogin('agendar')}/>}
          {page==='tienda'    && <StorePage cart={cart} setCart={setCart} user={user} onCheckout={()=>setLoginRequired(!user)}/>}
          {page==='agendar'   && user && <BookingPage user={user}/>}
          {page==='consultar' && <LookupPage/>}
          {page==='cliente'   && user && <ClientPortal user={user} client={client}/>}
        </main>

        <CartPanel cart={cart} setCart={setCart} open={cartOpen} onClose={()=>setCartOpen(false)} user={user} onCheckout={()=>setLoginRequired(!user)}/>

        <footer className="footer">
          <div className="footer-inner">
            <div className="footer-logo">AUTO<span>TECH</span>PRO</div>
            <div>Cartagena-Bolívar, Colombia · www.autotechpro.com</div>
            <div>© 2026 AutoTechPro</div>
          </div>
        </footer>
      </div>
    </>
  )
}
