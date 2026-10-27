const DAYS = ['söndag', 'måndag', 'tisdag', 'onsdag', 'torsdag', 'fredag', 'lördag']
const MONTHS = ['januari', 'februari', 'mars', 'april', 'maj', 'juni', 'juli', 'augusti', 'september', 'oktober', 'november', 'december']

export const CATEGORIES = ['Frukost', 'Kunskap', 'Bygga', 'Socialt', 'Öppet hus']

// Rad från databasen -> event som sidan använder.
// spotsLeft är null när antalet platser är obegränsat.
export const fromRow = (r, taken = 0) => ({
  id: r.id,
  slug: r.slug,
  title: r.title,
  category: r.category,
  date: r.date,
  startTime: r.start_time || '',
  endTime: r.end_time || '',
  location: r.location || '',
  image: r.image || '',
  summary: r.summary || '',
  description: (r.description || '').split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean),
  agenda: Array.isArray(r.agenda) ? r.agenda : [],
  forWhom: r.for_whom || '',
  price: r.price || '',
  host: { name: r.host_name || '', role: r.host_role || '' },
  spotsTotal: r.spots_total,
  taken,
  spotsLeft: r.spots_total > 0 ? Math.max(0, r.spots_total - taken) : null,
  published: r.published,
})

// "2026-11-12" -> lokalt datum (utan tidszonsfel)
export const parseDate = (iso) => {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(y, m - 1, d)
}

const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1)

export const longDate = (iso) => {
  const d = parseDate(iso)
  return `${cap(DAYS[d.getDay()])} ${d.getDate()} ${MONTHS[d.getMonth()]}`
}
export const shortDate = (iso) => {
  const d = parseDate(iso)
  return `${d.getDate()} ${MONTHS[d.getMonth()].slice(0, 3)}`
}
export const dayNumber = (iso) => parseDate(iso).getDate()
export const monthShort = (iso) => MONTHS[parseDate(iso).getMonth()].slice(0, 3)

export const timeRange = (e) => (e.startTime ? (e.endTime ? `${e.startTime}–${e.endTime}` : e.startTime) : '')

const today = () => {
  const n = new Date()
  return new Date(n.getFullYear(), n.getMonth(), n.getDate())
}

export const isUpcoming = (e) => parseDate(e.date) >= today()
export const byDate = (a, b) => parseDate(a.date) - parseDate(b.date)

// Kommande och tidigare delas automatiskt upp efter dagens datum.
export const upcomingOf = (list) => list.filter(isUpcoming).sort(byDate)
export const pastOf = (list) => list.filter((e) => !isUpcoming(e)).sort((a, b) => byDate(b, a))

export const isFull = (e) => e.spotsLeft !== null && e.spotsLeft <= 0

// Platsstatus: grön, orange (färre än 5 kvar) eller grå (fullt).
export const spotStatus = (e) => {
  if (isFull(e)) return { status: 'fullt', label: 'Fullt – väntelista' }
  if (e.spotsLeft !== null && e.spotsLeft < 5) return { status: 'fa', label: 'Få platser kvar' }
  return { status: 'lediga', label: 'Platser kvar' }
}

export const signupLink = (e) => `/event/${e.slug}/anmal`

export const slugify = (s) =>
  s
    .toLowerCase()
    .replace(/å|ä/g, 'a')
    .replace(/ö/g, 'o')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')

// Bygger en .ics-fil i webbläsaren och laddar ner den.
export function downloadIcs(e) {
  const ymd = e.date.replace(/-/g, '')
  const hm = (t) => (t || '').replace(':', '') + '00'
  const esc = (s) => String(s).replace(/([,;\\])/g, '\\$1').replace(/\n/g, '\\n')
  const timed = !!e.startTime
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//badhuset//event//SV',
    'BEGIN:VEVENT',
    `UID:${e.slug}@badhuset`,
    `DTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
    timed ? `DTSTART:${ymd}T${hm(e.startTime)}` : `DTSTART;VALUE=DATE:${ymd}`,
    timed ? `DTEND:${ymd}T${hm(e.endTime || e.startTime)}` : null,
    `SUMMARY:${esc(e.title)}`,
    `LOCATION:${esc(e.location)}`,
    `DESCRIPTION:${esc(e.summary)}`,
    'END:VEVENT',
    'END:VCALENDAR',
  ].filter(Boolean)
  const blob = new Blob([lines.join('\r\n')], { type: 'text/calendar;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${e.slug}.ics`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
}
