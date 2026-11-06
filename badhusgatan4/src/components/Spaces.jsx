import { about, spacesIntro } from '../data/content'
import Reveal from './Reveal'

// "Det här har vi": höga paneler. På dator växer panelen man pekar på eller tabbar till
// och beskrivningen tonas in. På mobil står alla paneler staplade med texten synlig.
export default function Spaces() {
  return (
    <section className="section section--dark spaces" id="ytor">
      <div className="container">
        <Reveal className="spaces__head">
          <h2 className="h2">{spacesIntro.title}</h2>
        </Reveal>

        <Reveal>
          <ul className="panels">
            {about.features.map((f) => (
              <li key={f.title} className="panel" tabIndex={0}>
                <img src={f.image} alt={f.title} width="640" height="900" loading="lazy" />
                <div className="panel__text">
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
