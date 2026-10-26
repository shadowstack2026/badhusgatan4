import { useCallback, useEffect, useRef, useState } from 'react'
import { communityIntro, companies } from '../data/content'
import Reveal from './Reveal'

export default function Community() {
  const track = useRef(null)
  const [progress, setProgress] = useState({ start: 0, size: 100 })
  const [edge, setEdge] = useState({ atStart: true, atEnd: false })

  const update = useCallback(() => {
    const el = track.current
    if (!el) return
    const max = el.scrollWidth - el.clientWidth
    const size = Math.min(100, (el.clientWidth / el.scrollWidth) * 100)
    const ratio = max > 0 ? el.scrollLeft / max : 0
    setProgress({ start: ratio * (100 - size), size })
    setEdge({ atStart: el.scrollLeft <= 2, atEnd: max <= 2 || el.scrollLeft >= max - 2 })
  }, [])

  useEffect(() => {
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [update])

  const scrollByCard = (dir) => {
    const el = track.current
    const card = el.querySelector('.ccard')
    const step = card ? card.getBoundingClientRect().width + 20 : 300
    el.scrollBy({ left: dir * step, behavior: 'smooth' })
  }

  return (
    <section className="section section--light" id="community">
      <div className="container">
        <Reveal className="section__head section__head--row">
          <div>
            <p className="eyebrow">
              <span className="mono">03</span> Community
            </p>
            <h2 className="h2">{communityIntro.title}</h2>
            <p className="lead">{communityIntro.text}</p>
          </div>
          <div className="arrows">
            <button type="button" onClick={() => scrollByCard(-1)} disabled={edge.atStart} aria-label="Föregående företag">
              ←
            </button>
            <button type="button" onClick={() => scrollByCard(1)} disabled={edge.atEnd} aria-label="Nästa företag">
              →
            </button>
          </div>
        </Reveal>
      </div>

      <Reveal className="scroller-wrap">
        <ul className="scroller" ref={track} onScroll={update} tabIndex={0} aria-label="Företag i huset">
          {companies.map((c) => {
            const inner = (
              <>
                <span className="ccard__logo mono">{c.initials}</span>
                <span className="ccard__name">{c.name}</span>
                <span className="ccard__field">{c.field}</span>
                <span className="ccard__foot mono">
                  {c.example ? 'Exempel' : ''}
                  {c.url && <span className="ccard__go">Besök →</span>}
                </span>
              </>
            )
            return (
              <li key={c.name} className="ccard">
                {c.url ? (
                  <a href={c.url} target="_blank" rel="noopener noreferrer" className="ccard__inner">
                    {inner}
                  </a>
                ) : (
                  <div className="ccard__inner">{inner}</div>
                )}
              </li>
            )
          })}
          <li className="ccard ccard--cta">
            <a href="#/kom-igang" className="ccard__inner">
              <span className="ccard__plus" aria-hidden="true">+</span>
              <span className="ccard__name">Din logga här?</span>
              <span className="ccard__go mono">Hör av dig →</span>
            </a>
          </li>
        </ul>

        <div className="container">
          <div className="progress" role="presentation">
            <span style={{ left: `${progress.start}%`, width: `${progress.size}%` }} />
          </div>
        </div>
      </Reveal>
    </section>
  )
}
