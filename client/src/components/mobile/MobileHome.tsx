import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  Heart, 
  Star, 
  Zap, 
  ChevronRight,
  Smartphone,
  Laptop,
  Shirt,
  Footprints,
  BookOpen,
  Headphones,
  Armchair,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Clock,
  Trophy,
  CreditCard,
  RotateCcw
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES_DATA } from '../../data/mockData';
import { ProductCategory } from '../../types';

export const MobileHome: React.FC = () => {
  const { 
    catalogProducts,
    viewProduct, 
    viewCategory, 
    toggleWishlist, 
    isInWishlist, 
    addToCart,
    cartItems,
    setActiveScreen,
    showToast
  } = useShop();

  const [activeSlide, setActiveSlide] = useState(0);

  // Countdown timer for mobile flash deals
  const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 42, seconds: 18 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const mobileBanners = [
    {
      title: 'Mega Campus Fest',
      tag: 'Flipkart Style Deals',
      sub: 'Intel Core i5 Laptops from ₹29,990',
      cta: 'Shop Laptops',
      category: 'laptops' as ProductCategory,
      img: '/images/laptop_deal_showcase_1791969325835.jpg',
      bg: 'linear-gradient(135deg, #1E3A8A 0%, #2874F0 100%)'
    },
    {
      title: '5G Smartphone Fest',
      tag: 'Hostel 2-Hr Delivery',
      sub: 'Flagships from ₹899/month EMI',
      cta: 'Explore 5G',
      category: 'mobiles' as ProductCategory,
      img: '/images/smartphone_flagship_1791969326350.jpg',
      bg: 'linear-gradient(135deg, #0F172A 0%, #2563EB 100%)'
    },
    {
      title: 'Hostel Room Setup',
      tag: 'Dorm Makeover',
      sub: 'Study tables & LED lights from ₹199',
      cta: 'Shop Room',
      category: 'home' as ProductCategory,
      img: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=800&auto=format&fit=crop&q=90',
      bg: 'linear-gradient(135deg, #064E3B 0%, #10B981 100%)'
    }
  ];

  // Auto advance mobile slider
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setActiveSlide(prev => (prev + 1) % mobileBanners.length);
    }, 4500);
    return () => clearInterval(slideTimer);
  }, [mobileBanners.length]);

  // Keep the mobile storefront renderable even if stale or malformed state arrives.
  const safeCatalogProducts = Array.isArray(catalogProducts) ? catalogProducts : [];
  const flashDeals = safeCatalogProducts.filter(p => p && (p.isFlashDeal || p.isDealOfTheDay));
  const recommended = safeCatalogProducts.filter(p => p && (p.isRecommended || p.isBestSeller));
  const currentBanner = mobileBanners[activeSlide];

  return (
    <div className="space-y-3 pb-24 pt-0">
      {/* 1. Category Quick Circles (Flipkart Mobile App Standard) */}
      <div className="bg-white rounded-2xl p-3 border border-gray-100 shadow-2xs">
        <div className="flex gap-3.5 overflow-x-auto no-scrollbar py-1">
          {CATEGORIES_DATA.slice(0, 9).map((cat) => (
            <button
              key={cat.id}
              onClick={() => viewCategory(cat.id as ProductCategory)}
              className="flex flex-col items-center shrink-0 min-w-[54px] group focus:outline-hidden cursor-pointer"
            >
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${cat.mobileBg} border border-gray-100 group-hover:scale-105 shadow-2xs`}>
                {cat.id === 'mobiles' && <Smartphone className="w-5 h-5 text-[#2874F0]" />}
                {cat.id === 'laptops' && <Laptop className="w-5 h-5 text-cyan-600" />}
                {cat.id === 'fashion' && <Shirt className="w-5 h-5 text-pink-600" />}
                {cat.id === 'footwear' && <Footprints className="w-5 h-5 text-emerald-600" />}
                {cat.id === 'electronics' && <Headphones className="w-5 h-5 text-sky-600" />}
                {cat.id === 'home' && <Armchair className="w-5 h-5 text-teal-600" />}
                {cat.id === 'books' && <BookOpen className="w-5 h-5 text-amber-600" />}
                {cat.id === 'sports' && <Trophy className="w-5 h-5 text-purple-600" />}
                {cat.id === 'stationery' && <RotateCcw className="w-5 h-5 text-indigo-600" />}
              </div>
              <span className="text-[10px] font-semibold text-slate-700 mt-1.5 text-center truncate max-w-[56px] group-hover:text-[#2874F0]">
                {cat.name}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Bank Offers & Payment Strip (Mobile) */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/80 rounded-xl px-3 py-2 flex items-center justify-between text-[11px] text-blue-900 shadow-3xs">
        <div className="flex items-center gap-1.5 font-bold">
          <CreditCard className="w-3.5 h-3.5 text-[#2874F0] shrink-0" />
          <span>10% Bank Off on HDFC & ICICI Cards</span>
        </div>
        <span className="text-[10px] bg-[#2874F0] text-white px-2 py-0.5 rounded-full font-black">
          Code: CAMPUS10
        </span>
      </div>

      {/* 3. Sliding Promotional Banner */}
      <div 
        className="relative rounded-2xl overflow-hidden p-4 text-white shadow-xs flex items-center justify-between min-h-[150px] transition-all duration-500"
        style={{ background: currentBanner.bg }}
      >
        <div className="z-10 max-w-[65%]">
          <span className="inline-block px-2 py-0.5 rounded-full bg-white/20 text-[9px] font-black uppercase tracking-wider mb-1">
            {currentBanner.tag}
          </span>
          <h2 className="text-xl font-black leading-tight text-white font-heading">
            {currentBanner.title}
          </h2>
          <p className="text-[11px] text-blue-100 font-medium mt-0.5 line-clamp-1">
            {currentBanner.sub}
          </p>
          <button
            onClick={() => viewCategory(currentBanner.category)}
            className="mt-3 px-3.5 py-1.5 rounded-lg bg-white text-[#2874F0] font-black text-xs shadow-xs hover:bg-blue-50 flex items-center gap-1 cursor-pointer"
          >
            <span>{currentBanner.cta}</span>
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        {/* Studio Product Graphic */}
        <div className="w-28 h-28 shrink-0 flex items-center justify-center p-2 bg-white/10 backdrop-blur-xs rounded-xl border border-white/20 shadow-md">
          <img
            src={currentBanner.img}
            alt="Promotion"
            referrerPolicy="no-referrer"
            className="max-h-full max-w-full object-contain drop-shadow-xl"
          />
        </div>

        {/* Carousel indicators */}
        <div className="absolute bottom-2 left-4 flex gap-1 z-20">
          {mobileBanners.map((_, i) => (
            <span
              key={i}
              className={`h-1 rounded-full transition-all ${
                activeSlide === i ? 'w-4 bg-white' : 'w-1.5 bg-white/40'
              }`}
            />
          ))}
        </div>
      </div>

      {/* 4. Flash Deals Section (Flipkart / Amazon Mobile Rail Layout) */}
      <div className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-black text-slate-900">Deals of the Day</h3>
            <span className="flex items-center gap-1 text-[10px] font-mono font-bold bg-[#2874F0] text-white px-2 py-0.5 rounded-sm">
              <Clock className="w-2.5 h-2.5" />
              <span>{String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
            </span>
          </div>
          <button 
            onClick={() => viewCategory('all')}
            className="text-xs font-bold text-[#2874F0] flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Horizontal scroll cards */}
        <div className="flex gap-2.5 overflow-x-auto no-scrollbar pb-1">
          {flashDeals.map((prod) => {
            const inWishlist = isInWishlist(prod.id);
            return (
              <div
                key={prod.id}
                onClick={() => viewProduct(prod)}
                className="w-34 shrink-0 bg-white rounded-xl border border-gray-200 p-2.5 relative flex flex-col justify-between cursor-pointer shadow-2xs hover:border-[#2874F0]"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(prod.id);
                  }}
                  className="absolute top-1.5 right-1.5 z-10 p-1 rounded-full bg-white/90 text-gray-400 hover:text-rose-500 shadow-2xs"
                >
                  <Heart className={`w-3 h-3 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                <div className="aspect-square bg-white rounded-lg p-1.5 mb-1.5 flex items-center justify-center border border-gray-100">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain drop-shadow-xs"
                    loading="lazy"
                  />
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-slate-800 line-clamp-1">
                    {prod.name}
                  </h4>
                  
                  {/* Campus Assured Badge */}
                  <span className="inline-block text-[8px] font-black italic bg-[#2874F0] text-white px-1 py-0.2 rounded-xs mt-0.5">
                    Campus Assured
                  </span>

                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-xs font-black text-slate-900">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[9px] text-gray-400 line-through">
                      ₹{prod.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="inline-block text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded-xs mt-0.5">
                    {prod.discountPercent}% OFF
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 5. Senior-to-Junior Peer Market Card (Unique Campus Advantage) */}
      <div 
        onClick={() => {
          viewCategory('all');
          showToast('Showing Senior Hand-me-downs');
        }}
        className="bg-gradient-to-r from-emerald-700 to-teal-900 rounded-2xl p-4 text-white flex items-center justify-between cursor-pointer shadow-xs"
      >
        <div>
          <span className="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full inline-block mb-1">
            Senior Handover (Save 80%)
          </span>
          <h3 className="text-base font-black">Pre-Loved Campus Gear</h3>
          <p className="text-[11px] text-emerald-100">Casio calculators, cycles & drafters from seniors</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <RotateCcw className="w-5 h-5 text-white" />
        </div>
      </div>

      {/* 6. Recommended for You (2-Column Infinite Grid) */}
      <div className="bg-white rounded-2xl p-3.5 border border-gray-100 shadow-2xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900">Recommended for You</h3>
            <p className="text-[10px] text-gray-400">Handpicked for college students</p>
          </div>
          <button 
            onClick={() => viewCategory('all')}
            className="text-xs font-bold text-[#2874F0] flex items-center gap-0.5 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {recommended.slice(0, 8).map((prod) => {
            const inWishlist = isInWishlist(prod.id);
            return (
              <div
                key={prod.id}
                onClick={() => viewProduct(prod)}
                className="bg-white rounded-xl border border-gray-200 p-2.5 relative flex flex-col justify-between cursor-pointer hover:border-[#2874F0] shadow-2xs"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(prod.id);
                  }}
                  className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 text-gray-400 hover:text-rose-500 shadow-2xs"
                >
                  <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                <div className="aspect-square bg-white rounded-lg p-2 mb-2 flex items-center justify-center border border-gray-100">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain drop-shadow-xs"
                    loading="lazy"
                  />
                </div>

                <div>
                  <span className="text-[9px] font-bold text-[#2874F0] uppercase tracking-wider block">
                    {prod.brand}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-1 mt-0.5">
                    {prod.name}
                  </h4>
                  
                  <div className="flex items-center gap-1.5 my-1">
                    <span className="flex items-center text-[9px] font-black bg-emerald-600 text-white px-1.5 py-0.2 rounded-xs">
                      <span>{Number(prod.rating || 0).toFixed(1)}</span>
                      <Star className="w-2 h-2 fill-white ml-0.5" />
                    </span>
                    <span className="text-[10px] text-gray-400">({(prod.reviewCount / 1000).toFixed(1)}k)</span>
                  </div>

                  <div className="flex items-baseline gap-1 mt-1">
                    <span className="text-sm font-black text-slate-900">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-gray-400 line-through">
                      ₹{prod.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded-xs mt-0.5 inline-block">
                    {prod.discountPercent}% OFF
                  </span>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      if (cartItems.some(item => item.product.id === prod.id)) setActiveScreen('cart');
                      else addToCart(prod);
                    }}
                    className="w-full mt-2 py-2 rounded-lg bg-[#2874F0] hover:bg-[#1254C2] text-white text-sm font-black shadow-2xs transition-colors flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    <span>{cartItems.some(item => item.product.id === prod.id) ? 'View in Cart' : 'Add to Cart'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 7. Campus Safety Guarantee Badge (Mobile) */}
      <div className="bg-gradient-to-r from-[#2874F0] to-[#1254C2] rounded-2xl p-4 text-white flex items-center gap-3 shadow-xs">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0">
          <ShieldCheck className="w-5 h-5 text-white" />
        </div>
        <div>
          <h4 className="text-xs font-black text-white leading-tight">100% Student Verified Campus Network</h4>
          <p className="text-[10px] text-blue-100 mt-0.5">Secure payments & instant hostel doorstep handover</p>
        </div>
      </div>
    </div>
  );
};
