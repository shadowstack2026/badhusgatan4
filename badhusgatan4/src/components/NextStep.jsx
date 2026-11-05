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
            <Link to="/kom-igang?typ=besok" className="btn btn--primary">
              {nextStep.primaryCta} <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
            <Link to="/kom-igang?typ=fast-plats" className="btn btn--ghost">
              {nextStep.secondaryCta} <span className="btn__arrow" aria-hidden="true">→</span>
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
