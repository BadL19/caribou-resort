import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Cabins from './pages/Cabins'
import CabinDetail from './pages/CabinDetail'
import Gallery from './pages/Gallery'
import FAQ from './pages/FAQ'
import Booking from './pages/Booking'
import AdminDashboard from './pages/AdminDashboard'

export default function App() {
  return (
    <BrowserRouter>
      <div className="flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cabins" element={<Cabins />} />
            <Route path="/cabins/:id" element={<CabinDetail />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/book/:id" element={<Booking />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
