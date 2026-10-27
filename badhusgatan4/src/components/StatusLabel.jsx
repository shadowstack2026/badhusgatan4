import { STATUS } from '../data/content'

// Liten etikett med färgad prick: grön = lediga, orange = få kvar, grå = fullt.
export default function StatusLabel({ status, label, className = '' }) {
  const s = STATUS[status] ?? STATUS.fullt
  return (
    <span className={`status ${className}`.trim()}>
      <span className="status__dot" style={{ background: s.color }} aria-hidden="true" />
      {label ?? s.label}
    </span>
  )
}
