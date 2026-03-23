import React, { useEffect, useState } from 'react';

const Reviews = () => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), 100);
        return () => clearTimeout(timer);
    }, []);

    const reviews = [
        {
            id: 1,
            author: "Julian Thorne",
            location: "New York, NY",
            content: "The 'Ethereal Monolith' I acquired is more than just stone; it's a conversation with time itself.",
            rating: 5,
            image: "/Images/Products/BESLANA/Garden Landscape/Beslana Buddha Sculpture.jpg"
        },
        {
            id: 2,
            author: "Sophia Moretti",
            location: "Florence, Italy",
            content: "As a collector of fine marble, I am astounded by Earthy Crafts' ability to breathe life into such rigid material.",
            rating: 5,
            image: "/Images/Products/BESLANA/Home/Artistic Beslana Marble Vase.jpg"
        },
        {
            id: 3,
            author: "Kenji Sato",
            location: "Kyoto, Japan",
            content: "There is a profound silence in their work that resonates with Zen philosophy. Perfectly balanced.",
            rating: 5,
            image: "/Images/Products/Agra Red/Garden Landscape/Agra Red Hexagonal Lantern.webp"
        },
        {
            id: 4,
            author: "Aria Montgomery",
            location: "London, UK",
            content: "Every curve tells a story of patience and mastery. My home feels transformed by these sculptured forms.",
            rating: 5,
            image: "/Images/Products/BESLANA/Garden Landscape/Three Wise Monkeys Sculpture.jpg"
        }
    ];

    return (
        <div className={`w-full min-h-screen md:h-screen bg-[#080808] flex flex-col justify-start px-4 md:px-10 font-['Forum',serif] transition-opacity duration-1000 overflow-y-auto md:overflow-hidden scroll-smooth ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
            <style>{`
                .review-card {
                    background: rgba(255, 255, 255, 0.02);
                    backdrop-filter: blur(25px);
                    border: 1px solid rgba(232, 216, 163, 0.1);
                    transition: all 0.6s cubic-bezier(0.16, 1, 0.3, 1);
                    width: 100%;
                    max-width: 320px;
                    flex-shrink: 0;
                    min-height: 400px;
                    height: auto;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    border-radius: 20px;
                    margin-bottom: 2rem;
                }
                @media (min-width: 768px) {
                    .review-card {
                        width: 300px;
                        height: 420px;
                        margin-bottom: 0;
                    }
                }
                .review-card:hover {
                    background: rgba(255, 255, 255, 0.05);
                    border-color: rgba(194, 157, 89, 0.5);
                    transform: translateY(-8px);
                    box-shadow: 0 20px 40px rgba(0,0,0,0.5);
                }
                .editorial-reveal {
                    opacity: 0;
                    transform: translateY(20px);
                    filter: blur(10px);
                    transition: all 1.2s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .is-visible .editorial-reveal {
                    opacity: 1;
                    transform: translateY(0);
                    filter: blur(0);
                }
                .hide-scrollbar::-webkit-scrollbar {
                    display: none;
                }
                .hide-scrollbar {
                    -ms-overflow-style: none;
                    scrollbar-width: none;
                }
            `}</style>

            <div className={`max-w-full mx-auto ${isVisible ? 'is-visible' : ''} flex flex-col items-center h-full pt-32 md:pt-28`}>
                {/* Header - Very Compact on desktop */}
                <div className="text-center mb-8 md:mb-5 editorial-reveal" style={{ transitionDelay: '100ms' }}>
                    <div className="flex items-center justify-center space-x-3 mb-1">
                        <div className="h-[1px] w-6 md:w-8 bg-[#c29d59]/40"></div>
                        <span className="text-[#c29d59] tracking-[0.4em] md:tracking-[0.5em] text-[9px] md:text-[10px] uppercase font-light">Collector Testimonials</span>
                        <div className="h-[1px] w-6 md:w-8 bg-[#c29d59]/40"></div>
                    </div>
                    <h1 className="text-[#efe7d2] text-[clamp(1.4rem,7vw,2.4rem)] leading-none uppercase tracking-tight px-4">
                        Voices of the <span className="text-[#c29d59]">Collection</span>
                    </h1>
                </div>

                {/* Gallery */}
                <div className="w-full flex list-none flex-col md:flex-row md:justify-center items-center md:items-stretch gap-0 md:gap-6 pt-5 pb-10 md:pb-4 px-4 md:overflow-x-auto hide-scrollbar">
                    {reviews.map((review, index) => (
                        <div
                            key={review.id}
                            className="review-card editorial-reveal"
                            style={{ transitionDelay: `${200 + index * 100}ms` }}
                        >
                            {/* Top Portion: Image */}
                            <div className="h-[180px] md:h-[160px] w-full overflow-hidden relative">
                                <img
                                    src={review.image}
                                    alt={review.author}
                                    className="w-full h-full object-cover transition-transform duration-[2500ms] hover:scale-110"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/50 to-transparent"></div>
                            </div>

                            {/* Bottom Portion: Content */}
                            <div className="flex-1 p-6 md:p-5 flex flex-col justify-between">
                                <div>
                                    <div className="flex text-[#c29d59] mb-4 md:mb-2 space-x-1">
                                        {[...Array(review.rating)].map((_, i) => (
                                            <span key={i} className="text-sm">★</span>
                                        ))}
                                    </div>
                                    <h4 className="text-[#efe7d2] text-xl md:text-lg uppercase tracking-wider mb-0.5">{review.author}</h4>
                                    <p className="text-[#c29d59]/60 text-xs md:text-[9px] uppercase tracking-[0.2em] mb-4 md:mb-2">{review.location}</p>
                                    <blockquote className="text-[#efe7d2] text-base md:text-sm leading-relaxed italic line-clamp-6 md:line-clamp-5">
                                        "{review.content}"
                                    </blockquote>
                                </div>
                                <div className="mt-4 md:mt-2 pt-4 md:pt-2 border-t border-white/5 flex justify-end">
                                    <div className="w-10 md:w-8 h-[1px] bg-[#c29d59]/20 self-center"></div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Tiny CTA */}
                <div className="editorial-reveal mt-2 md:mt-0 mb-6 md:mb-4" style={{ transitionDelay: '700ms' }}>
                    <a
                        href="/contact-us"
                        className="text-[#c29d59] text-[10px] tracking-[0.4em] uppercase hover:text-[#efe7d2] transition-colors flex items-center gap-3 group"
                    >
                        <span>Begin Your Legacy</span>
                        <div className="h-[1px] w-6 bg-[#c29d59]/30 transition-all group-hover:w-12 group-hover:bg-[#efe7d2]"></div>
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Reviews;
