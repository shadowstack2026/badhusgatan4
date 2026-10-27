import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollManager from './components/ScrollManager'
import RequestPage from './components/RequestPage'
import Home from './pages/Home'
import OmOss from './pages/OmOss'
import Events from './pages/Events'
import EventDetail from './pages/EventDetail'
import EventSignup from './pages/EventSignup'
import Admin from './admin/Admin'
import NotFound from './pages/NotFound'

export default function App() {
  const { pathname } = useLocation()

  return (
    <>
      <ScrollManager />
      <Navbar solid={pathname !== '/'} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/om-oss" element={<OmOss />} />
        <Route path="/event" element={<Events />} />
        <Route path="/event/:slug" element={<EventDetail />} />
        <Route path="/event/:slug/anmal" element={<EventSignup />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/kom-igang" element={<RequestPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}
