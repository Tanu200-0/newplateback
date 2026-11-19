import { useState } from 'react'
import { useAuth } from './AuthContext'
import { envOk } from '../lib/supabase'

const TYPES = [['cooked', 'Cooked meals'], ['packaged', 'Packaged food'], ['bakery', 'Bakery'], ['fresh', 'Fruits and vegetables']]

export default function AuthScreen() {
  const { signUp, signIn, createProfile, session, profileMissing } = useAuth()
  const [mode, setMode] = useState('login')
  const [f, setF] = useState({ email: '', password: '', role: 'donor', name: '', phone: '', address: '', lat: 28.6139, lng: 77.209, capacity: 50, accepts: ['cooked'] })
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)
  const set = (k, v) => setF((o) => ({ ...o, [k]: v }))
  const completing = profileMissing // logged in, but the profile row is missing
  const signup = mode === 'signup' || completing

  const toggle = (t) => set('accepts', f.accepts.includes(t) ? f.accepts.filter((x) => x !== t) : [...f.accepts, t])
  const locate = () => navigator.geolocation?.getCurrentPosition(
    (p) => { set('lat', p.coords.latitude); set('lng', p.coords.longitude) },
    () => setErr('Could not read your location. The default location will be used.'))

  async function submit(e) {
    e.preventDefault()
    setErr('')
    if (!completing) {
      if (!f.email.includes('@')) return setErr('Enter a valid email.')
      if (f.password.length < 6) return setErr('Password must be at least 6 characters.')
    }
    if (signup && (!f.name.trim() || (f.role === 'ngo' && f.accepts.length === 0))) return setErr('Fill in your name' + (f.role === 'ngo' ? ' and pick at least one food type.' : '.'))
    setBusy(true)
    const res = completing ? await createProfile(session.user.id, f) : signup ? await signUp(f) : await signIn(f.email, f.password)
    setBusy(false)
    if (res.error) setErr(res.error)
  }

  return (
    <section className="panel" style={{ maxWidth: 460, margin: '24px auto' }}>
      <h2>{completing ? 'Finish your profile' : signup ? 'Create your account' : 'Log in'}</h2>
      {!envOk && <p className="ai">Supabase keys are missing. Check .env (names must start with VITE_) and restart npm run dev.</p>}
      <form onSubmit={submit} noValidate>
        {!completing && <>
          <label>Email<input type="email" autoComplete="email" value={f.email} onChange={(e) => set('email', e.target.value)} /></label>
          <label>Password<input type="password" autoComplete={signup ? 'new-password' : 'current-password'} value={f.password} onChange={(e) => set('password', e.target.value)} /></label>
        </>}
        {signup && <>
          <label>I am a
            <select value={f.role} onChange={(e) => set('role', e.target.value)}><option value="donor">Donor (restaurant, caterer, host)</option><option value="ngo">NGO or volunteer group</option></select>
          </label>
          <label>Name<input value={f.name} onChange={(e) => set('name', e.target.value)} /></label>
          <label>Phone<input type="tel" value={f.phone} onChange={(e) => set('phone', e.target.value)} /></label>
          <label>Address<input value={f.address} onChange={(e) => set('address', e.target.value)} /></label>
          <button type="button" className="btn ghost" onClick={locate}>Use my current location</button>
          {f.role === 'ngo' && <>
            <label>Capacity (meals per day)<input type="number" min="1" value={f.capacity} onChange={(e) => set('capacity', e.target.value)} /></label>
            <p className="sub">Food types you accept</p>
            {TYPES.map(([k, v]) => <label key={k} className="row"><input type="checkbox" checked={f.accepts.includes(k)} onChange={() => toggle(k)} /> {v}</label>)}
          </>}
        </>}
        {err && <p role="alert" className="cd red" style={{ display: 'block', margin: '10px 0' }}>{err}</p>}
        <button className="btn" disabled={busy}>{busy ? 'Please wait...' : completing ? 'Save profile' : signup ? 'Sign up' : 'Log in'}</button>
      </form>
      {!completing && <p className="sub" style={{ marginTop: 12 }}>
        {signup ? 'Already have an account? ' : 'New here? '}
        <button type="button" className="btn ghost" onClick={() => { setErr(''); setMode(signup ? 'login' : 'signup') }}>{signup ? 'Log in' : 'Create account'}</button>
      </p>}
    </section>
  )
}
