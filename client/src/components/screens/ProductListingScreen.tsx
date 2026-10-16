import React, { useState, useMemo, useEffect } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Heart, 
  Star, 
  SlidersHorizontal, 
  ChevronDown, 
  Check, 
  X,
  ShoppingBag,
  Filter
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { CATEGORIES_DATA } from '../../data/mockData';
import { ProductCategory, Product } from '../../types';

export const ProductListingScreen: React.FC = () => {
  const { 
    catalogProducts,
    selectedCategory, 
    setSelectedCategory, 
    viewProduct, 
    toggleWishlist, 
    isInWishlist, 
    setActiveScreen, 
    searchQuery,
    setSearchQuery 
  } = useShop();

  // Filters State
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState<number>(100000);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<string>('popularity');
  const [offerFilters, setOfferFilters] = useState<string[]>([]);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Category name title
  const currentCategoryObj = CATEGORIES_DATA.find(c => c.id === selectedCategory);
  const categoryTitle = selectedCategory === 'all' 
    ? (searchQuery ? `Search: "${searchQuery}"` : 'All Campus Products') 
    : (currentCategoryObj ? currentCategoryObj.name : 'Products');

  // Available brands in current view
  const availableBrands = useMemo(() => {
    const prods = selectedCategory === 'all' 
      ? catalogProducts 
      : catalogProducts.filter(p => p.category === selectedCategory);
    return Array.from(new Set(prods.map(p => p.brand)));
  }, [catalogProducts, selectedCategory]);

  useEffect(() => { setSelectedBrands([]); }, [selectedCategory]);

  const handleBrandToggle = (brand: string) => {
    setSelectedBrands(prev => 
      prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
    );
  };

  const clearAllFilters = () => {
    setSelectedBrands([]);
    setPriceMax(100000);
    setMinRating(0);
    setOfferFilters([]);
    setSortBy('popularity');
  };

  // Filter & Sort logic
  const filteredProducts = useMemo(() => {
    return catalogProducts.filter(prod => {
      // Category filter
      if (selectedCategory !== 'all' && String(prod.category).toLowerCase() !== String(selectedCategory).toLowerCase()) {
        return false;
      }
      // Search query filter
      if (searchQuery.trim()) {
        const normalize = (value: string) => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
        const query = normalize(searchQuery);
        const haystack = normalize(`${prod.name} ${prod.brand} ${prod.shortDesc || ''} ${prod.category}`);
        const words = query.split(' ').filter(Boolean);
        const matchCount = words.filter(word => {
          return haystack.split(' ').some(candidate => {
            if (candidate.includes(word)) return true;
            if (word.length < 3 || candidate.length < 3 || Math.abs(candidate.length - word.length) > 2) return false;
            let differences = 0;
            const limit = Math.min(word.length, candidate.length);
            for (let index = 0; index < limit; index++) if (word[index] !== candidate[index]) differences++;
            return differences <= 1 && Math.abs(candidate.length - word.length) <= 1;
          });
        }).length;
        if (matchCount < Math.max(1, Math.ceil(words.length * 0.6))) return false;
      }
      // Brand filter
      if (selectedBrands.length > 0 && !selectedBrands.includes(prod.brand)) {
        return false;
      }
      // Price filter
      if (prod.price > priceMax) {
        return false;
      }
      // Rating filter
      if (minRating > 0 && prod.rating < minRating) {
        return false;
      }
      if (offerFilters.length > 0) {
        const qualifies = offerFilters.some(offer => {
          if (offer === 'emi') return prod.price >= 3000;
          if (offer === 'bank') return prod.discountPercent >= 10;
          if (offer === 'cashback') return prod.stock > 0;
          return false;
        });
        if (!qualifies) return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'discount') return b.discountPercent - a.discountPercent;
      return b.reviewCount - a.reviewCount; // default popularity
    });
  }, [selectedCategory, searchQuery, selectedBrands, priceMax, minRating, sortBy, offerFilters]);

  return (
    <div className="max-w-7xl mx-auto pb-24 md:pb-16 pt-2 px-3 lg:px-8">
      {/* Breadcrumb & Navigation Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <button 
            onClick={() => setActiveScreen('home')}
            className="hover:text-blue-600 transition-colors"
          >
            Home
          </button>
          <span>&gt;</span>
          <span className="font-semibold text-slate-800 capitalize">
            {categoryTitle}
          </span>
          <span className="text-gray-400 font-normal">
            ({filteredProducts.length} products)
          </span>
        </div>

        {/* Sort & Mobile Filter Toggle */}
        <div className="flex items-center justify-between sm:justify-end gap-3">
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-gray-200 bg-white text-xs font-semibold text-gray-700 shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters ({selectedBrands.length > 0 ? selectedBrands.length : ''})</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-gray-500 hidden sm:inline">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-white border border-gray-200 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-700 focus:outline-hidden focus:border-blue-500 shadow-2xs cursor-pointer"
            >
              <option value="popularity">Popularity</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Customer Rating</option>
              <option value="discount">Highest Discount</option>
            </select>
          </div>
        </div>
      </div>

      {/* MOBILE HORIZONTAL FILTER CHIPS (Exact match for Mobile Screen 3 & Screen 10 from reference) */}
      <div className="md:hidden flex items-center gap-2 overflow-x-auto no-scrollbar mb-4 pb-1">
        <button
          onClick={() => setSortBy(sortBy === 'popularity' ? 'price-low' : 'popularity')}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border ${
            sortBy !== 'popularity' 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-gray-700 border-gray-200'
          }`}
        >
          <span>Sort {sortBy !== 'popularity' ? `(${sortBy})` : ''}</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        <button
          onClick={() => setIsMobileFilterOpen(true)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border ${
            selectedBrands.length > 0 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-gray-700 border-gray-200'
          }`}
        >
          <span>Brand {selectedBrands.length > 0 ? `(${selectedBrands.length})` : ''}</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        <button
          onClick={() => setPriceMax(priceMax < 50000 ? 100000 : 30000)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border ${
            priceMax < 100000 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-gray-700 border-gray-200'
          }`}
        >
          <span>Budget {priceMax < 100000 ? `(<₹${(priceMax/1000).toFixed(0)}k)` : ''}</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        <button
          onClick={() => setMinRating(minRating === 4 ? 0 : 4)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border ${
            minRating > 0 
              ? 'bg-blue-600 text-white border-blue-600' 
              : 'bg-white text-gray-700 border-gray-200'
          }`}
        >
          <span>Rating {minRating > 0 ? `(${minRating}★+)` : ''}</span>
          <ChevronDown className="w-3 h-3" />
        </button>

        {/* Quick query tags */}
        <button
          onClick={() => setSearchQuery('backpack')}
          className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border ${
            searchQuery.toLowerCase() === 'backpack'
              ? 'bg-blue-600 text-white border-blue-600'
              : 'bg-gray-100 text-gray-600 border-gray-200'
          }`}
        >
          Backpacks 🎒
        </button>
      </div>

      {/* Main Grid: Sidebar Filters + Products */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {/* DESKTOP FILTER SIDEBAR (Faithful to Desktop Reference Sheet) */}
        <aside className="hidden md:block col-span-1 bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs h-fit space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-blue-600" />
              <span>Filters</span>
            </h3>
            <button
              onClick={clearAllFilters}
              className="text-xs text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
            >
              Clear All
            </button>
          </div>

          {/* 1. Category Selector */}
          <div>
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Category
            </h4>
            <div className="space-y-1.5 max-h-48 overflow-y-auto no-scrollbar pr-1 text-xs text-gray-600">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-2 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                  selectedCategory === 'all' ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-50'
                }`}
              >
                <span>All Products</span>
                <span className="text-[10px] text-gray-400">({catalogProducts.length})</span>
              </button>
              {CATEGORIES_DATA.map(cat => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id as ProductCategory)}
                  className={`w-full text-left px-2 py-1.5 rounded-md flex items-center justify-between transition-colors ${
                    selectedCategory === cat.id ? 'bg-blue-50 text-blue-700 font-semibold' : 'hover:bg-gray-50'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-[10px] text-gray-400">({cat.count})</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Brand Filter Checkboxes */}
          {availableBrands.length > 0 && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
                Brand
              </h4>
              <div className="space-y-2 max-h-44 overflow-y-auto no-scrollbar pr-1 text-xs">
                {availableBrands.map(brand => {
                  const checked = selectedBrands.includes(brand);
                  return (
                    <label 
                      key={brand}
                      className="flex items-center gap-2 text-gray-700 hover:text-blue-600 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => handleBrandToggle(brand)}
                        className="rounded-sm border-gray-300 text-blue-600 focus:ring-blue-500 w-3.5 h-3.5"
                      />
                      <span>{brand}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {/* 3. Price Range Slider */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Price Range
              </h4>
              <span className="text-xs font-bold text-blue-600">
                ₹{priceMax.toLocaleString('en-IN')}
              </span>
            </div>
            <input
              type="range"
              min="500"
              max="100000"
              step="500"
              value={priceMax}
              onChange={(e) => setPriceMax(Number(e.target.value))}
              className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            <div className="flex items-center justify-between text-[10px] text-gray-400 mt-1.5 font-medium">
              <span>₹500</span>
              <span>₹1,00,000</span>
            </div>
          </div>

          {/* 4. Minimum Ratings */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Customer Ratings
            </h4>
            <div className="space-y-1.5 text-xs">
              {[4, 3, 2].map(rating => (
                <button
                  key={rating}
                  onClick={() => setMinRating(minRating === rating ? 0 : rating)}
                  className={`w-full flex items-center justify-between px-2 py-1.5 rounded-md transition-colors ${
                    minRating === rating ? 'bg-amber-50 text-amber-900 font-semibold' : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <span className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span>{rating} star rated</span>
                  </span>
                  {minRating === rating && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              ))}
            </div>
          </div>

          {/* 5. Student Offers & Discounts */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2.5">
              Campus Offers
            </h4>
            <div className="space-y-2 text-xs text-gray-600">
              {[
                { id: 'emi', label: 'No Cost EMI', hint: 'Products ₹3,000 and above' },
                { id: 'bank', label: 'Bank Instant 10% Off', hint: 'Discounted products' },
                { id: 'cashback', label: 'Student ID Extra Cashback', hint: 'In-stock campus deals' },
              ].map(offer => (
                <label key={offer.id} title={offer.hint} className="flex items-start gap-2 cursor-pointer hover:text-blue-600">
                  <input type="checkbox" checked={offerFilters.includes(offer.id)} onChange={() => setOfferFilters(current => current.includes(offer.id) ? current.filter(id => id !== offer.id) : [...current, offer.id])} className="mt-0.5 rounded-sm text-blue-600 w-3.5 h-3.5" />
                  <span>{offer.label}<span className="block text-[10px] text-gray-400">{offer.hint}</span></span>
                </label>
              ))}
            </div>
          </div>
        </aside>

        {/* catalogProducts GRID (Desktop 3-4 Cols / Mobile Vertical List & Grid) */}
        <div className="col-span-1 md:col-span-3 lg:col-span-4">
          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
              <ShoppingBag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h4 className="text-base font-bold text-slate-800">No products found</h4>
              <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
                No campus gear matching your selected filters. Try clearing some filters or searching for another term.
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-xs font-semibold hover:bg-blue-700"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <>
              {/* DESKTOP MULTI-COLUMN GRID (Matching Desktop Reference Top Right) */}
              <div className="hidden sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredProducts.map((prod) => {
                  const inWishlist = isInWishlist(prod.id);
                  return (
                    <div
                      key={prod.id}
                      className="group bg-white rounded-xl border border-gray-100 hover:border-gray-300 hover:shadow-md transition-all p-3.5 flex flex-col justify-between relative"
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleWishlist(prod.id);
                        }}
                        className="absolute top-3 right-3 z-10 p-1.5 rounded-full bg-white/90 hover:bg-white text-gray-400 hover:text-rose-500 transition-colors shadow-2xs"
                        title="Wishlist"
                      >
                        <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                      </button>

                      <div 
                        onClick={() => viewProduct(prod)}
                        className="cursor-pointer"
                      >
                        <div className="aspect-square rounded-xl bg-white border border-gray-100 mb-3 flex items-center justify-center p-3 relative overflow-hidden group-hover:border-[#C6DCFD] transition-colors">
                          <img
                            src={prod.image}
                            alt={prod.name}
                            referrerPolicy="no-referrer"
                            className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300 drop-shadow-xs"
                            loading="lazy"
                          />
                          {prod.isBestSeller && (
                            <span className="absolute top-2 left-2 bg-emerald-600 text-white font-bold text-[9px] px-1.5 py-0.5 rounded-xs tracking-wider uppercase">
                              Best Seller
                            </span>
                          )}
                        </div>

                        <span className="text-[10px] font-bold text-[#2874F0] uppercase tracking-wider">
                          {prod.brand}
                        </span>
                        <h4 className="text-xs font-bold text-slate-800 line-clamp-2 min-h-[34px] group-hover:text-blue-600 transition-colors mt-0.5">
                          {prod.name}
                        </h4>
                        <p className="text-[11px] text-gray-500 line-clamp-1 mt-0.5">
                          {prod.shortDesc}
                        </p>
                      </div>

                      <div className="mt-3 pt-2.5 border-t border-gray-100">
                        <div className="flex items-baseline gap-2">
                          <span className="text-base font-black text-slate-900">
                            ₹{prod.price.toLocaleString('en-IN')}
                          </span>
                          <span className="text-xs text-gray-400 line-through">
                            ₹{prod.originalPrice.toLocaleString('en-IN')}
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded-sm">
                            {prod.discountPercent}% OFF
                          </span>
                        </div>

                        <div className="mt-2 flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-600 font-medium">
                            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400 mr-1" />
                            <span className="font-bold">{Number(prod.rating || 0).toFixed(1)}</span>
                            <span className="text-[10px] text-gray-400 ml-1">
                              ({(prod.reviewCount / 1000).toFixed(1)}k)
                            </span>
                          </div>

                          <button
                            onClick={() => viewProduct(prod)}
                            className="text-[11px] font-semibold text-blue-600 hover:underline"
                          >
                            View Specs →
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* MOBILE VERTICAL PRODUCT LIST (Faithful to Mobile Screen 3 from Reference) */}
              <div className="sm:hidden space-y-2.5">
                {filteredProducts.map((prod) => {
                  const inWishlist = isInWishlist(prod.id);
                  return (
                    <div
                      key={prod.id}
                      onClick={() => viewProduct(prod)}
                      className="bg-white rounded-xl border border-gray-100 p-3 flex gap-3 relative shadow-2xs cursor-pointer"
                    >
                      {/* Product Thumbnail with Best Seller badge */}
                      <div className="w-24 h-24 shrink-0 rounded-xl bg-white border border-gray-100 p-2 flex items-center justify-center relative shadow-2xs">
                        <img
                          src={prod.image}
                          alt={prod.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain drop-shadow-xs"
                          loading="lazy"
                        />
                        {prod.isBestSeller && (
                          <span className="absolute -top-1.5 -left-1 bg-emerald-600 text-white font-bold text-[8px] px-1 py-0.2 rounded-xs">
                            Best Seller
                          </span>
                        )}
                      </div>

                      {/* Right Details */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex items-start justify-between">
                            <h4 className="text-xs font-bold text-slate-800 line-clamp-1 pr-6">
                              {prod.name}
                            </h4>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                toggleWishlist(prod.id);
                              }}
                              className="p-1 text-gray-400 hover:text-rose-500"
                            >
                              <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
                            </button>
                          </div>

                          <p className="text-[10px] text-gray-500 line-clamp-1 mt-0.5">
                            {prod.shortDesc}
                          </p>

                          <div className="flex items-center text-[10px] text-gray-500 mt-1">
                            <Star className="w-3 h-3 text-amber-400 fill-amber-400 mr-0.5" />
                            <span className="font-bold">{Number(prod.rating || 0).toFixed(1)}</span>
                            <span className="text-gray-400 ml-1">({(prod.reviewCount / 1000).toFixed(1)}k)</span>
                          </div>
                        </div>

                        <div className="mt-1 flex items-baseline justify-between">
                          <div className="flex items-baseline gap-1.5">
                            <span className="text-sm font-black text-slate-900">
                              ₹{prod.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-[10px] text-gray-400 line-through">
                              ₹{prod.originalPrice.toLocaleString('en-IN')}
                            </span>
                          </div>
                          <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded-xs">
                            {prod.discountPercent}% OFF
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* MOBILE FILTER MODAL / DRAWER */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex justify-end">
          <div className="w-4/5 max-w-sm bg-white h-full p-5 overflow-y-auto flex flex-col justify-between shadow-2xl">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
                <h3 className="font-bold text-slate-900 text-sm">Filter Products</h3>
                <button 
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Brands */}
              <div className="mb-5">
                <h4 className="text-xs font-bold text-slate-800 mb-2">Brands</h4>
                <div className="space-y-2">
                  {availableBrands.map(b => (
                    <label key={b} className="flex items-center gap-2 text-xs text-gray-700">
                      <input
                        type="checkbox"
                        checked={selectedBrands.includes(b)}
                        onChange={() => handleBrandToggle(b)}
                        className="rounded-sm text-blue-600"
                      />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Max */}
              <div className="mb-5">
                <div className="flex items-center justify-between text-xs font-bold mb-1">
                  <span>Max Price</span>
                  <span className="text-blue-600">₹{priceMax.toLocaleString('en-IN')}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="100000"
                  step="500"
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
              </div>
            </div>

            <div className="flex gap-2 pt-4 border-t border-gray-100">
              <button
                onClick={clearAllFilters}
                className="flex-1 py-2 rounded-lg border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
              >
                Reset
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
