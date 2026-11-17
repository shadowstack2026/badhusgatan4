import { companies } from '../data/ecosystem'
import CompanyLogo, { CompanyLink } from './CompanyLogo'

// Rullande logotypremsa längst ned i hero. Listan visas två gånger så att loopen är sömlös.
export default function HeroLogos() {
  const row = (hidden) => (
    <ul className="logos__row" aria-hidden={hidden || undefined}>
      {companies.map((c) => (
        <li key={c.namn}>
          <CompanyLink company={c} hidden={hidden}>
            <CompanyLogo company={c} />
          </CompanyLink>
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
