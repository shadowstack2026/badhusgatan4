import { useCallback, useEffect, useRef, useState } from 'react'
import { communityIntro, companies } from '../data/content'

const AUTO_MS = 3000 // ungefär en logotyp var tredje sekund
const MOVE_MS = 1000 // hur lång själva förflyttningen tar
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2)
const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

const items = [
  ...companies.map((c) => ({ key: c.name, name: c.name, logo: c.logo, url: c.url })),
  { key: 'cta', cta: true, name: 'Din logga här?', url: '#/kom-igang' },
]
const N = items.length
// Listan visas tre gånger efter varandra så att loopen aldrig hoppar.
const slots = [0, 1, 2].flatMap((copy) => items.map((item, i) => ({ item, i, copy })))

export default function Community() {
  const viewport = useRef(null)
  const track = useRef(null)
  const nodes = useRef([])
  const s = useRef({ pos: 0, target: 0, anim: null, raf: 0, itemW: 0, step: 0, vw: 0, active: 0, drag: null, justDragged: false, loop: null })
  const hold = useRef({ hover: false, focus: false })
  const [active, setActive] = useState(0)

  // Placerar alla logotyper utifrån aktuell position (ingen React-rendering per bildruta).
  const render = useCallback(() => {
    const st = s.current
    if (!st.step) return
    const posMod = ((st.pos % N) + N) % N
    const center = N + posMod
    track.current.style.transform = `translate3d(${st.vw / 2 - st.itemW / 2 - center * st.step}px,0,0)`
    nodes.current.forEach((el, k) => {
      if (!el) return
      const w = Math.max(0, 1 - Math.abs(k - center))
      el.style.opacity = String(0.35 + 0.65 * w)
      el.firstChild.style.transform = `scale(${1 + 0.1 * w})`
    })
    const a = Math.round(posMod) % N
    if (a !== st.active) {
      st.active = a
      setActive(a)
    }
  }, [])

  const tick = useCallback(
    (now) => {
      const st = s.current
      st.raf = 0
      if (st.anim) {
        const t = Math.min(1, (now - st.anim.start) / MOVE_MS)
        st.pos = st.anim.from + (st.anim.to - st.anim.from) * easeInOut(t)
        if (t >= 1) {
          st.pos = st.anim.to
          st.anim = null
        }
        render()
        if (st.anim) st.raf = requestAnimationFrame(st.loop)
      }
    },
    [render],
  )

  useEffect(() => {
    s.current.loop = tick
  }, [tick])

  const goTo = useCallback(
    (target) => {
      const st = s.current
      st.target = target
      if (reducedMotion()) {
        st.anim = null
        st.pos = target
        render()
        return
      }
      st.anim = { from: st.pos, to: target, start: performance.now() }
      if (!st.raf) st.raf = requestAnimationFrame(st.loop)
    },
    [render],
  )

  // Mät storlekar och rita om när fönstret ändras.
  useEffect(() => {
    const st = s.current
    const measure = () => {
      const a = nodes.current[N]
      const b = nodes.current[N + 1]
      if (!a || !b) return
      st.itemW = a.offsetWidth
      st.step = b.offsetLeft - a.offsetLeft
      st.vw = viewport.current.clientWidth
      render()
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(viewport.current)
    return () => {
      ro.disconnect()
      cancelAnimationFrame(st.raf)
      st.raf = 0
    }
  }, [render])

  // Automatisk förflyttning, pausas vid hover, fokus och drag.
  useEffect(() => {
    if (reducedMotion()) return
    const id = setInterval(() => {
      const st = s.current
      if (hold.current.hover || hold.current.focus || st.drag || document.hidden) return
      goTo(Math.round(st.target) + 1)
    }, AUTO_MS)
    return () => clearInterval(id)
  }, [goTo])

  // Flytta logotyp nummer i till mitten via kortaste vägen runt loopen.
  const centerOn = (i) => {
    const st = s.current
    const base = Math.round(st.pos)
    let d = (((i - base) % N) + N) % N
    if (d > N / 2) d -= N
    goTo(base + d)
  }

  const onItemClick = (item, i) => {
    if (s.current.justDragged) return
    if (item.cta && s.current.active === i) {
      window.location.assign('#/kom-igang')
      return
    }
    centerOn(i)
  }

  const onPointerDown = (e) => {
    if (e.button !== 0) return
    const st = s.current
    st.anim = null
    st.drag = { x: e.clientX, pos0: st.pos, moved: false }
  }
  const onPointerMove = (e) => {
    const st = s.current
    const d = st.drag
    if (!d) return
    const dx = e.clientX - d.x
    if (!d.moved && Math.abs(dx) > 6) {
      d.moved = true
      viewport.current.setPointerCapture(e.pointerId)
    }
    if (d.moved) {
      st.pos = d.pos0 - dx / st.step
      render()
    }
  }
  const endDrag = () => {
    const st = s.current
    const d = st.drag
    if (!d) return
    st.drag = null
    if (d.moved) {
      st.justDragged = true
      setTimeout(() => (st.justDragged = false), 0)
      goTo(Math.round(st.pos))
    }
  }

  const onKeyDown = (e) => {
    if (e.key === 'ArrowRight') goTo(Math.round(s.current.target) + 1)
    if (e.key === 'ArrowLeft') goTo(Math.round(s.current.target) - 1)
  }

  const current = items[active]

  return (
    <section
      className="section section--dark community"
      id="community"
      onMouseEnter={() => (hold.current.hover = true)}
      onMouseLeave={() => (hold.current.hover = false)}
      onFocus={(e) => {
        if (e.target.matches(':focus-visible')) hold.current.focus = true
      }}
      onBlur={() => (hold.current.focus = false)}
    >
      <div className="container community__head">
        <h2 className="h2">{communityIntro.title}</h2>
        <p className="lead">{communityIntro.text}</p>
      </div>

      <div
        className="carousel"
        ref={viewport}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
        onKeyDown={onKeyDown}
        role="group"
        aria-roledescription="karusell"
        aria-label="Företag i huset"
      >
        <ul className="carousel__track" ref={track}>
          {slots.map(({ item, i, copy }, k) => (
            <li key={k} ref={(el) => (nodes.current[k] = el)} className="carousel__item" aria-hidden={copy !== 1}>
              <button
                type="button"
                className="carousel__btn"
                tabIndex={copy === 1 ? 0 : -1}
                aria-label={item.name}
                onClick={() => onItemClick(item, i)}
              >
                {item.cta ? (
                  <span className="carousel__cta">
                    <span className="carousel__plus" aria-hidden="true">+</span>
                    {item.name}
                  </span>
                ) : (
                  <img src={item.logo} alt="" draggable="false" />
                )}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="carousel__link" aria-live="polite">
        <a
          key={current.key}
          href={current.url}
          {...(current.cta ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
          aria-label={current.cta ? 'Skicka förfrågan' : `Besök sidan – ${current.name}`}
        >
          {current.cta ? 'Hör av dig' : 'Besök sidan'}
          <span className="carousel__circle" aria-hidden="true">→</span>
        </a>
      </div>

      <div className="carousel__dots">
        {items.map((it, i) => {
          const dist = Math.min(Math.abs(i - active), N - Math.abs(i - active))
          return (
            <button
              key={it.key}
              type="button"
              data-dist={Math.min(dist, 3)}
              aria-label={`Visa ${it.name}`}
              aria-current={i === active}
              onClick={() => centerOn(i)}
            />
          )
        })}
      </div>
    </section>
  )
}
