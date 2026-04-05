import React, { useState, useEffect, useRef } from 'react';
import { useLocation, Link, useSearchParams } from 'react-router-dom';
import productsData from '../data.json';

// Reuse ProductCard from SingleCollection for consistency
const ProductCard = ({ product, index, onOpenLightbox, getImagePath }) => {
  const cardRef = useRef(null);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const currentX = useRef(0);
  const currentY = useRef(0);
  const targetX = useRef(0);
  const targetY = useRef(0);
  const currentEntranceY = useRef(50);
  const targetEntranceY = useRef(50);
  const currentScale = useRef(0.95);
  const targetScale = useRef(0.95);
  const requestRef = useRef();

  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  useEffect(() => {
    // Stagger based on position in current set, using modulo 8 for consistent batches
    const staggerIndex = index % 8;
    const timer = setTimeout(() => {
      setIsVisible(true);
      targetEntranceY.current = 0;
      targetScale.current = 1;
    }, staggerIndex * 80);
    return () => clearTimeout(timer);
  }, [index]);

  useEffect(() => {
    const lerp = (start, end, amt) => (1 - amt) * start + amt * end;
    const animate = () => {
      currentX.current = lerp(currentX.current, targetX.current, 0.05);
      currentY.current = lerp(currentY.current, targetY.current, 0.05);
      currentEntranceY.current = lerp(currentEntranceY.current, targetEntranceY.current, 0.06);
      currentScale.current = lerp(currentScale.current, targetScale.current, 0.06);

      if (cardRef.current) {
        cardRef.current.style.transform = `translateY(${currentEntranceY.current}px) scale(${currentScale.current}) perspective(2000px) rotateX(${currentY.current}deg) rotateY(${currentX.current}deg)`;
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
    const offsetX = ((x - rect.width / 2) / (rect.width / 2)) * 5;
    const offsetY = ((y - rect.height / 2) / (rect.height / 2)) * -5;
    targetX.current = offsetX;
    targetY.current = offsetY;
  };

  const handleMouseLeave = () => {
    targetX.current = 0;
    targetY.current = 0;
    setIsHovered(false);
  };

  return (
    <div
      ref={cardRef}
      className={`product-card ${isVisible ? 'opacity-100' : 'opacity-0'} transition-opacity duration-700`}
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
        transition: 'border-color 0.6s ease',
        minHeight: '380px'
      }}
    >
      <div style={{ position: 'relative', width: '100%', flex: 1, overflow: 'hidden', background: '#0a0a0a' }}>
        <img
          src={getImagePath(product.image)}
          alt={product.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 1.2s cubic-bezier(0.2, 0, 0.2, 1)', transform: isHovered ? 'scale(1.08)' : 'scale(1)' }}
        />
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0, 0, 0, 0.4), transparent)', opacity: isHovered ? 0.8 : 0.4, transition: 'opacity 0.6s' }}></div>

        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: isHovered || isTouch ? 1 : 0, transition: 'all 0.4s', transform: isHovered || isTouch ? 'translateY(0)' : 'translateY(10px)' }}>
          <button
            onClick={(e) => { e.stopPropagation(); onOpenLightbox(product); }}
            style={{ width: '48px', height: '48px', background: '#C5A059', color: 'white', border: 'none', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', boxShadow: '0 10px 20px rgba(0,0,0,0.3)' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
          </button>
        </div>
      </div>
      <div style={{ padding: '1.5rem', background: '#111111', borderTop: '1px solid #18181b' }}>
        <p style={{ color: '#C5A059', fontSize: '9px', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '0.4rem', fontFamily: '"Forum", serif' }}>
          {product.collection}
        </p>
        <h3 style={{ fontSize: '16px', letterSpacing: '0.03em', color: isHovered ? '#C5A059' : '#FDF5E6', fontFamily: '"Forum", serif', transition: 'color 0.3s' }}>
          {product.name}
        </h3>
      </div>
    </div>
  );
};

