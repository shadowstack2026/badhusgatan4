import { STATUS } from '../data/content'

// Liten etikett med färgad prick: grön = lediga, orange = få kvar, grå = fullt.
export default function StatusLabel({ status, label, className = '' }) {
  const s = STATUS[status] ?? STATUS.fullt
  return (
    <span className={`status ${className}`.trim()} style={{ '--s': s.color }}>
      <span className="status__dot" aria-hidden="true" />
      {label ?? s.label}
    </span>
  )
}
