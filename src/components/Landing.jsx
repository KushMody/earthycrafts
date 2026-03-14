import { useState, useEffect, useRef } from 'react'
import { Link } from "react-router-dom";
import { Navbar } from './Navbar';

const logo = '/Images/Home Page/Logo-2-150x150.png'
const heroBg1 = '/Images/Home Page/4-1.jpg'
const heroBg2 = '/Images/Home Page/3-1.jpg'
const productImg = '/Images/Home Page/1-1.jpg'
const aboutImg = '/Images/Home Page/5-1.jpg'
const contactImg = '/Images/Home Page/2-1.jpg'
const video1 = '/Images/Home Page/Video_1.mp4'
const video2 = '/Images/Home Page/Video_2.mp4'
const video3 = '/Images/Home Page/Video_3.mp4'

const SideCard = ({ img, video, title, label, category, to }) => {
  const videoRef = useRef(null)

  const handleMouseEnter = () => {
    if (videoRef.current) {
      videoRef.current.playbackRate = 1.5
      videoRef.current.play()
    }
  }

  const handleMouseLeave = () => {
    if (videoRef.current) {
      videoRef.current.pause()
      videoRef.current.currentTime = 0
    }
  }

  return (
    <Link
      to={to}
      className="relative h-[40vh] md:h-1/3 w-full group overflow-hidden rounded-[2rem] md:rounded-[1.5rem] cursor-pointer block"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleMouseEnter}
      onTouchEnd={handleMouseLeave}
    >
      <img
        src={img}
        alt={title}
        className="absolute inset-0 w-full h-full object-cover transition-all duration-1000 group-hover:opacity-0 group-hover:scale-110"
      />
      <video
        ref={videoRef}
        src={video}
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-0 group-hover:opacity-100 transition-all duration-1000 group-hover:scale-110"
      />
      <div className="absolute inset-0 p-4 md:p-5 flex flex-col justify-between pointer-events-none">
        <div>
          <h3 className="text-white text-[18px] tracking-tight font-['Forum',serif] font-normal uppercase leading-[0.95]">
            {category.split('-').map((word, i) => (
              <span key={i} className="block">{word}</span>
            ))}
          </h3>
        </div>

        <div className="flex items-end justify-between w-full">
          <div className="pointer-events-auto">
            <div className="text-white text-[10px] tracking-[0.2em] font-['Forum',serif] transition-all duration-300 uppercase flex items-center">
              <span className="relative">
                SEE MORE
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full"></span>
              </span>
              <span className="ml-2 text-base font-light transition-transform duration-300 group-hover:translate-x-3">—</span>
            </div>
          </div>

          {/* Bottom Right Label Tab */}
          <div className="absolute right-0 bottom-0 bg-black rounded-tl-[1.8rem] px-4 py-3 flex items-center space-x-3 pointer-events-auto translate-y-[1px] translate-x-[1px]">
            <span className="text-white text-[10px] tracking-[0.25em] uppercase whitespace-nowrap">{label}</span>
            <div className="w-8 h-[1px] bg-white/25"></div>
          </div>
        </div>
      </div>
    </Link>
  )
}

