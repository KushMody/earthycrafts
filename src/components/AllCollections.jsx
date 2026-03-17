import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import productsData from '../data.json';

const getImagePath = (imagePath) => {
  try {
    if (!imagePath) return '';
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) return imagePath;
    const relativePath = imagePath.startsWith('./') ? `../${imagePath.substring(2)}` : imagePath;
    return new URL(relativePath, import.meta.url).href;
  } catch (error) {
    return imagePath;
  }
};

const ProjectLinkAnimation = ({ href, text, subtitle, imageSrc, delay }) => {
  const linkRef = useRef(null);
  const imageRef = useRef(null);
  const [isHovering, setIsHovering] = useState(false);

  // Animation state references
  const animState = useRef({
    currentX: 0.5,
    currentY: 0.5,
    targetX: 0.5,
    targetY: 0.5,
    currentScale: 0,
    targetScale: 0,
    currentRotate: -12.5,
    targetRotate: -12.5,
    currentOpacity: 0
  });

  const requestRef = useRef();
  const posLerp = 0.1;
  const scaleLerp = 0.1;
  const rotateLerp = 0.1;

  const mapRange = (value, inMin, inMax, outMin, outMax) => {
    return ((value - inMin) * (outMax - outMin)) / (inMax - inMin) + outMin;
  };

  const animate = () => {
    const state = animState.current;
    state.currentX += (state.targetX - state.currentX) * posLerp;
    state.currentY += (state.targetY - state.currentY) * posLerp;
    state.currentScale += (state.targetScale - state.currentScale) * scaleLerp;
    state.currentRotate += (state.targetRotate - state.currentRotate) * rotateLerp;

    const targetOpacity = isHovering ? 1 : 0;
    state.currentOpacity += (targetOpacity - state.currentOpacity) * scaleLerp;

    const normX = state.currentX - 0.5;
    const normY = state.currentY - 0.5;
    const leftPct = mapRange(normX, -0.5, 0.5, 70, 60);
    const topPct = mapRange(normY, -0.5, 0.5, 60, 40);

    if (imageRef.current) {
      imageRef.current.style.left = `${leftPct}%`;
      imageRef.current.style.top = `${topPct}%`;
      imageRef.current.style.opacity = state.currentOpacity;
      imageRef.current.style.transform = `translate(-50%, -50%) scale(${state.currentScale}) rotate(${state.currentRotate}deg)`;
    }
    requestRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, [isHovering]);

  useEffect(() => {
    animState.current.targetScale = isHovering ? 1 : 0;
    animState.current.targetRotate = isHovering ? 12.5 : -12.5;
  }, [isHovering]);

  const handleMouseMove = (e) => {
    if (!linkRef.current) return;
    const rect = linkRef.current.getBoundingClientRect();
    animState.current.targetX = (e.clientX - rect.left) / rect.width;
    animState.current.targetY = (e.clientY - rect.top) / rect.height;
  };

  const handleTouchMove = (e) => {
    if (e.touches && e.touches.length > 0 && linkRef.current) {
      const rect = linkRef.current.getBoundingClientRect();
      animState.current.targetX = (e.touches[0].clientX - rect.left) / rect.width;
      animState.current.targetY = (e.touches[0].clientY - rect.top) / rect.height;
    }
  };



  return (
    <Link
      to={href}
      ref={linkRef}
      className="pll-link editorial-reveal"
      style={{ transitionDelay: `${delay}ms` }}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onMouseMove={handleMouseMove}
      onTouchStart={(e) => {
        setIsHovering(true);
        handleTouchMove(e);
      }}
      onTouchEnd={() => {
        setTimeout(() => setIsHovering(false), 300);
      }}
      onTouchCancel={() => setIsHovering(false)}
      onTouchMove={handleTouchMove}
    >
      <div className="pll-text-content">
        <span className="pll-heading" aria-label={text}>
          {text.split(' ').map((word, wordIndex) => (
            <React.Fragment key={wordIndex}>
              {word.split('').map((char, charIndex) => (
                <span className="pll-letter-wrapper" key={`${wordIndex}-${charIndex}`}>
                  <span className="pll-letter-inner">{char}</span>
                </span>
              ))}
              {wordIndex < text.split(' ').length - 1 && (
                <span className="pll-letter-wrapper">
                  <span className="pll-letter-inner">&nbsp;</span>
                </span>
              )}
            </React.Fragment>
          ))}
        </span>
        <span className="pll-subheading">{subtitle}</span>
      </div>

      <img
        ref={imageRef}
        src={getImagePath(imageSrc)}
        alt={text}
        className="pll-floating-image"
        style={{ borderRadius: '10px' }}
      />

      <div className="pll-arrow-wrapper">
        <div className="pll-arrow-inner">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2" className="pll-arrow-icon">
            <line x1="5" y1="12" x2="19" y2="12"></line>
            <polyline points="12 5 19 12 12 19"></polyline>
          </svg>
        </div>
      </div>
    </Link>
  );
};

