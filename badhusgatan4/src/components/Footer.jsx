import { navLinks, site } from '../data/content'
import Logo from './Logo'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <a href="#/" aria-label="badhuset – startsidan">
            <Logo />
          </a>
          <p className="footer__address mono">{site.address}</p>
        </div>
        <nav className="footer__links" aria-label="Sidfot">
          {navLinks.map((l) => (
            <a key={l.id} href={`#/${l.id}`}>
              {l.label}
            </a>
          ))}
        </nav>
      </div>
      <div className="container footer__bottom mono">
        <span>© {new Date().getFullYear()} {site.name}</span>
        <span>Badhusgatan 4</span>
      </div>
    </footer>
  )
}
