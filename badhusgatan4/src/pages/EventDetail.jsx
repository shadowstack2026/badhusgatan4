import { Link, useParams } from 'react-router-dom'
import { downloadIcs, isFull, longDate, signupLink, spotStatus, timeRange } from '../lib/events'
import { useEvents } from '../lib/EventsContext'
import EventCard from '../components/EventCard'
import Reveal from '../components/Reveal'
import StatusLabel from '../components/StatusLabel'
import NotFound from './NotFound'

const initials = (name) =>
  name
    .split(/\s+/)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

export default function EventDetail() {
  const { slug } = useParams()
  const { find, upcoming, loading } = useEvents()
  const e = find(slug)
  if (loading) return <main className="request" />
  if (!e) return <NotFound />

  const st = spotStatus(e)
  const full = isFull(e)
  const time = timeRange(e)
  const past = !upcoming.some((u) => u.slug === e.slug)
  const more = upcoming.filter((u) => u.slug !== e.slug).slice(0, 3)

  return (
    <main>
      <section className="edetail__hero">
        <img className="edetail__bg" src={e.image} alt="" fetchPriority="high" />
        <div className="edetail__shade" />
        <div className="container edetail__content">
          <Link to="/event" className="edetail__back">← Alla event</Link>
          <span className="pill pill--light">{e.category}</span>
          <h1 className="aboutus__title">{e.title}</h1>
          <p className="edetail__when">
            {longDate(e.date)}
            {time && ` · ${time}`}
          </p>
        </div>
      </section>

      <section className="section section--light edetail__main">
        <div className="container edetail__grid">
          <div className="edetail__text">
            <Reveal className="about__copy edetail__desc">
              {e.description.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </Reveal>

            {e.agenda.length > 0 && (
              <Reveal>
                <h2 className="edetail__h">Program</h2>
                <ol className="timeline">
                  {e.agenda.map((a) => (
                    <li key={a.time + a.text}>
                      <span className="timeline__time">{a.time}</span>
                      <span>{a.text}</span>
                    </li>
                  ))}
                </ol>
              </Reveal>
            )}

            {e.forWhom && (
              <Reveal>
                <h2 className="edetail__h">För vem</h2>
                <p className="edetail__who">{e.forWhom}</p>
              </Reveal>
            )}

            <Reveal>
              <h2 className="edetail__h">Värd</h2>
              <div className="person">
                <span className="avatar person__avatar" aria-hidden="true">{initials(e.host.name)}</span>
                <div>
                  <h3>{e.host.name}</h3>
                  <p>{e.host.role}</p>
                </div>
              </div>
            </Reveal>
          </div>

          <aside className="infocard">
            <dl>
              <div><dt>Datum</dt><dd>{longDate(e.date)}</dd></div>
              {time && <div><dt>Tid</dt><dd>{time}</dd></div>}
              <div><dt>Plats</dt><dd>{e.location}</dd></div>
              <div><dt>Pris</dt><dd>{e.price}</dd></div>
            </dl>
            {past ? (
              <p className="infocard__past">Det här eventet har redan ägt rum.</p>
            ) : (
              <>
                <StatusLabel status={st.status} label={st.label} className="status--small" />
                <Link to={signupLink(e)} className="btn btn--primary">
                  {full ? 'Ställ dig på väntelistan' : 'Anmäl dig'}
                  <span className="btn__arrow" aria-hidden="true">→</span>
                </Link>
                <button type="button" className="infocard__cal" onClick={() => downloadIcs(e)}>
                  Lägg till i kalender
                </button>
              </>
            )}
          </aside>
        </div>
      </section>

      {more.length > 0 && (
        <section className="section section--tint upcoming">
          <div className="container">
            <Reveal className="section__head">
              <h2 className="h2">Fler event</h2>
            </Reveal>
            <div className="egrid">
              {more.map((m, i) => (
                <EventCard key={m.slug} event={m} delay={i * 100} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  )
}
