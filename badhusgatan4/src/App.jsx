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
import WorkspaceDetail from './pages/WorkspaceDetail'
import Ytor from './pages/Ytor'
import { SHOW_AVAILABILITY } from './config'
import NotFound from './pages/NotFound'

export default function App() {
  const { pathname } = useLocation()
  // CRM:et på /admin har egen layout, utan sajtens meny och sidfot.
  const isAdmin = pathname.startsWith('/admin')

  return (
    <>
      <ScrollManager />
      {!isAdmin && <Navbar solid={pathname !== '/'} />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/om-oss" element={<OmOss />} />
        <Route path="/event" element={<Events />} />
        <Route path="/event/:slug" element={<EventDetail />} />
        <Route path="/event/:slug/anmal" element={<EventSignup />} />
        <Route path="/ytor" element={<Ytor />} />
        {SHOW_AVAILABILITY && (
          <>
            <Route path="/oppet-bord" element={<WorkspaceDetail id="oppet-bord" />} />
            <Route path="/fast-plats" element={<WorkspaceDetail id="fast-plats" />} />
            <Route path="/eget-rum" element={<WorkspaceDetail id="eget-rum" />} />
          </>
        )}
        <Route path="/admin" element={<Admin />} />
        <Route path="/kontakt" element={<RequestPage />} />
        <Route path="/kom-igang" element={<RequestPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      {!isAdmin && <Footer />}
    </>
  )
}
