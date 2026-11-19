import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

const Ctx = createContext(null)
export const useAuth = () => useContext(Ctx)

const friendly = (e) => {
  const m = e?.message || 'Something went wrong'
  if (/invalid login/i.test(m)) return 'Wrong email or password.'
  if (/not confirmed/i.test(m)) return 'Email not confirmed. Turn OFF "Confirm email" in Supabase Auth settings, or confirm the email.'
  if (/already registered/i.test(m)) return 'This email is already registered. Try logging in.'
  if (/rate limit/i.test(m)) return 'Too many emails sent. Turn OFF "Confirm email" in Supabase Auth settings, or wait a few minutes.'
  if (/row-level security/i.test(m)) return 'Database blocked saving your profile. Run 02_security.sql (the profiles insert policy) in Supabase.'
  if (/relation .* does not exist|schema cache/i.test(m)) return 'The profiles table is missing. Run 01_schema.sql in Supabase.'
  return m
}

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  // 1) Track the session only. Never call supabase.* inside this callback (it can hang).
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session)
      if (!data.session) setLoading(false)
    })
    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      setSession(s)
      if (!s) { setProfile(null); setLoading(false) }
    })
    return () => sub.subscription.unsubscribe()
  }, [])

  // 2) Load the profile whenever the logged-in user changes.
  const uid = session?.user?.id
  useEffect(() => {
    if (!uid) return
    let stale = false
    setLoading(true)
    supabase.from('profiles').select('*').eq('id', uid).maybeSingle().then(({ data }) => {
      if (stale) return
      setProfile((prev) => data ?? prev) // never overwrite a profile we just created with null
      setLoading(false)
    })
    return () => { stale = true }
  }, [uid])

  async function createProfile(userId, f) {
    const row = {
      id: userId, role: f.role, name: f.name, phone: f.phone, address: f.address, lat: f.lat, lng: f.lng,
      ...(f.role === 'ngo' ? { capacity: Number(f.capacity) || 0, accepts: f.accepts || [] } : {}),
    }
    const { data, error } = await supabase.from('profiles').insert(row).select().single()
    if (error) return { error: friendly(error) }
    setProfile(data)
    return {}
  }

  async function signUp(f) {
    const { data, error } = await supabase.auth.signUp({ email: f.email, password: f.password })
    if (error) return { error: friendly(error) }
    if (!data.session) return { error: 'Account created, but no session started. Turn OFF "Confirm email" in Supabase Auth settings (or confirm the email), then log in.' }
    return createProfile(data.user.id, f)
  }

  async function signIn(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return error ? { error: friendly(error) } : {}
  }

  async function updateProfile(patch) {
    const { data, error } = await supabase.from('profiles').update(patch).eq('id', uid).select().single()
    if (error) return { error: friendly(error) }
    setProfile(data)
    return {}
  }

  const signOut = () => supabase.auth.signOut()
  const profileMissing = Boolean(session) && !loading && !profile

  return (
    <Ctx.Provider value={{ session, profile, loading, profileMissing, signUp, signIn, signOut, createProfile, updateProfile }}>
      {children}
    </Ctx.Provider>
  )
}
