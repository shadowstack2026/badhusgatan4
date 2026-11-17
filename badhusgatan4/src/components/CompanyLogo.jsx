// Bolagets logotyp (vit, transparent). Färgen styrs av CSS i respektive remsa.
// Saknas logotypen visas bolagsnamnet som text.
export default function CompanyLogo({ company }) {
  if (!company.logo) {
    return <span className="colo colo--text">{company.namn}</span>
  }
  return (
    <span className="colo">
      <img src={company.logo} alt={company.url ? '' : company.namn} draggable="false" loading="lazy" />
    </span>
  )
}

// Länk om bolaget har en webbplats, annars bara innehållet.
export function CompanyLink({ company, hidden, children }) {
  if (!company.url) return <span className="colo-wrap">{children}</span>
  return (
    <a
      href={company.url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${company.namn} (öppnas i ny flik)`}
      tabIndex={hidden ? -1 : 0}
    >
      {children}
    </a>
  )
}
