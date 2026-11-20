import Hero from '../components/Hero'
import Huset from '../components/Huset'
import SplitSection from '../components/SplitSection'
import CompanyShowcase from '../components/CompanyShowcase'
import Workspaces from '../components/Workspaces'
import UpcomingEvents from '../components/UpcomingEvents'
import Location from '../components/Location'
import Contact from '../components/Contact'
import { ecosystemSplit, whySplit } from '../data/sections'
import { SHOW_AVAILABILITY } from '../config'

// Ordning: hero, ikonsektionen, ekosystemet (bild + text), varför (text + bild),
// bolag i ekosystemet (scroll-sektionen), event, kontakt. Sektionerna Community, House och Location
// finns kvar som komponenter men används inte här.
export default function Home() {
  return (
    <main>
      <Hero />
      <SplitSection data={ecosystemSplit} id="om-ekosystemet" />
      <SplitSection data={whySplit} reverse tint id="varfor" />
      <CompanyShowcase />
      <Huset />
      {SHOW_AVAILABILITY && <Workspaces />}
      <Location />
      <UpcomingEvents />
      <Contact />
    </main>
  )
}
