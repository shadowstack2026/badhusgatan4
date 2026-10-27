import { Link } from 'react-router-dom'
import { navLinks, site } from '../data/content'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <Link to="/" aria-label="badhuset – startsidan">
            <Logo />
          </Link>
          <p className="footer__address">{site.address}</p>
        </div>
        <nav className="footer__links" aria-label="Sidfot">
          {navLinks.map((l) => (
            <Link key={l.label} to={{ pathname: l.to, hash: l.hash ? `#${l.hash}` : '' }}>
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="container footer__bottom">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>Badhusgatan 4</span>
      </div>
    </footer>
  )
}
