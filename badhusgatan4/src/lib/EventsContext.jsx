import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { events as fallbackEvents } from '../data/events'
import { supabase } from './supabase'
import { fromRow, pastOf, upcomingOf } from './events'

const Ctx = createContext(null)

// Hämtar publicerade event från Supabase. Går det inte (t.ex. databasen är inte
// uppsatt än) visas exemplen i src/data/events.js så att sajten aldrig blir tom.
export function EventsProvider({ children }) {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)

  const reload = useCallback(async () => {
    try {
      const [ev, counts] = await Promise.all([
        supabase.from('events').select('*').eq('published', true),
        supabase.from('event_counts').select('*'),
      ])
      if (ev.error) throw ev.error
      const taken = Object.fromEntries((counts.data ?? []).map((c) => [c.event_id, c.taken]))
      setEvents(ev.data.map((r) => fromRow(r, taken[r.id] ?? 0)))
    } catch (err) {
      console.warn('Kunde inte hämta event från databasen, visar exempel', err)
      setEvents(fallbackEvents.map((e) => ({ ...e, id: e.slug })))
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    // Hämtar från databasen vid start; state sätts först efter await.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    reload()
  }, [reload])

  const value = useMemo(
    () => ({
      events,
      loading,
      reload,
      upcoming: upcomingOf(events),
      past: pastOf(events),
      find: (slug) => events.find((e) => e.slug === slug),
    }),
    [events, loading, reload],
  )
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export const useEvents = () => useContext(Ctx)
