import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Vid sidbyte: scrolla mjukt till sektionen i #hash, annars alltid till toppen.
export default function ScrollManager() {
  const { hash, key } = useLocation()

  useEffect(() => {
    const id = decodeURIComponent(hash.slice(1))
    const target = id ? document.getElementById(id) : null
    if (target) target.scrollIntoView({ behavior: 'smooth' })
    else window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
  }, [hash, key])

  return null
}
