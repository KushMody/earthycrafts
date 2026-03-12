import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import productsData from '../data.json';

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

  const [collections, setCollections] = useState([]);

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
    <div className={`w-full h-screen md:h-screen bg-[#0c0c0c] pt-36 md:pt-32 pb-8 overflow-y-auto md:overflow-hidden flex flex-col ${isPageVisible ? 'is-visible' : ''}`}>
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
            align-content: center;
        }

        @media (max-width: 1024px) {
            .pll-container { grid-template-columns: repeat(2, 1fr); column-gap: 2rem; }
        }

        @media (max-width: 768px) {
            .pll-container { 
              grid-template-columns: 1fr;
              padding: 20px 24px;
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

      {/* Condensed Premium Header */}
      <div className="max-w-[1400px] mx-auto px-[60px] mb-8 md:mb-12">
        <div className="flex flex-col space-y-2 editorial-reveal" style={{ transitionDelay: '200ms' }}>
          <div className="flex items-center space-x-3">
             <div className="h-[1px] w-8 bg-[#c29d59] opacity-40"></div>
             <span className="text-[#c29d59] font-['Forum',serif] text-[10px] tracking-[0.5em] uppercase opacity-70">Studio Catalog</span>
          </div>
          
          <h1 className="text-[#efe7d2] font-['Forum',serif] text-[clamp(1.5rem,4vw,3.5rem)] leading-none tracking-tight uppercase">
            {getCategoryTitle()}
          </h1>

          <p className="text-[#efe7d2]/30 font-['Forum',serif] text-[12px] md:text-sm max-w-lg italic font-light tracking-wide">
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
  );
};

export default AllCollections;