const Landing = ({ isMenuOpen, setIsMenuOpen }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const heroImages = [heroBg1, heroBg2, productImg, contactImg, aboutImg]
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Hero image slider interval
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length)
    }, 5000)

    // Trigger entrance animation
    const visTimer = setTimeout(() => setIsVisible(true), 100)

    return () => {
      clearInterval(timer)
      clearTimeout(visTimer)
    }
  }, [heroImages.length])

  return (
    <div className="min-h-screen md:h-screen w-screen bg-[#0c0c0c] flex flex-col md:flex-row p-2 pt-0 md:pt-0 overflow-x-hidden md:overflow-hidden">
      <style>{`
        .editorial-reveal {
          opacity: 0;
          filter: blur(15px);
          transform: translateY(20px);
          transition: all 1.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        
        .is-visible .editorial-reveal {
          opacity: 1;
          filter: blur(0);
          transform: translateY(0);
        }

        .bg-transition {
          transform: scale(1.15);
          opacity: 0;
          transition: transform 4s cubic-bezier(0.16, 1, 0.3, 1), 
                      opacity 2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .hero-visible {
          transform: scale(1);
          opacity: 1;
        }

        .hero-stacking {
          z-index: 5;
        }

        .hero-prev {
          opacity: 1;
          transform: scale(1);
          z-index: 1;
        }
      `}</style>

      {/* Cinematic Hero Section (Left Pane) */}
      <div className={`relative w-full md:w-[72.5%] h-[75vh] md:h-full rounded-[2rem] md:rounded-[2.5rem] overflow-hidden mb-2 md:mb-0 group ${isVisible ? 'is-visible' : ''}`}>

        {/* Background Crossfade */}
        {heroImages.map((img, index) => (
          <img
            key={index}
            src={img}
            alt={`Hero background ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover brightness-[0.7] contrast-110 bg-transition 
              ${index === currentSlide ? 'hero-visible hero-stacking' :
                index === (currentSlide - 1 + heroImages.length) % heroImages.length ? 'hero-prev' : ''}`}
          />
        ))}

        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/50 z-10"></div>
        <div className="absolute inset-0 bg-black/10 backdrop-blur-[0.5px] z-10"></div>

        <Navbar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

        {/* Centered Premium Content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center z-20 pointer-events-none px-4">

          <div className="flex items-center space-x-4 mb-6 md:mb-8 editorial-reveal" style={{ transitionDelay: '200ms' }}>
            <div className="h-[1px] w-12 md:w-20 bg-[#c29d59] opacity-40"></div>
            <span className="text-[#c29d59] font-['Forum',serif] text-xs md:text-sm tracking-[0.6em] md:tracking-[0.8em] uppercase opacity-80 whitespace-nowrap">Explore</span>
            <div className="h-[1px] w-12 md:w-20 bg-[#c29d59] opacity-40"></div>
          </div>

          <h1 className="text-[#efe7d2] font-['Forum',serif] text-[clamp(2.5rem,7vw,6.5rem)] leading-[0.85] tracking-[-0.02em] uppercase drop-shadow-2xl text-center editorial-reveal pointer-events-auto" style={{ transitionDelay: '400ms' }}>
            EARTHY CRAFTS<br />
            <span className="text-[#c29d59]/90 inline-block mt-2">STUDIO</span>
          </h1>

        </div>

        {/* Social Icons (Bottom Right) */}
        <div className="absolute right-0 bottom-0 bg-black/40 backdrop-blur-md rounded-tl-[1.5rem] md:rounded-tl-[2rem] px-5 py-3 md:px-8 md:py-5 flex items-center space-x-4 md:space-x-6 z-20 translate-y-[1px] translate-x-[1px] border-t border-l border-white/10 editorial-reveal" style={{ transitionDelay: '600ms' }}>
          {/* WhatsApp */}
          <a href="#" className="group relative pointer-events-auto">
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:border-[#c29d59] group-hover:bg-[#c29d59]/10">
              <svg className="w-6 h-6 text-white/80 group-hover:text-[#c29d59] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.031 2c-5.517 0-9.997 4.481-9.997 10 0 1.761.461 3.415 1.267 4.851L2 22l5.312-1.393c1.402.77 3.003 1.211 4.719 1.211 5.518 0 9.997-4.481 9.997-10 0-5.519-4.479-10-9.997-10zm0 1.833c4.503 0 8.164 3.662 8.164 8.167 0 4.505-3.661 8.167-8.164 8.167-1.579 0-3.048-.451-4.298-1.229l-.307-.191-3.2.839.855-3.122-.211-.334c-.732-1.157-1.153-2.529-1.153-4.13.001-4.505 3.662-8.167 8.167-8.167zm-3.834 4.512c-.174 0-.462.062-.712.339-.25.277-.954.912-.954 2.227s.949 2.583 1.085 2.768c.135.185 1.83 2.91 4.5 4.026.637.266 1.132.424 1.52.544.654.205 1.248.176 1.718.107.525-.078 1.625-.664 1.854-1.305.228-.642.228-1.19.159-1.305-.069-.115-.251-.184-.528-.321-.278-.138-1.625-.8-1.878-.892-.255-.093-.44-.139-.623.139-.184.277-.714.892-.876 1.076-.16.184-.324.208-.6.069-.278-.138-1.171-.432-2.23-1.378-.823-.733-1.38-1.639-1.541-1.914-.161-.277-.017-.428.121-.565.124-.123.278-.323.417-.484.139-.161.185-.277.278-.462.092-.185.046-.346-.023-.484s-.624-1.5-.854-2.052c-.225-.544-.452-.468-.621-.476l-.52-.014z" />
              </svg>
            </div>
          </a>
          {/* Email */}
          <a href="#" className="group relative pointer-events-auto">
            <div className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:border-[#c29d59] group-hover:bg-[#c29d59]/10">
              <svg className="w-5 h-5 text-white/80 group-hover:text-[#c29d59] transition-colors" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z" />
              </svg>
            </div>
          </a>
        </div>
      </div>

      {/* Side Cards Section (Right Pane) */}
      <div className="w-full md:w-[27.5%] h-full flex flex-col space-y-2 pb-2 md:pb-0 pl-2">
        <SideCard
          img={productImg}
          video={video1}
          title="PRODUCTS"
          label="PRODUCTS"
          category="ALL-PRODUCTS"
          to="/categories"
        />
        <SideCard
          img={aboutImg}
          video={video2}
          title="ABOUT US"
          label="ABOUT US"
          category="LEARN-ABOUT US"
          to="/about-us"
        />
        <SideCard
          img={contactImg}
          video={video3}
          title="CONTACT"
          label="CONTACT"
          category="GET A-QUOTE"
          to="/contact-us"
        />
      </div>
    </div>
  )
}

export default Landing;
