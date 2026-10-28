import { useState } from 'react'
import { Link, useLocation, useSearchParams } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import { requestTexts, requestTypes, site, workspaces } from '../data/content'
import { sendRequestReceipt } from '../lib/mail'
import StatusLabel from './StatusLabel'

const STORAGE_KEY = 'badhub-forfragningar'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const env = import.meta.env
const mailto = `mailto:${site.email}`

const statusFor = (type) =>
  type?.platsId ? workspaces.find((w) => w.id === type.platsId)?.status : undefined

// "?typ=dagspass" och "?typ=vantelista" kommer från knapparna på sidan.
// "vantelista" förvälter första platstypen som är full just nu.
function initialType(preselect) {
  if (preselect === 'dagspass') return 'prova-dag'
  if (preselect === 'vantelista') {
    return requestTypes.find((t) => statusFor(t) === 'fullt')?.id ?? ''
  }
  return requestTypes.some((t) => t.id === preselect) ? preselect : ''
}

function validate(v) {
  const e = {}
  if (!v.typ) e.typ = 'Välj vad du vill göra så vet vi vad vi ska återkomma om.'
  if (!v.namn.trim()) e.namn = 'Skriv ditt namn så vet vi vem vi pratar med.'
  if (!v.epost.trim()) e.epost = 'Vi behöver din e-postadress för att kunna svara.'
  else if (!EMAIL_RE.test(v.epost.trim())) e.epost = 'E-postadressen ser inte riktig ut – kolla att den är rätt skriven.'
  if (v.typ === 'besok' && !v.meddelande.trim()) e.meddelande = 'Skriv gärna ett par rader om vad du vill se, så vi kan förbereda besöket.'
  if (!v.samtycke) e.samtycke = 'Du behöver godkänna detta för att vi ska kunna svara på din förfrågan.'
  return e
}

export default function RequestPage() {
  const [params] = useSearchParams()
  const { search } = useLocation()
  // key: byter man ?typ= medan sidan är öppen startar formuläret om med rätt förval.
  return <RequestForm key={search} preselect={params.get('typ')} />
}

