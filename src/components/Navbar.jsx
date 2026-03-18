import { Link, useLocation } from "react-router-dom";

const logo = '/Images/Home Page/Logo-2-150x150.png'

// Define nav items to keep the JSX clean and scalable
const navItems = [
  { label: 'Spaces', href: '/categories' },
  { label: 'Collections', href: '/all-collections' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Contact Us', href: '/contact-us' },
];

// Reusable custom SVG icons with gold theme (18x18 for details)
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const AtSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>;

// Social icons with outline design and unified gold color (24x24 for footer row)
const WhatsappIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const LinkedinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;

export const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
  const location = useLocation();
  const isLeftAligned = location.pathname === '/contact-us';

  return (
    <nav className="absolute top-0 left-0 w-full pt-4 px-6 md:pt-0 md:pl-4 flex items-center justify-between z-[150]">
      <div className={`flex items-center ${isLeftAligned ? 'space-x-2' : 'w-full justify-between'}`}>
        <Link to="/" onClick={() => setIsMenuOpen(false)}>
          <img
            src={logo}
            alt="Logo"
            className="h-16 md:h-28 w-auto brightness-110 cursor-pointer"
          />
        </Link>
        <div className="hidden md:flex space-x-[20px] text-lg tracking-[0.2em] font-['Forum',serif] font-normal text-white items-center">
          
          {/* Desktop Links with Animated Underline & Active State */}
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link 
                key={item.href}
                to={item.href} 
                className={`group relative px-1 py-1 transition-all duration-300 whitespace-nowrap cursor-pointer ${isActive ? 'text-white' : 'text-white/80 hover:text-white'}`}
              >
                {item.label}
                <span 
                  className={`absolute bottom-0 left-0 h-[2px] bg-white transition-all duration-300 ${
                    isActive ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                ></span>
              </Link>
            );
          })}
          
          {/* Kept the premium button intact */}
          <Link to="/contact-us" className="nav-premium-btn ml-4">Custom Inquiry</Link>
        </div>
      </div>

      {/* Hamburger for mobile */}
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="md:hidden text-white p-2 z-[120] border border-white/20 rounded-xl bg-black/20 backdrop-blur-sm transition-all active:scale-95"
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

export const MobileMenu = ({ isOpen, onClose }) => {
  const location = useLocation();

  // Including 'Home' specifically for the mobile menu
  const mobileNavItems = [
    { label: 'Home', href: '/' },
    ...navItems
  ];

  return (
    <div className={`fixed inset-0 bg-[#0c0c0c] z-[140] flex flex-col items-center justify-center transition-all duration-500 ease-in-out md:hidden ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-[-20px] opacity-0 pointer-events-none'}`}>
    
      {/* Main links area - keeping your logic intact */}
      <div className="flex-1 flex flex-col space-y-8 text-center justify-center items-center">
        {mobileNavItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link 
              key={item.href}
              to={item.href} 
              onClick={onClose}
              className={`group relative text-2xl tracking-[0.3em] font-['Forum',serif] uppercase transition-colors ${
                isActive ? 'text-white' : 'text-white/60 hover:text-white'
              }`} 
            >
              {item.label}
              <span 
                className={`absolute -bottom-2 left-1/2 -translate-x-1/2 h-[2px] bg-white transition-all duration-300 ${
                  isActive ? 'w-full' : 'w-0 group-hover:w-full'
                }`}
              ></span>
            </Link>
          );
        })}

        <Link to="/contact-us" className="nav-button mt-6" onClick={onClose}>Custom Inquiry</Link>
      </div>

      {/* New Contact & Socials Area at the bottom */}
      <div className={`w-full flex flex-col items-center space-y-6 pb-4 transition-all duration-700 delay-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
        
        {/* Title - updated to gold as per website theme */}
        <h2 className="text-[#D9C394] font-['Forum',serif] text-xl tracking-[0.2em] font-normal">Contact Us</h2>

        {/* Details - text also gold */}
        <div className="flex flex-col items-start space-y-3 text-[#D9C394] font-['Forum',serif] text-sm md:text-base tracking-[0.1em]">
          <a href="tel:+918949181484" className="flex items-center space-x-3 hover:scale-105 transition-transform">
            <PhoneIcon />
            <span>Phone: +91 89491 81484</span>
          </a>
          <a href="mailto:admin@earthycrafts.com" className="flex items-center space-x-3 hover:scale-105 transition-transform">
            <AtSignIcon />
            <span>Email: admin@earthycrafts.com</span>
          </a>
        </div>

        {/* Social icons - updated to unified gold theme from image_3.png's outline style */}
        <div className="flex items-center space-x-6 pt-2 text-[#D9C394]">
           <a href="#" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform"><WhatsappIcon /></a>
           <a href="#" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform"><FacebookIcon /></a>
           <a href="#" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform"><InstagramIcon /></a>
           <a href="#" target="_blank" rel="noreferrer" className="hover:scale-110 transition-transform"><LinkedinIcon /></a>
        </div>
      </div>

    </div>
  );
};