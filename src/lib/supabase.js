import { createClient } from '@supabase/supabase-js'

const url = import.meta.env.VITE_SUPABASE_URL
const key = import.meta.env.VITE_SUPABASE_ANON_KEY


export const envOk = Boolean(url && key)
if (!envOk) console.error('Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Fix .env, then restart npm run dev.')

export const supabase = createClient(url || 'http://localhost', key || 'missing-key')
