import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useEvents } from '../lib/EventsContext'
import { isFull, longDate, timeRange } from '../lib/events'
import NotFound from './NotFound'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

// Eget anmälningsformulär för event. Anmälan sparas i databasen (Supabase)
// och syns i adminpanelen – inget mejl skickas.
export default function EventSignup() {
  const { slug } = useParams()
  const { find, loading, reload } = useEvents()
  const ev = find(slug)

  const [v, setV] = useState({ name: '', email: '', phone: '', message: '', consent: false, hp: '' })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [failed, setFailed] = useState('')
  const [done, setDone] = useState(null) // 'anmalan' | 'vantelista'

  if (loading) return <main className="request" />
  if (!ev) return <NotFound />

  const full = isFull(ev)
  const set = (k, val) => {
    setV((p) => ({ ...p, [k]: val }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: undefined }))
  }

  const onSubmit = async (e) => {
    e.preventDefault()
    if (sending) return
    const found = {}
    if (!v.name.trim()) found.name = 'Skriv ditt namn så vet vi vem som kommer.'
    if (!v.email.trim()) found.email = 'Vi behöver din e-postadress för att kunna bekräfta din plats.'
    else if (!EMAIL_RE.test(v.email.trim())) found.email = 'E-postadressen ser inte riktig ut – kolla att den är rätt skriven.'
    if (!v.consent) found.consent = 'Du behöver godkänna detta för att vi ska kunna ta emot din anmälan.'
    setErrors(found)
    if (Object.keys(found).length) {
      document.querySelector('[data-error="true"]')?.focus()
      return
    }
    if (v.hp) {
      setDone('anmalan') // bot – låtsas att det gick bra
      return
    }

    setSending(true)
    setFailed('')
    const { data, error } = await supabase.rpc('register_for_event', {
      p_event: ev.id,
      p_name: v.name,
      p_email: v.email,
      p_phone: v.phone,
      p_message: v.message,
    })
    setSending(false)
    if (error) {
      console.error('Anmälan misslyckades', error)
      const m = error.message || ''
      setFailed(
        m.includes('duplicate')
          ? 'Den här e-postadressen är redan anmäld till eventet.'
          : m.includes('event_past')
            ? 'Det här eventet har redan ägt rum.'
            : 'Något gick fel när anmälan skulle skickas. Dina uppgifter finns kvar – försök igen om en stund.',
      )
      return
    }
    setDone(data)
    reload()
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  if (done) {
    const wait = done === 'vantelista'
    return (
      <main className="request">
        <div className="container request__inner request__thanks">
          <h1 className="h2">Tack, {v.name.trim().split(/\s+/)[0]}!</h1>
          <p className="lead">
            {wait
              ? `Det blev fullt, så du står nu på väntelistan till ${ev.title}. Vi hör av oss om en plats blir ledig.`
              : `Din anmälan till ${ev.title} är skickad. Vi bekräftar din plats via mejl.`}
          </p>
          <p className="request__notice">Din plats är inte bekräftad förrän vi har återkommit till dig.</p>
          <Link to="/event" className="btn btn--primary">
            Till alla event <span className="btn__arrow" aria-hidden="true">→</span>
          </Link>
        </div>
      </main>
    )
  }

  const field = (name, label, props = {}, optional = false) => (
    <div className={`field${errors[name] ? ' field--error' : ''}`}>
      <label htmlFor={name}>
        {label}
        {optional && <span className="field__opt"> valfritt</span>}
      </label>
      {props.as === 'textarea' ? (
        <textarea id={name} rows={4} value={v[name]} onChange={(e) => set(name, e.target.value)} />
      ) : (
        <input
          id={name}
          type={props.type ?? 'text'}
          autoComplete={props.autoComplete}
          value={v[name]}
          onChange={(e) => set(name, e.target.value)}
          aria-invalid={!!errors[name]}
          data-error={!!errors[name]}
        />
      )}
      {errors[name] && <p className="field__error">{errors[name]}</p>}
    </div>
  )

  return (
    <main className="request">
      <div className="container request__inner">
        <Link to={`/event/${ev.slug}`} className="request__back">← {ev.title}</Link>
        <h1 className="h2">{full ? 'Ställ dig på väntelistan' : 'Anmäl dig'}</h1>

        <div className="evbox">
          {ev.image && <img src={ev.image} alt="" />}
          <div>
            <strong>{ev.title}</strong>
            <span>
              {longDate(ev.date)}
              {timeRange(ev) && ` · ${timeRange(ev)}`}
            </span>
          </div>
        </div>

        {full && (
          <div className="notice" role="status" style={{ marginTop: 32 }}>
            Det är fullt just nu – ställ dig på väntelistan så hör vi av oss om en plats blir ledig.
          </div>
        )}

        <form onSubmit={onSubmit} noValidate>
          <div className="form-grid">
            {field('name', 'Namn', { autoComplete: 'name' })}
            {field('email', 'E-post', { type: 'email', autoComplete: 'email' })}
            {field('phone', 'Telefon', { type: 'tel', autoComplete: 'tel' }, true)}
          </div>
          {field('message', 'Något vi ska veta?', { as: 'textarea' }, true)}

          <div className="hp" aria-hidden="true">
            <label htmlFor="hp">Webbplats</label>
            <input id="hp" type="text" tabIndex={-1} autoComplete="off" value={v.hp} onChange={(e) => set('hp', e.target.value)} />
          </div>

          <div className={`consent${errors.consent ? ' field--error' : ''}`}>
            <label>
              <input
                type="checkbox"
                checked={v.consent}
                onChange={(e) => set('consent', e.target.checked)}
                data-error={!!errors.consent}
              />
              <span>Jag godkänner att mina uppgifter används för min anmälan till eventet.</span>
            </label>
            {errors.consent && <p className="field__error">{errors.consent}</p>}
          </div>

          {failed && (
            <div className="notice notice--error" role="alert">
              {failed}
            </div>
          )}

          <div className="form-foot">
            <p className="form-foot__note">Din plats är inte bekräftad förrän vi har återkommit till dig.</p>
            <button type="submit" className="btn btn--primary" disabled={sending}>
              {sending ? (
                'Skickar …'
              ) : (
                <>
                  {full ? 'Ställ mig på väntelistan' : 'Skicka anmälan'}
                  <span className="btn__arrow" aria-hidden="true">→</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
