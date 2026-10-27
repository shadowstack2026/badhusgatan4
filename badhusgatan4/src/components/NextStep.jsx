import { Link } from 'react-router-dom'
import { nextStep, site } from '../data/content'
import Reveal from './Reveal'

export default function NextStep() {
  return (
    <section className="section section--light next" id="kontakt">
      <div className="container">
        <Reveal className="next__inner">
          <h2 className="h2">{nextStep.title}</h2>
          <p className="lead">{nextStep.text}</p>
          <div className="next__buttons">
            <Link to="/kom-igang?typ=dagspass" className="btn btn--primary">
              Boka ett gratis dagspass <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
            <Link to="/kom-igang?typ=vantelista" className="btn btn--ghost">
              Ställ mig i kö <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
          </div>
          <p className="next__contact">
            <a href={`mailto:${site.email}`}>{site.email}</a>
            <span className="next__sep" aria-hidden="true">·</span>
            <a href={`tel:${site.phone.replace(/[^\d+]/g, '')}`}>{site.phone}</a>
          </p>
        </Reveal>
      </div>
    </section>
  )
}
