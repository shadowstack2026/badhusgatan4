import { useState } from 'react'
import emailjs from '@emailjs/browser'
import { contact } from '../data/content'
import { CONTACT_EMAIL, SHOW_AVAILABILITY } from '../config'
import { sendRequestReceipt } from '../lib/mail'
import { supabase } from '../lib/supabase'
import Reveal from './Reveal'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const env = import.meta.env

function validate(v) {
  const e = {}
  if (!v.namn.trim()) e.namn = 'Skriv ditt namn så vet vi vem vi pratar med.'
  if (!v.epost.trim()) e.epost = 'Vi behöver din e-postadress för att kunna svara.'
  else if (!EMAIL_RE.test(v.epost.trim())) e.epost = 'E-postadressen ser inte riktig ut. Kolla att den är rätt skriven.'
  if (!v.meddelande.trim()) e.meddelande = 'Skriv några rader så vet vi vad du vill prata om.'
  return e
}

// ---------------------------------------------------------------------------
//  SKICKA: det här är den enda funktionen som pratar med en tjänst.
//  Nu används samma EmailJS + Supabase (CRM) som formuläret på /kontakt.
//  Vill du byta till Formspree/Web3Forms: ersätt innehållet här med en fetch().
//  Kasta ett fel om det misslyckas.
// ---------------------------------------------------------------------------
async function send(v) {
  const name = v.namn.trim()
  const email = v.epost.trim()
  const company = v.foretag.trim()
  const message = v.meddelande.trim()

  let saved = false
  try {
    const { error } = await supabase.rpc('submit_lead', {
      p_space: '',
      p_kind: 'intresse',
      p_name: name,
      p_email: email,
      p_phone: '',
      p_company: company,
      p_work: '',
      p_start: '',
      p_message: message,
    })
    if (error) throw error
    saved = true
  } catch (err) {
    console.error('Meddelandet kunde inte sparas i CRM:et', err)
  }

  try {
    await emailjs.send(
      env.VITE_EMAILJS_SERVICE_ID,
      env.VITE_EMAILJS_TEMPLATE_OWNER,
      {
        from_name: name,
        from_email: email,
        phone: '–',
        company: company || '–',
        request_type: 'Meddelande från startsidan',
        start_date: '–',
        message,
        submitted_at: new Date().toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' }),
      },
      { publicKey: env.VITE_EMAILJS_PUBLIC_KEY },
    )
    // Bekräftelsen till besökaren är sekundär.
    sendRequestReceipt({ to_email: email, to_name: name, requestType: 'Meddelande från startsidan' }).catch((err) =>
      console.error('Bekräftelsemejlet kunde inte skickas', err),
    )
  } catch (err) {
    console.error('Meddelandet kunde inte mejlas', err)
    if (!saved) throw err
  }
}

export default function Contact() {
  const [values, setValues] = useState({ namn: '', epost: '', foretag: '', meddelande: '', webbplats: '' })
  const [errors, setErrors] = useState({})
  const [state, setState] = useState('idle') // idle | sending | sent | failed

  const set = (name, value) => {
    setValues((v) => ({ ...v, [name]: value }))
    if (errors[name]) setErrors((e) => ({ ...e, [name]: undefined }))
  }

  const onSubmit = async (ev) => {
    ev.preventDefault()
    if (state === 'sending') return
    const found = validate(values)
    setErrors(found)
    if (Object.keys(found).length) {
      document.querySelector('#kontakt [data-error="true"]')?.focus()
      return
    }
    if (values.webbplats) {
      // Honeypot ifylld: det är en bot. Låtsas att allt gick bra.
      setState('sent')
      return
    }
    setState('sending')
    try {
      await send(values)
      setState('sent')
    } catch {
      setState('failed')
    }
  }

  const mailto = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('Hej Badhusgatan 4')}&body=${encodeURIComponent(values.meddelande)}`

  const field = (name, label, props = {}) => (
    <div className={`field${errors[name] ? ' field--error' : ''}`}>
      <label htmlFor={`c-${name}`}>
        {label}
        {props.optional && <span className="field__opt"> valfritt</span>}
      </label>
      {props.as === 'textarea' ? (
        <textarea
          id={`c-${name}`}
          rows={5}
          value={values[name]}
          onChange={(e) => set(name, e.target.value)}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `c-${name}-err` : undefined}
          data-error={!!errors[name]}
        />
      ) : (
        <input
          id={`c-${name}`}
          type={props.type ?? 'text'}
          autoComplete={props.autoComplete}
          value={values[name]}
          onChange={(e) => set(name, e.target.value)}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `c-${name}-err` : undefined}
          data-error={!!errors[name]}
        />
      )}
      {errors[name] && (
        <p className="field__error" id={`c-${name}-err`}>
          {errors[name]}
        </p>
      )}
    </div>
  )

  return (
    <section className="section section--light contact" id="kontakt">
      <div className="container contact__grid">
        <Reveal className="contact__visual">
          <img src={contact.image} alt={contact.imageAlt} width="1200" height="896" loading="lazy" />
          <div className="contact__caption">
            <h2 className="h2">{SHOW_AVAILABILITY ? contact.titleOpen : contact.title}</h2>
            <p>{contact.text}</p>
          </div>
        </Reveal>

        <Reveal delay={80} className="contact__form">
          {state === 'sent' ? (
            <div className="contact__done" role="status">
              <h3>{contact.success}</h3>
              <p>{contact.successText}</p>
            </div>
          ) : (
            <form onSubmit={onSubmit} noValidate>
              <div className="contact__row">
                {field('namn', 'Namn', { autoComplete: 'name' })}
                {field('epost', 'E-post', { type: 'email', autoComplete: 'email' })}
              </div>
              {field('foretag', 'Företag', { autoComplete: 'organization', optional: true })}
              {field('meddelande', contact.messageLabel, { as: 'textarea' })}

              {/* Honeypot: dolt för människor, botar fyller i det */}
              <div className="hp" aria-hidden="true">
                <label htmlFor="c-webbplats">Webbplats</label>
                <input
                  id="c-webbplats"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={values.webbplats}
                  onChange={(e) => set('webbplats', e.target.value)}
                />
              </div>

              {state === 'failed' && (
                <div className="notice notice--error" role="alert">
                  {contact.error} <a href={mailto}>Mejla oss direkt</a>
                </div>
              )}

              <button type="submit" className="btn btn--primary contact__submit" disabled={state === 'sending'}>
                {state === 'sending' ? (
                  'Skickar …'
                ) : (
                  <>
                    {contact.submit} <span className="btn__arrow" aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </form>
          )}
          <p className="contact__direct">
            {contact.directLabel} <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
