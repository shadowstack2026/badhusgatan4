import { Link } from 'react-router-dom'
import { useEvents } from '../lib/EventsContext'
import EventCard from './EventCard'
import Reveal from './Reveal'

export default function UpcomingEvents() {
  const list = useEvents().upcoming.slice(0, 3)
  if (!list.length) return null
  return (
    <section className="section section--tint upcoming" id="kommande-event">
      <div className="container">
        <Reveal className="section__head section__head--row">
          <h2 className="h2">Kommande event</h2>
          <Link to="/event" className="link link--dark">
            Se alla event <span className="link__arrow" aria-hidden="true">→</span>
          </Link>
        </Reveal>
        <div className="egrid">
          {list.map((e, i) => (
            <EventCard key={e.slug} event={e} delay={i * 100} />
          ))}
        </div>
      </div>
    </section>
  )
}
