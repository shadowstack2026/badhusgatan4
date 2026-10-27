import { useState } from 'react'
import { testimonials, testimonialsIntro } from '../data/content'
import Reveal from './Reveal'

const initialsOf = (name) =>
  name
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')

export default function Testimonials() {
  const [index, setIndex] = useState(0)
  const count = testimonials.length
  const go = (i) => setIndex((i + count) % count)

  return (
    <section className="section section--tint" id="kundroster">
      <div className="container">
        <Reveal className="section__head">
          <h2 className="h2">{testimonialsIntro.title}</h2>
        </Reveal>

        <Reveal className="voices">
          <div className="voices__image media">
            <img src={testimonialsIntro.image} alt="" loading="lazy" />
          </div>

          <div className="voices__main">
            <div className="voices__stack" aria-live="polite">
              {testimonials.map((t, i) => (
                <figure key={t.name} className={`quote${i === index ? ' is-active' : ''}`} aria-hidden={i !== index}>
                  <blockquote>{t.quote}</blockquote>
                  <figcaption>
                    <span className="avatar">
                      {t.image ? <img src={t.image} alt="" /> : <span>{initialsOf(t.name)}</span>}
                    </span>
                    <span>
                      <strong>{t.name}</strong>
                      <span className="quote__role">
                        {t.role}, {t.company}
                        {t.example && <span className="quote__example"> · Exempel</span>}
                      </span>
                    </span>
                  </figcaption>
                </figure>
              ))}
            </div>

            <div className="voices__controls">
              <div className="arrows arrows--small">
                <button type="button" onClick={() => go(index - 1)} aria-label="Föregående citat">←</button>
                <button type="button" onClick={() => go(index + 1)} aria-label="Nästa citat">→</button>
              </div>
              <div className="dots">
                {testimonials.map((t, i) => (
                  <button
                    key={t.name}
                    type="button"
                    className={i === index ? 'is-active' : ''}
                    aria-label={`Visa citat ${i + 1}`}
                    aria-current={i === index}
                    onClick={() => go(i)}
                  />
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
