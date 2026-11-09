import { useCallback, useEffect, useRef, useState } from 'react'
import { houseParts } from '../data/house'
import Reveal from './Reveal'

const N = houseParts.length

// Små linjeikoner (24 px) för indexet. Nyckeln är "id" i src/data/house.js.
const ICONS = {
  'eget-skrivbord': (
    <>
      <rect x="3" y="4" width="18" height="12" rx="2" />
      <path d="M8 20h8M12 16v4" />
    </>
  ),
  internet: (
    <>
      <path d="M2.5 9a15 15 0 0 1 19 0M5.5 12.5a10.5 10.5 0 0 1 13 0M8.8 16a5.5 5.5 0 0 1 6.4 0" />
      <circle cx="12" cy="19.5" r="1" fill="currentColor" stroke="none" />
    </>
  ),
  'gemensamma-ytan': (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <circle cx="17" cy="9" r="2.5" />
      <path d="M16.2 14.2A5 5 0 0 1 21 19" />
    </>
  ),
  samtalsrummet: (
    <path d="M5 5h12a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-6l-4 3.5V15H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" />
  ),
  'kaffe-och-te': (
    <>
      <path d="M5 9h11v5a5 5 0 0 1-5 5h-1a5 5 0 0 1-5-5V9z" />
      <path d="M16 11h1.5a2.5 2.5 0 0 1 0 5H16M8 3v2M12 3v2" />
    </>
  ),
  'det-praktiska': <path d="M12 3s6 6.4 6 11a6 6 0 0 1-12 0c0-4.6 6-11 6-11z" />,
}

function Icon({ id }) {
  return (
    <svg
      className="house__ico"
      viewBox="0 0 24 24"
      width="22"
      height="22"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {ICONS[id]}
    </svg>
  )
}

// Bilden för en del. "eager" bara för den första.
function Shot({ part, eager, active }) {
  return (
    <img
      className={`house__img${active ? ' is-active' : ''}`}
      src={part.src}
      alt={active ? part.alt : ''}
      aria-hidden={!active}
      width="1400"
      height="1000"
      loading={eager ? 'eager' : 'lazy'}
      decoding="async"
      style={{ objectPosition: part.position }}
    />
  )
}

// "Det här har vi": en pinnad scroll-sektion på dator, staplade kort på mobil.
export default function House() {
  const section = useRef(null)
  const [active, setActive] = useState(0)
  const activeRef = useRef(0)

  // Läs scrollläget (bara när den pinnade versionen syns).
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

  // Klick i indexet: scrolla till mitten av den delen.
  const goTo = useCallback((i) => {
    const el = section.current
    const top = el.getBoundingClientRect().top + window.scrollY
    const travel = el.offsetHeight - window.innerHeight
    window.scrollTo({ top: top + (travel * (i + 0.5)) / N, behavior: 'smooth' })
  }, [])

  const part = houseParts[active]

  return (
    <section className="house" id="ytor" ref={section} style={{ '--n': N }}>
      <h2 className="sr-only">Det här har vi</h2>

      {/* ---- Dator: pinnad scroll ---- */}
      <div className="house__pin">
        <div className="container house__stage">
          <div className="house__left">
            <ol className="house__index" aria-label="Delar av huset">
              {houseParts.map((p, i) => (
                <li key={p.id}>
                  <button
                    type="button"
                    className={i === active ? 'is-active' : ''}
                    aria-current={i === active}
                    onClick={() => goTo(i)}
                  >
                    <Icon id={p.id} />
                    <span className="house__name">{p.name}</span>
                  </button>
                </li>
              ))}
            </ol>

            <div className="house__detail" aria-live="polite">
              <div className="house__mask">
                <h3 className="house__title" key={`t-${part.id}`}>
                  {part.name}
                </h3>
              </div>
              <p className="house__text" key={`p-${part.id}`}>
                {part.text}
              </p>
            </div>
          </div>

          <div className="house__right">
            <figure className="house__frame">
              <div className="house__imgs">
                {houseParts.map((p, i) => (
                  <Shot key={p.id} part={p} eager={i === 0} active={i === active} />
                ))}
              </div>
            </figure>
          </div>
        </div>
      </div>

      {/* ---- Mobil och "minska rörelse": staplade kort ---- */}
      <HouseCards />
    </section>
  )
}

function HouseCards() {
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
        <div className="house__dots" role="group" aria-label="Hoppa till del">
          {houseParts.map((p, i) => (
            <button
              key={p.id}
              type="button"
              className={i === current ? 'is-active' : ''}
              aria-label={`${i + 1}. ${p.name}`}
              aria-current={i === current}
              onClick={() => jump(i)}
            />
          ))}
        </div>
      </div>

      <ul>
        {houseParts.map((p, i) => (
          <li key={p.id} className="hcard" data-i={i} ref={(el) => (refs.current[i] = el)}>
            <Reveal>
              <figure className="hcard__img">
                <img
                  src={p.src}
                  alt={p.alt}
                  width="1400"
                  height="1000"
                  loading="lazy"
                  decoding="async"
                  style={{ objectPosition: p.position }}
                />
              </figure>
              <h3 className="hcard__title">{p.name}</h3>
              <p className="hcard__text">{p.text}</p>
            </Reveal>
          </li>
        ))}
      </ul>
    </div>
  )
}
