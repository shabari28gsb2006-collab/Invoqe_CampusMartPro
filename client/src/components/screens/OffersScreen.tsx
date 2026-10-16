import React, { useState, useEffect } from 'react';
import { 
  ArrowLeft, 
  Tag, 
  ArrowRight, 
  Sparkles, 
  Smartphone, 
  Shirt, 
  Headphones, 
  GraduationCap,
  Clock,
  Copy,
  Check,
  Zap,
  CreditCard,
  Flame,
  Percent,
  Gift,
  Coins,
  ShieldCheck,
  ShoppingBag
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useTheme } from '../../context/ThemeContext';

import { ProductCategory } from '../../types';

export const OffersScreen: React.FC = () => {
  const { catalogProducts, setActiveScreen, viewCategory, viewProduct, addToCart, applyCoupon, showToast } = useShop();
  const { currentThemeConfig } = useTheme();
  
  const [activeTab, setActiveTab] = useState<'all' | 'coupons' | 'bank' | 'flash'>('all');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Live Countdown Timer
  const [timeLeft, setTimeLeft] = useState({ hours: 9, minutes: 28, seconds: 44 });

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

  const coupons = [
    {
      code: 'CAMPUS10',
      discount: '10% Instant Off',
      subtitle: 'Valid on all student orders above ₹999 with verified college ID',
      badge: 'Most Popular',
      category: 'Storewide',
      validTill: 'Expires Tonight'
    },
    {
      code: 'LAPTOP2500',
      discount: 'Flat ₹2,500 Off',
      subtitle: 'Extra markdown on Intel Core i5/i7 & Apple M2 laptops for coding',
      badge: 'Tech Special',
      category: 'Laptops',
      validTill: 'Semester Deal'
    },
    {
      code: 'FREEDEL',
      discount: '100% Free Courier',
      subtitle: 'Instant hostel gate doorstep delivery on orders above ₹199',
      badge: 'Express',
      category: 'Hostel Drop',
      validTill: 'Campus Regular'
    },
    {
      code: 'SENIOR80',
      discount: 'Extra 15% Off Hand-me-downs',
      subtitle: 'Save more on verified senior calculators, cycles & dorm gear',
      badge: 'Peer Market',
      category: 'Pre-Loved',
      validTill: 'Active'
    }
  ];

  const bankOffers = [
    {
      bank: 'HDFC Bank',
      offer: '10% Instant Cashback up to ₹1,500',
      cardType: 'Credit & Debit Cards',
      minSpend: 'Min Spend: ₹4,999',
      color: 'bg-blue-600 text-white'
    },
    {
      bank: 'ICICI Bank',
      offer: 'Flat ₹2,000 Off on No-Cost EMI',
      cardType: 'Credit Card 3/6/9 Mo EMI',
      minSpend: 'Min Spend: ₹19,990',
      color: 'bg-amber-600 text-white'
    },
    {
      bank: 'Google Pay / UPI',
      offer: 'Win up to ₹500 Campus Scratch Card',
      cardType: 'Direct UPI Pay',
      minSpend: 'Min Spend: ₹299',
      color: 'bg-emerald-600 text-white'
    }
  ];

  const handleCopyCode = (code: string) => {
    setCopiedCode(code);
    applyCoupon(code);
    showToast(`Coupon "${code}" applied to cart!`);
    setTimeout(() => setCopiedCode(null), 3000);
  };

  const flashDeals = catalogProducts.filter(p => p.discountPercent >= 20).slice(0, 4);

  return (
    <div className="max-w-6xl mx-auto pb-24 md:pb-16 pt-1 px-3 md:px-0 select-none">
      {/* 1. Header */}
      <div className="flex items-center justify-between pb-3 mb-4 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setActiveScreen('home')}
            className="p-1.5 rounded-full hover:bg-gray-100 text-slate-700 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-heading">
                Campus Deals & Bank Offers
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-rose-100 text-rose-700 text-xs font-bold flex items-center gap-1">
                <Flame className="w-3 h-3 fill-rose-600" />
                Live Now
              </span>
            </div>
            <p className="text-xs text-gray-500">
              Flipkart-grade price drops, verified university discount codes & bank promotions
            </p>
          </div>
        </div>

        {/* Live Countdown Chip */}
        <div className="hidden sm:flex items-center gap-2 bg-slate-900 text-white px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold shadow-xs">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          <span>Ends in: {String(timeLeft.hours).padStart(2, '0')}:{String(timeLeft.minutes).padStart(2, '0')}:{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
      </div>

      {/* 2. Hero Deals Banner */}
      <div 
        className="rounded-2xl p-5 sm:p-7 text-white mb-6 shadow-md relative overflow-hidden flex flex-col justify-between min-h-[170px]"
        style={{
          background: `linear-gradient(135deg, ${currentThemeConfig.primaryColor} 0%, #1E3A8A 100%)`
        }}
      >
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[10px] font-black uppercase tracking-wider bg-amber-400 text-slate-900 px-2.5 py-0.5 rounded-full">
              University Mega Fest
            </span>
            <span className="text-xs font-semibold text-blue-200">2-Hour Hostel Delivery</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight font-heading">
            Up to 70% Off + Instant Bank Discount
          </h2>
          <p className="text-xs text-blue-100 mt-1.5 leading-relaxed">
            Grab Intel Core i5 laptops, noise-canceling headphones, college apparel & hostel essentials at India's lowest campus prices.
          </p>

          <div className="flex flex-wrap gap-2.5 mt-4">
            <button
              onClick={() => viewCategory('laptops')}
              className="px-4 py-2 bg-white text-[#2874F0] font-black text-xs rounded-xl shadow-xs hover:bg-blue-50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <span>Shop Tech Drops</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => handleCopyCode('CAMPUS10')}
              className="px-4 py-2 bg-blue-500/30 border border-white/40 text-white font-bold text-xs rounded-xl hover:bg-blue-500/50 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Auto-Apply 10% Code</span>
            </button>
          </div>
        </div>

        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80"
          alt="Sneakers promo"
          className="absolute -right-4 -bottom-6 w-44 h-44 object-contain opacity-80 pointer-events-none drop-shadow-2xl hidden sm:block"
        />
      </div>

      {/* 3. Filter Navigation Tabs */}
      <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 pb-1">
        {[
          { id: 'all', label: '🔥 All Offers & Coupons' },
          { id: 'coupons', label: '🎟️ Promo Vouchers' },
          { id: 'bank', label: '💳 Bank Cards & UPI' },
          { id: 'flash', label: '⚡ Flash Deals' },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
              activeTab === tab.id
                ? 'bg-[#2874F0] text-white shadow-2xs'
                : 'bg-white text-slate-700 hover:bg-gray-100 border border-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 4. Interactive Promo Voucher Cards (Flipkart Style Scratch & Copy Cards) */}
      {(activeTab === 'all' || activeTab === 'coupons') && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <Tag className="w-4 h-4 text-[#2874F0]" />
              <span>Campus Discount Vouchers (Click to Apply)</span>
            </h3>
            <span className="text-xs text-gray-400">Guaranteed 100% working</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            {coupons.map((coupon) => {
              const isCopied = copiedCode === coupon.code;
              return (
                <div
                  key={coupon.code}
                  className="bg-white rounded-2xl border-2 border-dashed border-blue-200 hover:border-[#2874F0] p-4 flex flex-col justify-between shadow-2xs transition-all relative overflow-hidden group"
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-blue-50 text-[#2874F0] px-2 py-0.5 rounded-md">
                        {coupon.badge}
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {coupon.validTill}
                      </span>
                    </div>

                    <h4 className="text-base font-black text-slate-900 mt-1">
                      {coupon.discount}
                    </h4>
                    <p className="text-[11px] text-gray-500 mt-1 leading-snug">
                      {coupon.subtitle}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between gap-2">
                    <span className="font-mono font-bold text-xs bg-slate-100 px-2.5 py-1 rounded-md text-slate-800 border border-slate-200">
                      {coupon.code}
                    </span>

                    <button
                      onClick={() => handleCopyCode(coupon.code)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
                        isCopied
                          ? 'bg-emerald-600 text-white'
                          : 'bg-[#2874F0] hover:bg-[#1254C2] text-white shadow-2xs'
                      }`}
                    >
                      {isCopied ? (
                        <>
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          <span>Applied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Apply</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 5. Bank Offers Section */}
      {(activeTab === 'all' || activeTab === 'bank') && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-emerald-600" />
              <span>Bank & Instant Payment Offers</span>
            </h3>
            <span className="text-xs text-gray-400">Available at Checkout</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
            {bankOffers.map((b, i) => (
              <div 
                key={i}
                className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs flex flex-col justify-between hover:border-blue-400 transition-all"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-xs text-slate-800">{b.bank}</span>
                    <span className="text-[10px] font-semibold bg-gray-100 px-2 py-0.5 rounded-full text-slate-600">
                      {b.cardType}
                    </span>
                  </div>
                  <h4 className="text-sm font-black text-[#2874F0] leading-snug">
                    {b.offer}
                  </h4>
                  <p className="text-[11px] text-gray-400 mt-1">
                    {b.minSpend} • No coupon required
                  </p>
                </div>

                <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs font-semibold text-emerald-700">
                  <span>Auto-deducted at payment</span>
                  <Check className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 6. Flash Deals Rail */}
      {(activeTab === 'all' || activeTab === 'flash') && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-black text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-amber-500 fill-amber-500" />
                <span>Featured Flash Markdown Products</span>
              </h3>
            </div>
            <button 
              onClick={() => viewCategory('all')}
              className="text-xs font-bold text-[#2874F0] hover:underline"
            >
              View Full Catalog &gt;
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
            {flashDeals.map((prod) => (
              <div
                key={prod.id}
                onClick={() => viewProduct(prod)}
                className="bg-white rounded-2xl border border-gray-200 p-3 flex flex-col justify-between hover:border-[#2874F0] hover:shadow-md transition-all cursor-pointer shadow-2xs"
              >
                <div className="aspect-square bg-gray-50 rounded-xl p-2 mb-2 flex items-center justify-center relative overflow-hidden">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-contain drop-shadow-2xs"
                  />
                  <span className="absolute top-2 left-2 bg-rose-600 text-white font-black text-[9px] px-1.5 py-0.5 rounded-md">
                    {prod.discountPercent}% OFF
                  </span>
                </div>

                <div>
                  <span className="text-[9px] font-bold text-[#2874F0] uppercase tracking-wider block">
                    {prod.brand}
                  </span>
                  <h4 className="text-xs font-bold text-slate-900 line-clamp-1 mt-0.5">
                    {prod.name}
                  </h4>

                  <div className="flex items-baseline gap-1.5 mt-1.5">
                    <span className="text-sm font-black text-slate-900">
                      ₹{prod.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] text-gray-400 line-through">
                      ₹{prod.originalPrice.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addToCart(prod);
                    }}
                    className="w-full mt-2.5 py-1.5 rounded-lg bg-[#2874F0] hover:bg-[#1254C2] text-white text-[11px] font-bold shadow-2xs flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    <span>Claim Deal</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 7. SuperCoins Rewards Box */}
      <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center shrink-0">
            <Coins className="w-6 h-6 text-yellow-200 fill-yellow-200" />
          </div>
          <div>
            <h4 className="text-sm font-black text-white">Your Campus SuperCoins: 420 🪙</h4>
            <p className="text-xs text-amber-100">
              Redeem anytime for flat ₹420 discount or free university meal passes.
            </p>
          </div>
        </div>

        <button
          onClick={() => showToast('SuperCoins balance applied to next order!')}
          className="px-4 py-2 bg-slate-950 text-white hover:bg-slate-900 font-bold text-xs rounded-xl shadow-xs transition-colors cursor-pointer shrink-0"
        >
          Redeem 420 Coins Now
        </button>
      </div>
    </div>
  );
};
