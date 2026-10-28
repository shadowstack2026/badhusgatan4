import emailjs from '@emailjs/browser'
import { longDate, timeRange } from './events'

const env = import.meta.env

// Allmän mall för alla mejl till besökare (VITE_EMAILJS_TEMPLATE_CONFIRM).
// Mallen tar: to_email, to_name, subject, heading, intro, details, note.
export function sendVisitorMail({ to_email, to_name, subject, heading, intro, details, note }) {
  return emailjs.send(
    env.VITE_EMAILJS_SERVICE_ID,
    env.VITE_EMAILJS_TEMPLATE_CONFIRM,
    { to_email, to_name, subject, heading, intro, details, note },
    { publicKey: env.VITE_EMAILJS_PUBLIC_KEY },
  )
}

// "torsdag 12 november, 18:00–21:00"
const whenText = (event) => {
  const day = longDate(event.date)
  const date = day.charAt(0).toLowerCase() + day.slice(1)
  const time = timeRange({ startTime: event.start_time, endTime: event.end_time })
  return time ? `${date}, ${time}` : date
}

const eventDetails = (event) => `När: ${whenText(event)} · Var: ${event.location}`
const EVENT_NOTE = 'Kan du inte komma? Svara på det här mejlet, så ger vi platsen till någon på väntelistan.'

// Bekräftelse från adminpanelen. "promoted" = personen stod på väntelistan.
export function sendEventConfirmation({ reg, event, promoted = false }) {
  const base = { to_email: reg.email, to_name: reg.name, details: eventDetails(event), note: EVENT_NOTE }
  return sendVisitorMail(
    promoted
      ? {
          ...base,
          subject: `En plats har blivit ledig: ${event.title}`,
          heading: 'Goda nyheter!',
          intro: `En plats har blivit ledig och den är din. Din anmälan till ${event.title} är nu bekräftad.`,
        }
      : {
          ...base,
          subject: `Du är bekräftad: ${event.title}`,
          heading: 'Vi ses där!',
          intro: `Din anmälan till ${event.title} är bekräftad.`,
        },
  )
}

// Tack-mejl när någon skickat formuläret på /kom-igang.
export function sendRequestReceipt({ to_email, to_name, requestType }) {
  const first = to_name.trim().split(/\s+/)[0]
  return sendVisitorMail({
    to_email,
    to_name,
    subject: `Tack för din förfrågan, ${first}!`,
    heading: `Tack, ${first}!`,
    intro: 'Vi har fått din förfrågan och hör av oss inom två arbetsdagar.',
    details: `Din förfrågan: ${requestType}`,
    note: 'Observera att detta inte är en bekräftad bokning. Vi kontaktar dig för att bekräfta.',
  })
}
