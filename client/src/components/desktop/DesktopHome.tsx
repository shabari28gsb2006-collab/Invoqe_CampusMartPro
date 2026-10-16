import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  Heart, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones,
  Smartphone,
  Laptop,
  Shirt,
  Footprints,
  Armchair,
  BookOpen,
  Sparkles,
  ChevronRight,
  ChevronLeft,
  Clock,
  Eye,
  CheckCircle2,
  X,
  CreditCard,
  Zap,
  Tag,
  Share2
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES_DATA } from '../../data/mockData';
import { Product, ProductCategory } from '../../types';

export const DesktopHome: React.FC = () => {
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

  // Mega Hero Carousel Slide Index
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  // Deal countdown timer (Authentic 12-hour flash sale timer)
  const [timeLeft, setTimeLeft] = useState({ hours: 11, minutes: 42, seconds: 18 });

  // Quick View Modal State
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedQuickColor, setSelectedQuickColor] = useState<string>('');
  const [pincodeCheck, setPincodeCheck] = useState('603203');
  const [pincodeChecked, setPincodeChecked] = useState(true);

  // Deals rail horizontal scroll ref
  const dealsRailRef = useRef<HTMLDivElement>(null);
  const electronicsRailRef = useRef<HTMLDivElement>(null);

  // Countdown clock effect
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

  // Auto-play hero carousel every 5.5s
  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentHeroSlide(prev => (prev + 1) % heroBanners.length);
    }, 5500);
    return () => clearInterval(slideTimer);
  }, []);

  const heroBanners = [
    {
      id: 'tech-fest',
      badge: 'FLIPKART STYLE MEGA CAMPUS FEST',
      title: 'Intel Core i5 & Ryzen Laptops',
      subtitle: 'Up to ₹25,000 Off + Extra ₹2,500 Student ID Discount',
      pricingHighlight: 'Starting from ₹29,990',
      bankOffer: '10% Instant Discount on HDFC & ICICI Cards',
      ctaText: 'Explore Laptops',
      category: 'laptops' as ProductCategory,
      bgGradient: 'from-[#1E3A8A] via-[#1D4ED8] to-[#2874F0]',
      image: '/images/laptop_deal_showcase_1791969325835.jpg',
      tags: ['Intel 12th Gen', '16GB RAM', 'Pre-installed MS Office']
    },
    {
      id: '5g-mobiles',
      badge: 'CAMPUS 5G CARNIVAL',
      title: 'Flagship 5G Smartphones',
      subtitle: 'Apple, iQOO, OnePlus & Xiaomi with No Cost EMI',
      pricingHighlight: 'From ₹899/month EMI',
      bankOffer: 'Free 2-Hour Express Delivery to your Hostel Room',
      ctaText: 'Grab 5G Deals',
      category: 'mobiles' as ProductCategory,
      bgGradient: 'from-[#0F172A] via-[#1E293B] to-[#2563EB]',
      image: '/images/smartphone_flagship_1791969326350.jpg',
      tags: ['Sony Sensor', '120Hz AMOLED', '67W FlashCharge']
    },
    {
      id: 'hostel-dorm',
      badge: 'HOSTEL ROOM MAKEOVER',
      title: 'Dorm Setup & Living Fest',
      subtitle: 'Ergonomic Chairs, Solid Wood Desks & 3D Moon Lamps',
      pricingHighlight: 'Items Starting at ₹199',
      bankOffer: 'Campus Courier Free Doorstep Delivery',
      ctaText: 'Furnish Room',
      category: 'home' as ProductCategory,
      bgGradient: 'from-[#064E3B] via-[#047857] to-[#10B981]',
      image: 'https://images.unsplash.com/photo-1532767153582-b1a0e5145009?w=800&auto=format&fit=crop&q=90',
      tags: ['Engineered Wood', 'Warm Ambient LED', 'Space Saver']
    },
    {
      id: 'peer-market',
      badge: 'SENIOR TO JUNIOR PEER EXCHANGE',
      title: 'Pre-Loved Campus Instruments',
      subtitle: 'Casio Calculators, Drafters, Cycles & Reference Books',
      pricingHighlight: 'Save up to 80% on MRP',
      bankOffer: 'Verified Senior Students • Handover at Hostel Common Room',
      ctaText: 'Browse Peer Market',
      category: 'all' as ProductCategory,
      bgGradient: 'from-[#4C1D95] via-[#6D28D9] to-[#7C3AED]',
      image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=800&auto=format&fit=crop&q=90',
      tags: ['100% Verified Working', 'Hostel Pickup', 'Escrow Protected']
    }
  ];

  // Guard the storefront against malformed/stale API state so one bad response
  // cannot crash the entire page. The context normally supplies the mock catalogue.
  const safeCatalogProducts = Array.isArray(catalogProducts) ? catalogProducts : [];
  const topDeals = safeCatalogProducts.filter(p => p && (p.isDealOfTheDay || p.isFlashDeal || (p.discountPercent ?? 0) >= 30));
  const electronicsProducts = safeCatalogProducts.filter(p => p && (p.category === 'electronics' || p.category === 'laptops' || p.category === 'mobiles'));
  const hostelProducts = safeCatalogProducts.filter(p => p && (p.category === 'home' || p.category === 'stationery'));

  const scrollRail = (ref: React.RefObject<HTMLDivElement | null>, direction: 'left' | 'right') => {
    if (ref.current) {
      const scrollAmount = direction === 'left' ? -380 : 380;
      ref.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const openQuickView = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    setQuickViewProduct(product);
    setSelectedQuickColor(product.colors?.[0] || '');
  };

  return (
    <div className="space-y-6 lg:space-y-8 pb-16">
      {/* =========================================================================
          1. FULL-WIDTH COMMERCIAL HERO BANNER CAROUSEL (Flipkart Standard)
      ========================================================================= */}
      <section className="relative rounded-2xl overflow-hidden shadow-sm group">
        <div 
          className={`relative min-h-[360px] sm:min-h-[400px] lg:min-h-[440px] bg-gradient-to-r ${heroBanners[currentHeroSlide].bgGradient} text-white transition-all duration-700 flex flex-col justify-center`}
        >
          {/* Subtle geometric background grid for high-end look */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

          <div className="relative z-10 max-w-[1440px] mx-auto px-6 sm:px-12 py-8 w-full grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="md:col-span-7 space-y-4">
              {/* Event Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[11px] font-black uppercase tracking-wider border border-white/30">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>{heroBanners[currentHeroSlide].badge}</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-[1.1] font-heading drop-shadow-xs">
                {heroBanners[currentHeroSlide].title}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base text-blue-100 font-medium max-w-xl">
                {heroBanners[currentHeroSlide].subtitle}
              </p>

              {/* Price Highlight Pill */}
              <div className="flex flex-wrap items-center gap-3 pt-1">
                <span className="text-xl sm:text-2xl font-black text-amber-300 bg-black/20 px-3 py-1 rounded-lg border border-amber-300/30">
                  {heroBanners[currentHeroSlide].pricingHighlight}
                </span>
                <span className="text-xs text-white/90 flex items-center gap-1.5 font-medium">
                  <CreditCard className="w-3.5 h-3.5 text-amber-300" />
                  {heroBanners[currentHeroSlide].bankOffer}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="pt-3 flex flex-wrap items-center gap-3">
                <button
                  onClick={() => viewCategory(heroBanners[currentHeroSlide].category)}
                  className="px-6 py-3 rounded-full bg-white text-[#2874F0] hover:bg-blue-50 font-black text-sm shadow-md transition-all flex items-center gap-2 cursor-pointer transform hover:scale-105"
                >
                  <span>{heroBanners[currentHeroSlide].ctaText}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveScreen('offers')}
                  className="px-5 py-3 rounded-full bg-black/20 hover:bg-black/30 text-white font-bold text-xs backdrop-blur-md border border-white/20 transition-colors cursor-pointer"
                >
                  View All Festive Deals
                </button>
              </div>

              {/* Feature Badges */}
              <div className="pt-2 flex flex-wrap items-center gap-2 text-[11px] text-white/80">
                {heroBanners[currentHeroSlide].tags.map((tag, idx) => (
                  <span key={idx} className="bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15">
                    ✓ {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Right Isolated Studio Product Visual */}
            <div className="md:col-span-5 flex items-center justify-center">
              <div className="relative w-64 h-64 sm:w-80 sm:h-80 rounded-3xl bg-white/10 backdrop-blur-md p-6 flex items-center justify-center border border-white/20 shadow-2xl">
                <img
                  src={heroBanners[currentHeroSlide].image}
                  alt={heroBanners[currentHeroSlide].title}
                  referrerPolicy="no-referrer"
                  className="max-h-full max-w-full object-contain drop-shadow-2xl transform hover:scale-110 transition-transform duration-500"
                />
                <span className="absolute bottom-3 right-3 bg-amber-400 text-slate-900 font-black text-[10px] px-2 py-0.5 rounded-full shadow-xs uppercase tracking-wider">
                  Campus Verified
                </span>
              </div>
            </div>
          </div>

          {/* Carousel Left / Right Navigation Arrows */}
          <button
            onClick={() => setCurrentHeroSlide((prev) => (prev - 1 + heroBanners.length) % heroBanners.length)}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            title="Previous Banner"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          <button
            onClick={() => setCurrentHeroSlide((prev) => (prev + 1) % heroBanners.length)}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/80 hover:bg-white text-slate-800 flex items-center justify-center shadow-lg transition-all opacity-0 group-hover:opacity-100 cursor-pointer"
            title="Next Banner"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Carousel Slide Indicators */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20">
            {heroBanners.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentHeroSlide(index)}
                className={`h-2 rounded-full transition-all cursor-pointer ${
                  currentHeroSlide === index ? 'w-8 bg-white shadow-xs' : 'w-2 bg-white/40'
                }`}
                title={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================================
          2. AUTHENTIC BANK OFFERS & PAYMENT PARTNERS STRIP (Indian E-Commerce Hallmark)
      ========================================================================= */}
      <section className="bg-white rounded-xl border border-gray-200 shadow-2xs p-3 sm:p-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 divide-y md:divide-y-0 md:divide-x divide-gray-100">
          <div className="flex items-center gap-3 pt-2 md:pt-0">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2874F0] flex items-center justify-center shrink-0">
              <CreditCard className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">10% Instant Bank Off</span>
              <span className="text-[11px] text-gray-500">On HDFC, ICICI & SBI Cards</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 md:pt-0 pl-0 md:pl-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">Campus Pay Later</span>
              <span className="text-[11px] text-gray-500">₹10,000 Credit @ 0% Interest</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 md:pt-0 pl-0 md:pl-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">Hostel Doorstep Delivery</span>
              <span className="text-[11px] text-gray-500">Free on orders above ₹499</span>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2 md:pt-0 pl-0 md:pl-4">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 block leading-tight">CampusMart Assured</span>
              <span className="text-[11px] text-gray-500">100% Genuine & 7-Day Returns</span>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          3. FLIPKART'S ICONIC "DEALS OF THE DAY" MODULE (Left Tile + Rail with Arrows)
      ========================================================================= */}
      <section className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden">
        <div className="grid grid-cols-12">
          {/* Left Promotional Tile (Flipkart Signature) */}
          <div className="col-span-12 lg:col-span-3 bg-gradient-to-b from-[#2874F0] via-[#1E60FF] to-[#0E49B5] text-white p-6 flex flex-col justify-between relative overflow-hidden">
            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[10px] font-black uppercase tracking-wider mb-3">
                <Clock className="w-3 h-3 text-amber-300" />
                <span>Flash Deals</span>
              </div>
              <h2 className="text-2xl lg:text-3xl font-black font-heading leading-tight">
                Deals of<br />the Day
              </h2>
              <p className="text-xs text-blue-100 mt-2 font-medium">
                Lowest prices of the semester guaranteed on student tech & dorm essentials.
              </p>

              {/* Countdown Clock */}
              <div className="mt-5 bg-black/20 backdrop-blur-xs rounded-xl p-3 border border-white/20">
                <span className="text-[10px] font-bold uppercase tracking-wider text-blue-200 block mb-1">
                  Sale Ends In:
                </span>
                <div className="flex items-center gap-1 text-sm font-mono font-black">
                  <div className="bg-white text-[#2874F0] px-2 py-1 rounded shadow-xs">
                    {String(timeLeft.hours).padStart(2, '0')}h
                  </div>
                  <span>:</span>
                  <div className="bg-white text-[#2874F0] px-2 py-1 rounded shadow-xs">
                    {String(timeLeft.minutes).padStart(2, '0')}m
                  </div>
                  <span>:</span>
                  <div className="bg-white text-[#2874F0] px-2 py-1 rounded shadow-xs">
                    {String(timeLeft.seconds).padStart(2, '0')}s
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 relative z-10">
              <button
                onClick={() => viewCategory('all')}
                className="w-full py-2.5 rounded-xl bg-white hover:bg-blue-50 text-[#2874F0] font-black text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>VIEW ALL DEALS</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Background subtle shine */}
            <div className="absolute -bottom-8 -right-8 w-32 h-32 rounded-full bg-white/10 blur-xl pointer-events-none" />
          </div>

          {/* Right Product Scroll Rail with Left/Right Buttons */}
          <div className="col-span-12 lg:col-span-9 p-4 lg:p-6 relative">
            {/* Header controls for the rail */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                Exclusive Student Discount Rail
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollRail(dealsRailRef, 'left')}
                  className="w-8 h-8 rounded-full border border-gray-200 hover:border-[#2874F0] hover:text-[#2874F0] bg-white flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                  title="Scroll Left"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => scrollRail(dealsRailRef, 'right')}
                  className="w-8 h-8 rounded-full border border-gray-200 hover:border-[#2874F0] hover:text-[#2874F0] bg-white flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
                  title="Scroll Right"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Scrollable Container */}
            <div 
              ref={dealsRailRef}
              className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
            >
              {topDeals.map((prod) => {
                const inWishlist = isInWishlist(prod.id);
                return (
                  <div
                    key={prod.id}
                    onClick={() => viewProduct(prod)}
                    className="w-52 shrink-0 group bg-white rounded-xl border border-gray-200 hover:border-[#2874F0] hover:shadow-lg transition-all p-3 flex flex-col justify-between cursor-pointer relative"
                  >
                    {/* Discount ribbon */}
                    <div className="absolute top-2 left-2 z-10 bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.5 rounded shadow-2xs">
                      {prod.discountPercent}% OFF
                    </div>

                    {/* Wishlist toggle */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(prod.id);
                      }}
                      className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-400 hover:text-rose-500 transition-colors shadow-2xs cursor-pointer"
                      title="Save to Wishlist"
                    >
                      <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                    </button>

                    <div>
                      {/* Product Image on Clean White Container */}
                      <div className="aspect-square rounded-lg bg-white mb-2 flex items-center justify-center p-2 border border-gray-100 group-hover:border-blue-50 relative overflow-hidden">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300 drop-shadow-2xs"
                          loading="lazy"
                        />
                        {/* Quick View Hover Button */}
                        <button
                          onClick={(e) => openQuickView(e, prod)}
                          className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-white/95 hover:bg-white text-[#2874F0] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 cursor-pointer whitespace-nowrap"
                        >
                          <Eye className="w-3 h-3" />
                          <span>Quick View</span>
                        </button>
                      </div>

                      {/* Brand & Title */}
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                        {prod.brand}
                      </span>
                      <h4 className="text-xs font-bold text-slate-800 line-clamp-2 min-h-[32px] group-hover:text-[#2874F0] transition-colors leading-tight">
                        {prod.name}
                      </h4>

                      {/* Campus Assured Badge (Iconic Flipkart Assured Look) */}
                      <div className="mt-1 flex items-center gap-1">
                        <span className="inline-flex items-center gap-0.5 text-[9px] font-black italic bg-gradient-to-r from-blue-700 to-[#2874F0] text-white px-1.5 py-0.2 rounded-xs shadow-3xs">
                          <span>Campus</span>
                          <span className="text-amber-300">Assured</span>
                        </span>
                      </div>
                    </div>

                    {/* Price, Ratings & Add to Cart */}
                    <div className="mt-2.5 pt-2 border-t border-gray-100">
                      {/* Rating pill */}
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="bg-[#388e3c] text-white text-[10px] font-black px-1.5 py-0.2 rounded flex items-center gap-0.5">
                          <span>{Number(prod.rating || 0).toFixed(1)}</span>
                          <Star className="w-2.5 h-2.5 fill-white text-white" />
                        </span>
                        <span className="text-[10px] text-gray-400 font-medium">
                          ({prod.reviewCount.toLocaleString('en-IN')})
                        </span>
                      </div>

                      {/* Price stack */}
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-sm font-black text-slate-900">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </span>
                        <span className="text-[10px] text-gray-400 line-through">
                          ₹{prod.originalPrice.toLocaleString('en-IN')}
                        </span>
                      </div>

                      {/* Delivery micro-copy */}
                      <p className="text-[10px] text-emerald-700 font-semibold mt-1">
                        Free Delivery by Tomorrow
                      </p>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          if (cartItems.some(item => item.product.id === prod.id)) setActiveScreen('cart');
                          else addToCart(prod);
                        }}
                        className="w-full mt-2 py-2 bg-[#2874F0] hover:bg-[#1254C2] text-white text-sm font-bold rounded-lg transition-colors cursor-pointer"
                      >
                        {cartItems.some(item => item.product.id === prod.id) ? 'View in Cart' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          4. 3-COLUMN FLIPKART PROMOTIONAL TILES (Real Commercial Banners)
      ========================================================================= */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Banner 1: Top Electronics */}
        <div className="bg-gradient-to-br from-indigo-900 via-blue-900 to-[#2874F0] rounded-2xl p-6 text-white flex items-center justify-between relative overflow-hidden shadow-xs">
          <div className="z-10 max-w-[65%]">
            <span className="text-[10px] font-black uppercase tracking-wider bg-white/20 px-2 py-0.5 rounded-full inline-block mb-1">
              Top Student Tech
            </span>
            <h4 className="text-xl font-black font-heading leading-tight">Laptops & Audio</h4>
            <p className="text-xs text-blue-100 font-medium mt-1">HP, Apple, boAt & Sony</p>
            <p className="text-lg font-black text-amber-300 mt-2">Up to 60% OFF</p>
            <button 
              onClick={() => viewCategory('laptops')}
              className="mt-3 px-4 py-1.5 rounded-full bg-white text-[#2874F0] text-xs font-black hover:bg-blue-50 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Explore Tech</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="w-28 h-28 flex items-center justify-center p-2 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/20">
            <img 
              src="/images/laptop_deal_showcase_1791969325835.jpg"
              alt="Laptops Sale"
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain drop-shadow-lg transform hover:scale-110 transition-transform"
            />
          </div>
        </div>

        {/* Banner 2: Campus Fits & Fashion */}
        <div className="bg-gradient-to-br from-amber-600 via-rose-600 to-red-700 rounded-2xl p-6 text-white flex items-center justify-between relative overflow-hidden shadow-xs">
          <div className="z-10 max-w-[65%]">
            <span className="text-[10px] font-black uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full inline-block mb-1">
              Collegiate Fits
            </span>
            <h4 className="text-xl font-black font-heading leading-tight">Campus Fashion</h4>
            <p className="text-xs text-amber-100 font-medium mt-1">Oversized hoodies & sneakers</p>
            <p className="text-lg font-black text-yellow-300 mt-2">Under ₹799</p>
            <button 
              onClick={() => viewCategory('fashion')}
              className="mt-3 px-4 py-1.5 rounded-full bg-white text-slate-900 text-xs font-black hover:bg-amber-50 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>View Fits</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="w-28 h-28 flex items-center justify-center p-2 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/20">
            <img 
              src="/images/running_shoes_sneaker_1791969327423.jpg"
              alt="Sneakers Sale"
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain drop-shadow-lg transform hover:scale-110 transition-transform"
            />
          </div>
        </div>

        {/* Banner 3: Senior-to-Junior Peer Market */}
        <div className="bg-gradient-to-br from-emerald-700 via-teal-800 to-slate-900 rounded-2xl p-6 text-white flex items-center justify-between relative overflow-hidden shadow-xs">
          <div className="z-10 max-w-[65%]">
            <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-500/30 text-emerald-200 px-2 py-0.5 rounded-full inline-block mb-1 border border-emerald-400/30">
              Hostel Peer Market
            </span>
            <h4 className="text-xl font-black font-heading leading-tight">Senior Handover</h4>
            <p className="text-xs text-emerald-100 font-medium mt-1">Calculators, drafters & cycles</p>
            <p className="text-lg font-black text-emerald-300 mt-2">Flat 70-80% OFF</p>
            <button 
              onClick={() => {
                viewCategory('all');
                showToast('Showing Verified Senior Hand-me-downs');
              }}
              className="mt-3 px-4 py-1.5 rounded-full bg-white text-emerald-900 text-xs font-black hover:bg-emerald-50 transition-colors inline-flex items-center gap-1 cursor-pointer"
            >
              <span>Grab from Seniors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
          <div className="w-28 h-28 flex items-center justify-center p-2 bg-white/10 backdrop-blur-xs rounded-2xl border border-white/20">
            <img 
              src="https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=400&auto=format&fit=crop&q=80"
              alt="Scientific Calculator"
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain drop-shadow-lg transform hover:scale-110 transition-transform"
            />
          </div>
        </div>
      </section>

      {/* =========================================================================
          5. BEST OF ELECTRONICS & STUDY TECH (Horizontal Scroll Rail with Brands)
      ========================================================================= */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-5 pb-3 border-b border-gray-100">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
                Best of Electronics & Laptops
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-blue-50 text-[#2874F0] text-xs font-bold">
                Student Verified Specs
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Tested for coding, engineering simulations, video editing and campus work.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => scrollRail(electronicsRailRef, 'left')}
              className="w-8 h-8 rounded-full border border-gray-200 hover:border-[#2874F0] hover:text-[#2874F0] bg-white flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => scrollRail(electronicsRailRef, 'right')}
              className="w-8 h-8 rounded-full border border-gray-200 hover:border-[#2874F0] hover:text-[#2874F0] bg-white flex items-center justify-center shadow-2xs transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => viewCategory('electronics')}
              className="text-xs font-bold text-[#2874F0] hover:text-[#1254C2] ml-2 hidden sm:flex items-center gap-1 cursor-pointer"
            >
              <span>VIEW ALL</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Rail */}
        <div 
          ref={electronicsRailRef}
          className="flex gap-4 overflow-x-auto no-scrollbar scroll-smooth pb-2"
        >
          {electronicsProducts.map((prod) => {
            const inWishlist = isInWishlist(prod.id);
            return (
              <div
                key={prod.id}
                onClick={() => viewProduct(prod)}
                className="w-56 shrink-0 group bg-white rounded-xl border border-gray-200 hover:border-[#2874F0] hover:shadow-lg transition-all p-3.5 flex flex-col justify-between cursor-pointer relative"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleWishlist(prod.id);
                  }}
                  className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-400 hover:text-rose-500 transition-colors shadow-2xs cursor-pointer"
                >
                  <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                </button>

                <div>
                  <div className="aspect-square rounded-lg bg-white mb-2.5 flex items-center justify-center p-3 border border-gray-100 group-hover:border-blue-50 relative overflow-hidden">
                    <img
                      src={prod.image}
                      alt={prod.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300 drop-shadow-2xs"
                      loading="lazy"
                    />
                    <button
                      onClick={(e) => openQuickView(e, prod)}
                      className="absolute bottom-1.5 left-1/2 -translate-x-1/2 bg-white/95 text-[#2874F0] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md border border-gray-200 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1"
                    >
                      <Eye className="w-3 h-3" />
                      <span>Quick View</span>
                    </button>
                  </div>

                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                    {prod.brand}
                  </span>
                  <h4 className="text-xs font-bold text-slate-800 line-clamp-2 min-h-[32px] group-hover:text-[#2874F0] transition-colors leading-tight">
                    {prod.name}
                  </h4>
                  <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">{prod.shortDesc}</p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100">
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <span className="bg-[#388e3c] text-white text-[10px] font-black px-1.5 py-0.2 rounded flex items-center gap-0.5">
                      <span>{Number(prod.rating || 0).toFixed(1)}</span>
                      <Star className="w-2.5 h-2.5 fill-white text-white" />
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium">
                      ({prod.reviewCount.toLocaleString('en-IN')})
                    </span>
                    <span className="ml-auto text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 rounded">
                      {prod.discountPercent}% off
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1.5">
                    <span className="text-base font-black text-slate-900">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-gray-400 line-through">
                      ₹{prod.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(prod);
                    }}
                    className="w-full mt-2.5 py-1.5 bg-[#2874F0] hover:bg-[#1254C2] text-white text-xs font-bold rounded-lg transition-colors cursor-pointer"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* =========================================================================
          6. CAMPUS PEER MARKETPLACE: VERIFIED SENIOR HAND-ME-DOWNS
      ========================================================================= */}
      <section className="bg-gradient-to-r from-blue-50 via-indigo-50/40 to-white rounded-2xl border border-blue-200 p-6 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              <h3 className="text-xl font-black text-slate-900 tracking-tight">
                Campus Senior-to-Junior Peer Market
              </h3>
              <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-black">
                Save 70-85%
              </span>
            </div>
            <p className="text-xs text-gray-600 mt-1">
              Direct peer handover from graduating 3rd & 4th year students. Meet at common rooms or get hostel delivery.
            </p>
          </div>

          <button
            onClick={() => setActiveScreen('offers')}
            className="px-4 py-2 rounded-xl bg-[#2874F0] hover:bg-[#1254C2] text-white text-xs font-bold shadow-xs transition-colors cursor-pointer shrink-0"
          >
            Browse All Senior Listings
          </button>
        </div>

        {/* 4 Peer Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            {
              id: 'peer-calc',
              title: 'Casio FX-991EX Classwiz Calculator',
              seller: 'Rahul V. (Mechanical 4th Year)',
              hostel: 'Boys Hostel 3 • Room 412',
              price: 950,
              mrp: 1595,
              discount: '40% OFF',
              condition: 'Like New (Used 1 Semester)',
              image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=400&auto=format&fit=crop&q=80',
            },
            {
              id: 'peer-cycle',
              title: 'Hero Sprint 26T Commuter Bicycle',
              seller: 'Arjun K. (CSE Final Year)',
              hostel: 'Boys Hostel 4 • Ground Floor',
              price: 3200,
              mrp: 7500,
              discount: '57% OFF',
              condition: 'Gently Used (New Tyres)',
              image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&auto=format&fit=crop&q=80',
            },
            {
              id: 'peer-books',
              title: 'H.C. Verma Concepts of Physics Vol 1 & 2',
              seller: 'Sneha M. (ECE 3rd Year)',
              hostel: 'Girls Hostel 1 • Room 108',
              price: 450,
              mrp: 900,
              discount: '50% OFF',
              condition: 'No Marks • Perfect Binding',
              image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
            },
            {
              id: 'peer-kettle',
              title: 'Bajaj 1.5L Stainless Steel Electric Kettle',
              seller: 'Vikram S. (Civil 4th Year)',
              hostel: 'Boys Hostel 2 • Room 215',
              price: 550,
              mrp: 1200,
              discount: '54% OFF',
              condition: 'Super Clean • 100% Working',
              image: 'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=400&auto=format&fit=crop&q=80',
            }
          ].map((item) => (
            <div 
              key={item.id}
              className="bg-white rounded-xl border border-gray-200 hover:border-[#2874F0] p-4 flex flex-col justify-between transition-all hover:shadow-md"
            >
              <div>
                <div className="aspect-4/3 rounded-lg bg-gray-50 mb-3 flex items-center justify-center p-2 relative overflow-hidden border">
                  <img
                    src={item.image}
                    alt={item.title}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain"
                  />
                  <span className="absolute top-2 left-2 bg-emerald-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded">
                    {item.discount}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[9px] font-medium px-1.5 py-0.5 rounded">
                    {item.condition}
                  </span>
                </div>

                <h4 className="text-xs font-bold text-slate-900 line-clamp-2 leading-tight">
                  {item.title}
                </h4>

                <div className="mt-2 text-[10px] text-gray-500 space-y-0.5">
                  <p className="font-semibold text-slate-700">👤 {item.seller}</p>
                  <p className="text-[#2874F0]">📍 {item.hostel}</p>
                </div>
              </div>

              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <span className="text-sm font-black text-slate-900">₹{item.price}</span>
                  <span className="text-[10px] text-gray-400 line-through ml-1.5">₹{item.mrp}</span>
                </div>
                <button
                  onClick={() => showToast(`Contact request sent to ${item.seller}`)}
                  className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold rounded-lg transition-colors cursor-pointer"
                >
                  Request Handover
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          7. DORM & HOSTEL ROOM ESSENTIALS
      ========================================================================= */}
      <section className="bg-white rounded-2xl border border-gray-200 p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight">
              Hostel Room & Dorm Makeover
            </h3>
            <p className="text-xs text-gray-500">
              Study tables, organizers, ambient LED lighting & bedsheets for college rooms.
            </p>
          </div>
          <button
            onClick={() => viewCategory('home')}
            className="text-xs font-bold text-[#2874F0] hover:text-[#1254C2] flex items-center gap-1 cursor-pointer"
          >
            <span>VIEW ALL ROOM GEAR</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3.5">
          {hostelProducts.slice(0, 6).map((prod) => (
            <div
              key={prod.id}
              onClick={() => viewProduct(prod)}
              className="group bg-white rounded-xl border border-gray-200 hover:border-[#2874F0] hover:shadow-md transition-all p-3 flex flex-col justify-between cursor-pointer"
            >
              <div>
                <div className="aspect-square rounded-lg bg-white mb-2 flex items-center justify-center p-2 border border-gray-100">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
                  />
                </div>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-2 min-h-[32px] group-hover:text-[#2874F0] leading-tight">
                  {prod.name}
                </h4>
              </div>

              <div className="mt-2 pt-2 border-t border-gray-100">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-black text-slate-900">₹{prod.price.toLocaleString('en-IN')}</span>
                  <span className="text-[10px] text-gray-400 line-through">₹{prod.originalPrice.toLocaleString('en-IN')}</span>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    addToCart(prod);
                  }}
                  className="w-full mt-2 py-1 bg-gray-50 hover:bg-[#2874F0] hover:text-white text-slate-700 text-xs font-bold rounded border transition-colors cursor-pointer"
                >
                  + Add
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* =========================================================================
          8. WHY 2.5 LAKH+ STUDENTS BUY ON CAMPUSMART (Trust Matrix)
      ========================================================================= */}
      <section className="bg-slate-900 text-white rounded-2xl p-8 shadow-sm">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold text-amber-400 uppercase tracking-widest block mb-1">
            INDIA'S LARGEST COLLEGIATE NETWORK
          </span>
          <h3 className="text-2xl sm:text-3xl font-black font-heading">
            Why University Students Trust CampusMart
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 mt-2">
            Built specifically to solve the high cost of campus living with verified student pricing and instant delivery.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5">
            <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center text-xl font-black mb-3">
              🎓
            </div>
            <h4 className="font-bold text-sm text-white">100% Student Verified</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Every seller and buyer is authenticated using their .edu or university ID cards for complete safety.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-xl font-black mb-3">
              ⚡
            </div>
            <h4 className="font-bold text-sm text-white">2-Hour Campus Express</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Direct delivery to your hostel room, academic blocks, or campus main gate within 2 hours.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5">
            <div className="w-12 h-12 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center text-xl font-black mb-3">
              🛡️
            </div>
            <h4 className="font-bold text-sm text-white">Campus Escrow Safety</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Payments are held securely in escrow until you inspect and accept your delivery in person.
            </p>
          </div>

          <div className="bg-slate-800/80 border border-slate-700 rounded-xl p-5">
            <div className="w-12 h-12 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center text-xl font-black mb-3">
              🔄
            </div>
            <h4 className="font-bold text-sm text-white">7-Day Free Replacement</h4>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Not satisfied with your device or item? Get a hassle-free doorstep return or replacement.
            </p>
          </div>
        </div>
      </section>

      {/* =========================================================================
          QUICK VIEW MODAL (Flipkart Standard Product Overlay)
      ========================================================================= */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative animate-in fade-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto no-scrollbar">
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-500 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
              {/* Image & Thumbnails */}
              <div>
                <div className="aspect-square rounded-xl bg-white border border-gray-200 p-4 flex items-center justify-center relative">
                  <img
                    src={quickViewProduct.image}
                    alt={quickViewProduct.name}
                    referrerPolicy="no-referrer"
                    className="max-h-full max-w-full object-contain"
                  />
                  <span className="absolute top-3 left-3 bg-emerald-600 text-white text-[10px] font-black px-2 py-0.5 rounded">
                    {quickViewProduct.discountPercent}% OFF
                  </span>
                </div>
              </div>

              {/* Product Details & Purchase Form */}
              <div className="space-y-4">
                <div>
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
                    {quickViewProduct.brand}
                  </span>
                  <h3 className="text-lg font-black text-slate-900 leading-tight mt-0.5">
                    {quickViewProduct.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-2">
                    <span className="bg-[#388e3c] text-white text-xs font-black px-2 py-0.5 rounded flex items-center gap-1">
                      <span>{quickViewProduct.rating}</span>
                      <Star className="w-3 h-3 fill-white text-white" />
                    </span>
                    <span className="text-xs text-gray-500 font-medium">
                      {quickViewProduct.reviewCount.toLocaleString('en-IN')} Ratings & Reviews
                    </span>
                    <span className="inline-flex items-center gap-0.5 text-[10px] font-black bg-[#2874F0] text-white px-1.5 py-0.5 rounded-xs ml-auto">
                      Campus Assured
                    </span>
                  </div>
                </div>

                {/* Price Display */}
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-baseline gap-3">
                  <span className="text-2xl font-black text-slate-900">
                    ₹{quickViewProduct.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ₹{quickViewProduct.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-xs font-bold text-emerald-600">
                    Save ₹{(quickViewProduct.originalPrice - quickViewProduct.price).toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Color Variants */}
                {quickViewProduct.colors && quickViewProduct.colors.length > 0 && (
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-1.5">
                      Select Color: <span className="font-normal text-gray-600">{selectedQuickColor}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      {quickViewProduct.colors.map((color) => (
                        <button
                          key={color}
                          onClick={() => setSelectedQuickColor(color)}
                          className={`px-3 py-1 text-xs rounded-lg border font-semibold transition-all cursor-pointer ${
                            selectedQuickColor === color
                              ? 'border-[#2874F0] bg-blue-50 text-[#2874F0]'
                              : 'border-gray-200 text-gray-700 hover:border-gray-300'
                          }`}
                        >
                          {color}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Hostel Delivery Pincode Checker */}
                <div>
                  <span className="text-xs font-bold text-slate-800 block mb-1">
                    Delivery Pincode:
                  </span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={pincodeCheck}
                      onChange={(e) => setPincodeCheck(e.target.value)}
                      placeholder="Enter Campus Pincode"
                      className="w-36 px-3 py-1.5 border border-gray-300 rounded-lg text-xs font-semibold focus:outline-hidden focus:border-[#2874F0]"
                    />
                    <button
                      onClick={() => {
                        setPincodeChecked(true);
                        showToast(`Delivery available to ${pincodeCheck} by Tomorrow`);
                      }}
                      className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-slate-800 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      Check
                    </button>
                  </div>
                  {pincodeChecked && (
                    <p className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" />
                      Free 2-Hour Delivery Available to Hostel 4
                    </p>
                  )}
                </div>

                {/* Key Highlights */}
                {quickViewProduct.highlights && (
                  <div>
                    <span className="text-xs font-bold text-slate-800 block mb-1">Highlights:</span>
                    <ul className="text-xs text-gray-600 space-y-1">
                      {quickViewProduct.highlights.slice(0, 3).map((hl, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="text-[#2874F0] font-black">•</span>
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* CTA Buttons */}
                <div className="pt-2 flex items-center gap-3">
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct, 1, selectedQuickColor);
                      setQuickViewProduct(null);
                    }}
                    className="flex-1 py-3 bg-[#2874F0] hover:bg-[#1254C2] text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    ADD TO CART
                  </button>
                  <button
                    onClick={() => {
                      addToCart(quickViewProduct, 1, selectedQuickColor);
                      setQuickViewProduct(null);
                      setActiveScreen('cart');
                    }}
                    className="flex-1 py-3 bg-amber-500 hover:bg-amber-600 text-slate-900 text-xs font-black rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    BUY NOW
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
