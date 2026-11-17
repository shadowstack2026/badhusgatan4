import { CalendarDays, Coffee, Lightbulb, MessagesSquare, Monitor, Users, Wifi } from 'lucide-react'
import { features } from '../data/features'
import { intro } from '../data/sections'
import Reveal from './Reveal'

const ICONS = { Monitor, Wifi, Users, MessagesSquare, Coffee, CalendarDays, Lightbulb }

// Under hero: centrerad rubrik och text, sedan små kort med ikon och etikett (inte klickbara).
export default function Huset() {
  return (
    <section className="section section--light huset" id="huset">
      <div className="container">
        <Reveal className="huset__head">
          <h2 className="huset__title">{intro.title}</h2>
          <p className="huset__text">{intro.text}</p>
        </Reveal>

        <ul className="huset__grid">
          {features.map((f, i) => {
            const Icon = ICONS[f.icon]
            return (
              <Reveal as="li" key={f.label} delay={(i % 3) * 70}>
                <div className="hc">
                  <span className="hc__top">
                    <span className="hc__ico">
                      <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                    </span>
                  </span>
                  <span className="hc__label">{f.label}</span>
                  <span className="hc__bar" aria-hidden="true" />
                </div>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
