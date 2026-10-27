import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { events as sampleEvents } from '../data/events'
import { CATEGORIES, isUpcoming, longDate, slugify, timeRange } from '../lib/events'

const EMPTY = {
  title: '',
  category: 'Socialt',
  date: '',
  start_time: '',
  end_time: '',
  location: 'Badhusgatan 4, Helsingborg',
  image: '',
  summary: '',
  description: '',
  agenda: [],
  for_whom: '',
  price: 'Gratis',
  host_name: '',
  host_role: '',
  spots_total: 0,
  published: true,
}

const asView = (r) => ({ ...r, time: timeRange({ startTime: r.start_time, endTime: r.end_time }) })

export default function AdminEvents({ events, regs, onChange }) {
  const [editing, setEditing] = useState(null) // null | 'new' | rad
  const [busy, setBusy] = useState(false)

  const counts = (id) => {
    const mine = regs.filter((r) => r.event_id === id && r.status !== 'avbokad')
    return {
      going: mine.filter((r) => r.kind === 'anmalan').length,
      wait: mine.filter((r) => r.kind === 'vantelista').length,
    }
  }

  const togglePublished = async (e) => {
    await supabase.from('events').update({ published: !e.published }).eq('id', e.id)
    onChange()
  }

  const remove = async (e) => {
    const n = regs.filter((r) => r.event_id === e.id).length
    const extra = n ? `\n\nDe ${n} anmälningarna till eventet raderas också.` : ''
    if (!window.confirm(`Radera "${e.title}"?${extra}\n\nDet går inte att ångra.`)) return
    await supabase.from('events').delete().eq('id', e.id)
    onChange()
  }

  const seed = async () => {
    setBusy(true)
    const rows = sampleEvents.map((e) => ({
      slug: e.slug,
      title: e.title,
      category: e.category,
      date: e.date,
      start_time: e.startTime,
      end_time: e.endTime,
      location: e.location,
      image: e.image,
      summary: e.summary,
      description: e.description.join('\n\n'),
      agenda: e.agenda,
      for_whom: e.forWhom,
      price: e.price,
      host_name: e.host.name,
      host_role: e.host.role,
      spots_total: e.spotsTotal,
      published: true,
    }))
    await supabase.from('events').upsert(rows, { onConflict: 'slug', ignoreDuplicates: true })
    setBusy(false)
    onChange()
  }

  if (editing) {
    return (
      <EventForm
        initial={editing === 'new' ? EMPTY : editing}
        isNew={editing === 'new'}
        existingSlugs={events.map((e) => e.slug)}
        onCancel={() => setEditing(null)}
        onSaved={() => {
          setEditing(null)
          onChange()
        }}
      />
    )
  }

  return (
    <section>
      <div className="admin__bar">
        <p className="admin__hint">Här lägger du till, ändrar och tar bort event. Ändringar syns direkt på sajten.</p>
        <button type="button" className="btn btn--primary" onClick={() => setEditing('new')}>
          + Nytt event
        </button>
      </div>

      {events.length === 0 && (
        <div className="admin__empty">
          <p>Inga event ännu.</p>
          <button type="button" className="btn btn--ghost" onClick={seed} disabled={busy}>
            {busy ? 'Lägger in …' : 'Lägg in exempelevent'}
          </button>
        </div>
      )}

      <ul className="admin__list">
        {events.map((e) => {
          const c = counts(e.id)
          const past = !isUpcoming({ date: e.date })
          return (
            <li key={e.id} className="admin__item">
              <div className="admin__thumb">{e.image ? <img src={e.image} alt="" /> : <span>Ingen bild</span>}</div>
              <div className="admin__info">
                <strong>{e.title}</strong>
                <span>
                  {longDate(e.date)}
                  {asView(e).time && ` · ${asView(e).time}`} · {e.category}
                </span>
                <span>
                  {c.going} {e.spots_total > 0 ? `av ${e.spots_total} ` : ''}anmälda
                  {c.wait > 0 && ` · ${c.wait} på väntelista`}
                </span>
                <span className="admin__tags">
                  <em className={e.published ? 'tag tag--ok' : 'tag tag--off'}>{e.published ? 'Publicerad' : 'Dold'}</em>
                  {past && <em className="tag">Tidigare</em>}
                </span>
              </div>
              <div className="admin__actions">
                <button type="button" className="btn btn--primary" onClick={() => setEditing(e)}>
                  Redigera
                </button>
                <button type="button" className="btn btn--ghost" onClick={() => togglePublished(e)}>
                  {e.published ? 'Dölj' : 'Publicera'}
                </button>
                <button type="button" className="btn btn--danger" onClick={() => remove(e)}>
                  Radera
                </button>
              </div>
            </li>
          )
        })}
      </ul>
    </section>
  )
}