const Lightbox = ({ product, isOpen, onClose, getImagePath }) => {
  const [shareText, setShareText] = useState('Share');
  if (!isOpen || !product) return null;

  const handleShare = async () => {
    // Generate specialized URL with product ID
    const baseUrl = window.location.origin + window.location.pathname;
    const shareUrl = `${baseUrl}?product=${product.id}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      setShareText('Link Copied!');
      setTimeout(() => setShareText('Share'), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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
        style={{ background: '#3d291b', color: '#f1dfb7', maxWidth: '1000px', width: window.innerWidth > 768 ? '100%' : '100%', maxHeight: '94vh', display: 'flex', flexDirection: window.innerWidth > 768 ? 'row' : 'column', borderRadius: '8px', overflowY: 'auto', transform: 'scale(1)', transition: 'transform 0.6s cubic-bezier(0.2, 0, 0.2, 1)', boxShadow: '0 40px 100px rgba(0, 0, 0, 0.8)', position: 'relative' }}
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
            {product.collection} • {product.categories.join(', ')}
          </span>
          <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2.5rem)', margin: '0.25rem 0 1rem 0', fontFamily: '"Forum", serif' }}>
            {product.name}
          </h2>
          <p style={{ color: '#f1dfb7', lineHeight: 1.6, fontSize: 'clamp(0.9rem, 1.5vw, 1rem)', fontStyle: 'italic', borderLeft: '2px solid #f1dfb7', paddingLeft: '1.25rem' }}>
            {product.description || "Exquisite hand-painted pottery featuring traditional cobalt pigments and a signature glaze that captures the essence of heritage craftsmanship."}
          </p>

          {product.dimensions && (
            <div style={{ marginTop: '1.5rem', borderTop: '1px solid rgba(241, 223, 183, 0.1)', paddingTop: '1rem' }}>
              <h4 style={{ fontSize: '10px', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#C5A059', marginBottom: '0.4rem', fontWeight: 700, fontFamily: '"Forum", serif' }}>
                Dimensions
              </h4>
              <p style={{ fontSize: '1.1rem', color: '#f1dfb7', fontFamily: '"Forum", serif' }}>
                {product.dimensions}
              </p>
            </div>
          )}

          <div className="lightbox-actions" style={{ display: 'flex', gap: '10px', marginTop: window.innerWidth > 768 ? '2rem' : '1.25rem', width: '100%', flexDirection: window.innerWidth <= 480 ? 'column' : 'row' }}>
            <Link
              to="/contact-us"
              className="btn-enquire"
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '48px', fontSize: '16px', fontWeight: 500, cursor: 'pointer', borderRadius: '4px', transition: 'all 0.3s ease', backgroundColor: '#f1dfb7', color: '#3d291b', border: '1px solid #f1dfb7', flex: 1.2 }}
            >
              Enquire Product
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </Link>
            <button
              className="btn-share"
              onClick={handleShare}
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', height: '48px', fontSize: '16px', fontWeight: 500, cursor: 'pointer', borderRadius: '4px', transition: 'all 0.3s ease', backgroundColor: 'transparent', color: '#f1dfb7', border: '1px solid #f1dfb7', flex: 1 }}
            >
              {shareText}
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

const AllProducts = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isPageVisible, setIsPageVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCollection, setSelectedCollection] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [visibleCount, setVisibleCount] = useState(20);

  const categories = ['All', ...new Set(productsData.products.flatMap(p => p.categories))];
  const collections = ['All', ...new Set(productsData.products.map(p => p.collection))];

  const getImagePath = (imagePath) => {
    if (!imagePath) return '';
    try {
      if (imagePath.startsWith('http') || imagePath.startsWith('/')) return imagePath;
      const relativePath = imagePath.startsWith('./') ? `../${imagePath.substring(2)}` : imagePath;
      return new URL(relativePath, import.meta.url).href;
    } catch { return imagePath; }
  };

  useEffect(() => {
    // Trigger entrance animation
    const timer = setTimeout(() => setIsPageVisible(true), 100);

    // Deep-linking: Look for product ID in URL
    const productId = searchParams.get('product');
    if (productId && productsData.products) {
      const found = productsData.products.find(p => p.id === productId);
      if (found) setSelectedProduct(found);
    } else {
      setSelectedProduct(null);
    }
  }, [searchParams, productsData.products]);

  const handleOpenLightbox = (product) => {
    setSearchParams({ product: product.id });
  };

  const handleCloseLightbox = () => {
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('product');
    setSearchParams(newParams);
  };

  useEffect(() => {
    const filtered = productsData.products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.categories.includes(selectedCategory);
      const matchesCollection = selectedCollection === 'All' || p.collection === selectedCollection;
      return matchesSearch && matchesCategory && matchesCollection;
    });
    setFilteredProducts(filtered);
    setVisibleCount(20); // Reset to 20 whenever filters/search change
  }, [searchQuery, selectedCategory, selectedCollection]);

  useEffect(() => {
    if (selectedProduct) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [selectedProduct]);

  return (
    <div className={`w-full min-h-screen bg-[#0c0c0c] text-[#FDF5E6] pt-32 pb-20 transition-opacity duration-1000 ${isPageVisible ? 'is-visible' : ''}`}>
      <div className="max-w-[1400px] mx-auto px-8 md:px-[60px]">

        {/* Header Section */}
        <div className="text-center mb-16 editorial-reveal">
          <div className="flex items-center justify-center mb-4">
            <div className="h-[1px] w-12 bg-[#c29d59] opacity-40"></div>
            <span className="mx-4 text-[#c29d59] font-['Forum',serif] text-xs tracking-[0.5em] uppercase">The Studio Portfolio</span>
            <div className="h-[1px] w-12 bg-[#c29d59] opacity-40"></div>
          </div>
          <h1 className="text-[#efe7d2] font-['Forum',serif] text-5xl md:text-7xl uppercase mb-6 tracking-wide">All Products</h1>
          <p className="text-white/60 font-['Forum',serif] text-lg max-w-2xl mx-auto italic font-light">Explore a world where heritage craftsmanship meets contemporary design, curated for spaces that matter.</p>
        </div>

        {/* Search & Filters Section */}
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 md:p-8 mb-12 flex flex-col lg:flex-row gap-6 items-end editorial-reveal" style={{ transitionDelay: '200ms' }}>

          {/* Name Search */}
          <div className="w-full lg:flex-1 space-y-2">
            <label className="text-xs font-['Forum',serif] text-[#C5A059] uppercase tracking-widest pl-1">Search Product</label>
            <div className="relative group">
              <input
                type="text"
                placeholder="Ex. Blue Pottery Vase..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-12 text-[#efe7d2] font-['Forum',serif] text-lg outline-none transition-all focus:border-[#c29d59]/50 focus:bg-black/60"
              />
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 group-focus-within:text-[#c29d59] transition-colors" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8" /><path d="m21 21-4.3-4.3" /></svg>
            </div>
          </div>

          {/* Filters Container */}
          <div className="flex flex-col sm:flex-row gap-6 w-full lg:w-auto">
            {/* Category Filter */}
            <div className="w-full sm:w-1/2 lg:w-64 space-y-2">
              <label className="text-xs font-['Forum',serif] text-[#C5A059] uppercase tracking-widest pl-1">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-[#efe7d2] font-['Forum',serif] text-lg outline-none appearance-none cursor-pointer focus:border-[#c29d59]/50"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'rgba(197, 160, 89, 0.5)\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2rem' }}
              >
                {categories.map(cat => <option key={cat} value={cat} style={{ background: '#1c1c1c' }}>{cat}</option>)}
              </select>
            </div>

            {/* Collection Filter */}
            <div className="w-full sm:w-1/2 lg:w-64 space-y-2">
              <label className="text-xs font-['Forum',serif] text-[#C5A059] uppercase tracking-widest pl-1">Collection</label>
              <select
                value={selectedCollection}
                onChange={(e) => setSelectedCollection(e.target.value)}
                className="w-full bg-black/40 border border-white/10 rounded-xl py-3.5 px-4 text-[#efe7d2] font-['Forum',serif] text-lg outline-none appearance-none cursor-pointer focus:border-[#c29d59]/50"
                style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'rgba(197, 160, 89, 0.5)\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.2rem' }}
              >
                {collections.map(col => <option key={col} value={col} style={{ background: '#1c1c1c' }}>{col}</option>)}
              </select>
            </div>
          </div>

          {/* Clear Button */}
          {(searchQuery || selectedCategory !== 'All' || selectedCollection !== 'All') && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedCategory('All'); setSelectedCollection('All'); }}
              className="py-3 px-6 text-[#C5A059] font-['Forum',serif] text-sm uppercase tracking-widest hover:text-white transition-colors h-[54px] mb-0"
            >
              Reset
            </button>
          )}

        </div>

        {/* Results Info */}
        <div className="mb-8 flex justify-between items-center editorial-reveal" style={{ transitionDelay: '300ms' }}>
          <p className="font-['Forum',serif] text-white/40 tracking-widest uppercase text-xs">Showing {filteredProducts.length} results</p>
          <div className="h-[1px] flex-1 mx-8 bg-white/5"></div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.length > 0 ? (
            filteredProducts.slice(0, visibleCount).map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                onOpenLightbox={handleOpenLightbox}
                getImagePath={getImagePath}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-[#C5A059] font-['Forum',serif] text-2xl opacity-40 italic underline-offset-8 decoration-1 underline decoration-[#C5A059]/30">No products found matching your criteria</p>
            </div>
          )}
        </div>

        {/* Load More Button */}
        {filteredProducts.length > visibleCount && (
          <div className="mt-20 flex justify-center editorial-reveal" style={{ transitionDelay: '400ms', paddingBottom: '4rem' }}>
            <button
              onClick={() => setVisibleCount(prev => prev + 8)}
              className="show-more-btn"
              style={{
                background: '#0a0a0a',
                color: '#efe7d2',
                border: '1px solid rgba(197, 160, 89, 0.3)',
                padding: '1.2rem 3.5rem',
                fontFamily: '"Forum", serif',
                fontSize: '1.1rem',
                letterSpacing: '0.25em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                position: 'relative',
                transition: 'all 0.4s cubic-bezier(0.2, 0, 0.2, 1)',
                boxShadow: '0 20px 40px rgba(0,0,0,0.3)',
                borderRadius: '2px',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#C5A059';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(197, 160, 89, 0.3)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              SHOW MORE
              <div style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: '#C5A059',
                boxShadow: '0 -2px 10px rgba(197, 160, 89, 0.3)'
              }}></div>
            </button>
          </div>
        )}
      </div>

      <Lightbox
        product={selectedProduct}
        isOpen={!!selectedProduct}
        onClose={handleCloseLightbox}
        getImagePath={getImagePath}
      />
    </div>
  );
};

export default AllProducts;
