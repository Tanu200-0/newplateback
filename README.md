# PlateBack (with Supabase login)

Login, sign-up (donor or NGO), profile page, and role-based start screen. Food listings are still mock data until the donor and NGO screens are connected.

## Setup (10 minutes)
1. Create a free project at supabase.com.
2. Auth settings: turn OFF "Confirm email".
3. SQL Editor: run `supabase/01_schema.sql`, then `supabase/02_security.sql`.
4. Copy `.env.example` to `.env` and paste your Project URL and anon (publishable) key. Never commit `.env`.
5. `npm install` then `npm run dev` (restart after any `.env` change).

## Files
- `src/lib/supabase.js`: Supabase client
- `src/auth/AuthContext.jsx`: session, profile, signUp, signIn, signOut, updateProfile
- `src/auth/AuthScreen.jsx`: login and sign-up form
- `src/auth/Profile.jsx`: edit profile
- `src/App.jsx`: login gate and tabs
