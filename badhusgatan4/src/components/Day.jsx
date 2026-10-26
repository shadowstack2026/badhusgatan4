import { day } from '../data/content'
import Reveal from './Reveal'

export default function Day() {
  return (
    <section className="section section--dark" id="en-dag">
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow">
            <span className="mono">05</span> En dag hos oss
          </p>
          <h2 className="h2">{day.title}</h2>
        </Reveal>

        {/* Linjen "ritas" när listan scrollas in; raderna tonar in en och en. */}
        <Reveal as="ol" className="timeline">
          {day.items.map((it, i) => (
            <li key={it.time} className="timeline__item" style={{ '--n': i }}>
              <span className="timeline__time mono">{it.time}</span>
              <span className="timeline__dot" aria-hidden="true" />
              <div>
                <h3>{it.title}</h3>
                <p>{it.text}</p>
              </div>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
