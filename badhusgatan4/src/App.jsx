import { Route, Routes, useLocation } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollManager from './components/ScrollManager'
import RequestPage from './components/RequestPage'
import Home from './pages/Home'
import OmOss from './pages/OmOss'
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
        <Route path="/kom-igang" element={<RequestPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  )
}
