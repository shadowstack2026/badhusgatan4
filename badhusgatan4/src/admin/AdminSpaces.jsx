import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { statusOf } from '../lib/spaces'
import StatusLabel from '../components/StatusLabel'
import { activeMembers, downloadCsv, endMember, log, placeLead, queueOf, sv } from './crm'

export default function AdminSpaces({ spaces, leads, members, onChange }) {
  const [notice, setNotice] = useState(null)
  const [mail, setMail] = useState(false)
  const [adding, setAdding] = useState(null) // platstyp-id
  const [busy, setBusy] = useState(false)

  const done = (res, okText) => {
    setBusy(false)
    if (res?.error) setNotice({ error: true, text: res.error })
    else if (res?.mailError) setNotice({ error: true, text: `Klart, men mejlet kunde inte skickas: ${res.mailError}` })
    else if (okText) setNotice({ text: okText })
    onChange()
  }

  const setCapacity = async (s, value) => {
    const n = Math.max(0, parseInt(value, 10) || 0)
    if (n === s.capacity) return
    await supabase.from('space_types').update({ capacity: n }).eq('id', s.id)
    await log(`Antal platser för ${s.title} ändrades till ${n}`)
    onChange()
  }

  const end = async (m, s) => {
    if (!window.confirm(`${m.name} har sagt upp sig från ${s.title}? Platsen blir ledig.`)) return
    setBusy(true)
    const res = await endMember(m, s)
    done(res, queueOf(leads, s.id).length ? `${m.name} har lämnat. Första i kön kan nu få platsen.` : `${m.name} har lämnat ${s.title}.`)
  }

  const removeMember = async (m) => {
    if (!window.confirm(`Radera ${m.name} helt ur registret?`)) return
    await supabase.from('members').delete().eq('id', m.id)
    onChange()
  }

  const give = async (lead, s) => {
    setBusy(true)
    done(await placeLead({ lead, space: s, members, mail }), `${lead.name} har fått plats: ${s.title}.`)
  }

  const unqueue = async (lead) => {
    await supabase.from('leads').update({ status: 'avbojd' }).eq('id', lead.id)
    await log(`${lead.name} togs ur kön`)
    onChange()
  }

  const exportCsv = () =>
    downloadCsv(
      'medlemmar.csv',
      ['Namn', 'E-post', 'Telefon', 'Företag', 'Plats', 'Sedan', 'Slutade', 'Anteckning'],
      members.map((m) => [m.name, m.email, m.phone, m.company, spaces.find((s) => s.id === m.space_type)?.title, sv(m.since), sv(m.ended_at), m.notes]),
    )

  return (
    <section>
      <div className="admin__bar">
        <p className="admin__hint">Här ser du vem som sitter var, vilka som står i kö och kan ta bort någon som sagt upp sig.</p>
        <button type="button" className="btn btn--ghost" onClick={exportCsv} disabled={!members.length}>
          Ladda ner medlemmar
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

      <div className="crm__spaces">
        {spaces.map((s) => {
          const act = activeMembers(members, s.id)
          const queue = queueOf(leads, s.id)
          const free = s.capacity - act.length
          return (
            <article key={s.id} className="crm__space">
              <header className="crm__spacehead">
                <div>
                  <h2 className="crm__h">{s.title}</h2>
                  <StatusLabel status={statusOf(s.capacity, act.length)} />
                </div>
                <div className="crm__cap">
                  <strong>
                    {act.length} / {s.capacity}
                  </strong>
                  <label>
                    Antal platser
                    <input type="number" min="0" defaultValue={s.capacity} key={s.capacity} onBlur={(e) => setCapacity(s, e.target.value)} />
                  </label>
                </div>
              </header>

              <h3 className="crm__sub">Sitter här nu</h3>
              {act.length === 0 ? (
                <p className="crm__none">Ingen ännu.</p>
              ) : (
                <ul className="crm__rows">
                  {act.map((m) => (
                    <li key={m.id}>
                      <div className="admin__info">
                        <strong>{m.name}</strong>
                        <span>
                          {m.company && `${m.company} · `}
                          {m.email && <a href={`mailto:${m.email}`}>{m.email}</a>}
                          {m.phone && ` · ${m.phone}`} · sedan {sv(m.since)}
                        </span>
                      </div>
                      <div className="admin__actions">
                        <button type="button" className="btn btn--ghost" disabled={busy} onClick={() => end(m, s)}>
                          Har sagt upp
                        </button>
                        <button type="button" className="btn btn--danger" onClick={() => removeMember(m)}>
                          Radera
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              {adding === s.id ? (
                <AddMember
                  space={s}
                  disabled={free <= 0}
                  onCancel={() => setAdding(null)}
                  onSaved={() => {
                    setAdding(null)
                    onChange()
                  }}
                />
              ) : (
                <button type="button" className="btn btn--ghost crm__add" onClick={() => setAdding(s.id)} disabled={free <= 0} title={free <= 0 ? 'Fullt' : undefined}>
                  + Lägg till medlem
                </button>
              )}

              <h3 className="crm__sub">
                Kö <span className="admin__badge">{queue.length}</span>
              </h3>
              {queue.length === 0 ? (
                <p className="crm__none">Ingen står i kö.</p>
              ) : (
                <ol className="crm__rows crm__queue">
                  {queue.map((l, i) => (
                    <li key={l.id}>
                      <div className="admin__info">
                        <strong>
                          {i + 1}. {l.name}
                        </strong>
                        <span>
                          <a href={`mailto:${l.email}`}>{l.email}</a> · ställde sig i kö {sv(l.created_at)}
                        </span>
                      </div>
                      <div className="admin__actions">
                        <button type="button" className="btn btn--primary" disabled={busy || free <= 0} title={free <= 0 ? 'Ingen plats ledig än' : undefined} onClick={() => give(l, s)}>
                          Ge plats
                        </button>
                        <button type="button" className="btn btn--ghost" onClick={() => unqueue(l)}>
                          Ta ur kö
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </article>
          )
        })}
      </div>
    </section>
  )
}

function AddMember({ space, disabled, onCancel, onSaved }) {
  const [v, setV] = useState({ name: '', email: '', phone: '', company: '' })
  const [err, setErr] = useState('')
  const set = (k) => (e) => setV((x) => ({ ...x, [k]: e.target.value }))

  const save = async (e) => {
    e.preventDefault()
    if (!v.name.trim()) return setErr('Skriv ett namn.')
    if (disabled) return setErr('Fullt.')
    const { error } = await supabase.from('members').insert({ ...v, name: v.name.trim(), space_type: space.id })
    if (error) return setErr(error.message)
    await log(`${v.name.trim()} lades till: ${space.title}`)
    onSaved()
  }

  return (
    <form className="crm__addform" onSubmit={save} noValidate>
      <input placeholder="Namn *" value={v.name} onChange={set('name')} />
      <input placeholder="Företag" value={v.company} onChange={set('company')} />
      <input type="email" placeholder="E-post" value={v.email} onChange={set('email')} />
      <input type="tel" placeholder="Telefon" value={v.phone} onChange={set('phone')} />
      {err && <p className="field__error">{err}</p>}
      <div className="admin__actions">
        <button type="submit" className="btn btn--primary">
          Spara
        </button>
        <button type="button" className="btn btn--ghost" onClick={onCancel}>
          Avbryt
        </button>
      </div>
    </form>
  )
}
