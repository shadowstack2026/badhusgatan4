import { companies } from '../data/ecosystem'
import CompanyLogo, { CompanyLink } from './CompanyLogo'

// Rullande logotyper. Listan visas två gånger så att loopen är sömlös.
// Pausar vid hover och fokus. På mobil (och med "minska rörelse") blir den en vanlig svepbar rad.
export default function LogoMarquee() {
  const row = (hidden) => (
    <ul className="marq__row" aria-hidden={hidden || undefined}>
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
