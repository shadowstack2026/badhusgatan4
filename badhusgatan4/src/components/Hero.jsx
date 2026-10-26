import heroImage from '../assets/workingspace.jpg'
import { generalStatus, hero } from '../data/content'
import StatusLabel from './StatusLabel'

export default function Hero() {
  return (
    <section className="hero" id="top">
      <img className="hero__bg" src={heroImage} alt="" fetchPriority="high" />
      <div className="hero__shade" />
      <div className="container hero__content">
        <h1 className="hero__title">{hero.title}</h1>
        <p className="hero__text">{hero.text}</p>
        <StatusLabel status={generalStatus} className="status--hero" />
      </div>
    </section>
  )
}
