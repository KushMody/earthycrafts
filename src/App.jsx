import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AnimatePresence, motion } from 'framer-motion'
import Collections from './components/Collections'
import Contact from './components/Contact'
import About from './components/About'
import AllCollections from './components/AllCollections'
import SingleCollection from './components/SingleCollection'
import Home from './components/Home'
import AllProducts from './components/AllProducts'
import FloatingShopButton from './components/FloatingShopButton'
import Reviews from './components/Reviews'
import { Navbar, MobileMenu } from './components/Navbar'
import Loader from './components/Loader'
import { preloadAssets } from './utils/preloader';

function App() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [assetsLoaded, setAssetsLoaded] = useState(false)
  const [animationComplete, setAnimationComplete] = useState(false)

  useEffect(() => {
    const criticalAssets = [
      '/Images/Home Page/4-1.jpg',
      '/Images/Home Page/3-1.jpg',
      '/Images/Home Page/1-1.jpg',
      '/Images/Home Page/5-1.jpg',
      '/Images/Home Page/2-1.jpg',
      '/Images/Home Page/Video_1.mp4',
      '/Images/Home Page/Video_2.mp4',
      '/Images/Home Page/Video_3.mp4',
    ];

    preloadAssets(criticalAssets).then(() => {
      setAssetsLoaded(true);
    });

    // Fallback if preloading takes too long
    const timeout = setTimeout(() => {
      setAssetsLoaded(true);
    }, 10000);

    return () => clearTimeout(timeout);
  }, [])

  useEffect(() => {
    if (assetsLoaded && animationComplete) {
      setIsLoading(false)
    }
  }, [assetsLoaded, animationComplete])

  const handleAnimationComplete = () => {
    setAnimationComplete(true)
  }

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMenuOpen])

  return (
    <BrowserRouter>
      <AnimatePresence>
        {isLoading ? (
          <motion.div
            key="loader"
            exit={{ opacity: 0, scale: 1, filter: 'blur(5px)' }}
            transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          >
            <Loader onComplete={handleAnimationComplete} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="min-h-screen bg-[#0c0c0c] text-[#efe7d2] selection:bg-[#c29d59]/30"
          >
            <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

            <Routes>
              <Route path="/" element={
                <div className="w-full h-full relative">
                  <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
                  <Home isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
                </div>
              } />
              <Route path="/our-story" element={
                <div className="w-full h-full relative">
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
              <Route path="/all-products" element={
                <div className="w-full h-full relative overflow-y-auto">
                  <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
                  <AllProducts />
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
              <Route path="/reviews" element={
                <div className="w-full min-h-screen md:h-screen relative overflow-y-auto md:overflow-hidden">
                  <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
                  <Reviews />
                </div>
              } />
            </Routes>
            <FloatingShopButton />
          </motion.div>
        )}
      </AnimatePresence>
    </BrowserRouter>
  )
}

export default App;