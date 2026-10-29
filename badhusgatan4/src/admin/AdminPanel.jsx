import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useEvents } from '../lib/EventsContext'
import AdminEvents from './AdminEvents'
import AdminRegistrations from './AdminRegistrations'
import AdminLeads from './AdminLeads'
import AdminSpaces from './AdminSpaces'
import AdminOverview from './AdminOverview'

const TABS = [
  ['oversikt', 'Översikt'],
  ['intresse', 'Intresseanmälningar'],
  ['platser', 'Platser & kö'],
  ['event', 'Event'],
  ['anmalningar', 'Eventanmälningar'],
]

export default function AdminPanel({ email }) {
  const [tab, setTab] = useState('oversikt')
  const { reload } = useEvents()
  const [data, setData] = useState(null)
  const [error, setError] = useState('')

  // Hämtar allt (även dolda event) och uppdaterar publika sajten efteråt.
  const load = useCallback(async () => {
    const res = await Promise.all([
      supabase.from('events').select('*').order('date', { ascending: false }),
      supabase.from('registrations').select('*').order('created_at', { ascending: false }),
      supabase.from('space_types').select('*').order('sort'),
      supabase.from('leads').select('*').order('created_at', { ascending: false }),
      supabase.from('members').select('*').order('since', { ascending: false }),
      supabase.from('activity_log').select('*').order('created_at', { ascending: false }).limit(8),
    ])
    if (res.some((r) => r.error)) {
      setError('Kunde inte hämta data. Har du kört hela supabase/schema.sql i Supabase?')
      setData((d) => d ?? { events: [], regs: [], spaces: [], leads: [], members: [], activity: [] })
      return
    }
    setError('')
    const [events, regs, spaces, leads, members, activity] = res.map((r) => r.data)
    setData({ events, regs, spaces, leads, members, activity })
    reload()
  }, [reload])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load()
  }, [load])

  const badge = {
    intresse: data?.leads.filter((l) => l.status === 'ny').length,
    anmalningar: data?.regs.filter((r) => r.status === 'ny').length,
  }

  return (
    <main className="request admin">
      <div className="container admin__inner admin__inner--wide">
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
          {TABS.map(([id, label]) => (
            <button key={id} type="button" role="tab" aria-selected={tab === id} className={tab === id ? 'is-active' : ''} onClick={() => setTab(id)}>
              {label}
              {badge[id] > 0 && <span className="admin__badge">{badge[id]}</span>}
            </button>
          ))}
        </div>

        {error && <div className="notice notice--error">{error}</div>}
        {data && tab === 'oversikt' && <AdminOverview {...data} go={setTab} />}
        {data && tab === 'intresse' && <AdminLeads leads={data.leads} spaces={data.spaces} members={data.members} onChange={load} />}
        {data && tab === 'platser' && <AdminSpaces spaces={data.spaces} leads={data.leads} members={data.members} onChange={load} />}
        {data && tab === 'event' && <AdminEvents events={data.events} regs={data.regs} onChange={load} />}
        {data && tab === 'anmalningar' && <AdminRegistrations events={data.events} regs={data.regs} onChange={load} />}
      </div>
    </main>
  )
}
