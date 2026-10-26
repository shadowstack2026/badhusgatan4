import { useEffect, useState } from 'react'
import { navLinks } from '../data/content'
import Logo from './Logo'

// Ligger över hero-bilden och är genomskinlig. Efter lite scroll blir den mörk.
// På förfrågningssidan (solid) är den alltid mörk.
export default function Navbar({ solid = false }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

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

  return (
    <header className={cls}>
      <div className="container nav__inner">
        <a href="#/" className="nav__logo" onClick={close} aria-label="badhub – startsidan">
          <Logo />
        </a>

        <nav className="nav__links" aria-label="Huvudmeny">
          {navLinks.map((l) => (
            <a key={l.id} href={`#/${l.id}`}>
              {l.label}
            </a>
          ))}
        </nav>

        <a href="#/kom-igang?typ=prova-dag" className="btn btn--primary nav__cta">
          Prova en dag <span className="btn__arrow" aria-hidden="true">→</span>
        </a>

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
            <a key={l.id} href={`#/${l.id}`} onClick={close} tabIndex={open ? 0 : -1} style={{ '--i': i }}>
              <span className="mono">0{i + 1}</span>
              {l.label}
            </a>
          ))}
          <a
            href="#/kom-igang?typ=prova-dag"
            className="btn btn--primary"
            onClick={close}
            tabIndex={open ? 0 : -1}
            style={{ '--i': navLinks.length }}
          >
            Prova en dag <span className="btn__arrow" aria-hidden="true">→</span>
          </a>
        </nav>
      </div>
    </header>
  )
}
