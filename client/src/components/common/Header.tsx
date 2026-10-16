import React, { useState, useRef, useEffect } from 'react';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  ChevronDown,
  MapPin,
  X,
  Package,
  ShieldCheck,
  CheckCircle2,
  Sparkles,
  TrendingUp,
  Clock,
  Coins,
  Smartphone,
  Laptop,
  Shirt,
  Headphones,
  Armchair,
  BookOpen,
  RotateCcw,
  Zap,
  Lock,
  Menu
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES_DATA } from '../../data/mockData';
import { ProductCategory } from '../../types';

export const Header: React.FC = () => {
  const { 
    catalogProducts,
    cartItems, 
    wishlistIds, 
    activeScreen, 
    setActiveScreen, 
    selectedCategory, 
    setSelectedCategory,
    viewCategory, 
    searchQuery, 
    setSearchQuery,
    setPortalMode,
    showToast,
    viewProduct
  } = useShop();

  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [selectedCampus, setSelectedCampus] = useState('SRM Campus, Boys Hostel 4 (Room 312)');
  const [isCampusModalOpen, setIsCampusModalOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalCartValue = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  // Close search suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const normalizeText = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  const editDistance = (left: string, right: string) => {
    const a = left.slice(0, 80), b = right.slice(0, 80);
    const row = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      let diagonal = row[0]; row[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const above = row[j];
        row[j] = Math.min(row[j] + 1, row[j - 1] + 1, diagonal + (a[i - 1] === b[j - 1] ? 0 : 1));
        diagonal = above;
      }
    }
    return row[b.length];
  };
  const getSearchScore = (query: string, product: typeof catalogProducts[number]) => {
    const q = normalizeText(query), name = normalizeText(product.name), brand = normalizeText(product.brand);
    if (!q) return 0;
    if (name.includes(q) || brand.includes(q) || normalizeText(product.shortDesc || '').includes(q)) return 100;
    const queryWords = q.split(' ').filter(Boolean);
    const searchableWords = normalizeText(`${product.name} ${product.brand} ${product.shortDesc || ''}`).split(' ');
    const matched = queryWords.filter(word => searchableWords.some(candidate => candidate.startsWith(word) || (word.length >= 3 && editDistance(word, candidate) <= Math.max(1, Math.ceil(word.length * 0.35)) ))).length;
    return Math.round((matched / Math.max(1, queryWords.length)) * 90);
  };
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const rawQuery = searchQuery.trim();
    if (!rawQuery || isSearchLoading) return;
    const bestMatch = [...catalogProducts].map(product => ({ product, score: getSearchScore(rawQuery, product) })).sort((a, b) => b.score - a.score)[0];
    // Correct clear misspellings to the closest real product name; otherwise preserve broad searches.
    const queryWords = normalizeText(rawQuery).split(' ').filter(Boolean);
    const hasStrongMatch = bestMatch && bestMatch.score >= 65 && queryWords.some(word => word.length >= 3);
    if (hasStrongMatch && bestMatch.score < 100) setSearchQuery(bestMatch.product.name);
    setIsSearchFocused(false);
    setSelectedCategory('all');
    setIsSearchLoading(true);
    window.setTimeout(() => {
      setIsSearchLoading(false);
      setActiveScreen('product-listing');
    }, 1500);
  };

  const trendingSearches = [
    'HP Pavilion 15 i5',
    'Casio FX-991EX Scientific Calculator',
    'boAt ANC Headphones',
    'Hostel Wooden Study Table',
    'iQOO Z9 5G Mobile',
    'Campus Oversized Hoodie',
    'Bicycle for Hostel Commute'
  ];

  const campusOptions = [
    'SRM Campus, Boys Hostel 4 (Room 312)',
    'SRM Campus, Girls Hostel 2 (Room 205)',
    'IIT Madras, Ganga Hostel (Block C)',
    'VIT Vellore, Men\'s Hostel Block D',
    'NIT Trichy, Garnet Hostel',
    'BITS Pilani, Shankar Bhawan',
    'Delhi University, North Campus',
  ];

  const filteredQuickProducts = searchQuery.trim()
    ? catalogProducts.map(product => ({ product, score: getSearchScore(searchQuery, product) }))
        .filter(item => item.score >= 35)
        .sort((a, b) => b.score - a.score || b.product.reviewCount - a.product.reviewCount)
        .slice(0, 5).map(item => item.product)
    : [];

  return (
    <>
    {isSearchLoading && (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/55 backdrop-blur-md px-5" role="status" aria-live="polite">
        <div className="search-loader-card relative w-full max-w-sm overflow-hidden rounded-[2rem] border border-white/70 bg-white/95 px-8 py-9 text-center shadow-[0_30px_100px_rgba(2,6,23,0.4)]">
          <div className="search-orbit-scene mx-auto mb-6"><div className="search-orbit-ring ring-one"></div><div className="search-orbit-ring ring-two"></div><div className="search-cube"><Search className="h-7 w-7" /></div><span className="search-orbit-dot dot-one"></span><span className="search-orbit-dot dot-two"></span><span className="search-orbit-dot dot-three"></span></div>
          <p className="text-[10px] font-extrabold uppercase tracking-[0.28em] text-blue-600">CampusMart Discovery</p>
          <h3 className="mt-2 text-xl font-extrabold tracking-tight text-slate-900">Finding your best match</h3>
          <p className="mt-2 text-sm text-slate-500">Checking products, deals and close matches…</p>
          <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="search-progress-bar h-full rounded-full bg-gradient-to-r from-blue-600 via-cyan-400 to-violet-500"></div></div>
        </div>
      </div>
    )}
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-xs select-none">
      {/* 1. TOP UTILITY STRIP (Desktop only or clean single line on mobile) */}
      <div className="bg-[#2874F0] text-white text-[11px] py-1 px-3 sm:px-6 lg:px-8 border-b border-blue-600">
        <div className="max-w-[1440px] mx-auto flex items-center justify-between font-medium">
          <div className="flex items-center gap-2 sm:gap-6 truncate">
            <span className="flex items-center gap-1.5 font-bold tracking-wide shrink-0">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span className="hidden xs:inline">100% Student Verified</span>
              <span className="xs:hidden">Student Verified</span>
            </span>
            <span className="hidden md:inline text-blue-200">•</span>
            <span className="hidden md:inline text-blue-100 truncate">
              ⚡ FREE 2-Hour Express Delivery to University Hostels & Gates
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 text-blue-100 shrink-0">
            <button 
              onClick={() => setIsCampusModalOpen(true)}
              className="flex items-center gap-1 hover:text-white transition-colors cursor-pointer text-[10px] sm:text-[11px]"
            >
              <MapPin className="w-3 h-3 text-amber-300 shrink-0" />
              <span className="hidden sm:inline">Deliver to:</span>
              <strong className="text-white underline font-semibold truncate max-w-[100px] sm:max-w-[170px]">
                {selectedCampus.split(',')[0]}
              </strong>
              <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-80 shrink-0" />
            </button>
            <span className="text-blue-300">|</span>
            <button 
              onClick={() => setActiveScreen('track-order')}
              className="hover:text-white transition-colors cursor-pointer text-[10px] sm:text-[11px]"
            >
              Track Order
            </button>
            <span className="hidden sm:inline text-blue-300">|</span>
            <button 
              onClick={() => setActiveScreen('offers')}
              className="hidden sm:inline hover:text-white transition-colors cursor-pointer text-amber-300 font-bold text-[10px] sm:text-[11px]"
            >
              Deals
            </button>
          </div>
        </div>
      </div>

      {/* 2. MAIN BRAND & SEARCH HEADER */}
      <div className="max-w-[1440px] mx-auto px-3 sm:px-6 lg:px-8 py-2 md:py-3">
        {/* ROW 1 (Desktop: Logo + Search + Profile + Wishlist + Cart; Mobile: Logo + Deliver Tag + Wishlist + Cart) */}
        <div className="flex items-center justify-between gap-3 md:gap-8">
          {/* Flipkart-Style Brand Logo */}
          <button 
            onClick={() => {
              setPortalMode('customer');
              setActiveScreen('home');
            }}
            className="flex flex-col text-left group focus:outline-hidden cursor-pointer shrink-0"
            title="CampusMart Home"
          >
            <div className="flex items-center gap-1.5 sm:gap-2">
              <div className="w-7 h-7 sm:w-9 sm:h-9 rounded-lg bg-[#2874F0] text-white flex items-center justify-center shadow-xs">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              </div>
              <span className="text-lg sm:text-2xl font-black tracking-tight text-[#2874F0] font-heading leading-none">
                Campus<span className="text-slate-900">Mart</span>
              </span>
            </div>
            {/* "Explore Plus ★" Signature Badge */}
            <div className="flex items-center gap-1 ml-8 sm:ml-10 -mt-0.5 text-[9px] sm:text-[10px] font-bold italic tracking-wide text-gray-500">
              <span>Explore</span>
              <span className="text-[#2874F0] font-black">Plus</span>
              <Sparkles className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
            </div>
          </button>

          {/* DESKTOP SEARCH BAR (Hidden on mobile, shown in Row 2 below on mobile) */}
          <div ref={searchContainerRef} className="hidden md:block flex-1 max-w-2xl relative min-w-0">
            <form 
              onSubmit={handleSearchSubmit}
              className={`flex items-center bg-gray-50 hover:bg-white border transition-all rounded-lg pl-3 pr-1.5 py-1.5 shadow-2xs ${
                isSearchFocused ? 'bg-white border-[#2874F0] ring-2 ring-blue-100' : 'border-gray-200'
              }`}
            >
              <Search className="w-4 h-4 text-gray-400 shrink-0" />
              
              <input 
                type="text"
                value={searchQuery}
                onFocus={() => setIsSearchFocused(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search laptops, smartphones, hostel setups, books..."
                className="flex-1 min-w-0 px-2.5 py-1 bg-transparent text-xs sm:text-sm text-gray-900 placeholder-gray-400 focus:outline-hidden font-medium"
              />

              {searchQuery && (
                <button 
                  type="button" 
                  onClick={() => setSearchQuery('')}
                  className="text-gray-400 hover:text-gray-600 px-1.5 py-1 cursor-pointer shrink-0"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}

              <button
                type="submit"
                className="px-4 py-1.5 bg-[#2874F0] hover:bg-[#1254C2] text-white text-xs font-bold rounded-md shadow-2xs transition-colors cursor-pointer shrink-0 ml-1"
              >
                Search
              </button>
            </form>

            {/* Interactive Search Autocomplete / Trending Dropdown */}
            {isSearchFocused && (
              <div className="absolute left-0 right-0 top-full mt-1.5 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-gray-100 animate-in fade-in duration-100">
                {/* Instant matched products if typing */}
                {filteredQuickProducts.length > 0 && (
                  <div className="p-2 bg-blue-50/40">
                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-2 py-1">
                      Matching Products
                    </div>
                    {filteredQuickProducts.map(p => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          viewProduct(p);
                          setIsSearchFocused(false);
                        }}
                        className="w-full text-left px-2.5 py-1.5 hover:bg-white rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer"
                      >
                        <div className="flex items-center gap-2">
                          <img src={p.image} alt={p.name} className="w-7 h-7 object-contain rounded bg-white border p-0.5" />
                          <span className="font-semibold text-slate-800 line-clamp-1">{p.name}</span>
                        </div>
                        <span className="font-bold text-[#2874F0] shrink-0 ml-2">₹{p.price.toLocaleString('en-IN')}</span>
                      </button>
                    ))}
                  </div>
                )}

                {searchQuery.trim() && filteredQuickProducts.length > 0 && !filteredQuickProducts.some(p => normalizeText(p.name).includes(normalizeText(searchQuery))) && (
                  <button type="button" onClick={() => setSearchQuery(filteredQuickProducts[0].name)} className="w-full px-3 py-2 text-left text-xs bg-amber-50 text-amber-900 hover:bg-amber-100">
                    <span className="font-semibold">Did you mean:</span> {filteredQuickProducts[0].name}
                  </button>
                )}
                {/* Trending Queries on Campus */}
                <div className="p-3">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 mb-2">
                    <TrendingUp className="w-3.5 h-3.5 text-[#2874F0]" />
                    <span>Trending on Campus</span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {trendingSearches.map((term, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={() => {
                          setSearchQuery(term);
                          setIsSearchFocused(false);
                          setActiveScreen('product-listing');
                        }}
                        className="px-2.5 py-1 bg-gray-50 hover:bg-blue-50 hover:text-[#2874F0] text-gray-700 rounded-full text-xs font-medium border border-gray-200 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Clock className="w-3 h-3 text-gray-400" />
                        <span>{term}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Category Jump */}
                <div className="p-2.5 bg-gray-50/70 flex items-center justify-between text-xs text-gray-600">
                  <span className="text-[11px] font-semibold text-gray-500">Popular:</span>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => { viewCategory('laptops'); setIsSearchFocused(false); }}
                      className="font-bold text-[#2874F0] hover:underline cursor-pointer"
                    >
                      Laptops
                    </button>
                    <span>•</span>
                    <button 
                      onClick={() => { viewCategory('mobiles'); setIsSearchFocused(false); }}
                      className="font-bold text-[#2874F0] hover:underline cursor-pointer"
                    >
                      5G Mobiles
                    </button>
                    <span>•</span>
                    <button 
                      onClick={() => { viewCategory('home'); setIsSearchFocused(false); }}
                      className="font-bold text-[#2874F0] hover:underline cursor-pointer"
                    >
                      Hostel Setup
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Action Icons (Profile, Wishlist, Cart) */}
          <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-5 shrink-0">
            {/* Customer Profile Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className="flex items-center gap-1 sm:gap-2 px-2 sm:px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 text-slate-800 text-xs font-bold transition-all shadow-2xs cursor-pointer"
              >
                <div className="w-5 h-5 rounded-full bg-[#EBF3FE] text-[#2874F0] flex items-center justify-center font-black text-[10px]">
                  G
                </div>
                <span className="hidden sm:inline">Guest</span>
                <ChevronDown className="w-3 h-3 text-gray-500" />
              </button>

              {isAccountMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded-xl shadow-xl py-2 z-50 text-xs text-gray-700 divide-y divide-gray-100 animate-in fade-in duration-100">
                  <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-indigo-50/30">
                    <div className="flex items-center justify-between">
                      <p className="font-bold text-slate-900 text-sm">Guest</p>
                      <span className="text-[10px] bg-slate-100 text-slate-600 font-bold px-1.5 py-0.5 rounded">Guest session</span>
                    </div>
                    <p className="text-[11px] text-gray-500 mt-0.5">Browse as a guest · Sign in to save your account</p>
                    
                    {/* SuperCoins Strip */}
                    <div className="mt-2.5 pt-2 border-t border-blue-100/70 flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1 text-slate-700 font-medium">
                        <Coins className="w-3.5 h-3.5 text-amber-500" />
                        Campus Coins:
                      </span>
                      <span className="font-bold text-amber-600">Sign in to earn</span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setActiveScreen('account');
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-[#2874F0] font-medium flex items-center gap-2.5 cursor-pointer"
                    >
                      <User className="w-4 h-4 text-gray-500" />
                      <span>My Profile & Student ID</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveScreen('track-order');
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-[#2874F0] font-medium flex items-center gap-2.5 cursor-pointer"
                    >
                      <Package className="w-4 h-4 text-gray-500" />
                      <span>Orders & Delivery Tracking</span>
                    </button>

                    <button
                      onClick={() => {
                        setActiveScreen('wishlist');
                        setIsAccountMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-blue-50 hover:text-[#2874F0] font-medium flex items-center justify-between cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Heart className="w-4 h-4 text-gray-500" />
                        <span>My Wishlist</span>
                      </div>
                      {wishlistIds.length > 0 && (
                        <span className="bg-rose-100 text-rose-700 font-bold px-1.5 py-0.5 rounded-full text-[10px]">
                          {wishlistIds.length}
                        </span>
                      )}
                    </button>
                  </div>

                  <div className="border-t border-gray-100 py-1">
                    <button onClick={() => { setPortalMode('seller'); setIsAccountMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-blue-50 font-semibold flex items-center gap-2.5"><Package className="w-4 h-4 text-blue-600"/><span>Seller Portal <span className="text-[10px] text-gray-400">· Store management</span></span></button>
                    <button onClick={() => { setPortalMode('admin'); setIsAccountMenuOpen(false); }} className="w-full text-left px-4 py-2 hover:bg-blue-50 font-semibold flex items-center gap-2.5"><ShieldCheck className="w-4 h-4 text-violet-600"/><span>Admin Portal <span className="text-[10px] text-gray-400">· Platform operations</span></span></button>
                  </div>
                </div>
              )}
            </div>

            {/* Wishlist Icon */}
            <button
              onClick={() => setActiveScreen('wishlist')}
              className="flex items-center justify-center p-2 rounded-lg hover:bg-gray-100 text-slate-700 transition-colors relative cursor-pointer"
              title="Wishlist"
            >
              <Heart className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
              {wishlistIds.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-rose-500 text-white font-bold text-[9px] w-4 h-4 rounded-full flex items-center justify-center">
                  {wishlistIds.length}
                </span>
              )}
            </button>

            {/* Cart Button with Counter */}
            <button
              onClick={() => setActiveScreen('cart')}
              className="flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 rounded-lg bg-[#2874F0] hover:bg-[#1254C2] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
              title="Shopping Cart"
            >
              <div className="relative">
                <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                <span className="absolute -top-1.5 -right-2 bg-amber-400 text-slate-900 font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                  {totalCartCount}
                </span>
              </div>
              <span className="hidden md:inline font-bold">Cart</span>
              {totalCartValue > 0 && (
                <span className="hidden lg:inline text-blue-100 font-normal border-l border-blue-400 pl-1.5 text-[11px]">
                  ₹{totalCartValue.toLocaleString('en-IN')}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* ROW 2: MOBILE FULL-WIDTH SEARCH BAR (Guarantees zero overlap on mobile screens) */}
        <div className="md:hidden mt-2 relative">
          <form 
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-gray-50 hover:bg-white border border-gray-200 focus-within:border-[#2874F0] focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-100 rounded-lg px-2.5 py-1.5 transition-all shadow-2xs w-full"
          >
            <Search className="w-4 h-4 text-gray-400 shrink-0" />
            
            <input 
              type="text"
              value={searchQuery}
              onFocus={() => setIsSearchFocused(true)}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search mobiles, laptops, clothes, notes..."
              className="flex-1 min-w-0 px-2 py-0.5 bg-transparent text-xs text-gray-900 placeholder-gray-400 focus:outline-hidden font-medium"
            />

            {searchQuery && (
              <button 
                type="button" 
                onClick={() => setSearchQuery('')}
                className="text-gray-400 hover:text-gray-600 px-1 py-0.5 cursor-pointer shrink-0"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              type="submit"
              className="px-2.5 py-1 bg-[#2874F0] hover:bg-[#1254C2] text-white text-[11px] font-bold rounded shadow-2xs shrink-0 cursor-pointer ml-1"
            >
              Search
            </button>
          </form>

          {/* Mobile search suggestions dropdown */}
          {isSearchFocused && (
            <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-gray-100 animate-in fade-in duration-100">
              {filteredQuickProducts.length > 0 && (
                <div className="p-2 bg-blue-50/40">
                  <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-1 py-0.5">
                    Matching Products
                  </div>
                  {filteredQuickProducts.map(p => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => {
                        viewProduct(p);
                        setIsSearchFocused(false);
                      }}
                      className="w-full text-left px-2 py-1.5 hover:bg-white rounded-lg flex items-center justify-between text-xs transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2 truncate">
                        <img src={p.image} alt={p.name} className="w-6 h-6 object-contain rounded bg-white border p-0.5 shrink-0" />
                        <span className="font-semibold text-slate-800 truncate">{p.name}</span>
                      </div>
                      <span className="font-bold text-[#2874F0] shrink-0 ml-1">₹{p.price.toLocaleString('en-IN')}</span>
                    </button>
                  ))}
                </div>
              )}

              {searchQuery.trim() && filteredQuickProducts.length > 0 && !filteredQuickProducts.some(p => normalizeText(p.name).includes(normalizeText(searchQuery))) && (
                <button type="button" onClick={() => setSearchQuery(filteredQuickProducts[0].name)} className="w-full px-3 py-2 text-left text-xs bg-amber-50 text-amber-900 hover:bg-amber-100">
                  <span className="font-semibold">Did you mean:</span> {filteredQuickProducts[0].name}
                </button>
              )}
              <div className="p-2.5">
                <div className="text-[11px] font-bold text-slate-800 mb-1.5 flex items-center gap-1">
                  <TrendingUp className="w-3 h-3 text-[#2874F0]" />
                  <span>Trending on Campus</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {trendingSearches.slice(0, 5).map((term, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => {
                        setSearchQuery(term);
                        setIsSearchFocused(false);
                        setActiveScreen('product-listing');
                      }}
                      className="px-2 py-0.5 bg-gray-50 hover:bg-blue-50 hover:text-[#2874F0] text-gray-700 rounded-full text-[11px] font-medium border border-gray-200"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 3. FLIPKART-STYLE HORIZONTAL CATEGORY NAVIGATION STRIP */}
      <div className="hidden md:block bg-white border-t border-gray-100 shadow-2xs">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <div className="flex items-center justify-between py-2 text-xs font-semibold overflow-x-auto no-scrollbar gap-2">
            {[
              { id: 'all', label: '🔥 Top Offers', icon: Zap },
              { id: 'mobiles', label: 'Mobiles & 5G', icon: Smartphone },
              { id: 'laptops', label: 'Laptops & IT', icon: Laptop },
              { id: 'electronics', label: 'Audio & Gadgets', icon: Headphones },
              { id: 'fashion', label: 'Campus Fashion', icon: Shirt },
              { id: 'home', label: 'Hostel & Living', icon: Armchair },
              { id: 'books', label: 'Books & Notes', icon: BookOpen },
              { id: 'stationery', label: 'Stationery & Drafters', icon: Package },
              { id: 'sports', label: 'Sports & Cycles', icon: RotateCcw },
            ].map(cat => {
              const Icon = cat.icon;
              const isActive = selectedCategory === cat.id && activeScreen === 'product-listing';
              return (
                <button
                  key={cat.id}
                  onClick={() => viewCategory(cat.id as ProductCategory)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-[#EBF3FE] text-[#2874F0] font-bold shadow-2xs'
                      : 'text-slate-700 hover:text-[#2874F0] hover:bg-gray-50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#2874F0]' : 'text-gray-400'}`} />
                  <span>{cat.label}</span>
                </button>
              );
            })}

            {/* Direct Link to Verified Senior Peer Marketplace */}
            <button
              onClick={() => {
                viewCategory('all');
                showToast('Viewing Senior Hand-me-downs & Hostel Listings');
              }}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 font-bold whitespace-nowrap border border-emerald-200 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-emerald-600" />
              <span>Campus Buy & Sell</span>
            </button>
          </div>
        </div>
      </div>

      {/* CAMPUS SELECTION MODAL */}
      {isCampusModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-blue-50 text-[#2874F0] flex items-center justify-center">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Choose Delivery Campus</h3>
                  <p className="text-[11px] text-gray-500">Hostel delivery available across all campuses</p>
                </div>
              </div>
              <button 
                onClick={() => setIsCampusModalOpen(false)}
                className="p-1 rounded-full text-gray-400 hover:bg-gray-100 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto no-scrollbar py-1">
              {campusOptions.map((campus, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedCampus(campus);
                    setIsCampusModalOpen(false);
                    showToast(`Delivery location set to: ${campus.split(',')[0]}`);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between text-xs cursor-pointer ${
                    selectedCampus === campus
                      ? 'border-[#2874F0] bg-blue-50/60 font-bold text-[#2874F0]'
                      : 'border-gray-200 hover:border-gray-300 text-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <MapPin className={`w-4 h-4 ${selectedCampus === campus ? 'text-[#2874F0]' : 'text-gray-400'}`} />
                    <span>{campus}</span>
                  </div>
                  {selectedCampus === campus && (
                    <CheckCircle2 className="w-4 h-4 text-[#2874F0]" />
                  )}
                </button>
              ))}
            </div>

            <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between text-[11px] text-gray-500">
              <span>⚡ 2-Hour Express Courier to your room</span>
              <button
                onClick={() => setIsCampusModalOpen(false)}
                className="font-bold text-[#2874F0] hover:underline cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
    </>
  );
};
