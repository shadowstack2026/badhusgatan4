import { companies } from '../data/content'

// Rullande logotypremsa längst ned i hero. Listan visas två gånger så att loopen är sömlös.
export default function HeroLogos() {
  const row = (hidden) => (
    <ul className="logos__row" aria-hidden={hidden || undefined}>
      {companies.map((c) => (
        <li key={c.name}>
          <a href={c.url} target="_blank" rel="noopener noreferrer" aria-label={c.name} tabIndex={hidden ? -1 : 0}>
            <img src={c.logo} alt="" draggable="false" />
          </a>
        </li>
      ))}
    </ul>
  )
  return (
    <div className="logos" aria-label="Företag på Badhusgatan 4">
      <div className="logos__window">
        <div className="logos__track">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  )
}
