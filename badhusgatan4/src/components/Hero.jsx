import { Link } from 'react-router-dom'
import heroImage from '../assets/workingspace.png'
import { hero } from '../data/content'
import HeroLogos from './HeroLogos'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <img className="hero__bg" src={heroImage} alt="" fetchPriority="high" />
      <div className="hero__shade" />
      <div className="container hero__content">
        <h1 className="hero__title">{hero.title}</h1>
        <p className="hero__text">{hero.text}</p>
        <div className="hero__actions">
          <Link to="/kom-igang?typ=prova-dag" className="btn btn--primary">
            {hero.primaryCta} <span className="btn__arrow" aria-hidden="true">→</span>
          </Link>
          <Link to={{ pathname: '/', hash: '#arbetsplatser' }} className="btn btn--outline-light">
            {hero.secondaryCta}
          </Link>
        </div>
      </div>
      <HeroLogos />
    </section>
  )
}