function EventForm({ initial, isNew, existingSlugs, onCancel, onSaved }) {
  const [f, setF] = useState({ ...initial, agenda: initial.agenda ?? [] })
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  const set = (k, v) => setF((p) => ({ ...p, [k]: v }))
  const text = (k, label, props = {}) => (
    <div className="field">
      <label htmlFor={`f-${k}`}>{label}</label>
      <input id={`f-${k}`} value={f[k]} onChange={(e) => set(k, e.target.value)} {...props} />
      {props.hint && <p className="admin__help">{props.hint}</p>}
    </div>
  )

  const upload = async (file) => {
    if (!file) return
    setUploading(true)
    setError('')
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase().replace(/[^a-z0-9]/g, '')
    const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`
    const { error: err } = await supabase.storage.from('event-images').upload(path, file, { contentType: file.type })
    setUploading(false)
    if (err) return setError('Bilden kunde inte laddas upp: ' + err.message)
    set('image', supabase.storage.from('event-images').getPublicUrl(path).data.publicUrl)
  }

  const setAgenda = (i, k, v) => set('agenda', f.agenda.map((a, j) => (j === i ? { ...a, [k]: v } : a)))

  const save = async (e) => {
    e.preventDefault()
    if (!f.title.trim()) return setError('Eventet behöver en rubrik.')
    if (!f.date) return setError('Välj ett datum.')

    let slug = initial.slug
    if (isNew) {
      const base = slugify(f.title) || 'event'
      slug = base
      for (let n = 2; existingSlugs.includes(slug); n++) slug = `${base}-${n}`
    }
    const row = {
      slug,
      title: f.title.trim(),
      category: f.category,
      date: f.date,
      start_time: f.start_time,
      end_time: f.end_time,
      location: f.location.trim(),
      image: f.image.trim(),
      summary: f.summary.trim(),
      description: f.description.trim(),
      agenda: f.agenda.filter((a) => a.text.trim()).map((a) => ({ time: a.time.trim(), text: a.text.trim() })),
      for_whom: f.for_whom.trim(),
      price: f.price.trim(),
      host_name: f.host_name.trim(),
      host_role: f.host_role.trim(),
      spots_total: Math.max(0, parseInt(f.spots_total, 10) || 0),
      published: f.published,
    }
    setSaving(true)
    setError('')
    const { error: err } = isNew
      ? await supabase.from('events').insert(row)
      : await supabase.from('events').update(row).eq('id', initial.id)
    setSaving(false)
    if (err) return setError('Kunde inte spara: ' + err.message)
    onSaved()
  }

  return (
    <form className="admin__form" onSubmit={save} noValidate>
      <h2 className="admin__h">{isNew ? 'Nytt event' : 'Redigera event'}</h2>

      {text('title', 'Rubrik')}

      <div className="form-grid">
        <div className="field">
          <label htmlFor="f-category">Kategori</label>
          <select id="f-category" value={f.category} onChange={(e) => set('category', e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>
        {text('date', 'Datum', { type: 'date' })}
        {text('start_time', 'Starttid', { type: 'time' })}
        {text('end_time', 'Sluttid', { type: 'time' })}
      </div>

      {text('location', 'Plats')}

      <div className="field">
        <label>Bild</label>
        <div className="admin__image">
          {f.image ? <img src={f.image} alt="" /> : <div className="admin__noimg">Ingen bild vald</div>}
          <div className="admin__imgbtns">
            <label className="btn btn--ghost admin__file">
              {uploading ? 'Laddar upp …' : f.image ? 'Byt bild' : 'Ladda upp bild'}
              <input type="file" accept="image/*" onChange={(e) => upload(e.target.files[0])} disabled={uploading} />
            </label>
            {f.image && (
              <button type="button" className="btn btn--ghost" onClick={() => set('image', '')}>
                Ta bort bild
              </button>
            )}
          </div>
        </div>
        <p className="admin__help">Tips: en liggande bild fungerar bäst.</p>
      </div>

      {text('summary', 'Kort sammanfattning', { hint: 'En mening som visas på korten.' })}

      <div className="field">
        <label htmlFor="f-description">Beskrivning</label>
        <textarea id="f-description" rows={8} value={f.description} onChange={(e) => set('description', e.target.value)} />
        <p className="admin__help">Lämna en tom rad mellan styckena.</p>
      </div>

      <div className="field">
        <label>Program</label>
        <div className="admin__agenda">
          {f.agenda.map((a, i) => (
            <div key={i} className="admin__arow">
              <input aria-label="Tid" placeholder="18:00" value={a.time} onChange={(e) => setAgenda(i, 'time', e.target.value)} />
              <input aria-label="Vad händer" placeholder="Vad händer?" value={a.text} onChange={(e) => setAgenda(i, 'text', e.target.value)} />
              <button type="button" className="admin__x" aria-label="Ta bort raden" onClick={() => set('agenda', f.agenda.filter((_, j) => j !== i))}>
                ×
              </button>
            </div>
          ))}
          <button type="button" className="btn btn--ghost" onClick={() => set('agenda', [...f.agenda, { time: '', text: '' }])}>
            + Lägg till punkt
          </button>
        </div>
      </div>

      {text('for_whom', 'För vem', { hint: 'En mening om vem eventet passar.' })}

      <div className="form-grid">
        {text('price', 'Pris', { hint: 'Till exempel Gratis eller 100 kr.' })}
        {text('spots_total', 'Antal platser', { type: 'number', min: 0, hint: '0 betyder obegränsat. Blir det fullt hamnar nya på väntelistan.' })}
        {text('host_name', 'Värd, namn')}
        {text('host_role', 'Värd, roll')}
      </div>

      <label className="admin__check">
        <input type="checkbox" checked={f.published} onChange={(e) => set('published', e.target.checked)} />
        <span>Visa på sajten</span>
      </label>

      {error && <div className="notice notice--error" role="alert">{error}</div>}

      <div className="admin__formfoot">
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Avbryt
        </button>
        <button type="submit" className="btn btn--primary" disabled={saving || uploading}>
          {saving ? 'Sparar …' : 'Spara event'}
        </button>
      </div>
    </form>
  )
}
