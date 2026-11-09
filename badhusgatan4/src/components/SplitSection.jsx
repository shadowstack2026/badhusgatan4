import { Link } from 'react-router-dom'
import Reveal from './Reveal'

// Bild på ena sidan, text och knapp på den andra. "reverse" lägger bilden till höger.
export default function SplitSection({ data, reverse = false, tint = false, id }) {
  return (
    <section className={`section ${tint ? 'section--tint' : 'section--light'} split`} id={id}>
      <div className={`container split__grid${reverse ? ' split--reverse' : ''}`}>
        <Reveal className="split__media">
          <img src={data.image} alt={data.alt} width="1200" height="900" loading="lazy" decoding="async" />
        </Reveal>
        <Reveal delay={80} className="split__text">
          <h2 className="split__title">{data.title}</h2>
          <p>{data.text}</p>
          <Link to={data.button.to} className="btn btn--primary">
            {data.button.label} <span className="btn__arrow" aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
