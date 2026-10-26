import { useState } from 'react'
import { site } from '../data/content'

// Loggan ligger i public/badhub-mark.png. Saknas filen visas bara ordmärket.
export default function Logo() {
  const [hasMark, setHasMark] = useState(true)
  return (
    <span className="logo">
      {hasMark && (
        <img
          className="logo__mark"
          src="/badhub-mark.png"
          alt=""
          onError={() => setHasMark(false)}
        />
      )}
      <span className="logo__word">{site.name}</span>
    </span>
  )
}
