import { companies } from '../data/ecosystem'

// Rullande logotyper. Listan visas två gånger så att loopen är sömlös.
// Pausar vid hover och fokus. På mobil (och med "minska rörelse") blir den en vanlig svepbar rad.
export default function LogoMarquee() {
  const row = (hidden) => (
    <ul className="marq__row" aria-hidden={hidden || undefined}>
      {companies.map((c) => (
        <li key={c.namn}>
          <a
            href={c.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${c.namn} (öppnas i ny flik)`}
            tabIndex={hidden ? -1 : 0}
          >
            <img src={c.logo} alt="" width="200" height="54" loading="lazy" draggable="false" />
          </a>
        </li>
      ))}
    </ul>
  )
  return (
    <div className="marq" role="group" aria-label="Bolag i ekosystemet">
      <div className="marq__window">
        <div className="marq__track">
          {row(false)}
          {row(true)}
        </div>
      </div>
    </div>
  )
}
