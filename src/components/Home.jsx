import { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom";

// Assets
const heroBg1 = '/Images/Home Page/4-1.jpg'
const heroBg2 = '/Images/Home Page/3-1.jpg'
const productImg = '/Images/Home Page/1-1.jpg'
const aboutImg = '/Images/Home Page/5-1.jpg'
const contactImg = '/Images/Home Page/2-1.jpg'
const video1 = '/Images/Home Page/Video_1.mp4'
const video2 = '/Images/Home Page/Video_2.mp4'
const video3 = '/Images/Home Page/Video_3.mp4'

import { Navbar } from './Navbar';

const DotNavigation = ({ activeSection, onDotClick, isHidden }) => {
  const sections = ['Hero', 'Gallery', 'Process', 'Invitation'];
  return (
    <div
      className={`dot-nav z-[40] transition-opacity duration-200 ease-in-out ${isHidden
        ? 'opacity-0 pointer-events-none'
        : 'opacity-100'
        }`}
    >
      {sections.map((_, index) => (
        <div
          key={index}
          className={`dot-nav-item ${activeSection === index ? 'active' : ''}`}
          onClick={() => onDotClick(index)}
        />
      ))}
    </div>
  );
};

const GalleryCard = ({ img, video, title, label, to, className, style }) => {
  const videoRef = useRef(null)
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.5;
    }
  }, []);

  return (
    <Link
      to={to}
      // Reduced border radius slightly for mobile
      className={`gallery-card-premium relative group overflow-hidden rounded-[1.25rem] md:rounded-[2rem] cursor-pointer block ${className || ''}`}
      style={style}
      onMouseEnter={() => videoRef.current?.play()}
      onMouseLeave={() => {
        videoRef.current?.pause();
        if (videoRef.current) videoRef.current.currentTime = 0;
      }}
    >
      <img src={img} alt={title} className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000" />
      <video ref={videoRef} src={video} muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />

      {/* Layered Overlays for Depth */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/40 z-10 opacity-60 group-hover:opacity-80 transition-opacity duration-700"></div>

      {/* Reduced padding to p-4 on mobile for shorter cards */}
      <div className="absolute inset-0 p-3 md:p-8 flex flex-col justify-between z-20">
        {/* Top Section */}
        {/* Scaled title down to text-base for mobile, text-2xl for desktop */}
        <h3 className="text-[#efe7d2] font-['Forum',serif] text-sm md:text-2xl lg:text-3xl uppercase leading-[1.1] tracking-tight transition-colors duration-500 group-hover:text-white">
          {title}
        </h3>

        {/* Bottom Section */}
        <div className="flex items-end justify-between w-full">
          <span className="text-[#efe7d2]/70 text-[8px] md:text-xs tracking-[0.2em] md:tracking-[0.3em] font-['Plus_Jakarta_Sans',sans-serif] uppercase group-hover:text-[#c29d59] transition-colors duration-500 mb-1 md:mb-0">
            SEE MORE —
          </span>
        </div>
      </div>

      {/* Signature Black Tab */}
      {/* Shrunk the black tab and text slightly on mobile */}
      <div className="absolute bottom-0 right-0 bg-[#0c0c0c] px-4 py-3 md:px-6 md:py-4 rounded-tl-[1.25rem] md:rounded-tl-[2rem] z-30 transition-transform duration-500">
        <span className="text-white text-[9px] md:text-[11px] tracking-[0.15em] md:tracking-[0.2em] font-['Plus_Jakarta_Sans',sans-serif] uppercase whitespace-nowrap">
          {label} —
        </span>
      </div>
    </Link>
  )
}

