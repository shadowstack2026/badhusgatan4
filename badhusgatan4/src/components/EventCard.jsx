import { Link } from 'react-router-dom'
import { dayNumber, longDate, monthShort, spotStatus, timeRange } from '../lib/events'
import Reveal from './Reveal'
import StatusLabel from './StatusLabel'

export default function EventCard({ event: e, delay = 0 }) {
  const st = spotStatus(e)
  const time = timeRange(e)
  return (
    <Reveal as="article" delay={delay} className="ecard">
      <div className="media ecard__media">
        <img src={e.image} alt="" loading="lazy" />
        <span className="ecard__date" aria-hidden="true">
          <strong>{dayNumber(e.date)}</strong>
          <span>{monthShort(e.date)}</span>
        </span>
      </div>
      <div className="ecard__body">
        <span className="pill">{e.category}</span>
        <h3>
          <Link to={`/event/${e.slug}`} className="ecard__link">
            <span className="ecard__title">{e.title}</span>
          </Link>
        </h3>
        <p className="ecard__summary">{e.summary}</p>
        <p className="ecard__meta">
          {longDate(e.date)}
          {time && ` · ${time}`}
          <br />
          {e.location}
        </p>
        <StatusLabel status={st.status} label={st.label} className="status--small ecard__status" />
      </div>
    </Reveal>
  )
}
