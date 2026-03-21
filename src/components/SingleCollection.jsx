import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import productsData from '../data.json';

const ProductCard = ({ product, index, onOpenLightbox, getImagePath, targetCategoryName }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  // Animation Refs - Modern subtle tilt effect
  const DEFAULT_TILT_X = 0;
  const DEFAULT_TILT_Y = 0;
  const currentX = useRef(DEFAULT_TILT_X);
  const currentY = useRef(DEFAULT_TILT_Y);
  const targetX = useRef(DEFAULT_TILT_X);
  const targetY = useRef(DEFAULT_TILT_Y);
  const currentEntranceY = useRef(30);
  const targetEntranceY = useRef(30);
  const requestRef = useRef();

  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  useEffect(() => {
    // Staggered entrance
    const timer = setTimeout(() => {
      setIsVisible(true);
      targetEntranceY.current = 0;
    }, Math.min(index * 100, 600));

    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;

    const animate = () => {
      currentX.current = lerp(currentX.current, targetX.current, 0.05);
      currentY.current = lerp(currentY.current, targetY.current, 0.05);
      currentEntranceY.current = lerp(currentEntranceY.current, targetEntranceY.current, 0.05);

      if (cardRef.current) {
        cardRef.current.style.transform = `translateY(${currentEntranceY.current}px) perspective(2000px) rotateX(${currentY.current}deg) rotateY(${currentX.current}deg)`;
      }

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  const handleMouseMove = (e) => {
    if (isTouch || window.innerWidth <= 768 || !cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Slightly increased hover-only tilt (range [-5, 5] degrees for better visibility)
    const offsetX = ((x - rect.width / 2) / (rect.width / 2)) * 7;
    const offsetY = ((y - rect.height / 2) / (rect.height / 2)) * -7;

    targetX.current = DEFAULT_TILT_X + offsetX;
    targetY.current = DEFAULT_TILT_Y + offsetY;
  };

  const handleMouseLeave = () => {
    if (window.innerWidth <= 768) return;
    targetX.current = DEFAULT_TILT_X;
    targetY.current = DEFAULT_TILT_Y;
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className={`product-card ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-800 ease-in-out`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={() => isTouch && onOpenLightbox(product)}
      style={{
        position: 'relative',
        background: '#111111',
        border: `1px solid ${isHovered ? 'rgba(197, 160, 89, 0.4)' : '#18181b'}`,
        borderRadius: '4px',
        overflow: 'hidden',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        willChange: 'transform',
        transition: 'border-color 0.8s ease',
        height: '100%',
        minHeight: '400px'
      }}
    >
      <div className="card-inner" style={{ position: 'relative', width: '100%', height: '100%', display: 'flex', flexDirection: 'column', transformStyle: 'preserve-3d' }}>
        <div className="image-container" style={{ position: 'relative', width: '100%', flex: 1, minHeight: '250px', height: 'auto', overflow: 'hidden', background: '#0a0a0a', transform: 'translateZ(20px)' }}>
          <img
            src={getImagePath(product.image)}
            alt={product.name}
            className={`product-image ${isHovered ? 'scale-108' : 'scale-100'}`}
            style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1.5s cubic-bezier(0.2, 0, 0.2, 1), opacity 1s ease' }}
          />
          <div className="image-overlay" style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0, 0, 0, 0.6), transparent)', opacity: 0.6, pointerEvents: 'none' }}></div>

          <div className={`action-row ${isHovered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${isTouch ? 'opacity-100 translate-y-0 pointer-events-auto' : ''}`} style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.6s cubic-bezier(0.2, 0, 0.2, 1)', transform: isHovered || isTouch ? 'translateY(0) translateZ(50px)' : 'translateY(1rem) translateZ(50px)', pointerEvents: isHovered ? 'auto' : 'none' }}>
            <button
              className="magnetic-btn"
              onClick={(e) => {
                e.stopPropagation();
                onOpenLightbox(product);
              }}
              style={{ width: '54px', height: '54px', background: isHovered ? '#C5A059' : 'white', color: isHovered ? 'white' : 'black', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 20px 40px rgba(0, 0, 0, 0.4)', transition: 'background 0.3s ease, transform 0.1s linear' }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </button>
          </div>
        </div>

        <div className="info-box" style={{ padding: '2rem', background: '#111111', transform: 'translateZ(10px)', borderTop: '1px solid #18181b', zIndex: 10 }}>
          <p className="category" style={{ color: '#C5A059', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem', opacity: 0.7, fontFamily: '"Forum", serif' }}>
            {product.categories.find(c => c.toLowerCase().includes(targetCategoryName?.toLowerCase() || '')) || product.categories[0]}
          </p>
          <h3 className="title" style={{ fontSize: 'clamp(1rem, 5vw, 18px)', letterSpacing: '0.05em', textTransform: 'uppercase', fontWeight: 500, transition: 'color 0.3s ease', color: isHovered ? '#C5A059' : '#FDF5E6', fontFamily: '"Forum", serif' }}>
            {product.name}
          </h3>
          <div className="rating" style={{ display: 'flex', gap: '4px', marginTop: '1rem' }}>
            {Array(5).fill(0).map((_, i) => (
              <svg key={i} className={`star ${i < 5 ? 'filled' : ''}`} viewBox="0 0 24 24" style={{ width: '10px', height: '10px', fill: i < 5 ? '#C5A059' : '#27272a' }}>
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const Lightbox = ({ product, isOpen, onClose, getImagePath }) => {
  if (!isOpen || !product) return null;

  return (
    <div
      id="lightbox"
      className="active"
      onClick={(e) => {
        if (e.target.id === 'lightbox') onClose();
      }}
      style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0, 0, 0, 0.98)', backdropFilter: 'blur(20px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: window.innerWidth > 768 ? '2rem' : '1rem', opacity: 1, transition: 'opacity 0.5s ease' }}
    >
      {window.innerWidth > 768 && (
        <button
          className="close-btn"
          onClick={onClose}
          style={{ position: 'absolute', top: '2rem', right: '2rem', background: '#3d291b', border: 'none', color: '#f1dfb7', cursor: 'pointer', zIndex: 1010, borderRadius: '50%', width: '50px', height: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ transition: 'transform 0.3s ease' }}>
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}

      <div
        className="lightbox-content"
        style={{ background: '#3d291b', color: '#f1dfb7', maxWidth: '900px', width: window.innerWidth > 768 ? '95%' : '100%', maxHeight: '94vh', display: 'flex', flexDirection: window.innerWidth > 768 ? 'row' : 'column', borderRadius: '8px', overflowY: 'auto', transform: 'scale(1)', transition: 'transform 0.6s cubic-bezier(0.2, 0, 0.2, 1)', boxShadow: '0 40px 100px rgba(0, 0, 0, 0.8)', position: 'relative' }}
      >
        {window.innerWidth <= 768 && (
          <button
            className="mobile-close-btn"
            onClick={onClose}
            style={{ display: 'flex', position: 'absolute', top: '0.5rem', right: '0.5rem', background: '#3d291b', border: 'none', borderRadius: '50%', width: '44px', height: '44px', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(4px)', zIndex: 1010, color: '#f1dfb7', cursor: 'pointer' }}
          >
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        )}

        <div
          className="lightbox-image-side"
          style={{ flex: window.innerWidth > 768 ? 1.2 : '0 0 auto', background: '#000', minHeight: window.innerWidth > 768 ? '300px' : 'auto', height: window.innerWidth <= 768 ? '35vh' : 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', borderTopLeftRadius: '8px', borderBottomLeftRadius: window.innerWidth > 768 ? '8px' : 0, borderTopRightRadius: window.innerWidth <= 768 ? '8px' : 0 }}
        >
          <img src={getImagePath(product.image)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>

        <div
          className="lightbox-info-side"
          style={{ flex: 1, padding: window.innerWidth > 768 ? '3rem' : '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: window.innerWidth <= 768 ? 'min-content' : 'auto' }}
        >
          <span className="category" style={{ color: '#ffffff', fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.5rem', fontFamily: '"Forum", serif' }}>
            {product.categories.join(', ')}
          </span>
          <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.2rem)', margin: '0.25rem 0 1rem 0', fontFamily: '"Forum", serif' }}>
            {product.name}
          </h2>
          <p style={{ color: '#f1dfb7', lineHeight: 1.6, fontSize: 'clamp(0.9rem, 1.5vw, 1rem)', fontStyle: 'italic', borderLeft: '2px solid #f1dfb7', paddingLeft: '1.25rem' }}>
            Exquisite hand-painted pottery featuring traditional cobalt pigments and a signature glaze that captures the essence of heritage craftsmanship.
          </p>

          <div className="lightbox-actions" style={{ display: 'flex', gap: '10px', marginTop: window.innerWidth > 768 ? '2rem' : '1.25rem', width: '100%', flexDirection: window.innerWidth <= 480 ? 'column' : 'row' }}>
            <button
              className="btn-enquire"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '48px', fontSize: '16px', fontWeight: 500, cursor: 'pointer', borderRadius: '4px', transition: 'all 0.3s ease', backgroundColor: '#f1dfb7', color: '#3d291b', border: '1px solid #f1dfb7', flex: 1.2 }}
            >
              Enquire Product
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
            <button
              className="btn-share"
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '48px', fontSize: '16px', fontWeight: 500, cursor: 'pointer', borderRadius: '4px', transition: 'all 0.3s ease', backgroundColor: 'transparent', color: '#f1dfb7', border: '1px solid #f1dfb7', flex: 1 }}
            >
              Share
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="18" cy="5" r="3"></circle>
                <circle cx="6" cy="12" r="3"></circle>
                <circle cx="18" cy="19" r="3"></circle>
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SingleCollection = () => {
  const { id } = useParams();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const categoryParam = searchParams.get('category');

  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Map URL params back to the collection/category strings in data.json
  const idToCollectionMap = {
    'blue-pottery': 'Blue Pottery',
    'marbles': 'Marbles',
    'furniture': 'Furniture',
    'lava-stones': 'Lava Stones',
    'mosaic-art': 'Mosaic Art',
    'sandstone': 'Sandstone',
    'temple': 'Temple',
    'exotic-stones': 'Exotic Stones'
  };

  const categoryIdToNameMap = {
    'home': 'Home',
    'outdoor': 'Outdoor',
    'garden': 'Garden Landscape'
  };

  const collectionName = idToCollectionMap[id] || id.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  const targetCategoryName = categoryIdToNameMap[categoryParam];

  // Helper function to resolve image paths from data.json
  const getImagePath = (imagePath) => {
    try {
      if (!imagePath) return '';
      if (imagePath.startsWith('http') || imagePath.startsWith('/')) return imagePath;
      // In Vite, new URL(path, import.meta.url) works best with relative paths.
      const relativePath = imagePath.startsWith('./') ? `../${imagePath.substring(2)}` : imagePath;
      return new URL(relativePath, import.meta.url).href;
    } catch (error) {
      console.error("Error resolving image path:", imagePath, error);
      return imagePath;
    }
  };

  useEffect(() => {
    if (!productsData || !productsData.products) return;

    const collectionNameLower = collectionName.toLowerCase();
    const categoryParamLower = categoryParam ? categoryParam.toLowerCase() : null;

    const matches = productsData.products.filter(p => {
      // 1. Collection Match (Case-insensitive)
      const isCollectionMatch = p.collection.toLowerCase() === collectionNameLower;
      if (!isCollectionMatch) return false;

      // 2. Category Match (Robust / Fail-safe)
      if (!categoryParamLower) return true; // No category filter applied

      // Try to find a category that matches the param (exactly or partially)
      return p.categories.some(cat => {
        const catLower = cat.toLowerCase();
        // Exact match (e.g., "home" === "home")
        if (catLower === categoryParamLower) return true;
        // Partial match for common terms (e.g., "garden" matches "garden landscape")
        if (catLower.includes(categoryParamLower)) return true;
        // Check if param is part of category (e.g., "landscape" matches "garden landscape")
        if (categoryParamLower.includes(catLower)) return true;

        // Special case mapping fallback
        if (categoryParamLower === 'home' && catLower === 'interior') return true;
        if (categoryParamLower === 'garden' && catLower.includes('landscape')) return true;

        return false;
      });
    });

    console.log(`Filtered products for ${collectionName} [${categoryParam || 'All'}]: ${matches.length}`);
    setFilteredProducts(matches);
  }, [id, categoryParam, collectionName]);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedProduct]);

  const collectionTitle = collectionName;

  return (
    <div className="w-full min-h-screen bg-[#0c0c0c] text-[#FDF5E6] pt-28 pb-12">
      <div style={{ maxWidth: '1400px', margin: '2rem auto 0 auto', padding: '0 2rem', textAlign: 'center' }}>
        <h2 style={{ fontFamily: '"Forum", serif', fontSize: 'clamp(2rem, 5vw, 3.5rem)', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.5rem', color: '#FDF5E6' }}>
          {collectionTitle}
        </h2>
        {categoryParam && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', opacity: 0.8 }}>
            <div style={{ height: '1px', width: '2rem', background: '#C5A059' }}></div>
            <p style={{ fontFamily: '"Forum", serif', fontSize: '1.2rem', color: '#C5A059', letterSpacing: '0.3em', textTransform: 'uppercase' }}>
              {targetCategoryName || categoryParam}
            </p>
            <div style={{ height: '1px', width: '2rem', background: '#C5A059' }}></div>
          </div>
        )}
      </div>

      <div style={{ maxWidth: '1400px', width: '100%', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2.5rem', padding: '4rem 2rem', margin: '0 auto' }}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              index={i}
              onOpenLightbox={setSelectedProduct}
              getImagePath={getImagePath}
              targetCategoryName={targetCategoryName}
            />
          ))
        ) : (
          <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '4rem', color: '#71717a', fontFamily: '"Forum", serif', fontSize: '1.2rem' }}>
            No products match the selected collection.
          </div>
        )}
      </div>

      <Lightbox
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        getImagePath={getImagePath}
      />
    </div>
  );
};

export default SingleCollection;
