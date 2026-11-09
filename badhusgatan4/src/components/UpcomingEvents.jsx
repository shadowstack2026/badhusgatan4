import { Link } from 'react-router-dom'
import { useEvents } from '../lib/EventsContext'
import { longDate } from '../lib/events'
import Reveal from './Reveal'

// "Event hos oss": stora bildkort med bara titel och datum.
export default function UpcomingEvents() {
  const list = useEvents().upcoming.slice(0, 3)
  if (!list.length) return null
  return (
    <section className="section section--tint upcoming" id="kommande-event">
      <div className="container">
        <Reveal className="section__head section__head--row">
          <h2 className="h2">Event hos oss</h2>
          <Link to="/event" className="link link--dark">
            Se alla event <span className="link__arrow" aria-hidden="true">→</span>
          </Link>
        </Reveal>
        <ul className="etiles">
          {list.map((e, i) => (
            <Reveal as="li" key={e.slug} delay={i * 100} className="etile">
              <Link to={`/event/${e.slug}`} className="etile__link">
                {e.image && <img src={e.image} alt="" width="800" height="1000" loading="lazy" />}
                <span className="etile__body">
                  <span className="etile__date">{longDate(e.date)}</span>
                  <span className="etile__title">{e.title}</span>
                  <span className="etile__more">
                    Läs mer <span aria-hidden="true">→</span>
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
