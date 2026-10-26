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
            <a href="#/kom-igang?typ=prova-dag" className="btn btn--primary">
              Boka ett gratis dagspass <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
            <a href="#/kom-igang?typ=vantelista" className="btn btn--ghost">
              Ställ mig i kö <span className="btn__arrow" aria-hidden="true">→</span>
            </a>
          </div>
          <p className="next__contact mono">
            {site.email} · {site.phone}
          </p>
        </Reveal>
      </div>
    </section>
  )
}
