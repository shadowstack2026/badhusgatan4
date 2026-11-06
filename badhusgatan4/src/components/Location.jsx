import { location } from '../data/content'
import Reveal from './Reveal'

export default function Location() {
  const q = encodeURIComponent(location.mapQuery)
  return (
    <section className="section section--dark place" id="hitta-hit">
      <div className="container">
        <Reveal>
          <h2 className="h2">{location.title}</h2>
        </Reveal>
        <Reveal delay={80} className="place__panel">
          <div className="place__info">
            <dl className="place__rows">
              <div>
                <dt>{location.label}</dt>
                <dd className="place__address">{location.address}</dd>
              </div>
            </dl>
            <ul className="place__facts">
              {location.facts.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
            <a
              className="btn btn--primary place__btn"
              href={`https://www.google.com/maps/search/?api=1&query=${q}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {location.button} <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
          </div>
          <div className="place__map">
            <iframe
              title={`Karta över ${location.address}`}
              src={`https://www.google.com/maps?q=${q}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
            <span className="place__ping" aria-hidden="true" />
          </div>
        </Reveal>
      </div>
    </section>
  )
}
