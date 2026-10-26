import { about } from '../data/content'
import Reveal from './Reveal'

export default function About() {
  return (
    <section className="section section--light" id="platsen">
      <div className="container">
        <Reveal className="about__intro">
          <p className="eyebrow">
            <span className="mono">01</span> Platsen
          </p>
          <h2 className="h2">{about.title}</h2>
          <div className="about__copy">
            {about.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
        </Reveal>

        <ul className="features">
          {about.features.map((f, i) => (
            <Reveal as="li" key={f.title} delay={i * 90} className="feature">
              <div className="media">
                <img src={f.image} alt="" loading="lazy" />
              </div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
