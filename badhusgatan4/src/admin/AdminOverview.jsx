import StatusLabel from '../components/StatusLabel'
import { statusOf } from '../lib/spaces'
import { activeMembers, queueOf } from './crm'

const when = (d) => new Date(d).toLocaleString('sv-SE', { dateStyle: 'short', timeStyle: 'short' })

export default function AdminOverview({ spaces, leads, members, events, regs, activity, go }) {
  const today = new Date().toISOString().slice(0, 10)
  const fresh = leads.filter((l) => l.status === 'ny').length
  const upcoming = events.filter((e) => e.published && e.date >= today).sort((a, b) => a.date.localeCompare(b.date)).slice(0, 4)
  const newRegs = regs.filter((r) => r.status === 'ny').length

  return (
    <section className="crm__overview">
      <div className="crm__todo">
        <button type="button" className="crm__stat" onClick={() => go('intresse')}>
          <strong>{fresh}</strong>
          <span>nya intresseanmälningar</span>
        </button>
        <button type="button" className="crm__stat" onClick={() => go('platser')}>
          <strong>{leads.filter((l) => l.status === 'ko').length}</strong>
          <span>personer i kö</span>
        </button>
        <button type="button" className="crm__stat" onClick={() => go('anmalningar')}>
          <strong>{newRegs}</strong>
          <span>nya eventanmälningar</span>
        </button>
      </div>

      <h2 className="crm__h">Platser</h2>
      <div className="crm__cards">
        {spaces.map((s) => {
          const taken = activeMembers(members, s.id).length
          return (
            <button key={s.id} type="button" className="crm__card" onClick={() => go('platser')}>
              <span className="crm__cardtitle">{s.title}</span>
              <strong className="crm__big">
                {taken} <small>/ {s.capacity}</small>
              </strong>
              <div className="crm__bar" aria-hidden="true">
                <i style={{ width: `${s.capacity ? Math.min(100, (taken / s.capacity) * 100) : 100}%` }} />
              </div>
              <StatusLabel status={statusOf(s.capacity, taken)} className="status--small" />
              <span className="crm__queued">{queueOf(leads, s.id).length} i kö</span>
            </button>
          )
        })}
      </div>

      <div className="crm__two">
        <div>
          <h2 className="crm__h">Kommande event</h2>
          {upcoming.length === 0 ? (
            <p className="crm__none">Inga kommande event.</p>
          ) : (
            <ul className="crm__rows">
              {upcoming.map((e) => {
                const going = regs.filter((r) => r.event_id === e.id && r.kind === 'anmalan' && r.status !== 'avbokad').length
                return (
                  <li key={e.id}>
                    <div className="admin__info">
                      <strong>{e.title}</strong>
                      <span>{e.date}</span>
                    </div>
                    <span className="tag tag--ok">
                      {going}
                      {e.spots_total > 0 ? ` / ${e.spots_total}` : ''} anmälda
                    </span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>
        <div>
          <h2 className="crm__h">Senaste händelser</h2>
          {activity.length === 0 ? (
            <p className="crm__none">Inget har hänt ännu.</p>
          ) : (
            <ul className="crm__rows">
              {activity.map((a) => (
                <li key={a.id}>
                  <div className="admin__info">
                    <strong>{a.text}</strong>
                    <span>{when(a.created_at)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </section>
  )
}
