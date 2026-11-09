import { Link } from 'react-router-dom'
import { ArrowRight, CalendarDays, Coffee, MessagesSquare, Monitor, Users, Wifi } from 'lucide-react'
import { features } from '../data/features'
import { intro } from '../data/sections'
import Reveal from './Reveal'

const ICONS = { Monitor, Wifi, Users, MessagesSquare, Coffee, CalendarDays }

// Under hero: centrerad rubrik och text, sedan små kort med ikon, etikett och pil.
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
                <Link to={f.to} className="hcardlink">
                  <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                  <span>{f.label}</span>
                  <ArrowRight className="hcardlink__arrow" size={18} strokeWidth={1.75} aria-hidden="true" />
                </Link>
              </Reveal>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
