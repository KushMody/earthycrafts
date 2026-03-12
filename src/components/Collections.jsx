import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import homeVideo from '../videos/mainCollections/home.mp4';
import outdoorVideo from '../videos/mainCollections/outdoor.mp4';
import gardenVideo from '../videos/mainCollections/garden-landscape.mp4';

const Collections = () => {
    const sections = [
        {
            title: "Interior-Spaces",
            subtitle: "Handmade with love, each piece is as unique as its origin.",
            video: homeVideo,
            id: "home"
        },
        {
            title: "Outdoor-Living",
            subtitle: "Earthy and alive, designed to weather the most beautiful elements.",
            video: outdoorVideo,
            id: "outdoor"
        },
        {
            title: "Garden &-Landscape",
            subtitle: "Uniquely imagined creations that breathe life into your greenery.",
            video: gardenVideo,
            id: "garden"
        }
    ];

    const videoRefs = useRef([]);
    const [activeIndex, setActiveIndex] = useState(-1);

    useEffect(() => {
        const observerOptions = {
            threshold: 0.6,
            rootMargin: "0px"
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const index = sections.findIndex(s => s.id === entry.target.id);
                    if (index !== -1) setActiveIndex(index);
                }
            });
        }, observerOptions);

        sections.forEach(section => {
            const el = document.getElementById(section.id);
            if (el) observer.observe(el);
        });

        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        videoRefs.current.forEach(video => {
            if (video) {
                video.playbackRate = 0.75;
                video.play().catch(() => { });
            }
        });
    });

    return (
        <div className="w-full h-[100dvh] md:h-screen overflow-hidden bg-[#0c0c0c]">
            <style>{`
                .collections-scroll-container::-webkit-scrollbar { display: none; }
                .collections-scroll-container { 
                    -ms-overflow-style: none; 
                    scrollbar-width: none; 
                }
                
                .editorial-reveal {
                    opacity: 0;
                    filter: blur(15px);
                    transform: translateY(20px);
                    transition: all 1.8s cubic-bezier(0.16, 1, 0.3, 1);
                }
                
                .section-visible .editorial-reveal {
                    opacity: 1;
                    filter: blur(0);
                    transform: translateY(0);
                }

                .bg-transition {
                    transform: scale(1.1);
                    opacity: 0.3;
                    transition: transform 2.5s cubic-bezier(0.16, 1, 0.3, 1), 
                                opacity 1.5s cubic-bezier(0.16, 1, 0.3, 1),
                                filter 1.5s cubic-bezier(0.16, 1, 0.3, 1);
                    filter: blur(4px);
                }

                .section-visible .bg-transition {
                    transform: scale(1);
                    opacity: 1;
                    filter: blur(1px);
                }

                .section-visible .bg-parallax {
                    transform: scale(1);
                }

                @keyframes scrolldown {
                    0% {
                        transform: translateX(-50%) translateY(20%) rotate(45deg);
                        opacity: 0.7;
                    }
                    50% {
                        transform: translateX(-50%) translateY(0%) rotate(45deg);
                        opacity: 0.2;
                    }
                    100% {
                        transform: translateX(-50%) translateY(20%) rotate(45deg);
                        opacity: 0.7;
                    }
                }

                .animate-scrolldown {
                    animation: scrolldown 1.2s ease-in-out infinite;
                }

                .animate-scrolldown-delayed {
                    animation: scrolldown 1.2s ease-in-out infinite 0.15s;
                }
            `}</style>

            <div className="collections-scroll-container w-full h-[100dvh] md:h-full overflow-y-auto snap-y snap-mandatory bg-[#0c0c0c] pb-[100px] md:pb-0">
                {/* Custom Mouse Scroll Indicator (Right Side) */}
                <div className="fixed right-6 md:right-10 top-1/2 -translate-y-1/2 z-[60] flex flex-col items-center pointer-events-none group">
                    <div className="w-[32px] h-[64px] border-2 border-[#c29d59]/50 rounded-full relative backdrop-blur-md transition-all duration-500 group-hover:border-[#c29d59]/80 shadow-[0_0_20px_rgba(0,0,0,0.3)]">
                        {/* Dynamic Scroll Dot */}
                        <div
                            className="absolute left-1/2 w-2.5 h-2.5 bg-[#c29d59] rounded-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] shadow-[0_0_15px_rgba(194,157,89,0.8)]"
                            style={{
                                top: activeIndex === 0 ? '20%' : activeIndex === 1 ? '50%' : '80%',
                                transform: `translate(-50%, -50%)`
                            }}
                        ></div>
                    </div>
                </div>

                {sections.map((section, index) => (
                    <section
                        key={section.id}
                        id={section.id}
                        className={`relative w-full h-[100dvh] snap-start snap-always overflow-hidden flex items-center justify-center transition-all duration-1000 ${activeIndex === index ? 'section-visible' : 'section-hidden'}`}
                    >
                        {/* Background Video */}
                        <div className="absolute inset-0 z-0 overflow-hidden">
                            <video
                                ref={el => videoRefs.current[index] = el}
                                src={section.video}
                                autoPlay
                                muted
                                loop
                                playsInline
                                onLoadedMetadata={(e) => e.target.playbackRate = 0.75}
                                className="w-full h-full object-cover brightness-[0.35] bg-transition"
                            />
                            {/* Layered Gradient for extra depth */}
                            <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-black/80"></div>
                            <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px]"></div>
                        </div>

                        {/* Decorative Space Number (Subtle Watermark Behind) */}
                        <div className={`absolute inset-0 flex items-center justify-center pointer-events-none transition-all duration-1000 ${activeIndex === index ? 'opacity-[0.1] scale-100' : 'opacity-0 scale-95'}`}>
                            <span className="text-[#efe7d2] font-['Cinzel',serif] text-[10rem] md:text-[30rem] font-bold leading-none select-none">
                                0{index + 1}
                            </span>
                        </div>

                        {/* Content Overlay */}
                        <div className="relative z-10 text-center px-6 max-w-4xl">
                            <div className="flex items-center justify-center space-x-6 mb-8 editorial-reveal" style={{ transitionDelay: '100ms' }}>
                                <div className="h-[1px] w-12 bg-[#c29d59]/30"></div>
                                <span className="text-[#c29d59] tracking-[0.6em] font-['Forum',serif] text-[10px] md:text-xs uppercase opacity-80">Collection</span>
                                <div className="h-[1px] w-12 bg-[#c29d59]/30"></div>
                            </div>

                            <h2 className="text-[#efe7d2] font-['Forum',serif] text-5xl md:text-7xl lg:text-9xl mb-6 tracking-tight uppercase leading-[0.8] drop-shadow-2xl editorial-reveal" style={{ transitionDelay: '300ms' }}>
                                {section.title.split('-').map((word, i) => (
                                    <span key={i} className="block">{word}</span>
                                ))}
                            </h2>

                            <p className="text-[#efe7d2]/70 font-['Forum',serif] text-sm md:text-lg lg:text-xl max-w-md mx-auto mb-12 leading-relaxed tracking-wide italic font-light editorial-reveal" style={{ transitionDelay: '500ms' }}>
                                "{section.subtitle}"
                            </p>

                            <Link to={`/all-collections/${section.id}`} className="group relative inline-flex flex-col items-center cursor-pointer editorial-reveal" style={{ transitionDelay: '700ms' }}>
                                <span className="text-[#efe7d2] text-[10px] md:text-xs tracking-[0.5em] font-['Forum',serif] transition-all duration-500 uppercase opacity-90 group-hover:text-[#c29d59]">
                                    DISCOVER COLLECTION
                                </span>
                                <div className="mt-4 w-12 h-[1px] bg-[#c29d59]/50 transition-all duration-700 group-hover:w-40 group-hover:bg-[#c29d59]"></div>
                            </Link>
                        </div>

                        {/* Scroll Down Indicator */}
                        {index < sections.length - 1 && (
                            <div className={`absolute bottom-10 left-1/2 z-[80] transition-opacity duration-1000 ${activeIndex === index ? 'opacity-100' : 'opacity-0'}`}>
                                <div className="relative w-10">
                                    {/* Top Arrow */}
                                    <div className="absolute bottom-6 left-0 w-8 h-8 border-r-4 border-b-4 border-[#efe7d2]/60 animate-scrolldown-delayed"></div>
                                    {/* Bottom Arrow */}
                                    <div className="absolute bottom-2 left-0 w-8 h-8 border-r-4 border-b-4 border-[#efe7d2]/60 animate-scrolldown"></div>
                                </div>
                            </div>
                        )}
                    </section>
                ))}
            </div>
        </div>
    );
};

export default Collections;
