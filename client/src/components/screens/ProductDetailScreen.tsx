import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Heart, 
  Share2, 
  Star, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Check, 
  Tag, 
  ShoppingBag, 
  ChevronRight,
  Info,
  Sparkles
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useTheme } from '../../context/ThemeContext';

import { Product } from '../../types';

export const ProductDetailScreen: React.FC = () => {
  const { 
    catalogProducts,
    selectedProduct, 
    addToCart, 
    toggleWishlist, 
    isInWishlist, 
    setActiveScreen,
    cartItems,
    showToast 
  } = useShop();
  const { currentThemeConfig } = useTheme();

  const product: Product = selectedProduct || catalogProducts[0];
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'Default');
  useEffect(() => { setSelectedImageIndex(0); setSelectedColor(product.colors?.[0] || 'Default'); setQuantity(1); }, [product.id]);
  const [quantity, setQuantity] = useState(1);

  const inWishlist = isInWishlist(product.id);
  const selectedVariantInCart = cartItems.some(item => item.product.id === product.id && (item.selectedColor || item.product.colors?.[0] || 'Default') === (selectedColor || product.colors?.[0] || 'Default'));
  const goToCart = () => setActiveScreen('cart');
  const gallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on CampusMart Pro!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Product link copied to clipboard!');
    }
  };

  const handleBuyNow = () => {
    addToCart(product, quantity, selectedColor);
    setActiveScreen('cart');
  };

  return (
    <div className="max-w-7xl mx-auto pb-28 md:pb-16 pt-2 px-3 lg:px-8">
      {/* Top Header / Breadcrumb */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-100">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <button 
            onClick={() => setActiveScreen('home')}
            className="hover:text-blue-600 transition-colors flex items-center gap-1 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">Back to shopping</span>
          </button>
          <span className="hidden sm:inline">&gt;</span>
          <span className="hidden sm:inline capitalize">{product.category}</span>
          <span className="hidden sm:inline">&gt;</span>
          <span className="font-semibold text-slate-800 line-clamp-1 max-w-[200px] sm:max-w-xs">
            {product.name}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button 
            onClick={handleShare}
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            title="Share"
          >
            <Share2 className="w-4 h-4" />
          </button>
          <button 
            onClick={() => toggleWishlist(product.id)}
            className="p-2 rounded-full border border-gray-200 hover:bg-gray-50 text-gray-600 transition-colors cursor-pointer"
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main 2-Column Product Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Image Gallery (Matches Desktop Middle & Mobile Screen 4) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative bg-white rounded-2xl border border-gray-200 p-6 flex items-center justify-center aspect-4/3 overflow-hidden shadow-2xs">
            <img 
              src={gallery[selectedImageIndex] || product.image} 
              alt={product.name}
              referrerPolicy="no-referrer"
              className="max-h-full max-w-full object-contain drop-shadow-md"
            />
            {product.isBestSeller && (
              <span className="absolute top-4 left-4 bg-emerald-600 text-white font-bold text-xs px-2.5 py-1 rounded-sm shadow-xs uppercase tracking-wider">
                Best Seller
              </span>
            )}
            <span className="absolute bottom-4 right-4 bg-slate-900/75 text-white font-mono text-[11px] px-2 py-0.5 rounded-full">
              {selectedImageIndex + 1}/{gallery.length}
            </span>
          </div>

          {/* Thumbnail list */}
          {gallery.length > 1 && (
            <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
              {gallery.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`w-16 h-16 rounded-xl border-2 overflow-hidden p-1.5 bg-white shrink-0 transition-all cursor-pointer ${
                    selectedImageIndex === idx ? 'border-[#2874F0] ring-2 ring-blue-100' : 'border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={img} alt="thumb" referrerPolicy="no-referrer" className="w-full h-full object-contain drop-shadow-2xs" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-3 pt-3 text-center text-xs text-gray-600">
            <div className="bg-slate-50 p-2.5 rounded-xl border border-gray-100 flex flex-col items-center">
              <Truck className="w-4 h-4 text-emerald-600 mb-1" />
              <span className="font-semibold text-slate-800">Free Delivery</span>
              <span className="text-[10px] text-gray-400">To college hostel</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-gray-100 flex flex-col items-center">
              <RotateCcw className="w-4 h-4 text-blue-600 mb-1" />
              <span className="font-semibold text-slate-800">7 Days Return</span>
              <span className="text-[10px] text-gray-400">Hassle free</span>
            </div>
            <div className="bg-slate-50 p-2.5 rounded-xl border border-gray-100 flex flex-col items-center">
              <ShieldCheck className="w-4 h-4 text-purple-600 mb-1" />
              <span className="font-semibold text-slate-800">Secure Payment</span>
              <span className="text-[10px] text-gray-400">100% Protected</span>
            </div>
          </div>
        </div>

        {/* Right Column: Pricing, Offers, Specifications & Actions */}
        <div className="lg:col-span-6 space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
                {product.brand}
              </span>
              {product.soldCount && (
                <span className="text-[11px] text-gray-400 font-medium">
                  • {product.soldCount}
                </span>
              )}
            </div>

            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-snug">
              {product.name}
            </h1>

            {/* Ratings */}
            <div className="flex items-center gap-3 mt-2">
              <div className="flex items-center bg-emerald-600 text-white px-2 py-0.5 rounded-md text-xs font-bold">
                <span>{Number(product.rating || 0).toFixed(1)}</span>
                <Star className="w-3 h-3 fill-white ml-1" />
              </div>
              <span className="text-xs text-gray-500 font-medium">
                {product.reviewCount.toLocaleString('en-IN')} reviews & ratings
              </span>
            </div>
          </div>

          {/* Pricing Box */}
          <div className="bg-slate-50 p-4 rounded-xl border border-gray-200">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-black text-slate-900">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              <span className="text-sm text-gray-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
              <span className="text-xs font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                {product.discountPercent}% OFF
              </span>
            </div>
            <p className="text-[11px] text-emerald-600 font-medium mt-1">
              Inclusive of all campus taxes & student subsidies
            </p>
          </div>

          {/* Available Offers (Faithful to Desktop and Mobile Sheet) */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              <span>Available Offers</span>
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2 bg-emerald-50/70 border border-emerald-100 p-2.5 rounded-lg text-emerald-900">
                <span className="font-bold shrink-0 text-emerald-700">Bank Offer:</span>
                <span>10% Instant Discount up to ₹1,500 on SBI, HDFC & ICICI Cards</span>
              </div>
              <div className="flex items-start gap-2 bg-blue-50/70 border border-blue-100 p-2.5 rounded-lg text-blue-900">
                <span className="font-bold shrink-0 text-blue-700">No Cost EMI:</span>
                <span>Starting from ₹{(product.price / 6).toFixed(0)}/month on select campus credit cards</span>
              </div>
              <div className="flex items-start gap-2 bg-amber-50/70 border border-amber-100 p-2.5 rounded-lg text-amber-900">
                <span className="font-bold shrink-0 text-amber-700">Student ID Perk:</span>
                <span>Extra 5% instant cashback on presenting valid college ID at hostel drop</span>
              </div>
            </div>
          </div>

          {/* Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                Color: <span className="text-blue-600 font-normal">{selectedColor}</span>
              </h4>
              <div className="flex gap-2">
                {product.colors.map(c => (
                  <button
                    key={c}
                    onClick={() => { setSelectedColor(c); setSelectedImageIndex(product.colors?.indexOf(c) === 1 && gallery.length > 1 ? 1 : 0); }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                      selectedColor === c 
                        ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-2xs' 
                        : 'border-gray-200 text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Selector & Desktop Buttons */}
          <div className="hidden sm:flex items-center gap-4 pt-2">
            <div className="flex items-center border border-gray-200 rounded-lg bg-white overflow-hidden shadow-2xs">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 font-bold text-sm cursor-pointer"
              >
                -
              </button>
              <span className="px-4 py-2 font-bold text-xs text-slate-900 min-w-[36px] text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-gray-600 hover:bg-gray-100 font-bold text-sm cursor-pointer"
              >
                +
              </button>
            </div>

            <button
              onClick={selectedVariantInCart ? goToCart : () => addToCart(product, quantity, selectedColor)}
              className="flex-1 py-3 px-6 rounded-xl border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-bold text-sm transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{selectedVariantInCart ? 'Go to Cart' : 'Add to Cart'}</span>
            </button>

            <button
              onClick={handleBuyNow}
              className="flex-1 py-3 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Buy Now</span>
            </button>
          </div>

          {/* Key Highlights */}
          {product.highlights && (
            <div className="pt-4 border-t border-gray-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2">
                Key Highlights
              </h4>
              <ul className="space-y-1.5 text-xs text-gray-700">
                {product.highlights.map((h, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Specifications Table */}
          <div className="pt-4 border-t border-gray-100">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-2.5">
              Specifications
            </h4>
            <div className="border border-gray-100 rounded-xl overflow-hidden divide-y divide-gray-100 text-xs">
              {Object.entries(product.specs).map(([key, val]) => (
                <div key={key} className="grid grid-cols-3 p-2.5">
                  <span className="text-gray-400 font-medium">{key}</span>
                  <span className="col-span-2 text-slate-800 font-semibold">{val}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* MOBILE STICKY BOTTOM ACTIONS (Matches Mobile Screen 4 from Reference) */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 p-3 flex gap-2 shadow-xl">
        <button
          onClick={selectedVariantInCart ? goToCart : () => addToCart(product, quantity, selectedColor)}
          className="flex-1 py-3 rounded-xl border border-blue-600 text-blue-600 font-bold text-xs flex items-center justify-center gap-1.5 active:bg-blue-50"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>{selectedVariantInCart ? 'Go to Cart' : 'Add to Cart'}</span>
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 py-3 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md active:bg-emerald-700"
        >
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
};