function RequestForm({ preselect }) {
  const [values, setValues] = useState({
    typ: initialType(preselect),
    namn: '',
    epost: '',
    telefon: '',
    foretag: '',
    arbete: '',
    startdatum: '',
    meddelande: '',
    samtycke: false,
    webbplats: '', // honeypot – ska alltid vara tomt
  })
  const [errors, setErrors] = useState({})
  const [sending, setSending] = useState(false)
  const [sendFailed, setSendFailed] = useState(false)
  const [sent, setSent] = useState(null)

  const selected = requestTypes.find((t) => t.id === values.typ)
  const isWaitlist = statusFor(selected) === 'fullt'

  const set = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }))
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if (sending) return
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      document.querySelector('[data-error="true"]')?.focus()
      return
    }

    const first = values.namn.trim().split(/\s+/)[0]
    const email = values.epost.trim()

    // Botar fyller i det dolda fältet – låtsas att allt gick bra utan att skicka något.
    if (values.webbplats) {
      setSent({ first, email, confirmed: true })
      return
    }

    const requestType = isWaitlist ? `Väntelista – ${selected.title}` : selected.title
    const message = [values.meddelande.trim(), values.arbete.trim() && `Jobbar med: ${values.arbete.trim()}`]
      .filter(Boolean)
      .join('\n\n')
    const submittedAt = new Date().toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' })
    const templateParams = {
      from_name: values.namn.trim(),
      from_email: email,
      phone: values.telefon.trim() || '–',
      company: values.foretag.trim() || '–',
      request_type: requestType,
      start_date: values.startdatum || '–',
      message: message || '–',
      submitted_at: submittedAt,
    }

    setSending(true)
    setSendFailed(false)
    let confirmed = true
    try {
      const options = { publicKey: env.VITE_EMAILJS_PUBLIC_KEY }
      await emailjs.send(env.VITE_EMAILJS_SERVICE_ID, env.VITE_EMAILJS_TEMPLATE_OWNER, templateParams, options)
      // Bekräftelsen till besökaren är sekundär: misslyckas den har ägaren ändå fått förfrågan.
      try {
        await sendRequestReceipt({ to_email: email, to_name: values.namn.trim(), requestType })
      } catch (err) {
        console.error('Bekräftelsemejlet kunde inte skickas', err)
        confirmed = false
      }
    } catch (err) {
      console.error('Förfrågan kunde inte skickas', err)
      setSendFailed(true)
      setSending(false)
      return
    }

    try {
      const record = {
        typ: values.typ, // används för att se efterfrågan per platstyp
        namn: values.namn,
        epost: values.epost,
        telefon: values.telefon,
        foretag: values.foretag,
        arbete: values.arbete,
        startdatum: values.startdatum,
        meddelande: values.meddelande,
        art: isWaitlist ? 'vantelista' : 'forfragan',
        skickad: new Date().toISOString(),
      }
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...all, record]))
    } catch {
      /* localStorage kan vara avstängt – förfrågan är redan skickad */
    }

    setSending(false)
    setSent({ first, email, confirmed })
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  if (sent) {
    return (
      <main className="request">
        <div className="container request__inner request__thanks">
          <h1 className="h2">Tack, {sent.first}!</h1>
          <p className="lead">
            {sent.confirmed
              ? `Vi har fått din förfrågan och skickat en bekräftelse till ${sent.email}. Vi hör av oss inom två arbetsdagar.`
              : 'Vi har fått din förfrågan. Vi hör av oss inom två arbetsdagar.'}
          </p>
          <p className="request__notice">{requestTexts.notBooking}</p>
          <Link to="/" className="btn btn--primary">
            Till startsidan <span className="btn__arrow" aria-hidden="true">→</span>
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
        <textarea
          id={name}
          rows={5}
          value={values[name]}
          onChange={(e) => set(name, e.target.value)}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${name}-err` : undefined}
          data-error={!!errors[name]}
        />
      ) : (
        <input
          id={name}
          type={props.type ?? 'text'}
          autoComplete={props.autoComplete}
          value={values[name]}
          onChange={(e) => set(name, e.target.value)}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${name}-err` : undefined}
          data-error={!!errors[name]}
        />
      )}
      {errors[name] && (
        <p className="field__error" id={`${name}-err`}>
          {errors[name]}
        </p>
      )}
    </div>
  )

  return (
    <main className="request">
      <div className="container request__inner">
        <Link to="/" className="request__back">
          ← Startsidan
        </Link>
        <h1 className="h2">{requestTexts.title}</h1>
        <p className="lead">{requestTexts.intro}</p>

        <form onSubmit={onSubmit} noValidate>
          <fieldset className="types">
            <legend>Vad vill du göra?</legend>
            <div className="types__grid">
              {requestTypes.map((t) => {
                const st = statusFor(t)
                return (
                  <label key={t.id} className={`type${values.typ === t.id ? ' is-selected' : ''}`}>
                    <input
                      type="radio"
                      name="typ"
                      value={t.id}
                      checked={values.typ === t.id}
                      onChange={() => set('typ', t.id)}
                    />
                    <span className="type__title">{t.title}</span>
                    <span className="type__text">{t.text}</span>
                    {st && <StatusLabel status={st} className="status--small" />}
                  </label>
                )
              })}
            </div>
            {errors.typ && <p className="field__error">{errors.typ}</p>}
          </fieldset>

          {isWaitlist && (
            <div className="notice" role="status">
              {requestTexts.waitlistNotice}
            </div>
          )}

          <div className="form-grid">
            {field('namn', 'Namn', { autoComplete: 'name' })}
            {field('epost', 'E-post', { type: 'email', autoComplete: 'email' })}
            {field('telefon', 'Telefon', { type: 'tel', autoComplete: 'tel' }, true)}
            {field('foretag', 'Företag', { autoComplete: 'organization' }, true)}
            {field('arbete', 'Vad jobbar du med?', {}, true)}
            {field('startdatum', 'Önskat startdatum', { type: 'date' }, true)}
          </div>
          {field('meddelande', 'Meddelande', { as: 'textarea' }, values.typ !== 'besok')}

          {/* Honeypot: dolt för människor, botar fyller i det */}
          <div className="hp" aria-hidden="true">
            <label htmlFor="webbplats">Webbplats</label>
            <input
              id="webbplats"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={values.webbplats}
              onChange={(e) => set('webbplats', e.target.value)}
            />
          </div>

          <div className={`consent${errors.samtycke ? ' field--error' : ''}`}>
            <label>
              <input
                type="checkbox"
                checked={values.samtycke}
                onChange={(e) => set('samtycke', e.target.checked)}
                aria-invalid={!!errors.samtycke}
                aria-describedby={errors.samtycke ? 'samtycke-err' : undefined}
                data-error={!!errors.samtycke}
              />
              <span>{requestTexts.consent}</span>
            </label>
            {errors.samtycke && (
              <p className="field__error" id="samtycke-err">
                {errors.samtycke}
              </p>
            )}
          </div>

          {sendFailed && (
            <div className="notice notice--error" role="alert">
              {requestTexts.sendError}{' '}
              <a href={mailto}>Mejla oss direkt</a>
            </div>
          )}

          <div className="form-foot">
            <p className="form-foot__note">{requestTexts.disclaimer}</p>
            <button type="submit" className="btn btn--primary" disabled={sending}>
              {sending ? (
                'Skickar …'
              ) : (
                <>
                  {isWaitlist ? 'Ställ mig på väntelistan' : 'Skicka förfrågan'}
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
