import { Link, useLocation } from "react-router-dom";

const logo = '/Images/Home Page/Logo-2-150x150.png'

export const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
  const location = useLocation();
  const isLeftAligned = location.pathname === '/contact-us';

  return (
    <nav className="absolute top-0 left-0 w-full pt-4 px-6 md:pt-0 md:pl-4 flex items-center justify-between z-60">
      <div className={`flex items-center ${isLeftAligned ? 'space-x-2' : 'w-full justify-between'}`}>
        <Link to="/" onClick={() => setIsMenuOpen(false)}>
          <img
            src={logo}
            alt="Logo"
            className="h-16 md:h-28 w-auto brightness-110 cursor-pointer"
          />
        </Link>
        <div className="hidden md:flex space-x-[12px] text-lg tracking-[0.2em] font-['Forum',serif] font-normal text-white items-center">
          <Link to="/categories" className="px-1 py-1 border border-white/0 hover:border-white hover:bg-white/5 rounded-lg transition-all duration-300 whitespace-nowrap cursor-pointer">Spaces</Link>
          <Link to="/all-collections" className="px-1 py-1 border border-white/0 hover:border-white hover:bg-white/5 rounded-lg transition-all duration-300 whitespace-nowrap cursor-pointer">Collections</Link>
          <Link to="/about-us" className="px-1 py-1 border border-white/0 hover:border-white hover:bg-white/5 rounded-lg transition-all duration-300 whitespace-nowrap cursor-pointer">About Us</Link>
          <Link to="/contact-us" className="px-1 py-1 border border-white/0 hover:border-white hover:bg-white/5 rounded-lg transition-all duration-300 whitespace-nowrap cursor-pointer">Contact Us</Link>
          <Link to="/" className="nav-premium-btn">Our Story</Link> 
        </div>
      </div>

      {/* Hamburger for mobile */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden text-white p-2 z-[50] border border-white/20 rounded-xl bg-black/20 backdrop-blur-sm transition-all active:scale-95"
      >
        <div className="w-8 h-4 flex flex-col justify-between items-end">
          <span className={`h-[1.5px] bg-white transition-all duration-300 ${isMenuOpen ? 'w-full rotate-45 translate-y-[7.5px]' : 'w-full'}`}></span>
          <span className={`h-[1.5px] bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : 'w-2/3'}`}></span>
          <span className={`h-[1.5px] bg-white transition-all duration-300 ${isMenuOpen ? 'w-full -rotate-45 -translate-y-[7.5px]' : 'w-1/2'}`}></span>
        </div>
      </button>
    </nav>
  );
};

export const MobileMenu = ({ isOpen, onClose }) => (
  <div className={`fixed inset-0 bg-[#0c0c0c] z-[55] flex flex-col items-center justify-center transition-all duration-500 ease-in-out md:hidden ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-[-20px] opacity-0 pointer-events-none'}`}>
    {/* Close Button */}
    {/* <button
      onClick={onClose}
      className="absolute top-8 right-8 text-white p-2 border border-white/20 rounded-xl bg-white/5 backdrop-blur-sm transition-all active:scale-95"
    >
      <div className="w-8 h-8 flex items-center justify-center relative">
        <span className="absolute w-6 h-[1.5px] bg-white rotate-45"></span>
        <span className="absolute w-6 h-[1.5px] bg-white -rotate-45"></span>
      </div>
    </button> */}

    <div className="flex flex-col space-y-8 text-center justify-center items-center">
      <Link to="/" className="text-white text-2xl tracking-[0.3em] font-['Forum',serif] uppercase hover:text-white/60 transition-colors" onClick={onClose}>Home</Link>
      <Link to="/categories" className="text-white text-2xl tracking-[0.3em] font-['Forum',serif] uppercase hover:text-white/60 transition-colors" onClick={onClose}>Spaces</Link>
      <Link to="/all-collections" className="text-white text-2xl tracking-[0.3em] font-['Forum',serif] uppercase hover:text-white/60 transition-colors" onClick={onClose}>All Collections</Link>
      <Link to="/about-us" className="text-white text-2xl tracking-[0.3em] font-['Forum',serif] uppercase hover:text-white/60 transition-colors" onClick={onClose}>About Us</Link>
      <Link to="/contact-us" className="text-white text-2xl tracking-[0.3em] font-['Forum',serif] uppercase hover:text-white/60 transition-colors" onClick={onClose}>Contact Us</Link>
      <Link to="/" className="nav-button mt-3" onClick={onClose}>Our Story</Link>
    </div>
  </div>
)
