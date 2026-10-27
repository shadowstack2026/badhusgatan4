import { useEffect, useRef, useState } from 'react'
import { day } from '../data/content'
import Reveal from './Reveal'

// Dagens tidslinje: en blå linje ritas nedåt medan man scrollar, och varje punkt
// poppar till liv när linjen når den. Raden som linjen just passerat lyser upp.
export default function Day() {
  const list = useRef(null)
  const [active, setActive] = useState(-1)

  useEffect(() => {
    const el = list.current
    const rows = [...el.querySelectorAll('[data-i]')]
    let raf = 0

    const update = () => {
      raf = 0
      const box = el.getBoundingClientRect()
      const line = Math.max(0, Math.min(box.height, window.innerHeight * 0.55 - box.top))
      el.style.setProperty('--line', `${line}px`)
      let now = -1
      rows.forEach((row, i) => {
        if (row.offsetTop + row.offsetHeight / 2 <= line) now = i
      })
      setActive(now)
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

  return (
    <section className="section section--dark day" id="en-dag">
      <div className="container day__grid">
        <div className="day__side">
          <Reveal>
            <h2 className="h2">{day.title}</h2>
            <p className="lead">{day.intro}</p>
          </Reveal>
          <Reveal delay={120} className="day__image media">
            <img src={day.image} alt="" loading="lazy" />
          </Reveal>
        </div>

        <ol className="day__list" ref={list}>
          {day.items.map((it, i) => (
            <Reveal
              as="li"
              key={it.title}
              data-i={i}
              className={`day__row${i <= active ? ' is-reached' : ''}${i === active ? ' is-active' : ''}`}
            >
              <span className="day__time">{it.time}</span>
              <span className="day__dot" aria-hidden="true" />
              <div className="day__body">
                <h3>{it.title}</h3>
                <p>{it.text}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  )
}
