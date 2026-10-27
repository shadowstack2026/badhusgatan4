import { Link } from 'react-router-dom'
import { aboutUs } from '../data/content'
import Reveal from '../components/Reveal'

export default function OmOss() {
  const { hero, why, values, team } = aboutUs
  return (
    <main>
      <section className="section section--dark aboutus__hero">
        <div className="container">
          <h1 className="aboutus__title">{hero.title}</h1>
          <p className="lead">{hero.text}</p>
        </div>
      </section>

      <section className="section section--light">
        <div className="container aboutus__why">
          <Reveal>
            <h2 className="h2">{why.title}</h2>
          </Reveal>
          <Reveal delay={100} className="about__copy">
            {why.paragraphs.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
        </div>
      </section>

      <section className="section section--tint aboutus__values-section">
        <div className="container">
          <ul className="aboutus__values">
            {values.map((v, i) => (
              <Reveal as="li" key={v.title} delay={i * 90} className="aboutus__value">
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--light">
        <div className="container">
          <Reveal>
            <h2 className="h2">{team.title}</h2>
          </Reveal>
          <ul className="aboutus__team">
            {team.people.map((p, i) => (
              <Reveal as="li" key={p.name} delay={i * 90} className="person">
                <img src={p.image} alt="" loading="lazy" />
                <div>
                  <h3>{p.name}</h3>
                  <p>{p.role}</p>
                </div>
              </Reveal>
            ))}
          </ul>
        </div>
      </section>

      <section className="section section--dark aboutus__cta">
        <div className="container">
          <Reveal>
            <Link to="/kom-igang?typ=dagspass" className="btn btn--primary">
              Prova en dag <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
