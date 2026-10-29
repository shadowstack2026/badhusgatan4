import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import AdminPanel from './AdminPanel'

// Adminpanelen på /admin. Inloggning sker med e-post och lösenord (Supabase Auth)
// och bara adresser i tabellen "admins" får se eller ändra något.
export default function Admin() {
  const [state, setState] = useState('loading') // loading | out | denied | in
  const [email, setEmail] = useState('')

  const check = useCallback(async (session) => {
    if (!session) return setState('out')
    setEmail(session.user.email)
    const { data } = await supabase.rpc('is_admin')
    setState(data ? 'in' : 'denied')
  }, [])

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => check(data.session))
    const { data } = supabase.auth.onAuthStateChange((_e, session) => check(session))
    return () => data.subscription.unsubscribe()
  }, [check])

  if (state === 'loading') return <main className="crmlogin" />
  if (state === 'out') return <Login />
  if (state === 'denied') {
    return (
      <main className="crmlogin">
        <div className="crmlogin__card">
          <h1 className="crmlogin__title">Ingen behörighet</h1>
          <p className="crmlogin__lead">{email} är inte registrerad som admin.</p>
          <button type="button" className="btn btn--ghost" onClick={() => supabase.auth.signOut()}>
            Logga ut
          </button>
        </div>
      </main>
    )
  }
  return <AdminPanel email={email} />
}

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    const { error: err } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
    setBusy(false)
    if (err) setError('Fel e-post eller lösenord.')
  }

  return (
    <main className="crmlogin">
      <div className="crmlogin__card">
        <span className="crm__logo">badhuset</span>
        <h1 className="crmlogin__title">Logga in</h1>
        <p className="crmlogin__lead">Hantera intresseanmälningar, platser och event.</p>
        <form onSubmit={submit} noValidate>
          <div className="field">
            <label htmlFor="a-email">E-post</label>
            <input id="a-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="a-pass">Lösenord</label>
            <input id="a-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </div>
          {error && <p className="field__error">{error}</p>}
          <button type="submit" className="btn btn--primary" disabled={busy}>
            {busy ? 'Loggar in …' : 'Logga in'}
          </button>
        </form>
        <a className="crmlogin__back" href="/">← Till sajten</a>
      </div>
    </main>
  )
}

