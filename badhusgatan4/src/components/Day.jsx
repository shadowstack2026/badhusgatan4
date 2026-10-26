import { useEffect, useRef, useState } from 'react'
import { day } from '../data/content'
import Reveal from './Reveal'

export default function Day() {
  const list = useRef(null)
  const [active, setActive] = useState(-1)

  // Raden som ligger mitt på skärmen lyser upp.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(Number(e.target.dataset.i))
        }),
      { rootMargin: '-45% 0px -45% 0px' },
    )
    list.current.querySelectorAll('[data-i]').forEach((el) => io.observe(el))
    return () => io.disconnect()
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
            <Reveal as="li" key={it.title} data-i={i} className={`day__row${i === active ? ' is-active' : ''}`}>
              <span className="day__time mono">{it.time}</span>
              <div>
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
