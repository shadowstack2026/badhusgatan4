import Hero from '../components/Hero'
import About from '../components/About'
import Workspaces from '../components/Workspaces'
import Community from '../components/Community'
import UpcomingEvents from '../components/UpcomingEvents'
import Testimonials from '../components/Testimonials'
import Day from '../components/Day'
import NextStep from '../components/NextStep'

export default function Home() {
  return (
    <main>
      <Hero />
      <About />
      <Workspaces />
      <Community />
      <UpcomingEvents />
      <Testimonials />
      <Day />
      <NextStep />
    </main>
  )
}
