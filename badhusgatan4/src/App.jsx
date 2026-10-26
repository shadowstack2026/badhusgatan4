import { useEffect, useState } from 'react'
import './App.css'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import Workspaces from './components/Workspaces'
import Community from './components/Community'
import Testimonials from './components/Testimonials'
import Day from './components/Day'
import NextStep from './components/NextStep'
import Footer from './components/Footer'
import RequestPage from './components/RequestPage'

// Enkel hash-routing:
//   #/                      startsidan
//   #/community             startsidan, scrollar till sektionen med id "community"
//   #/kom-igang?typ=eget-rum  förfrågningssidan med ett val förvalt
function parseHash() {
  const raw = window.location.hash.replace(/^#/, '') || '/'
  const [path, query = ''] = raw.split('?')
  return { path: path.replace(/^\/|\/$/g, ''), params: new URLSearchParams(query), raw }
}

export default function App() {
  const [route, setRoute] = useState(parseHash)

  useEffect(() => {
    const onChange = () => setRoute(parseHash())
    window.addEventListener('hashchange', onChange)
    return () => window.removeEventListener('hashchange', onChange)
  }, [])

  const isRequest = route.path === 'kom-igang'

  // Scrolla till rätt sektion (eller överst) när adressen ändras.
  useEffect(() => {
    if (isRequest) return
    const target = route.path ? document.getElementById(route.path) : null
    if (target) target.scrollIntoView()
    else window.scrollTo(0, 0)
  }, [route.raw, isRequest, route.path])

  return (
    <>
      <Navbar solid={isRequest} />
      {isRequest ? (
        <RequestPage key={route.raw} preselect={route.params.get('typ')} />
      ) : (
        <main>
          <Hero />
          <About />
          <Workspaces />
          <Community />
          <Testimonials />
          <Day />
          <NextStep />
        </main>
      )}
      <Footer />
    </>
  )
}
