import { useState } from 'react'
import { ArrowUpRight } from 'lucide-react'
import { companies } from '../data/ecosystem'

// En länk till bolagets webbplats (ny flik).
function Visit({ company }) {
  if (!company.url) return null
  return (
    <a className="co__visit" href={company.url} target="_blank" rel="noopener noreferrer">
      Besök {company.namn}
      <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
      <span className="sr-only"> (öppnas i ny flik)</span>
    </a>
  )
}

// Bolagen i ekosystemet: klicka på ett bolag för att se det. Ingen scroll-pinning.
export default function CompanyShowcase() {
  const [active, setActive] = useState(0)
  const company = companies[active]

  return (
    <section className="co" id="bolag">
      <div className="container">
        <h2 className="sr-only">Bolagen i ekosystemet</h2>

        <div className="co__tabs" role="tablist" aria-label="Bolag i ekosystemet">
          {companies.map((c, i) => (
            <button
              key={c.namn}
              type="button"
              role="tab"
              id={`co-tab-${i}`}
              aria-selected={i === active}
              aria-controls="co-panel"
              tabIndex={i === active ? 0 : -1}
              className={`co__tab${i === active ? ' is-active' : ''}`}
              onClick={() => setActive(i)}
              onKeyDown={(e) => {
                if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                  e.preventDefault()
                  const next = (i + (e.key === 'ArrowRight' ? 1 : -1) + companies.length) % companies.length
                  setActive(next)
                  document.getElementById(`co-tab-${next}`)?.focus()
                }
              }}
            >
              {c.namn}
            </button>
          ))}
        </div>

        <div className="co__panel" id="co-panel" role="tabpanel" aria-labelledby={`co-tab-${active}`}>
          <div className="co__text" key={company.namn}>
            <h3 className="co__title">{company.namn}</h3>
            {company.tagline && <p className="co__tagline">{company.tagline}</p>}
            {company.kommer && <p className="co__kommer">Uppgifter kommer.</p>}
            <p className="co__desc">{company.beskrivning}</p>

            {company.nyckeltal && (
              <ul className="co__facts">
                {company.nyckeltal.map((n) => (
                  <li key={n.varde}>
                    <strong>{n.varde}</strong>
                    {n.text}
                  </li>
                ))}
              </ul>
            )}
            {company.ekosystem && (
              <ul className="co__caps" aria-label={`Det här gör ${company.namn}`}>
                {company.ekosystem.map((e) => (
                  <li key={e.titel}>{e.titel}</li>
                ))}
              </ul>
            )}
            <Visit company={company} />
          </div>

          <figure className="co__img" key={`img-${company.namn}`}>
            {company.bild ? (
              <img
                src={company.bild}
                alt={company.bildAlt || `Bild från ${company.namn}`}
                width="1400"
                height="1000"
                decoding="async"
              />
            ) : (
              <div className="co__noimg" aria-hidden="true">
                {company.namn}
              </div>
            )}
          </figure>
        </div>
      </div>
    </section>
  )
}
