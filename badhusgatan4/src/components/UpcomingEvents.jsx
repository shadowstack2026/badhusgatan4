import { Link } from 'react-router-dom'
import { Coffee, Lightbulb, Users } from 'lucide-react'
import { useEvents } from '../lib/EventsContext'
import { eventFormats } from '../data/sections'
import EventCard from './EventCard'
import Reveal from './Reveal'

const ICONS = { Users, Coffee, Lightbulb }

// "Event hos oss": tre rutor om vad vi brukar göra, sedan kommande event som stora bildkort.
export default function UpcomingEvents() {
  const list = useEvents().upcoming.slice(0, 3)
  return (
    <section className="section section--tint upcoming" id="kommande-event">
      <div className="container">
        <Reveal className="section__head section__head--row">
          <h2 className="h2">Event hos oss</h2>
          <Link to="/event" className="link link--dark">
            Se alla event <span className="link__arrow" aria-hidden="true">→</span>
          </Link>
        </Reveal>

        <ul className="formats">
          {eventFormats.map((f, i) => {
            const Icon = ICONS[f.icon]
            return (
              <Reveal as="li" key={f.title} delay={i * 80} className="format">
                <span className="hc__ico">
                  <Icon size={22} strokeWidth={1.5} aria-hidden="true" />
                </span>
                <h3>{f.title}</h3>
                <p>{f.text}</p>
              </Reveal>
            )
          })}
        </ul>

        {list.length > 0 && (
          <div className="egrid evgrid">
            {list.map((e, i) => (
              <EventCard key={e.slug} event={e} delay={i * 100} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
