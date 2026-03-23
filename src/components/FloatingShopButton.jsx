import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const FloatingButton = ({ icon, label, subLabel, targetPath }) => {
    const navigate = useNavigate();
    const [isExpanded, setIsExpanded] = useState(false);
    const [isTouch, setIsTouch] = useState(false);
    const timerRef = useRef(null);
    const lastInteractionTime = useRef(0);
    const pointerType = useRef('');

    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener('resize', handleResize);
        const checkTouch = () => {
            setIsTouch('ontouchstart' in window || navigator.maxTouchPoints > 0);
        };
        checkTouch();
        window.addEventListener('touchstart', checkTouch, { once: true });
        return () => {
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('touchstart', checkTouch);
        };
    }, []);

    useEffect(() => {
        if (isExpanded && (isTouch || pointerType.current === 'touch')) {
            if (timerRef.current) clearTimeout(timerRef.current);
            timerRef.current = setTimeout(() => {
                setIsExpanded(false);
            }, 2000);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, [isExpanded, isTouch]);

    const handlePointerDown = (e) => {
        pointerType.current = e.pointerType;
    };

    const handlePointerEnter = (e) => {
        pointerType.current = e.pointerType;
        if (e.pointerType === 'mouse') setIsExpanded(true);
    };

    const handlePointerLeave = (e) => {
        if (e.pointerType === 'mouse') setIsExpanded(false);
    };

    const handleClick = (e) => {
        const now = Date.now();
        const isTouchInteraction = pointerType.current === 'touch' || (isTouch && pointerType.current !== 'mouse');

        if (isTouchInteraction) {
            // Debounce for double-fire events
            if (now - lastInteractionTime.current < 300) return;
            lastInteractionTime.current = now;

            if (!isExpanded) {
                setIsExpanded(true);
            } else {
                if (timerRef.current) clearTimeout(timerRef.current);
                navigate(targetPath);
            }
        } else {
            navigate(targetPath);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 100 }}
            animate={{
                opacity: 1,
                x: isExpanded ? 0 : (isMobile ? "calc(100% - 70px)" : "calc(100% - 100px)")
            }}
            exit={{ opacity: 0, x: 100 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            onPointerDown={handlePointerDown}
            onPointerEnter={handlePointerEnter}
            onPointerLeave={handlePointerLeave}
            onClick={handleClick}
            className="cursor-pointer pointer-events-auto"
        >
            <div className="group relative flex items-center gap-3 md:gap-4 bg-[#0a0a0a]/95 backdrop-blur-3xl border border-white/10 pl-4 pr-6 py-2.5 md:pl-5 md:pr-8 md:py-3.5 rounded-l-full shadow-[-20px_10px_50px_rgba(0,0,0,0.5)] transition-all hover:border-[#C5A059]/40 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:animate-[shine_1.5s_ease-in-out_infinite] transition-transform"></div>

                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#C5A059] rounded-full flex items-center justify-center text-[#1a1a1a] shadow-[0_0_20px_rgba(197,160,89,0.3)] relative z-10 group-hover:scale-105 transition-all duration-500 group-hover:shadow-[0_0_30px_rgba(197,160,89,0.5)] flex-shrink-0">
                    {icon}
                </div>

                <div className={`flex flex-col items-start relative z-10 transition-all duration-700 ${isExpanded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'} whitespace-nowrap`}>
                    <span className="text-white/40 font-['Forum',serif] text-[9px] md:text-[10px] uppercase tracking-[0.3em] leading-none mb-1">{subLabel}</span>
                    <span className="text-[#efe7d2] font-['Forum',serif] text-xs md:text-base uppercase tracking-[0.15em] relative z-10 transition-colors group-hover:text-[#C5A059]">
                        {label}
                    </span>
                </div>

                <div className="absolute inset-0 rounded-l-full border-l border-t border-b border-white/5 group-hover:border-[#C5A059]/20 transition-colors pointer-events-none"></div>
            </div>
        </motion.div>
    );
};

const FloatingShopButton = () => {
    const location = useLocation();
    const isAllProductsPage = location.pathname === '/all-products';
    const isCategoriesPage = location.pathname === '/categories';
    const isReviewsPage = location.pathname === '/reviews';

    useEffect(() => {
        // Reset scroll or expansion state if needed
    }, [location.pathname]);

    return (
        <div className="fixed bottom-10 md:bottom-12 right-0 z-[100] flex flex-col items-end gap-4 md:gap-6 pointer-events-none">
            <style dangerouslySetInnerHTML={{
                __html: `
                @keyframes shine {
                    0% { transform: translateX(-100%) skewX(-15deg); }
                    100% { transform: translateX(200%) skewX(-15deg); }
                }
            `}} />

            <AnimatePresence mode="popLayout">
                {!isReviewsPage && (
                    <FloatingButton
                        key="reviews"
                        targetPath="/reviews"
                        subLabel="read our"
                        label="Reviews"
                        icon={
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                        }
                    />
                )}

                {!isAllProductsPage && (
                    <FloatingButton
                        key="products"
                        targetPath="/all-products"
                        subLabel="search from"
                        label="All Products"
                        icon={
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="md:w-6 md:h-6">
                                <circle cx="11" cy="11" r="8" />
                                <path d="m21 21-4.3-4.3" />
                            </svg>
                        }
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default FloatingShopButton;
