import { facilities } from '../data/content'
import Reveal from './Reveal'

// Faciliteter: kort med löpnummer. Raderna ritas upp en efter en när sektionen scrollas in.
export default function Facilities() {
  return (
    <section className="section section--light facilities" id="faciliteter">
      <div className="container">
        <Reveal className="facilities__head">
          <h2 className="h2">{facilities.title}</h2>
          <p className="lead">{facilities.text}</p>
        </Reveal>

        <ul className="fgrid">
          {facilities.items.map((f, i) => (
            <Reveal as="li" key={f.title} delay={(i % 4) * 70 + Math.floor(i / 4) * 140} className="fcard">
              <div className="fcard__img">
                <img src={f.image} alt="" width="500" height="200" loading="lazy" />
              </div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
              <span className="fcard__bar" aria-hidden="true" />
            </Reveal>
          ))}
        </ul>
      </div>
    </section>
  )
}
