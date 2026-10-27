import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useEvents } from '../lib/EventsContext'
import AdminEvents from './AdminEvents'
import AdminRegistrations from './AdminRegistrations'

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

  if (state === 'loading') return <main className="request admin" />
  if (state === 'out') return <Login />
  if (state === 'denied') {
    return (
      <main className="request admin">
        <div className="container request__inner">
          <h1 className="h2">Ingen behörighet</h1>
          <p className="lead">{email} är inte registrerad som admin.</p>
          <button type="button" className="btn btn--ghost" onClick={() => supabase.auth.signOut()}>
            Logga ut
          </button>
        </div>
      </main>
    )
  }
  return <Panel email={email} />
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
    <main className="request admin">
      <div className="container request__inner admin__login">
        <h1 className="h2">Admin</h1>
        <p className="lead">Logga in för att hantera event och anmälningar.</p>
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
      </div>
    </main>
  )
}

function Panel({ email }) {
  const [tab, setTab] = useState('event')
  const { reload } = useEvents()
  const [events, setEvents] = useState(null)
  const [regs, setRegs] = useState([])
  const [error, setError] = useState('')

  // Hämtar allt (även dolda event) och uppdaterar publika sajten efteråt.
  const load = useCallback(async () => {
    const [ev, rg] = await Promise.all([
      supabase.from('events').select('*').order('date', { ascending: false }),
      supabase.from('registrations').select('*').order('created_at', { ascending: false }),
    ])
    if (ev.error || rg.error) {
      setError('Kunde inte hämta data. Har du kört supabase/schema.sql i Supabase?')
      setEvents([])
      return
    }
    setError('')
    setEvents(ev.data)
    setRegs(rg.data)
    reload()
  }, [reload])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  const waiting = regs.filter((r) => r.status === 'ny').length

  return (
    <main className="request admin">
      <div className="container admin__inner">
        <div className="admin__top">
          <div>
            <h1 className="h2">Admin</h1>
            <p className="admin__who">Inloggad som {email}</p>
          </div>
          <button type="button" className="btn btn--ghost" onClick={() => supabase.auth.signOut()}>
            Logga ut
          </button>
        </div>

        <div className="admin__tabs" role="tablist">
          <button type="button" role="tab" aria-selected={tab === 'event'} className={tab === 'event' ? 'is-active' : ''} onClick={() => setTab('event')}>
            Event
          </button>
          <button type="button" role="tab" aria-selected={tab === 'anmalningar'} className={tab === 'anmalningar' ? 'is-active' : ''} onClick={() => setTab('anmalningar')}>
            Anmälningar
            {waiting > 0 && <span className="admin__badge">{waiting} nya</span>}
          </button>
        </div>

        {error && <div className="notice notice--error">{error}</div>}
        {events &&
          (tab === 'event' ? (
            <AdminEvents events={events} regs={regs} onChange={load} />
          ) : (
            <AdminRegistrations events={events} regs={regs} onChange={load} />
          ))}
      </div>
    </main>
  )
}
