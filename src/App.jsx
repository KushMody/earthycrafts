import { useState } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Collections from './components/Collections'
import Contact from './components/Contact'
import About from './components/About'
import AllCollections from './components/AllCollections'
import SingleCollection from './components/SingleCollection'
import Home from './components/Home'
import { Navbar, MobileMenu } from './components/Navbar'

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0c0c0c] text-[#efe7d2] selection:bg-[#c29d59]/30">
        <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

        <Routes>
          <Route path="/" element={
            <div className="w-full h-full relative overflow-y-auto">
              <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
              <Home isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            </div>
          } />
          <Route path="/our-story" element={
            <div className="w-full h-full relative overflow-y-auto">
              <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
              <Home isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
            </div>
          } />
          <Route path="/categories" element={
            <div className="w-full h-full relative max-md:overflow-y-auto md:overflow-y-hidden">
              <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
              <Collections />
            </div>
          } />
          {/* New All Collections Routing with category support */}
          <Route path="/all-collections/:category" element={
            <div className="w-full h-full relative overflow-y-auto">
              <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
              <AllCollections />
            </div>
          } />
          {/* Fallback for all-collections without category */}
          <Route path="/all-collections" element={
            <div className="w-full h-full relative overflow-y-auto">
              <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
              <AllCollections />
            </div>
          } />
          {/* Dynamic Route for individual collections */}
          <Route path="/collection/:id" element={
            <div className="w-full h-full relative overflow-y-auto">
              <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
              <SingleCollection />
            </div>
          } />
          <Route path="/contact-us" element={
            <div className="w-full min-h-screen md:h-screen relative md:overflow-hidden">
              <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
              <Contact />
            </div>
          } />
          <Route path="/about-us" element={
            <div className="w-full min-h-screen md:h-screen relative md:overflow-hidden">
              <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
              <About />
            </div>
          } />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App;