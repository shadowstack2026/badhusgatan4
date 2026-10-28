import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { sendEventConfirmation } from '../lib/mail'

const STATUS = { ny: 'Ny', bekraftad: 'Bekräftad', avbokad: 'Avbokad' }

const csvCell = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`

export default function AdminRegistrations({ events, regs, onChange }) {
  const [eventId, setEventId] = useState('alla')
  const [busyId, setBusyId] = useState(null)
  const [notice, setNotice] = useState(null)

  const titleOf = (id) => events.find((e) => e.id === id)?.title ?? '–'
  const list = regs.filter((r) => eventId === 'alla' || r.event_id === eventId)
  const active = list.filter((r) => r.status !== 'avbokad')
  const going = active.filter((r) => r.kind === 'anmalan').length
  const wait = active.filter((r) => r.kind === 'vantelista').length
  const picked = events.find((e) => e.id === eventId)

  // Skickar bekräftelsemejlet och markerar anmälan som bekräftad först när mejlet gått iväg.
  const confirmAndMail = async (r, { promoted = false } = {}) => {
    const event = events.find((e) => e.id === r.event_id)
    if (!event) return
    setBusyId(r.id)
    setNotice(null)
    try {
      await sendEventConfirmation({ reg: r, event, promoted })
    } catch (err) {
      console.error('Mejlet kunde inte skickas', err)
      setBusyId(null)
      return setNotice({ error: true, text: `Mejlet till ${r.email} kunde inte skickas. ${err.message || err.text || ''}` })
    }
    const { error } = await supabase
      .from('registrations')
      .update({ kind: 'anmalan', status: 'bekraftad', confirmed_at: new Date().toISOString() })
      .eq('id', r.id)
    setBusyId(null)
    setNotice(
      error
        ? { error: true, text: `Mejlet skickades, men statusen kunde inte sparas: ${error.message}` }
        : { text: `Bekräftelse skickad till ${r.email}.` },
    )
    onChange()
  }

  const update = async (r, patch) => {
    await supabase.from('registrations').update(patch).eq('id', r.id)
    onChange()
  }
  const remove = async (r) => {
    if (!window.confirm(`Radera anmälan från ${r.name}?`)) return
    await supabase.from('registrations').delete().eq('id', r.id)
    onChange()
  }

  const exportCsv = () => {
    const head = ['Event', 'Namn', 'E-post', 'Telefon', 'Meddelande', 'Typ', 'Status', 'Anmäld']
    const rows = list.map((r) => [
      titleOf(r.event_id),
      r.name,
      r.email,
      r.phone,
      r.message,
      r.kind === 'vantelista' ? 'Väntelista' : 'Deltagare',
      STATUS[r.status],
      new Date(r.created_at).toLocaleString('sv-SE'),
    ])
    const csv = '﻿' + [head, ...rows].map((row) => row.map(csvCell).join(';')).join('\r\n')
    const a = document.createElement('a')
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8' }))
    a.download = 'anmalningar.csv'
    a.click()
    URL.revokeObjectURL(a.href)
  }

  return (
    <section>
      <div className="admin__bar">
        <div className="field admin__filter">
          <label htmlFor="r-event">Visa anmälningar till</label>
          <select id="r-event" value={eventId} onChange={(e) => setEventId(e.target.value)}>
            <option value="alla">Alla event</option>
            {events.map((e) => (
              <option key={e.id} value={e.id}>
                {e.title}
              </option>
            ))}
          </select>
        </div>
        <button type="button" className="btn btn--ghost" onClick={exportCsv} disabled={!list.length}>
          Ladda ner som Excel-fil
        </button>
      </div>

      {notice && (
        <div className={`notice${notice.error ? ' notice--error' : ''}`} role="status" style={{ marginBottom: 20 }}>
          {notice.text}
        </div>
      )}

      <p className="admin__summary">
        {going}
        {picked && picked.spots_total > 0 ? ` av ${picked.spots_total}` : ''} anmälda
        {wait > 0 && ` · ${wait} på väntelista`}
      </p>

      {list.length === 0 ? (
        <div className="admin__empty">
          <p>Inga anmälningar ännu.</p>
        </div>
      ) : (
        <ul className="admin__list">
          {list.map((r) => (
            <li key={r.id} className={`admin__item admin__reg${r.status === 'avbokad' ? ' is-off' : ''}`}>
              <div className="admin__info">
                <strong>{r.name}</strong>
                <span>
                  <a href={`mailto:${r.email}`}>{r.email}</a>
                  {r.phone && ` · ${r.phone}`}
                </span>
                {eventId === 'alla' && <span>{titleOf(r.event_id)}</span>}
                {r.message && <span className="admin__msg">”{r.message}”</span>}
                <span className="admin__tags">
                  <em className={r.kind === 'vantelista' ? 'tag tag--wait' : 'tag tag--ok'}>
                    {r.kind === 'vantelista' ? 'Väntelista' : 'Deltagare'}
                  </em>
                  <em className={`tag tag--${r.status}`}>{STATUS[r.status]}</em>
                  <em className="tag">Anmäld {new Date(r.created_at).toLocaleDateString('sv-SE')}</em>
                  {r.confirmed_at && (
                    <em className="tag tag--ok">Mejl skickat {new Date(r.confirmed_at).toLocaleDateString('sv-SE')}</em>
                  )}
                </span>
              </div>
              <div className="admin__actions">
                {r.kind === 'vantelista' && r.status !== 'avbokad' && (
                  <button type="button" className="btn btn--primary" disabled={busyId === r.id} onClick={() => confirmAndMail(r, { promoted: true })}>
                    {busyId === r.id ? 'Skickar …' : 'Ge plats och mejla'}
                  </button>
                )}
                {r.kind === 'anmalan' && r.status === 'ny' && (
                  <button type="button" className="btn btn--primary" disabled={busyId === r.id} onClick={() => confirmAndMail(r)}>
                    {busyId === r.id ? 'Skickar …' : 'Bekräfta och mejla'}
                  </button>
                )}
                {r.kind === 'anmalan' && r.status === 'bekraftad' && (
                  <button type="button" className="btn btn--ghost" disabled={busyId === r.id} onClick={() => confirmAndMail(r)}>
                    {busyId === r.id ? 'Skickar …' : 'Mejla igen'}
                  </button>
                )}
                {r.status !== 'avbokad' ? (
                  <button type="button" className="btn btn--ghost" onClick={() => update(r, { status: 'avbokad' })}>
                    Avboka
                  </button>
                ) : (
                  <button type="button" className="btn btn--ghost" onClick={() => update(r, { status: 'ny' })}>
                    Ångra avbokning
                  </button>
                )}
                <button type="button" className="btn btn--danger" onClick={() => remove(r)}>
                  Radera
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
