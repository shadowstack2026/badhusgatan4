import { useCallback, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { useEvents } from '../lib/EventsContext'
import AdminEvents from './AdminEvents'
import AdminRegistrations from './AdminRegistrations'
import AdminLeads from './AdminLeads'
import AdminSpaces from './AdminSpaces'
import AdminOverview from './AdminOverview'

const icon = (d) => (
  <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
)

const TABS = [
  {
    id: 'oversikt',
    label: 'Översikt',
    title: 'Översikt',
    text: 'Så ser det ut just nu.',
    icon: icon(<path d="M4 13h6V4H4zM14 20h6v-9h-6zM4 20h6v-3H4zM14 7h6V4h-6z" />),
  },
  {
    id: 'intresse',
    label: 'Intresseanmälningar',
    title: 'Intresseanmälningar',
    text: 'Godkänn, ställ i kö eller avslå dem som hört av sig.',
    icon: icon(<path d="M4 6h16v12H4zM4 7l8 6 8-6" />),
  },
  {
    id: 'platser',
    label: 'Platser & kö',
    title: 'Platser & kö',
    text: 'Vem som sitter var, vilka som står i kö och hur många platser som finns.',
    icon: icon(<path d="M3 10l9-6 9 6M5 9v10h14V9M10 19v-5h4v5" />),
  },
  {
    id: 'event',
    label: 'Event',
    title: 'Event',
    text: 'Skapa och redigera event som syns på sajten.',
    icon: icon(<path d="M4 6h16v14H4zM4 10h16M8 3v4M16 3v4" />),
  },
  {
    id: 'anmalningar',
    label: 'Eventanmälningar',
    title: 'Eventanmälningar',
    text: 'Vem som anmält sig till era event.',
    icon: icon(<path d="M9 11l2 2 4-4M4 5h16v14H4z" />),
  },
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
    platser: data?.leads.filter((l) => l.status === 'ko').length,
    anmalningar: data?.regs.filter((r) => r.status === 'ny').length,
  }
  const current = TABS.find((t) => t.id === tab)

  return (
    <div className="crm">
      <aside className="crm__side">
        <div className="crm__logo">badhuset</div>
        <nav className="crm__nav" aria-label="Meny">
          {TABS.map((t) => (
            <button key={t.id} type="button" className={`crm__link${tab === t.id ? ' is-active' : ''}`} aria-current={tab === t.id ? 'page' : undefined} onClick={() => setTab(t.id)}>
              {t.icon}
              <span>{t.label}</span>
              {badge[t.id] > 0 && <em className="crm__count">{badge[t.id]}</em>}
            </button>
          ))}
        </nav>
        <div className="crm__user">
          <a href="/" className="crm__site">
            ↗ Öppna sajten
          </a>
          <span className="crm__email">{email}</span>
          <button type="button" className="crm__out" onClick={() => supabase.auth.signOut()}>
            Logga ut
          </button>
        </div>
      </aside>

      <main className="crm__main">
        <header className="crm__head">
          <h1>{current.title}</h1>
          <p>{current.text}</p>
        </header>
        {error && <div className="notice notice--error">{error}</div>}
        {data && tab === 'oversikt' && <AdminOverview {...data} go={setTab} />}
        {data && tab === 'intresse' && <AdminLeads leads={data.leads} spaces={data.spaces} members={data.members} onChange={load} />}
        {data && tab === 'platser' && <AdminSpaces spaces={data.spaces} leads={data.leads} members={data.members} onChange={load} />}
        {data && tab === 'event' && <AdminEvents events={data.events} regs={data.regs} onChange={load} />}
        {data && tab === 'anmalningar' && <AdminRegistrations events={data.events} regs={data.regs} onChange={load} />}
      </main>
    </div>
  )
}
