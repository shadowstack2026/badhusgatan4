import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CATEGORIES, longDate, spotStatus, timeRange } from '../lib/events'
import { useEvents } from '../lib/EventsContext'
import EventCard from '../components/EventCard'
import Reveal from '../components/Reveal'
import StatusLabel from '../components/StatusLabel'

export default function Events() {
  const [filter, setFilter] = useState('Alla')
  const { upcoming, past } = useEvents()
  const featured = upcoming[0]
  const rest = upcoming.slice(1).filter((e) => filter === 'Alla' || e.category === filter)
  const featuredHidden = featured && filter !== 'Alla' && featured.category !== filter
  const fst = featured && spotStatus(featured)

  return (
    <main>
      <section className="section section--dark aboutus__hero events__hero">
        <div className="container">
          <h1 className="aboutus__title">Händer hos oss</h1>
          <p className="lead">Frukostar, kodkvällar och kunskapsluncher. Öppet för medlemmar och nyfikna.</p>
        </div>
      </section>

      <section className="section section--light events__main">
        <div className="container">
          <div className="filters" role="group" aria-label="Filtrera event">
            {['Alla', ...CATEGORIES].map((c) => (
              <button
                key={c}
                type="button"
                className={`filter${filter === c ? ' is-active' : ''}`}
                aria-pressed={filter === c}
                onClick={() => setFilter(c)}
              >
                {c}
              </button>
            ))}
          </div>

          {featured && !featuredHidden && (
            <Reveal as="article" className="efeature">
              <div className="media efeature__media">
                <img src={featured.image} alt="" />
              </div>
              <div className="efeature__body">
                <span className="pill">Nästa event</span>
                <p className="efeature__date">{longDate(featured.date)}</p>
                <h2 className="h2">{featured.title}</h2>
                <p className="lead">{featured.summary}</p>
                <p className="ecard__meta">
                  {[timeRange(featured), featured.location].filter(Boolean).join(' · ')}
                </p>
                <div className="efeature__foot">
                  <StatusLabel status={fst.status} label={fst.label} className="status--small" />
                  <Link to={`/event/${featured.slug}`} className="btn btn--primary">
                    Läs mer <span className="btn__arrow" aria-hidden="true">→</span>
                  </Link>
                </div>
              </div>
            </Reveal>
          )}

          <h2 className="events__sub">Kommande event</h2>
          {rest.length ? (
            <div className="egrid" key={filter}>
              {rest.map((e, i) => (
                <EventCard key={e.slug} event={e} delay={i * 90} />
              ))}
            </div>
          ) : (
            <p className="events__empty">
              {featuredHidden || upcoming.length === 0
                ? 'Inga kommande event i den här kategorin just nu.'
                : 'Inga fler kommande event just nu.'}
            </p>
          )}
        </div>
      </section>

      {past.length > 0 && (
        <section className="section section--tint events__past">
          <div className="container">
            <h2 className="events__sub">Tidigare event</h2>
            <ul className="past">
              {past.map((e) => (
                <li key={e.slug}>
                  <span>{longDate(e.date)}</span>
                  <span>{e.title}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </main>
  )
}
