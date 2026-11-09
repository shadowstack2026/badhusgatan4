import { ecosystemIntro } from '../data/ecosystem'
import LogoMarquee from './LogoMarquee'
import Reveal from './Reveal'

export default function Ecosystem() {
  return (
    <section className="section section--light eco" id="ekosystem">
      <div className="container">
        <Reveal className="eco__head">
          <h2 className="h2">{ecosystemIntro.title}</h2>
          <p className="lead">{ecosystemIntro.text}</p>
        </Reveal>
      </div>
      <Reveal delay={80}>
        <LogoMarquee />
      </Reveal>
    </section>
  )
}
