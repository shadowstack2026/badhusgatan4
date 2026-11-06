import { spaces } from '../data/content'
import Reveal from './Reveal'

// Bildrutnät över husets ytor – namn och en kort beskrivning, inget annat.
export default function SpacesGrid() {
  return (
    <ul className="sgrid">
      {spaces.map((s, i) => (
        <Reveal as="li" key={s.id} delay={i * 90} className="scard">
          <div className="media">
            <img src={s.image} alt={`${s.title} på Badhusgatan 4`} loading="lazy" />
          </div>
          <h3>{s.title}</h3>
          <p>{s.text}</p>
        </Reveal>
      ))}
    </ul>
  )
}
