import { Link } from 'react-router-dom'
import { useEvents } from '../lib/EventsContext'
import EventCard from './EventCard'
import Reveal from './Reveal'

// "Event hos oss": kommande event som stora bildkort.
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
