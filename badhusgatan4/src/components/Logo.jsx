import logo from '../assets/logga2-transparent.png'
import { site } from '../data/content'

// Loggan (src/assets/logga2.png) har bakgrunden borttagen så att den smälter in med bilden.
export default function Logo() {
  return (
    <span className="logo">
      <img className="logo__mark" src={logo} alt="" />
      <span className="logo__word">{site.name}</span>
    </span>
  )
}
