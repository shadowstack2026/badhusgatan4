import { Link } from 'react-router-dom'
import { communityIntro } from '../data/content'
import Reveal from './Reveal'

export default function Community() {
  return (
    <section className="section section--dark community" id="community">
      <div className="container">
        <Reveal className="community__head">
          <h2 className="h2">{communityIntro.title}</h2>
          <p className="lead">{communityIntro.text}</p>
          <Link to="/kom-igang" className="btn btn--primary community__cta">
            Hör av dig <span className="btn__arrow" aria-hidden="true">→</span>
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
