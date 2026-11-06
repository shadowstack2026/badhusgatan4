import Hero from '../components/Hero'
import Community from '../components/Community'
import Spaces from '../components/Spaces'
import Facilities from '../components/Facilities'
import Location from '../components/Location'
import Workspaces from '../components/Workspaces'
import UpcomingEvents from '../components/UpcomingEvents'
import Contact from '../components/Contact'
import { SHOW_AVAILABILITY } from '../config'

export default function Home() {
  return (
    <main>
      <Hero />
      <Community />
      <Spaces />
      <Facilities />
      <Location />
      {SHOW_AVAILABILITY && <Workspaces />}
      <UpcomingEvents />
      <Contact />
    </main>
  )
}
