import { useEffect, useState } from 'react'
import { requestTexts, requestTypes, workspaces } from '../data/content'
import StatusLabel from './StatusLabel'

const STORAGE_KEY = 'badhub-forfragningar'
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/

const statusFor = (type) =>
  type?.platsId ? workspaces.find((w) => w.id === type.platsId)?.status : undefined

// "?typ=vantelista" förvälter första platstypen som är full just nu.
function initialType(preselect) {
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
  if (!v.meddelande.trim()) e.meddelande = 'Skriv gärna ett par rader så vi kan förbereda oss.'
  return e
}

export default function RequestPage({ preselect }) {
  const [values, setValues] = useState({
    typ: initialType(preselect),
    namn: '',
    epost: '',
    telefon: '',
    foretag: '',
    arbete: '',
    startdatum: '',
    meddelande: '',
  })
  const [errors, setErrors] = useState({})
  const [sent, setSent] = useState(null)

  useEffect(() => window.scrollTo(0, 0), [sent])

  const selected = requestTypes.find((t) => t.id === values.typ)
  const isWaitlist = statusFor(selected) === 'fullt'

  const set = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }))
  }

  const onSubmit = (ev) => {
    ev.preventDefault()
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      document.querySelector('[data-error="true"]')?.focus()
      return
    }

    const record = {
      typ: values.typ, // t.ex. "eget-rum" – används för att se efterfrågan per platstyp
      art: isWaitlist ? 'vantelista' : 'forfragan',
      ...values,
      skickad: new Date().toISOString(),
    }

    // TODO: Koppla in en formulärtjänst här (t.ex. Formspree, Netlify Forms eller
    // en egen backend) och skicka "record" dit. Just nu sparas allt bara lokalt.
    console.log('Ny förfrågan', record)
    try {
      const all = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')
      localStorage.setItem(STORAGE_KEY, JSON.stringify([...all, record]))
    } catch {
      /* localStorage kan vara avstängt – då räcker console.log tills vidare */
    }
    setSent({ waitlist: isWaitlist })
  }

  if (sent) {
    return (
      <main className="request">
        <div className="container request__inner request__thanks">
          <p className="eyebrow">
            <span className="mono">{sent.waitlist ? 'Väntelista' : 'Förfrågan'}</span>
          </p>
          <h1 className="h2">{requestTexts.thanksTitle}</h1>
          <p className="lead">{requestTexts.disclaimer}</p>
          <a href="#/" className="btn btn--ghost">
            <span className="btn__arrow btn__arrow--back" aria-hidden="true">←</span> Tillbaka till startsidan
          </a>
        </div>
      </main>
    )
  }

  const field = (name, label, props = {}, optional = false) => (
    <div className={`field${errors[name] ? ' field--error' : ''}`}>
      <label htmlFor={name}>
        {label}
        {optional && <span className="field__opt mono"> valfritt</span>}
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
        <a href="#/" className="request__back mono">
          ← Startsidan
        </a>
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
          {field('meddelande', 'Meddelande', { as: 'textarea' })}

          <div className="form-foot">
            <p className="form-foot__note">{requestTexts.disclaimer}</p>
            <button type="submit" className="btn btn--primary">
              {isWaitlist ? 'Ställ mig på väntelistan' : 'Skicka förfrågan'}
              <span className="btn__arrow" aria-hidden="true">→</span>
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
