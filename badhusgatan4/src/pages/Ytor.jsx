import { Link } from 'react-router-dom'
import { spacesIntro } from '../data/content'
import Reveal from '../components/Reveal'
import SpacesGrid from '../components/SpacesGrid'

export default function Ytor() {
  return (
    <main>
      <section className="section section--dark aboutus__hero">
        <div className="container">
          <h1 className="aboutus__title">{spacesIntro.title}</h1>
          <p className="lead">{spacesIntro.text}</p>
        </div>
      </section>
      <section className="section section--dark ytor__list">
        <div className="container">
          <SpacesGrid />
          <Reveal className="ytor__cta">
            <Link to="/kontakt?typ=besok" className="btn btn--primary">
              Boka ett besök <span className="btn__arrow" aria-hidden="true">→</span>
            </Link>
          </Reveal>
        </div>
      </section>
    </main>
  )
}
