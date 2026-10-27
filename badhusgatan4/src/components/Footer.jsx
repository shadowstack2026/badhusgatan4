import { Link } from 'react-router-dom'
import { navLinks, site } from '../data/content'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div className="footer__brand">
          <Link to="/" aria-label="badhuset – startsidan">
            <Logo />
          </Link>
          <p className="footer__tagline">Här landar digitala människor.</p>
          <Link to="/kom-igang?typ=dagspass" className="btn btn--primary footer__cta">
            Prova en dag <span className="btn__arrow" aria-hidden="true">→</span>
          </Link>
        </div>

        <nav className="footer__col" aria-label="Sidfot">
          <h2 className="footer__head">Utforska</h2>
          {navLinks.map((l) => (
            <Link key={l.label} to={{ pathname: l.to, hash: l.hash ? `#${l.hash}` : '' }}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="footer__col">
          <h2 className="footer__head">Hitta hit</h2>
          <p>{site.address}</p>
          <a href={`mailto:${site.email}`}>{site.email}</a>
          <a href={`tel:${site.phone.replace(/[^\d+]/g, '')}`}>{site.phone}</a>
        </div>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <button type="button" className="footer__top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
          Till toppen <span aria-hidden="true">↑</span>
        </button>
      </div>
    </footer>
  )
}
