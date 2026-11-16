import { Link } from 'react-router-dom'
import { isOnline, slashDate } from '../lib/events'
import Reveal from './Reveal'

// Eventkort: stor bild i blå duoton med datum (18/11) och en liten etikett, text under.
export default function EventCard({ event: e, delay = 0 }) {
  return (
    <Reveal as="article" delay={delay} className="evc">
      <Link to={`/event/${e.slug}`} className="evc__link">
        <span className="evc__media">
          {e.image && <img src={e.image} alt="" width="800" height="500" loading="lazy" decoding="async" />}
          <span className="evc__date">{slashDate(e.date)}</span>
          <span className="evc__tag">{isOnline(e) ? 'Online' : 'På plats'}</span>
        </span>
        <span className="evc__body">
          <span className="evc__cat">{e.category}</span>
          <span className="evc__title">{e.title}</span>
          {e.summary && <span className="evc__summary">{e.summary}</span>}
        </span>
      </Link>
    </Reveal>
  )
}
