import { workspaces, workspacesIntro } from '../data/content'
import Reveal from './Reveal'
import StatusLabel from './StatusLabel'

export default function Workspaces() {
  return (
    <section className="section section--dark" id="arbetsplatser">
      <div className="container">
        <Reveal className="section__head">
          <p className="eyebrow">
            <span className="mono">02</span> Arbetsplatser
          </p>
          <h2 className="h2">{workspacesIntro.title}</h2>
        </Reveal>

        <div className="cards">
          {workspaces.map((w, i) => {
            const full = w.status === 'fullt'
            return (
              <Reveal as="article" key={w.id} delay={i * 100} className="wcard">
                <div className="media wcard__media">
                  <img src={w.image} alt="" loading="lazy" />
                  <span className="wcard__num mono">{w.number}</span>
                </div>
                <div className="wcard__body">
                  <h3>{w.title}</h3>
                  <p>{w.text}</p>
                  <div className="wcard__foot">
                    <StatusLabel status={w.status} />
                    <a href={`#/kom-igang?typ=${w.id}`} className="link">
                      {full ? 'Ställ dig i kö' : 'Visa intresse'}
                      <span className="link__arrow" aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>

        <Reveal as="p" className="section__note">
          {workspacesIntro.note}
        </Reveal>
      </div>
    </section>
  )
}
