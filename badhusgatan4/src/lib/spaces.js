import { useEffect, useState } from 'react'
import { workspaces as staticWorkspaces } from '../data/content'
import { supabase } from './supabase'

// Status för en platstyp utifrån antal platser och hur många som är upptagna.
export function statusOf(capacity, taken) {
  const free = capacity - taken
  if (free <= 0) return 'fullt'
  if (free <= Math.max(1, Math.floor(capacity * 0.25))) return 'fa'
  return 'lediga'
}

// Platskorten på sajten. Status räknas ut från CRM:et (space_counts); går det inte
// att hämta används statusen som står i src/data/content.js.
export function useWorkspaces() {
  const [counts, setCounts] = useState(null)

  useEffect(() => {
    let alive = true
    supabase
      .from('space_counts')
      .select('*')
      .then(({ data, error }) => {
        if (alive && !error && data?.length) setCounts(Object.fromEntries(data.map((c) => [c.id, c])))
      })
    return () => {
      alive = false
    }
  }, [])

  return staticWorkspaces.map((w) => {
    const c = counts?.[w.id]
    return c ? { ...w, status: statusOf(c.capacity, c.taken) } : w
  })
}
