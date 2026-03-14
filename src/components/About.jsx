import React, { useRef, useEffect, useState } from 'react';
import aboutVideo from '../videos/about-landscape.webm';
const about1 = '/Images/About us/about-1.webp';
const about2 = '/Images/About us/about-2.webp';

const About = () => {
    const videoRef = useRef(null);
    const [activeModal, setActiveModal] = useState(null);
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
        }
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
                        className="absolute inset-0 w-full h-full object-cover brightness-[0.6] transition-transform duration-[20s] ease-linear group-hover:scale-105"
                    />

                    {/* Editorial Header (Centered) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                        {/* Subheading */}
                        <div className="flex items-center space-x-4 mb-4 md:mb-8 editorial-reveal" style={{ transitionDelay: '100ms' }}>
                            <div className="h-[1px] w-12 md:w-20 bg-[#c29d59] opacity-40"></div>
                            <span className="text-[#c29d59] font-['Forum',serif] text-xs md:text-sm tracking-[0.6em] md:tracking-[0.8em] uppercase opacity-80 whitespace-nowrap">Heritage Redefined</span>
                            <div className="h-[1px] w-12 md:w-20 bg-[#c29d59] opacity-40 hidden md:block"></div>
                        </div>

                        {/* Main Title */}
                        <h2 className="text-[#efe7d2] font-['Forum',serif] text-5xl md:text-[8vw] lg:text-[10vw] leading-[0.85] tracking-[-0.02em] uppercase drop-shadow-lg text-center editorial-reveal" style={{ transitionDelay: '300ms' }}>
                            CRAFTING<br />
                            <span className="text-[#c29d59]/90 inline-block mt-2">SILENCE</span>
                        </h2>

                        {/* Bottom Description & Buttons */}
                        <div className="mt-8 md:mt-12 px-6 flex flex-col items-center justify-center editorial-reveal gap-8" style={{ transitionDelay: '500ms' }}>


                            {/* Hero Buttons */}
                            <div className="flex flex-col sm:flex-row gap-6 sm:gap-10 mt-8">
                                <button
                                    onClick={() => setActiveModal('who')}
                                    className="px-8 md:px-12 py-3 md:py-4 bg-black/40 hover:cursor-pointer backdrop-blur-md border border-white/20 text-[#efe7d2] font-['Forum',serif] text-xs md:text-sm tracking-[0.2em] md:tracking-[0.25em] uppercase rounded-sm shadow-[0_8px_0_#8c703b,0_15px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_0_#8c703b,0_8px_15px_rgba(0,0,0,0.4)] hover:translate-y-[4px] hover:bg-[#c29d59] hover:text-[#080808] hover:border-[#c29d59] active:shadow-[0_0px_0_#8c703b,0_0px_0_rgba(0,0,0,0.4)] active:translate-y-[8px] transition-all duration-200"
                                >
                                    WHO ARE WE?
                                </button>

                                <button
                                    onClick={() => setActiveModal('story')}
                                    className="px-8 md:px-12 py-3 md:py-4 bg-black/40 hover:cursor-pointer backdrop-blur-md border border-white/20 text-[#efe7d2] font-['Forum',serif] text-xs md:text-sm tracking-[0.2em] md:tracking-[0.25em] uppercase rounded-sm shadow-[0_8px_0_#8c703b,0_15px_20px_rgba(0,0,0,0.5)] hover:shadow-[0_4px_0_#8c703b,0_8px_15px_rgba(0,0,0,0.4)] hover:translate-y-[4px] hover:bg-[#c29d59] hover:text-[#080808] hover:border-[#c29d59] active:shadow-[0_0px_0_#8c703b,0_0px_0_rgba(0,0,0,0.4)] active:translate-y-[8px] transition-all duration-200"
                                >
                                    OUR MISSION
                                </button>
                            </div>
                        </div>
                    </div>

                </section>
            </div>

            {/* Premium Editorial Modal */}
            {activeModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-[#080808]/98 backdrop-blur-3xl">
                    <button
                        onClick={() => setActiveModal(null)}
                        className="absolute top-12 right-12 z-20 text-[#c29d59] hover:text-white hover:cursor-pointer transition-colors duration-300 p-4 group"
                        aria-label="Close modal"
                    >
                        <div className="relative w-8 h-8 flex items-center justify-center">
                            <div className="absolute w-8 h-[1px] bg-current rotate-45"></div>
                            <div className="absolute w-8 h-[1px] bg-current -rotate-45"></div>
                        </div>
                    </button>

                    <div className="w-full max-w-6xl flex flex-col md:flex-row gap-20 animate-scale-up text-left">
                        <div className="md:w-1/2 flex flex-col justify-center">
                            <span className="text-[#c29d59] font-['Forum',serif] text-[11px] tracking-[0.8em] uppercase mb-10 block opacity-60">Narrative</span>
                            <h2 className="text-[#efe7d2] font-['Forum',serif] text-6xl lg:text-9xl mb-12 leading-[0.8] tracking-tighter uppercase drop-shadow-sm">
                                {modalContent[activeModal].title.split(' ').map((word, i) => (
                                    <React.Fragment key={i}>{word}<br /></React.Fragment>
                                ))}
                            </h2>
                        </div>

                        <div className="md:w-1/2 flex flex-col justify-center border-l border-white/5 pl-20 py-10">
                            <p className="text-[#efe7d2] font-['Forum',serif] text-2xl lg:text-3xl leading-relaxed mb-16 opacity-90 first-letter:text-6xl first-letter:text-[#c29d59] first-letter:mr-4">
                                {modalContent[activeModal].content}
                            </p>

                            <div className="space-y-10 group">
                                <div className="h-[1px] w-20 bg-[#c29d59] group-hover:w-full transition-all duration-[2s]"></div>
                                <p className="text-[#efe7d2]/50 font-['Forum',serif] text-lg lg:text-xl leading-relaxed italic tracking-wide">
                                    {modalContent[activeModal].subContent}
                                </p>
                                <div className="text-[#c29d59] font-['Forum',serif] text-3xl lg:text-4xl italic opacity-80 mt-12 text-right">
                                    {modalContent[activeModal].quote}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default About;
