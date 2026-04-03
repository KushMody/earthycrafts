import React, { useRef, useEffect, useState } from 'react';
import aboutVideo from '../videos/about-landscape.webm';
const about1 = '/Images/About us/about-1.webp';
const about2 = '/Images/About us/about-2.webp';

const About = () => {
    const videoRef = useRef(null);
    const [activeModal, setActiveModal] = useState(null);
    const [isModalAnimating, setIsModalAnimating] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const [currentSlide, setCurrentSlide] = useState(0);

    const slides = [about1, about2];

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 100);

        if (videoRef.current) {
            videoRef.current.playbackRate = 0.75;
        }

        const slideTimer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % slides.length);
        }, 5000);
        return () => {
            clearTimeout(timer);
            clearInterval(slideTimer);
        };
    }, [slides.length]);

    const modalContent = {
        who: {
            title: "Identity & Heritage",
            content: "We are Earthy Crafts - artisans, designers, and storytellers rooted in Jaipur's rich craft heritage.",
            subContent: "Our journey began with a simple mission: to preserve the ancient art of stone carving while infusing it with contemporary design sensibilities.",
            quote: '"Designed by nature, crafted by hand."'
        },
        story: {
            title: "Mission & Vision",
            content: "Since our founding we have walked the path of blending ancient techniques with contemporary vision.",
            subContent: "Our mission has always been to celebrate heritage without compromising innovation, to create art that resonates with the modern collector.",
            quote: '"Resonating through every stone."'
        },
        location: {
            title: "Location",
            subtitle: "Jaipur",
            content: "Address: J-288, Murtikala Zone, Sarna Doongar, Jaipur, 302012",
            quote: (
                <div className="flex flex-col items-start mt-4">
                    <a
                        href="https://maps.app.goo.gl/U7o9W1R29xtgEGPZ7?g_st=aw"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-8 md:px-12 py-3 md:py-4 bg-black/40 hover:cursor-pointer backdrop-blur-md border border-white/20 text-[#efe7d2] font-['Forum',serif] text-xs md:text-sm tracking-[0.2em] md:tracking-[0.25em] uppercase rounded-sm shadow-[0_8px_0_#8c703b,0_15px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_0_#8c703b,0_8px_15px_rgba(0,0,0,0.4)] hover:translate-y-1 hover:bg-[#c29d59] hover:text-[#080808] hover:border-[#c29d59] active:shadow-[0_0px_0_#8c703b,0_0px_0_rgba(0,0,0,0.4)] active:translate-y-2 transition-all duration-200"
                    >
                        Get Directions
                    </a>
                </div>
            )
        }
    };

    const handleOpenModal = (type) => {
        setActiveModal(type);
        setTimeout(() => setIsModalAnimating(true), 10);
    };

    const handleCloseModal = () => {
        setIsModalAnimating(false);
        setTimeout(() => setActiveModal(null), 300);
    };


    const VerticalMetric = ({ label, value, delay }) => (
        <div
            className={`flex justify-between items-center py-3 border-b border-white/5 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
            style={{ transitionDelay: `${delay}ms` }}
        >
            <span className="text-[#c29d59] text-[9px] tracking-[0.4em] uppercase font-bold opacity-60">{label}</span>
            <span className="text-[#efe7d2] text-xs tracking-[0.15em] font-['Forum',serif] uppercase">{value}</span>
        </div>
    );

    return (
        <div className="w-full h-screen bg-[#080808] overflow-hidden relative">
            <style>{`
                .about-scroll-container::-webkit-scrollbar { display: none; }
                .about-scroll-container { 
                    -ms-overflow-style: none; 
                    scrollbar-width: none; 
                }
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
                .line-height-extra {
                    line-height: 1.8;
                }
                @keyframes scrolldown {
                    0% { transform: translateY(-100%); opacity: 0; }
                    50% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(100%); opacity: 0; }
                }
            `}</style>

            <div className={`about-scroll-container w-full h-full overflow-y-auto snap-y snap-mandatory ${isVisible ? 'is-visible' : ''}`}>

                {/* Section 1: Immersive Cinematic Video */}
                <section className="relative w-full h-full snap-start snap-always overflow-hidden group">
                    <video
                        ref={videoRef}
                        src={aboutVideo}
                        autoPlay
                        muted
                        loop
                        playsInline
                        onLoadedMetadata={(e) => e.target.playbackRate = 0.75}
                        className="absolute inset-0 w-full h-full object-cover brightness-[0.7] transition-transform duration-[20s] ease-linear group-hover:scale-105"
                    />

                    {/* Cinematic Overlays */}
                    <div className="absolute inset-0 z-10">
                        {/* Overall darkening for general legibility - reduced */}
                        <div className="absolute inset-0 bg-[#080808]/25"></div>

                        {/* Radial center overlay to focus on text - lightened */}
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(8,8,8,0.1)_0%,rgba(8,8,8,0.4)_100%)]"></div>

                        {/* Linear bottom-to-top gradient to ground the buttons - softer */}
                        <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/70 via-transparent to-[#080808]/20"></div>
                    </div>

                    {/* Editorial Header (Centered) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                        {/* Subheading */}
                        <div className="flex items-center space-x-4 mb-4 md:mb-8 editorial-reveal" style={{ transitionDelay: '100ms' }}>
                            <div className="h-[1px] w-12 md:w-20 bg-[#c29d59] opacity-40"></div>
                            <span className="text-[#c29d59] font-['Forum',serif] text-xs md:text-sm tracking-[0.6em] md:tracking-[0.8em] uppercase opacity-80 whitespace-nowrap">Heritage Redefined</span>
                            <div className="h-[1px] w-12 md:w-20 bg-[#c29d59] opacity-40 hidden md:block"></div>
                        </div>

                        {/* Main Title */}
                        <h2 className="text-[#efe7d2] font-['Forum',serif] text-[clamp(3.5rem,15vw,6rem)] leading-[0.85] tracking-[-0.02em] uppercase drop-shadow-lg text-center editorial-reveal" style={{ transitionDelay: '300ms' }}>
                            CRAFTING<br />
                            <span className="text-[#c29d59]/90 inline-block mt-2">SILENCE</span>
                        </h2>

                        {/* Bottom Description & Buttons */}
                        <div className="mt-8 md:mt-12 px-6 flex flex-col items-center justify-center editorial-reveal gap-8" style={{ transitionDelay: '500ms' }}>


                            {/* Hero Buttons */}
                            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 mt-8">
                                <button
                                    onClick={() => handleOpenModal('who')}
                                    className="px-8 md:px-12 py-3 md:py-4 bg-black/40 hover:cursor-pointer backdrop-blur-md border border-white/20 text-[#efe7d2] font-['Forum',serif] text-xs md:text-sm tracking-[0.2em] md:tracking-[0.25em] uppercase rounded-sm shadow-[0_8px_0_#8c703b,0_15px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_0_#8c703b,0_8px_15px_rgba(0,0,0,0.4)] hover:translate-y-1 hover:bg-[#c29d59] hover:text-[#080808] hover:border-[#c29d59] active:shadow-[0_0px_0_#8c703b,0_0px_0_rgba(0,0,0,0.4)] active:translate-y-2 transition-all duration-200"
                                >
                                    WHO ARE WE?
                                </button>

                                <button
                                    onClick={() => handleOpenModal('story')}
                                    className="px-8 md:px-12 py-3 md:py-4 bg-black/40 hover:cursor-pointer backdrop-blur-md border border-white/20 text-[#efe7d2] font-['Forum',serif] text-xs md:text-sm tracking-[0.2em] md:tracking-[0.25em] uppercase rounded-sm shadow-[0_8px_0_#8c703b,0_15px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_0_#8c703b,0_8px_15px_rgba(0,0,0,0.4)] hover:translate-y-[4px] hover:bg-[#c29d59] hover:text-[#080808] hover:border-[#c29d59] active:shadow-[0_0px_0_#8c703b,0_0px_0_rgba(0,0,0,0.4)] active:translate-y-[8px] transition-all duration-200"
                                >
                                    OUR MISSION
                                </button>

                                <button
                                    onClick={() => handleOpenModal('location')}
                                    className="px-8 md:px-12 py-3 md:py-4 bg-black/40 hover:cursor-pointer backdrop-blur-md border border-white/20 text-[#efe7d2] font-['Forum',serif] text-xs md:text-sm tracking-[0.2em] md:tracking-[0.25em] uppercase rounded-sm shadow-[0_8px_0_#8c703b,0_15px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_0_#8c703b,0_8px_15px_rgba(0,0,0,0.4)] hover:translate-y-[4px] hover:bg-[#c29d59] hover:text-[#080808] hover:border-[#c29d59] active:shadow-[0_0px_0_#8c703b,0_0px_0_rgba(0,0,0,0.4)] active:translate-y-[8px] transition-all duration-200"
                                >
                                    Locate Us
                                </button>
                            </div>
                        </div>
                    </div>

                </section>
            </div>

            {/* Premium Editorial Modal */}
            {activeModal && (
                <div
                    className={`fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-8 transition-all duration-300 ease-out ${isModalAnimating ? 'bg-[#080808]/95 backdrop-blur-lg opacity-100' : 'bg-[#080808]/0 backdrop-blur-0 opacity-0'}`}
                    onClick={(e) => { if (e.target === e.currentTarget) handleCloseModal(); }}
                >
                    <div className={`relative w-[82vw] max-w-md md:max-w-3xl min-h-[70vh] md:min-h-0 flex flex-col justify-center rounded-3xl border border-[#e8d8a3]/20 bg-[#121212] p-8 md:p-10 shadow-[0_20px_70px_rgba(0,0,0,0.8)] transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${isModalAnimating ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-10 scale-95 opacity-0'}`}>
                        <button
                            onClick={handleCloseModal}
                            className="absolute top-3 right-3 text-[#c29d59] hover:text-white transition-colors duration-200 p-2 rounded-full bg-white/10 hover:bg-white/20 text-lg md:text-xl cursor-pointer"
                            aria-label="Close modal"
                        >
                            ✕
                        </button>

                        <div className="space-y-4">
                            <div>
                                <p className="uppercase text-[#c29d59] tracking-[0.35em] text-[10px] md:text-xs font-semibold mb-2">{modalContent[activeModal].subtitle || 'Narrative'}</p>
                                <h3 className="text-[#efe7d2] font-['Forum',serif] text-3xl md:text-5xl leading-[1.05] uppercase tracking-tight">{modalContent[activeModal].title}</h3>
                                <p className="mt-4 text-[#efe7d2] font-['Forum',serif] text-base md:text-xl leading-relaxed opacity-80">{modalContent[activeModal].subContent}</p>
                            </div>

                            <div className="border-t border-white/10 pt-6">
                                <p className="text-[#efe7d2] font-['Forum',serif] text-base md:text-xl leading-relaxed opacity-80">{modalContent[activeModal].content}</p>
                                <div className="mt-6 text-[#c29d59] font-['Forum',serif] font-normal text-xl md:text-3xl italic opacity-90 leading-snug">{modalContent[activeModal].quote}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default About;
