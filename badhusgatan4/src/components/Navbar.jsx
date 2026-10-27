import { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { navLinks } from '../data/content'
import Logo from './Logo'

const target = (l) => ({ pathname: l.to, hash: l.hash ? `#${l.hash}` : '' })

// Ligger över hero-bilden och är genomskinlig. Efter lite scroll blir den mörk.
// På övriga sidor (solid) är den alltid mörk.
export default function Navbar({ solid = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lås scroll bakom helskärmsmenyn och stäng med Escape.
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKey)
    }
  }, [open])

  const close = () => setOpen(false)
  const cls = `nav${scrolled || solid ? ' nav--solid' : ''}${open ? ' nav--open' : ''}`
  const isActive = (l) => (l.hash ? pathname === '/' && hash === `#${l.hash}` : pathname === l.to || pathname.startsWith(`${l.to}/`))
  const current = (l) => (isActive(l) ? 'page' : undefined)

  return (
    <header className={cls}>
      <div className="container nav__inner">
        <Link to="/" className="nav__logo" onClick={close} aria-label="badhuset – startsidan">
          <Logo />
        </Link>

        <nav className="nav__links" aria-label="Huvudmeny">
          {navLinks.map((l) => (
            <Link key={l.label} to={target(l)} aria-current={current(l)}>
              {l.label}
            </Link>
          ))}
        </nav>

        <Link to="/kom-igang?typ=dagspass" className="btn btn--primary nav__cta">
          Prova en dag <span className="btn__arrow" aria-hidden="true">→</span>
        </Link>

        <button
          type="button"
          className="nav__burger"
          aria-expanded={open}
          aria-controls="mobilmeny"
          aria-label={open ? 'Stäng meny' : 'Öppna meny'}
          onClick={() => setOpen((o) => !o)}
        >
          <span />
          <span />
        </button>
      </div>

      <div className="nav__overlay" id="mobilmeny" aria-hidden={!open}>
        <nav aria-label="Mobilmeny">
          {navLinks.map((l, i) => (
            <Link
              key={l.label}
              to={target(l)}
              aria-current={current(l)}
              onClick={close}
              tabIndex={open ? 0 : -1}
              style={{ '--i': i }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            to="/kom-igang?typ=dagspass"
            className="btn btn--primary"
            onClick={close}
            tabIndex={open ? 0 : -1}
            style={{ '--i': navLinks.length }}
          >
            Prova en dag <span className="btn__arrow" aria-hidden="true">→</span>
          </Link>
        </nav>
      </div>
    </header>
  )
}
