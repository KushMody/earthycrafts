import { Link, useLocation } from "react-router-dom";

const logo = '/Images/Home Page/Logo-2-150x150.png';

// Define nav items to keep the JSX clean and scalable
const navItems = [
  { label: 'Home', href: '/' },
  { label: 'Spaces', href: '/categories' },
  { label: 'Collections', href: '/all-collections' },
  { label: 'About Us', href: '/about-us' },
  { label: 'Contact Us', href: '/contact-us' },
];

// Reusable custom SVG icons
const PhoneIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>;
const AtSignIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4"></circle><path d="M16 8v5a3 3 0 0 0 6 0v-1a10 10 0 1 0-3.92 7.94"></path></svg>;

const WhatsappIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 21l1.65-3.8a9 9 0 1 1 3.4 2.9L3 21" /><path d="M9 10a.5.5 0 0 0 1 0v-1a.5.5 0 0 0-1 0v1a5 5 0 0 0 5 5h1a.5.5 0 0 0 0-1h-1a.5.5 0 0 0 0 1" /></svg>;
const FacebookIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
const InstagramIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
const LinkedinIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>;

export const Navbar = ({ isMenuOpen, setIsMenuOpen }) => {
  const location = useLocation();
  const isLeftAligned = location.pathname === '/contact-us';

  return (
    <>
      {/* MAIN NAVBAR: Fades out completely when the menu is open.
      */}
      <nav className={`absolute top-0 left-0 w-full pt-4 px-8 md:pt-6 md:px-24 flex items-center justify-between z-[200] transition-opacity duration-500 ${isMenuOpen ? 'pointer-events-none' : ''}`}>

        {/* Logo */}
        <div className={`flex items-center ${isLeftAligned ? 'space-x-2' : ''} transition-opacity duration-300 ${isMenuOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
          <Link to="/" onClick={() => setIsMenuOpen(false)}>
            <img
              src={logo}
              alt="Logo"
              className="h-16 md:h-28 w-auto brightness-110 cursor-pointer drop-shadow-lg"
            />
          </Link>
        </div>

        {/* Desktop Menu Trigger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`hidden md:flex items-center space-x-2 transition-colors group pointer-events-auto ${isMenuOpen ? 'text-[#1f1f1f] hover:text-[#6b4f2f]' : 'text-white hover:text-[#D9C394]'}`}
        >
          <span className="font-['Forum',serif] tracking-[0.2em] text-2xl uppercase cursor-pointer">
            {isMenuOpen ? 'Close' : 'Menu'}
          </span>
        </button>

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className={`md:hidden transition-all active:scale-95 pointer-events-auto flex items-center justify-center ${isMenuOpen
            ? 'w-10 h-10 rounded-full border border-[#f1dfb7] text-[#f1dfb7] bg-transparent'
            : 'p-2 border border-white/20 rounded-xl text-white bg-black/20 backdrop-blur-sm'
            }`}
        >
          {isMenuOpen ? (
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          ) : (
            <div className="w-8 h-4 flex flex-col justify-between items-end">
              <span className="h-[1.5px] bg-white transition-all duration-300 w-full"></span>
              <span className="h-[1.5px] bg-white transition-all duration-300 w-2/3"></span>
              <span className="h-[1.5px] bg-white transition-all duration-300 w-1/2"></span>
            </div>
          )}
        </button>
      </nav>

      {/* Render both menus (CSS handles showing/hiding based on screen size) */}
      <DesktopMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
    </>
  );
};

// ---------------------------------------------------------
// DESKTOP SPLIT SCREEN MENU (Only visible on md and up)
// ---------------------------------------------------------
export const DesktopMenu = ({ isOpen, onClose }) => {
  const location = useLocation();

  return (
    <div
      className={`fixed inset-0 z-[150] hidden md:flex justify-end transition-all duration-500 ease-in-out ${isOpen ? 'pointer-events-auto' : 'pointer-events-none'
        }`}
    >
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* RIGHT SIDE: Navigation & Contacts */}
      <div className={`relative w-full max-w-[600px] h-full flex flex-col justify-center pt-20 short:pt-16 xshort:pt-12 px-12 short:px-16 xshort:px-12 bg-[#f1dfb7] text-[#1f1f1f] shadow-2xl transition-transform duration-700 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>

        {/* Navigation Links */}
        <div className="flex flex-col space-y-6 short:space-y-4 xshort:space-y-2 mb-8 short:mb-6 xshort:mb-4">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={`w-max text-3xl short:text-2xl xshort:text-xl font-['Forum',serif] tracking-[0.2em] uppercase transition-colors ${isActive ? 'text-[#6b4f2f]' : 'text-[#4b3b30] hover:text-[#1f1f1f]'}`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>

        {/* Contact Details */}
        <div className="w-16 h-px bg-[#4b3b30]/20 mb-8 short:mb-4 xshort:mb-2"></div>

        <div className="flex flex-col space-y-6 short:space-y-4 xshort:space-y-2 text-[#2f1f0f] font-['Forum',serif] text-xl short:text-lg xshort:text-base tracking-[0.1em]">
          <a href="tel:+918949181484" className="flex items-center space-x-6 hover:text-[#1f1f1f] transition-colors group">
            <div className="p-2 short:p-2 bg-[#4b3b30]/5 rounded-full group-hover:bg-[#4b3b30]/10 transition-colors border border-[#d0b77f] scale-90 short:scale-75 xshort:scale-75">
              <PhoneIcon />
            </div>
            <span>+91 89491 81484</span>
          </a>

          <a href="mailto:admin@earthycrafts.com" className="flex items-center space-x-6 hover:text-[#1f1f1f] transition-colors group">
            <div className="p-2 short:p-2 bg-[#4b3b30]/5 rounded-full group-hover:bg-[#4b3b30]/10 transition-colors border border-[#d0b77f] scale-90 short:scale-75 xshort:scale-75">
              <AtSignIcon />
            </div>
            <span>admin@earthycrafts.com</span>
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-8 short:space-x-6 mt-8 short:mt-4 xshort:mt-2 text-[#2f1f0f]">
          <a href="#" className="hover:text-[#1f1f1f] hover:-translate-y-1 transition-all scale-100 short:scale-90 xshort:scale-75"><WhatsappIcon /></a>
          <a href="#" className="hover:text-[#1f1f1f] hover:-translate-y-1 transition-all scale-100 short:scale-90 xshort:scale-75"><FacebookIcon /></a>
          <a href="#" className="hover:text-[#1f1f1f] hover:-translate-y-1 transition-all scale-100 short:scale-90 xshort:scale-75"><InstagramIcon /></a>
          <a href="#" className="hover:text-[#1f1f1f] hover:-translate-y-1 transition-all scale-100 short:scale-90 xshort:scale-75"><LinkedinIcon /></a>
        </div>
      </div>
    </div>
  );
};

// ---------------------------------------------------------
// MOBILE MENU (Only visible below md)
// ---------------------------------------------------------
export const MobileMenu = ({ isOpen, onClose }) => {
  const location = useLocation();

  const mobileNavItems = [
    ...navItems
  ];

  return (
    <div className={`fixed inset-0 bg-[#0c0c0c] z-[150] flex items-center justify-center p-4 transition-all duration-500 ease-in-out md:hidden ${isOpen ? 'translate-y-0 opacity-100 pointer-events-auto' : 'translate-y-[-20px] opacity-0 pointer-events-none'}`}>
      <div className="w-full max-w-[320px] flex flex-col items-center text-center space-y-6 xs:space-y-8 short:space-y-4 max-h-full">

        {/* Navigation Links */}
        <div className="flex flex-col space-y-3 xs:space-y-5 short:space-y-2">
          {mobileNavItems.map((item) => {
            const isActive = location.pathname === item.href;
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={`group relative text-2xl xs:text-3xl short:text-2xl tracking-[0.2em] font-['Forum',serif] uppercase text-[#f1dfb7] transition-colors ${isActive ? 'text-white' : 'text-[#d5c39d] hover:text-white'}`}
              >
                {item.label}
                <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 h-[1px] bg-white transition-all duration-300 ${isActive ? 'w-full' : 'w-0 group-hover:w-full'}`}></span>
              </Link>
            );
          })}
        </div>

        {/* Custom Inquiry Button */}
        <Link to="/contact-us" className="nav-button bg-black/90 border border-[#d7bf84] text-[#f1dfb7] px-6 py-2 uppercase tracking-widest text-[10px] xs:text-xs short:text-[10px] shadow-lg" onClick={onClose}>Custom Inquiry</Link>

        <div className={`w-full flex flex-col items-center space-y-5 xs:space-y-8 short:space-y-4 pt-4 xs:pt-8 short:pt-4 border-t border-[#f1dfb7]/10 transition-all duration-700 delay-300 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col items-center space-y-2 text-[#f1dfb7] font-['Forum',serif] text-sm xs:text-base short:text-sm tracking-[0.1em]">
            <a href="tel:+918949181484" className="flex items-center space-x-3 hover:text-white transition-colors">
              <PhoneIcon />
              <span>+91 89491 81484</span>
            </a>
            <a href="mailto:admin@earthycrafts.com" className="flex items-center space-x-3 hover:text-white transition-colors">
              <AtSignIcon />
              <span>admin@earthycrafts.com</span>
            </a>
          </div>

          <div className="flex items-center space-x-6 pt-1 text-[#f1dfb7]">
            <a href="#" className="hover:text-white transition-colors scale-75 xs:scale-90 short:scale-75"><WhatsappIcon /></a>
            <a href="#" className="hover:text-white transition-colors scale-75 xs:scale-90 short:scale-75"><FacebookIcon /></a>
            <a href="#" className="hover:text-white transition-colors scale-75 xs:scale-90 short:scale-75"><InstagramIcon /></a>
            <a href="#" className="hover:text-white transition-colors scale-75 xs:scale-90 short:scale-75"><LinkedinIcon /></a>
          </div>
        </div>
      </div>
    </div>
  );
};