const Home = ({ isMenuOpen, setIsMenuOpen }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeSection, setActiveSection] = useState(0)
  const heroImages = [heroBg1, heroBg2, productImg, contactImg, aboutImg]
  const containerRef = useRef(null)
  const maskImgRef = useRef(null)
  const statsRef = useRef(null)
  const invitationImgRef = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  const [showDots, setShowDots] = useState(!isMenuOpen)

  useEffect(() => {
    let timer;
    if (isMenuOpen) {
      setShowDots(false);
    } else {
      timer = setTimeout(() => {
        setShowDots(true);
      }, 0);
    }
    return () => clearTimeout(timer);
  }, [isMenuOpen]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentSlide((prev) => (prev + 1) % heroImages.length), 2000)
    const visTimer = setTimeout(() => setIsVisible(true), 300)

    const handleScroll = () => {
      if (!containerRef.current) return
      const scrollPos = containerRef.current.scrollTop
      const h = window.innerHeight

      const newActiveSection = Math.round(scrollPos / h)
      if (newActiveSection !== activeSection) {
        setActiveSection(newActiveSection);
      }

      // Sync Narrative Unmasking
      if (maskImgRef.current) {
        const start = h * 1.3, end = h * 1.9
        const progress = Math.min(Math.max((scrollPos - start) / (end - start), 0), 1)
        const reveal = 40 + (progress * 60)
        maskImgRef.current.style.clipPath = `inset(${(100 - reveal) / 2}% 0% ${(100 - reveal) / 2}% 0%)`
        if (statsRef.current) {
          statsRef.current.style.opacity = progress
          statsRef.current.style.transform = `translateY(${(1 - progress) * 30}px)`
        }
      }

      // Sync Invitation
      if (invitationImgRef.current) {
        const start = h * 2.3, end = h * 2.9
        const progress = Math.min(Math.max((scrollPos - start) / (end - start), 0), 1)
        const reveal = 60 + (progress * 40)
        invitationImgRef.current.style.clipPath = `inset(${(100 - reveal) / 2}% 0 ${(100 - reveal) / 2}% 0)`
        invitationImgRef.current.style.transform = `scale(${1.1 - (progress * 0.1)})`
      }
    }

    const container = containerRef.current
    container?.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      clearInterval(timer)
      clearTimeout(visTimer)
      container?.removeEventListener('scroll', handleScroll)
    }
  }, [activeSection, heroImages.length])

  const scrollToSection = (index) => {
    containerRef.current?.scrollTo({ top: index * window.innerHeight, behavior: 'smooth' })
  }

  return (
    <div className="snap-container" ref={containerRef}>

      <DotNavigation
        activeSection={activeSection}
        onDotClick={scrollToSection}
        isHidden={!showDots}
      />

      {/* 1. HERO */}
      <section className={`snap-section flex flex-col justify-center ${(activeSection === 0 && isVisible) ? 'section-visible' : ''}`}>
        <div className="absolute inset-0 z-0">
          {heroImages.map((img, index) => (
            <img
              key={index}
              src={img}
              alt="Hero"
              className={`absolute inset-0 w-full h-full object-cover transition-all duration-[2500ms]
                ${index === currentSlide ? 'opacity-40 scale-105 blur-none' : 'opacity-0 scale-100 blur-md'}`}
            />
          ))}
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-transparent to-[#0c0c0c]"></div>
        </div>

        <div className="relative z-10 text-center px-6 mt-20 editorial-reveal" style={{ transitionDelay: '200ms' }}>
          <span className="text-[#c29d59] font-['Forum',serif] text-base md:text-sm tracking-[0.5em] md:tracking-[0.8em] uppercase mb-8 block opacity-80">Jaipur's Fine Artisans</span>
          <h1 className="text-[#efe7d2] font-['Forum',serif] text-[clamp(5rem,14vw,12rem)] leading-[0.8] tracking-tighter uppercase mb-6 flex flex-col items-center">
            <span>Earthy</span>
            <span className="text-[#c29d59]">Crafts</span>
          </h1>
          <div className="w-[1px] h-24 bg-gradient-to-b from-[#c29d59] to-transparent mx-auto mt-12"></div>
        </div>
      </section>

      {/* 2. GALLERY */}
      {/* ADDED: justify-center to center vertically, and removed the asymmetrical pt-20/pb-6 padding */}
      <section className={`snap-section bg-[#0c0c0c] flex flex-col justify-center items-center py-2 md:py-10 overflow-hidden ${activeSection === 1 ? 'section-visible' : ''}`}>

        {/* ADDED: justify-center here as well so the inner flexbox perfectly centers the text and cards */}
        <div className="w-full max-w-[1400px] flex flex-col justify-center relative z-10 h-full px-4 md:px-0 mt-20 md:mt-15">

          <div className="flex-none text-center mb-4 md:mb-5 w-full editorial-reveal" style={{ transitionDelay: '200ms' }}>
            <div className="flex items-center justify-center space-x-4 md:space-x-6 mb-1 md:mb-5">
              <div className="h-[1px] w-8 md:w-12 bg-[#c29d59]/30"></div>
              <span className="text-[#c29d59] tracking-[0.4em] md:tracking-[0.6em] font-['Forum',serif] text-[10px] md:text-xs uppercase opacity-80">Our Curation</span>
              <div className="h-[1px] w-8 md:w-12 bg-[#c29d59]/30"></div>
            </div>
            <h2 className="text-[#efe7d2] font-['Forum',serif] text-3xl md:text-5xl lg:text-5xl tracking-tight uppercase leading-[0.9] md:leading-[0.8] flex flex-col items-center drop-shadow-2xl">
              <span>Timeless</span>
              <span>Stone Artistry</span>
            </h2>
            <p className="text-[#efe7d2]/40 font-['Forum',serif] text-sm md:text-lg max-w-lg mx-auto mt-2 md:mt-4 italic hidden md:block">
              "Every piece is hand-carved to perfection, preserving the heritage of master craftsmen."
            </p>
          </div>

          {/* Cards Wrapper */}
          <div className="w-full max-w-[85%] md:max-w-none mx-auto flex flex-col md:flex-row items-center justify-center gap-2 md:gap-5 pb-6 md:pb-0">

            {/* Card 1 */}
            <GalleryCard
              img={productImg}
              video={video1}
              title="ALL PRODUCTS"
              label="PRODUCTS"
              to="/categories"
              className="editorial-reveal 
    w-full 
    h-[22vh] min-h-[150px] max-h-[200px] 
    md:h-[30vh] md:w-[18vw] 
    lg:h-[28vh] lg:w-[14vw] 
    flex-shrink-0"
              style={{ transitionDelay: '0.4s' }}
            />

            {/* Card 2 */}
            <GalleryCard
              img={aboutImg}
              video={video2}
              title="LEARN ABOUT US"
              label="ABOUT US"
              to="/about-us"
              className="editorial-reveal 
    w-full 
    h-[22vh] min-h-[150px] max-h-[200px] 
    md:h-[30vh] md:w-[18vw] 
    lg:h-[28vh] lg:w-[14vw] 
    flex-shrink-0"
              style={{ transitionDelay: '0.55s' }}
            />

            {/* Card 3 */}
            <GalleryCard
              img={contactImg}
              video={video3}
              title="GET A QUOTE"
              label="CONTACT"
              to="/contact-us"
              className="editorial-reveal 
    w-full 
    h-[22vh] min-h-[150px] max-h-[200px] 
    md:h-[30vh] md:w-[18vw] 
    lg:h-[28vh] lg:w-[14vw] 
    flex-shrink-0"
              style={{ transitionDelay: '0.7s' }}
            />

          </div>

        </div>
      </section>

      {/* 3. NARRATIVE */}
      <section className={`snap-section bg-[#0c0c0c] border-t border-white/5 ${activeSection === 2 ? 'section-visible' : ''}`}>
        <div className="grid md:grid-cols-2 h-full">
          <div className="relative pt-24 p-6 md:p-32 flex flex-col justify-center">
            <div className="relative z-10 editorial-reveal" style={{ transitionDelay: '200ms' }}>
              <span className="text-[#c29d59] text-xs tracking-[0.5em] mb-8 block uppercase opacity-70">The Process</span>
              <h2 className="text-3xl md:text-8xl font-['Forum',serif] uppercase leading-[0.9] mb-6 md:mb-10 flex flex-col items-start drop-shadow-xl">
                <span>From <span className="text-[#c29d59]">Dust</span></span>
                <span>To Eternal</span>
              </h2>
              <p className="text-[#efe7d2]/60 text-lg md:text-xl font-['Forum',serif] leading-relaxed max-w-xl mb-10 md:mb-16 italic">
                "We don't just carve stone; we release the spirit within."
              </p>
              <Link to="/about-us" className="inline-flex items-center space-x-8 group">
                <span className="text-[#c29d59] text-[10px] tracking-[0.6em] uppercase">Explore Heritage</span>
                <div className="w-16 h-[1px] bg-[#c29d59]/40 group-hover:w-32 group-hover:bg-[#c29d59] transition-all duration-700"></div>
              </Link>
            </div>
          </div>
          <div className="relative overflow-hidden group min-h-[35vh] md:min-h-0">
            <img ref={maskImgRef} src={aboutImg} alt="Craft" className="absolute inset-0 w-full h-full object-cover opacity-30 grayscale hover:grayscale-0 transition-all duration-1000" style={{ clipPath: 'inset(40% 0 40% 0)' }} />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60"></div>
            <div ref={statsRef} className="absolute bottom-10 left-6 md:bottom-16 md:left-16 editorial-reveal opacity-0">
              <div className="flex items-center space-x-8 text-[#c29d59]">
                <span className="text-5xl md:text-9xl font-['Forum',serif]">74+</span>
                <div className="h-12 md:h-20 w-[1px] bg-white/20"></div>
                <span className="text-[8px] md:text-[10px] tracking-[0.5em] md:tracking-[0.6em] uppercase max-w-[80px] md:max-w-[100px]">Years of Stone Artistry</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. INVITATION */}
      <section className={`snap-section relative flex items-center justify-center bg-black ${activeSection === 3 ? 'section-visible' : ''}`}>
        <div className="absolute inset-0 z-0 opacity-40">
          <img ref={invitationImgRef} src={contactImg} alt="Vibe" className="w-full h-full object-cover contrast-125" style={{ clipPath: 'inset(20% 0 20% 0)' }} />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        <div className="relative z-10 text-center px-6 editorial-reveal" style={{ transitionDelay: '200ms' }}>
          <span className="text-[#efe7d2]/60 font-['Forum',serif] text-base md:text-sm tracking-[0.5em] md:tracking-[0.8em] uppercase mb-8 block">A Journey Awaits</span>
          <h2 className="text-[#efe7d2] font-['Forum',serif] text-7xl md:text-[8rem] lg:text-[10rem] uppercase leading-[0.8] tracking-tighter mb-20 flex flex-col items-center">
            <span>Start Your</span>
            <span className="text-[#c29d59]">Gallery</span>
          </h2>
          <Link to="/contact-us" className="group flex flex-col items-center">
            <span className="text-[#c29d59] text-xs md:text-xs tracking-[0.6em] md:tracking-[0.8em] mb-6 uppercase">Get A Custom Quote</span>
            <div className="w-16 md:w-32 h-[1px] bg-[#c29d59]/50 group-hover:bg-[#c29d59] group-hover:w-64 transition-all duration-1000"></div>
          </Link>
        </div>

        <div className="absolute bottom-10 left-0 w-full text-center text-white/5 text-[10px] tracking-[1.5em] uppercase pointer-events-none">
          Fine Stone Artisans • Earthy Crafts Studio
        </div>
      </section>
    </div>
  )
}

export default Home;