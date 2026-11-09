import { Link } from 'react-router-dom'
import { aboutUs, communityIntro } from '../data/content'
import { heroImages } from '../data/heroImages'
import Reveal from './Reveal'

const FACTS = 'startups · IT-bolag · konsulter'

// Rubrik där ordet "ekosystem" får accentfärg.
function Title({ text }) {
  const [before, after] = text.split('ekosystem')
  if (after === undefined) return text
  return (
    <>
      {before}
      <em>ekosystem</em>
      {after}
    </>
  )
}

// "Varför finns det här?": text till vänster, ett kompakt bildparti till höger,
// och värderingarna från Om oss som en rad under.
export default function Community() {
  return (
    <section className="cm" id="community">
      <div className="container">
        <div className="cm__grid">
          <div className="cm__text">
            <Reveal>
              <h2 className="cm__title">
                <Title text={communityIntro.title} />
              </h2>
              <p className="cm__lead">{communityIntro.text}</p>
            </Reveal>

            <Reveal delay={80}>
              <div className="cm__actions">
                <Link to={{ pathname: '/', hash: '#kontakt' }} className="btn btn--primary">
                  Kom förbi <span className="btn__arrow" aria-hidden="true">→</span>
                </Link>
                <Link to={{ pathname: '/', hash: '#ytor' }} className="btn btn--ghost">
                  Se vad vi har
                </Link>
              </div>
              <p className="cm__facts">{FACTS}</p>
            </Reveal>
          </div>

          <div className="cm__shots" role="group" aria-label="Bilder från huset" tabIndex={0}>
            {heroImages.map((img, i) => (
              <Reveal as="figure" key={img.label} delay={120 + i * 120} className={`shot shot--${i + 1}`}>
                <div className="shot__frame">
                  <img src={img.src} alt={img.alt} width={img.width} height={img.height} loading="lazy" />
                </div>
                <figcaption className="shot__tag">{img.label}</figcaption>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal as="ul" className="cm__values">
          {aboutUs.values.map((v) => (
            <li key={v.title}>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
