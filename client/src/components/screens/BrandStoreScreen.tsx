import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Heart, 
  Star, 
  ArrowRight,
  Filter
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';


export const BrandStoreScreen: React.FC = () => {
  const { catalogProducts, setActiveScreen, viewProduct, toggleWishlist, isInWishlist } = useShop();
  const [genderFilter, setGenderFilter] = useState<'All' | 'Men' | 'Women' | 'Kids'>('All');

  const brandProducts = catalogProducts.filter(p => p.brand === 'Nike' || p.category === 'footwear');

  return (
    <div className="max-w-7xl mx-auto pb-24 md:pb-16 pt-2 px-3 lg:px-8">
      {/* Header */}
      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-100">
        <button 
          onClick={() => setActiveScreen('home')}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Nike Campus Store</h2>
          <p className="text-xs text-gray-500">Official Campus Partner Store</p>
        </div>
      </div>

      {/* Hero Banner (Matches Mobile Screen 11 from Reference) */}
      <div className="relative rounded-2xl overflow-hidden bg-black text-white p-6 md:p-8 mb-6 shadow-md flex items-center justify-between min-h-[160px]">
        <div className="relative z-10 max-w-sm">
          <span className="text-xs font-black uppercase tracking-widest text-gray-400 block mb-1">
            Official Partner
          </span>
          <h3 className="text-2xl sm:text-3xl font-black italic tracking-tight">
            Just Do It.
          </h3>
          <p className="text-amber-400 font-bold text-sm mt-0.5">Up to 50% Off</p>
          <p className="text-xs text-gray-300 mt-1">
            Engineered for campus workouts, marathons & daily campus sprints
          </p>
        </div>

        <img
          src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&auto=format&fit=crop&q=80"
          alt="Nike shoes"
          className="w-36 h-36 sm:w-48 sm:h-48 object-contain drop-shadow-2xl"
        />
      </div>

      {/* Gender Filter Pills (From Reference) */}
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        {(['All', 'Men', 'Women', 'Kids'] as const).map(tab => (
          <button
            key={tab}
            onClick={() => setGenderFilter(tab)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
              genderFilter === tab
                ? 'bg-slate-900 text-white'
                : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {brandProducts.map(prod => {
          const inWishlist = isInWishlist(prod.id);
          return (
            <div
              key={prod.id}
              onClick={() => viewProduct(prod)}
              className="bg-white rounded-2xl border border-gray-200 p-3 relative shadow-2xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleWishlist(prod.id);
                }}
                className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-white/90 text-gray-400 hover:text-rose-500 shadow-2xs"
              >
                <Heart className={`w-3.5 h-3.5 ${inWishlist ? 'fill-rose-500 text-rose-500' : ''}`} />
              </button>

              <div>
                <div className="aspect-square bg-gray-50 rounded-xl p-3 mb-2 flex items-center justify-center">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-contain mix-blend-multiply"
                  />
                </div>
                <span className="text-[10px] font-bold uppercase text-gray-400">{prod.brand}</span>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1">{prod.name}</h4>
                <div className="flex items-center text-[10px] text-gray-500 mt-0.5">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400 mr-0.5" />
                  <span>{Number(prod.rating || 0).toFixed(1)}</span>
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-gray-100 flex items-baseline justify-between">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-sm font-bold text-slate-900">
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
          );
        })}
      </div>
    </div>
  );
};
