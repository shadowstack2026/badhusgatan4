import { Link } from 'react-router-dom'
import { workspaces as staticWorkspaces } from '../data/content'
import { useWorkspaces } from '../lib/spaces'
import StatusLabel from '../components/StatusLabel'
import Reveal from '../components/Reveal'

// Sida för en platstyp: /oppet-bord, /fast-plats, /eget-rum.
// Text och bilder fylls i under "details" och "photos" i src/data/content.js.
export default function WorkspaceDetail({ id }) {
  const live = useWorkspaces().find((w) => w.id === id)
  const w = live ?? staticWorkspaces.find((x) => x.id === id)
  const full = w.status === 'fullt'

  return (
    <main className="wdetail">
      <div className="container wdetail__inner">
        <Link to={{ pathname: '/', hash: '#arbetsplatser' }} className="request__back">
          ← Arbetsplatser
        </Link>
        <h1 className="h2">{w.title}</h1>
        <StatusLabel status={w.status} className="status--small" />

        {w.details?.length > 0 && (
          <Reveal className="wdetail__text">
            {w.details.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </Reveal>
        )}

        {w.photos?.length > 0 && (
          <Reveal className="wdetail__photos">
            {w.photos.map((src) => (
              <div className="media" key={src}>
                <img src={src} alt="" loading="lazy" />
              </div>
            ))}
          </Reveal>
        )}

        <Link to={`/kom-igang?typ=${w.id}`} className="btn btn--primary wdetail__cta">
          {full ? 'Ställ mig i kö' : 'Visa intresse'} <span className="btn__arrow" aria-hidden="true">→</span>
        </Link>
      </div>
    </main>
  )
}
