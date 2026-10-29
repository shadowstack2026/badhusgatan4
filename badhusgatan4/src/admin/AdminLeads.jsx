import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { KIND, LEAD_STATUS, activeMembers, downloadCsv, log, placeLead, sv } from './crm'

const FILTERS = [
  ['aktiva', 'Att hantera'],
  ['ny', 'Nya'],
  ['ko', 'I kö'],
  ['godkand', 'Godkända'],
  ['avbojd', 'Avslagna'],
  ['alla', 'Alla'],
]

export default function AdminLeads({ leads, spaces, members, onChange }) {
  const [filter, setFilter] = useState('aktiva')
  const [typ, setTyp] = useState('alla')
  const [q, setQ] = useState('')
  const [mail, setMail] = useState(false)
  const [busyId, setBusyId] = useState(null)
  const [notice, setNotice] = useState(null)

  const spaceOf = (id) => spaces.find((s) => s.id === id)
  const labelOf = (l) => (l.space_type ? spaceOf(l.space_type)?.title ?? l.space_type : KIND[l.kind])
  const needle = q.trim().toLowerCase()

  const list = leads.filter((l) => {
    if (filter === 'aktiva' ? !['ny', 'kontaktad', 'ko'].includes(l.status) : filter !== 'alla' && l.status !== filter) return false
    if (typ !== 'alla' && (l.space_type ?? l.kind) !== typ) return false
    return !needle || [l.name, l.email, l.company, l.phone].join(' ').toLowerCase().includes(needle)
  })

  const patch = async (l, fields, text) => {
    await supabase.from('leads').update(fields).eq('id', l.id)
    if (text) await log(text)
    onChange()
  }

  const approve = async (l) => {
    const space = spaceOf(l.space_type)
    if (!space) return patch(l, { status: 'godkand', approved_at: new Date().toISOString() }, `${l.name}: ${KIND[l.kind]} klar`)
    setBusyId(l.id)
    setNotice(null)
    const res = await placeLead({ lead: l, space, members, mail })
    setBusyId(null)
    if (res.error) setNotice({ error: true, text: res.error })
    else
      setNotice(
        res.mailError
          ? { error: true, text: `${l.name} har fått plats, men mejlet kunde inte skickas: ${res.mailError}` }
          : { text: `${l.name} har fått plats: ${space.title}.${mail ? ' Mejl skickat.' : ''}` },
      )
    onChange()
  }

  const queue = (l) => patch(l, { status: 'ko' }, `${l.name} ställdes i kö: ${labelOf(l)}`)
  const reject = (l) => patch(l, { status: 'avbojd' }, `${l.name} avslogs: ${labelOf(l)}`)
  const remove = async (l) => {
    if (!window.confirm(`Radera ${l.name} helt? Det går inte att ångra.`)) return
    await supabase.from('leads').delete().eq('id', l.id)
    onChange()
  }
  const saveNote = async (l, notes) => {
    if (notes !== l.notes) await supabase.from('leads').update({ notes }).eq('id', l.id)
  }

  const exportCsv = () =>
    downloadCsv(
      'intresseanmalningar.csv',
      ['Namn', 'E-post', 'Telefon', 'Företag', 'Gäller', 'Status', 'Önskad start', 'Meddelande', 'Anteckning', 'Inkom'],
      list.map((l) => [l.name, l.email, l.phone, l.company, labelOf(l), LEAD_STATUS[l.status], l.start_date, l.message, l.notes, sv(l.created_at)]),
    )

  return (
    <section>
      <div className="crm__chips" role="tablist">
        {FILTERS.map(([id, label]) => (
          <button key={id} type="button" className={`crm__chip${filter === id ? ' is-active' : ''}`} onClick={() => setFilter(id)}>
            {label}
          </button>
        ))}
      </div>

      <div className="admin__bar">
        <div className="crm__filters">
          <div className="field admin__filter">
            <label htmlFor="l-q">Sök</label>
            <input id="l-q" type="search" placeholder="Namn, e-post eller företag" value={q} onChange={(e) => setQ(e.target.value)} />
          </div>
          <div className="field admin__filter">
            <label htmlFor="l-typ">Gäller</label>
            <select id="l-typ" value={typ} onChange={(e) => setTyp(e.target.value)}>
              <option value="alla">Allt</option>
              {spaces.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.title}
                </option>
              ))}
              <option value="prova-dag">Prova en dag</option>
              <option value="besok">Boka besök</option>
            </select>
          </div>
        </div>
        <button type="button" className="btn btn--ghost" onClick={exportCsv} disabled={!list.length}>
          Ladda ner som Excel-fil
        </button>
      </div>

      <label className="admin__check crm__mail">
        <input type="checkbox" checked={mail} onChange={(e) => setMail(e.target.checked)} />
        <span>Skicka mejl till personen när jag ger en plats</span>
      </label>

      {notice && (
        <div className={`notice${notice.error ? ' notice--error' : ''}`} role="status" style={{ marginBottom: 20 }}>
          {notice.text}
        </div>
      )}

      {list.length === 0 ? (
        <div className="admin__empty">
          <p>Inget här just nu.</p>
        </div>
      ) : (
        <ul className="admin__list">
          {list.map((l) => {
            const space = spaceOf(l.space_type)
            const full = space && activeMembers(members, space.id).length >= space.capacity
            const open = ['ny', 'kontaktad', 'ko'].includes(l.status)
            return (
              <li key={l.id} className={`admin__item admin__reg crm__lead${l.status === 'avbojd' ? ' is-off' : ''}`}>
                <div className="admin__info">
                  <strong>{l.name}</strong>
                  <span>
                    <a href={`mailto:${l.email}`}>{l.email}</a>
                    {l.phone && ` · ${l.phone}`}
                    {l.company && ` · ${l.company}`}
                  </span>
                  <span className="admin__tags">
                    <em className="tag tag--ok">{labelOf(l)}</em>
                    <em className={`tag crm__st--${l.status}`}>{LEAD_STATUS[l.status]}</em>
                    <em className="tag">Inkom {sv(l.created_at)}</em>
                    {l.start_date && <em className="tag">Start {l.start_date}</em>}
                  </span>
                  {l.work && <span>Jobbar med: {l.work}</span>}
                  {l.message && <span className="admin__msg">”{l.message}”</span>}
                  <input
                    className="crm__note"
                    type="text"
                    placeholder="Anteckning (sparas när du klickar bort)"
                    defaultValue={l.notes}
                    onBlur={(e) => saveNote(l, e.target.value)}
                  />
                </div>
                <div className="admin__actions">
                  {open && (
                    <>
                      {full && l.status !== 'ko' ? (
                        <button type="button" className="btn btn--primary" onClick={() => queue(l)}>
                          Lägg i kö
                        </button>
                      ) : (
                        <button type="button" className="btn btn--primary" disabled={busyId === l.id || (full && l.status === 'ko')} onClick={() => approve(l)} title={full ? 'Fullt – avsluta någon först' : undefined}>
                          {busyId === l.id ? 'Sparar …' : space ? 'Godkänn – ge plats' : 'Markera klar'}
                        </button>
                      )}
                      {l.status === 'ny' && (
                        <button type="button" className="btn btn--ghost" onClick={() => patch(l, { status: 'kontaktad' })}>
                          Kontaktad
                        </button>
                      )}
                      <button type="button" className="btn btn--ghost" onClick={() => reject(l)}>
                        Avslå
                      </button>
                    </>
                  )}
                  {l.status === 'avbojd' && (
                    <button type="button" className="btn btn--ghost" onClick={() => patch(l, { status: 'ny' })}>
                      Öppna igen
                    </button>
                  )}
                  <button type="button" className="btn btn--danger" onClick={() => remove(l)}>
                    Radera
                  </button>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </section>
  )
}
