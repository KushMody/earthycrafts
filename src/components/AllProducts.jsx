import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
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
  const currentEntranceY = useRef(30);
  const targetEntranceY = useRef(30);
  const requestRef = useRef();

  const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
      targetEntranceY.current = 0;
    }, Math.min(index * 50, 400));
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
  if (!isOpen || !product) return null;
  return (
    <div onClick={(e) => e.target.id === 'lb-overlay' && onClose()} id="lb-overlay" style={{ position: 'fixed', inset: 0, zIndex: 1000, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(10px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <button onClick={onClose} style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: '#3d291b', color: '#f1dfb7', border: 'none', borderRadius: '50%', width: '44px', height: '44px', cursor: 'pointer', zIndex: 1010 }}>✕</button>
      <div style={{ background: '#3d291b', color: '#f1dfb7', maxWidth: '1000px', width: '100%', maxHeight: '90vh', display: 'flex', borderRadius: '8px', overflow: 'hidden', boxShadow: '0 30px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ flex: 1.2, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={getImagePath(product.image)} alt={product.name} style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div style={{ flex: 1, padding: '3rem', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <span style={{ fontSize: '10px', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.6)', marginBottom: '1rem' }}>{product.collection} • {product.categories.join(', ')}</span>
          <h2 style={{ fontSize: '2.5rem', fontFamily: '"Forum", serif', marginBottom: '1.5rem' }}>{product.name}</h2>
          <p style={{ fontStyle: 'italic', opacity: 0.8, lineHeight: 1.6, borderLeft: '2px solid #C5A059', paddingLeft: '1.5rem' }}>Earthy Crafts brings you the finest selection of hand-crafted masterpieces, blending traditional heritage with contemporary elegance.</p>
          <button style={{ marginTop: '2.5rem', height: '50px', background: '#f1dfb7', color: '#3d291b', border: 'none', borderRadius: '4px', fontWeight: 600, cursor: 'pointer', transition: '0.3s' }}>ENQUIRE PRODUCT</button>
        </div>
      </div>
    </div>
  );
};

const AllProducts = () => {
  const [isPageVisible, setIsPageVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCollection, setSelectedCollection] = useState('All');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);

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
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const filtered = productsData.products.filter(p => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || p.categories.includes(selectedCategory);
      const matchesCollection = selectedCollection === 'All' || p.collection === selectedCollection;
      return matchesSearch && matchesCategory && matchesCollection;
    });
    setFilteredProducts(filtered);
  }, [searchQuery, selectedCategory, selectedCollection]);

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
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 mb-12 flex flex-col md:flex-row gap-6 items-end editorial-reveal" style={{ transitionDelay: '200ms' }}>

          {/* Name Search */}
          <div className="flex-1 w-full space-y-2">
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

          {/* Category Filter */}
          <div className="w-full md:w-64 space-y-2">
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
          <div className="w-full md:w-64 space-y-2">
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
            filteredProducts.map((product, i) => (
              <ProductCard
                key={product.id}
                product={product}
                index={i}
                onOpenLightbox={setSelectedProduct}
                getImagePath={getImagePath}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center">
              <p className="text-[#C5A059] font-['Forum',serif] text-2xl opacity-40 italic underline-offset-8 decoration-1 underline decoration-[#C5A059]/30">No products found matching your criteria</p>
            </div>
          )}
        </div>
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

export default AllProducts;
