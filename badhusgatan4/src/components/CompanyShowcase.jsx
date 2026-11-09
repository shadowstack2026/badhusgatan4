import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowUpRight, Building2 } from 'lucide-react'
import { companies } from '../data/ecosystem'
import Reveal from './Reveal'

const N = companies.length

// En länk till bolagets webbplats (ny flik).
function Visit({ company }) {
  return (
    <a className="house__visit" href={company.url} target="_blank" rel="noopener noreferrer">
      Besök {company.namn}
      <ArrowUpRight size={16} strokeWidth={1.75} aria-hidden="true" />
      <span className="sr-only"> (öppnas i ny flik)</span>
    </a>
  )
}

function Shot({ company, eager, active }) {
  return (
    <img
      className={`house__img${active ? ' is-active' : ''}`}
      src={company.bild}
      alt={active ? `Bild från ${company.namn}` : ''}
      aria-hidden={!active}
      width="1400"
      height="1000"
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}

// Pinnad scroll-sektion om bolagen i ekosystemet: samma uppbyggnad som "Det här har vi".
// På dator byts bolag medan man scrollar. På mobil och med "minska rörelse" är det vanliga kort.
export default function CompanyShowcase() {
  const section = useRef(null)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)

  useEffect(() => {
    const el = section.current
    const mq = window.matchMedia('(min-width: 901px) and (prefers-reduced-motion: no-preference)')
    let raf = 0

    const update = () => {
      raf = 0
      if (!mq.matches) return
      const rect = el.getBoundingClientRect()
      const travel = el.offsetHeight - window.innerHeight
      const p = Math.min(1, Math.max(0, -rect.top / travel))
      const i = Math.min(N - 1, Math.floor(p * N))
      if (i !== activeRef.current) {
        activeRef.current = i
        setActive(i)
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  // Klick i listan: scrolla till mitten av det bolagets del.
  const goTo = useCallback((i) => {
    const el = section.current
    const top = el.getBoundingClientRect().top + window.scrollY
    const travel = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + (travel * (i + 0.5)) / N, behavior: 'smooth' })
  }, [])

  const company = companies[active]

  return (
    <section className="house" id="bolag" ref={section} style={{ '--n': N }}>
      <h2 className="sr-only">Bolagen i ekosystemet, ett i taget</h2>

      {/* ---- Dator: pinnad scroll ---- */}
      <div className="house__pin">
        <div className="container house__stage">
          <div className="house__left">
            <ol className="house__index" aria-label="Bolag i ekosystemet">
              {companies.map((c, i) => (
                <li key={c.namn}>
                  <button
                    type="button"
                    className={i === active ? 'is-active' : ''}
                    aria-current={i === active}
                    onClick={() => goTo(i)}
                  >
                    <Building2 className="house__ico" size={22} strokeWidth={1.5} aria-hidden="true" />
                    <span className="house__name">{c.namn}</span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="house__detail" aria-live="polite">
              <div className="house__mask">
                <h3 className="house__title" key={`t-${company.namn}`}>
                  {company.namn}
                </h3>
              </div>
              <p className="house__text" key={`p-${company.namn}`}>
                {company.beskrivning}
              </p>
              <Visit company={company} />
            </div>
          </div>

          <div className="house__right">
            <figure className="house__frame">
              <div className="house__imgs">
                {companies.map((c, i) => (
                  <Shot key={c.namn} company={c} eager={i === 0} active={i === active} />
                ))}
              </div>
            </figure>
          </div>
        </div>
      </div>

      {/* ---- Mobil och "minska rörelse": staplade kort ---- */}
      <CompanyCards />
    </section>
  )
}

function CompanyCards() {
  const [current, setCurrent] = useState(0)
  const refs = useRef([])

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setCurrent(Number(e.target.dataset.i))
        })
      },
      { rootMargin: '-45% 0px -45% 0px' },
    )
    refs.current.forEach((el) => el && io.observe(el))
    return () => io.disconnect()
  }, [])

  const jump = (i) => refs.current[i]?.scrollIntoView({ behavior: 'smooth', block: 'center' })

  return (
    <div className="house__cards">
      <div className="house__topbar">
        <div className="house__dots" role="group" aria-label="Hoppa till bolag">
          {companies.map((c, i) => (
            <button
              key={c.namn}
              type="button"
              className={i === current ? 'is-active' : ''}
              aria-label={`${i + 1}. ${c.namn}`}
              aria-current={i === current}
              onClick={() => jump(i)}
            />
          ))}
        </div>
      </div>

      <ul>
        {companies.map((c, i) => (
          <li key={c.namn} className="hcard" data-i={i} ref={(el) => (refs.current[i] = el)}>
            <Reveal>
              <figure className="hcard__img">
                <img src={c.bild} alt={`Bild från ${c.namn}`} width="1400" height="1000" loading="lazy" decoding="async" />
              </figure>
              <h3 className="hcard__title">{c.namn}</h3>
              <p className="hcard__text">{c.beskrivning}</p>
              <Visit company={c} />
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  )
}