const AllCollections = () => {
  const { category } = useParams();
  const [isPageVisible, setIsPageVisible] = useState(false);

  const categoryIdToNameMap = {
    'home': 'INTERIOR SPACES',
    'outdoor': 'OUTDOOR LIVING',
    'garden': 'GARDEN & LANDSCAPE'
  };

  const getCategoryTitle = () => {
    return categoryIdToNameMap[category] || "OUR COLLECTIONS";
  };

  const heroImages = [
    '/Images/Home Page/4-1.jpg',
    '/Images/Home Page/3-1.jpg',
    '/Images/Home Page/1-1.jpg',
    '/Images/Home Page/5-1.jpg',
    '/Images/Home Page/2-1.jpg'
  ];

  const [collections, setCollections] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [heroImages.length]);

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsPageVisible(true), 100);

    if (productsData && productsData.products) {
      // Internal filtering names
      const internalFilterMap = {
        'home': 'Home',
        'outdoor': 'Outdoor',
        'garden': 'Garden Landscape'
      };

      const targetCategoryName = internalFilterMap[category];

      const uniqueCollectionNames = [...new Set(productsData.products
        .filter(p => targetCategoryName ? p.categories.includes(targetCategoryName) : true)
        .map(p => p.collection)
      )];

      const dynamicCollections = uniqueCollectionNames.map(name => {
        const featuredProduct = productsData.products.find(p =>
          p.collection === name &&
          (targetCategoryName ? p.categories.includes(targetCategoryName) : true)
        );

        return {
          id: name.toLowerCase().replace(/\s+/g, '-'),
          text: name.toUpperCase(),
          subtitle: "Handmade with love.",
          image: featuredProduct ? featuredProduct.image : ""
        };
      });

      setCollections(dynamicCollections);
    }

    return () => clearTimeout(timer);
  }, [category]);

  return (
    <div className={`relative w-full h-screen bg-[#0c0c0c] overflow-hidden ${isPageVisible ? 'is-visible' : ''}`}>
      <style>{`
        .bg-transition {
          transform: scale(1.1);
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

        .pll-container {
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            padding: 0 60px;
            box-sizing: border-box;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            column-gap: 3rem;
            row-gap: 0.5rem;
            flex: 1;
            align-content: start;
            z-index: 20;
        }

        @media (max-width: 1024px) {
            .pll-container { grid-template-columns: repeat(2, 1fr); column-gap: 2rem; }
        }

        @media (max-width: 768px) {
            .pll-container { 
              grid-template-columns: 1fr;
              padding: 20px 40px;
              column-gap: 0;
              align-content: start;
            }
        }

        .pll-link {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: space-between;
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            padding: 1rem 0;
            cursor: pointer;
            text-decoration: none !important;
            transition: border-color 0.6s cubic-bezier(0.16, 1, 0.3, 1), transform 0.2s ease;
        }

        .pll-link:active { transform: scale(0.99); }
        .pll-link:hover { border-color: #d4af37; }

        .pll-heading {
            font-family: 'Forum', serif;
            font-weight: 400;
            font-size: clamp(1.2rem, 1.8vw, 1.8rem);
            text-transform: uppercase;
            color: #C5A059;
            transition: color 0.6s cubic-bezier(0.16, 1, 0.3, 1);
            line-height: 1.1;
            display: flex;
            flex-wrap: wrap;
            letter-spacing: 0.05em;
        }

        .pll-link:hover .pll-heading { color: #fff; }

        .pll-letter-wrapper { display: inline-block; transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); white-space: pre; }
        .pll-letter-inner { display: inline-block; transition: transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1); }

        .pll-link:hover .pll-letter-wrapper { transform: translateX(-10px); }
        .pll-link:hover .pll-letter-inner { transform: translateX(10px); }

        .pll-subheading { 
          display: block; 
          color: rgba(255, 255, 255, 0.3); 
          font-family: 'Inter Tight', sans-serif; 
          font-size: 0.65rem; 
          margin-top: 0.35rem;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .pll-floating-image {
            position: absolute;
            z-index: 100;
            width: 130px;
            height: 170px;
            object-fit: cover;
            pointer-events: none;
            opacity: 0;
            transform: translate(-50%, -50%) scale(0) rotate(-12.5deg);
            top: 50%;
            left: 50%;
            box-shadow: 0 15px 40px rgba(0,0,0,0.5);
        }

        @media (max-width: 768px) {
            .pll-floating-image { width: 100px; height: 130px; }
        }

        .pll-arrow-icon { width: 20px; height: 20px; color: white; transition: color 0.4s ease; opacity: 0.3; }
        .pll-link:hover .pll-arrow-icon { color: #d4af37; opacity: 0.8; }

        ${Array.from({ length: 40 }).map((_, i) => `
          .pll-letter-wrapper:nth-child(${i + 1}),
          .pll-letter-wrapper:nth-child(${i + 1}) .pll-letter-inner {
              transition-delay: ${i * 15}ms;
          }
        `).join('')}
      `}</style>

      {/* Background Slideshow Layer */}
      <div className="absolute inset-0 z-0">
        {heroImages.map((img, index) => (
          <img
            key={index}
            src={getImagePath(img)}
            alt={`Background slide ${index + 1}`}
            className={`absolute inset-0 w-full h-full object-cover brightness-[0.45] contrast-[1.1] scale-110 bg-transition 
              ${index === currentSlide ? 'hero-visible hero-stacking' :
                index === (currentSlide - 1 + heroImages.length) % heroImages.length ? 'hero-prev' : ''}`}
          />
        ))}
        {/* Cinematic Overlays */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0c0c0c]/85 via-transparent to-[#0c0c0c]/95 z-10"></div>
        <div className="absolute inset-0 backdrop-blur-[1.5px] bg-black/30 z-10"></div>
      </div>

      {/* Content Layer (Top of Background) */}
      <div className="absolute inset-0 z-20 flex flex-col overflow-y-auto pt-22 md:pt-26">
        {/* Condensed Premium Header */}
        <div className="max-w-[1400px] mx-auto w-full px-8 md:px-[60px] mb-6 md:mb-8 flex-shrink-0">
          <div className="flex flex-col items-center text-center space-y-3 editorial-reveal" style={{ transitionDelay: '200ms' }}>
            <div className="flex items-center justify-center">
              <div className="h-[1px] w-8 bg-[#c29d59] opacity-60"></div>
              <span className="text-[#c29d59] font-['Forum',serif] text-[10px] tracking-[0.5em] uppercase opacity-90">Studio Catalog</span>
              <div className="h-[1px] w-8 bg-[#c29d59] opacity-60"></div>
            </div>

            <h1 className="text-[#efe7d2] font-['Forum',serif] text-[clamp(1.8rem,7.5vw,4.5rem)] leading-tight tracking-tight uppercase drop-shadow-lg whitespace-nowrap">
              {getCategoryTitle()}
            </h1>

            <p className="text-[#efe7d2]/60 font-['Forum',serif] text-[14px] md:text-base max-w-lg italic font-light tracking-wide drop-shadow-md mx-auto">
              Explore our curated selection of hand-crafted masterpieces.
            </p>
          </div>
        </div>

        <div className="pll-container">
          {collections.map((item, index) => (
            <ProjectLinkAnimation
              key={item.id}
              href={`/collection/${item.id}${category ? `?category=${category}` : ''}`}
              text={item.text}
              subtitle={item.subtitle}
              imageSrc={item.image}
              delay={300 + (index * 50)}
            />
          ))}
          {collections.length === 0 && (
            <div className="col-span-full text-center py-20 editorial-reveal" style={{ transitionDelay: '400ms' }}>
              <p className="text-[#C5A059] font-['Forum',serif] text-xl opacity-60 italic">
                No collections found for this category.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllCollections;
