import React from 'react';
import { 
  ArrowLeft, 
  Heart, 
  ShoppingBag, 
  Star, 
  Trash2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';


export const WishlistScreen: React.FC = () => {
  const { 
    catalogProducts,
    wishlistIds, 
    toggleWishlist, 
    addToCart, 
    setActiveScreen, 
    viewProduct 
  } = useShop();

  const wishlistProducts = catalogProducts.filter(p => wishlistIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto pb-24 md:pb-16 pt-2 px-3 lg:px-8">
      {/* Title */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <button 
          onClick={() => setActiveScreen('home')}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            My Wishlist <span className="text-gray-400 font-normal text-sm">({wishlistProducts.length} items)</span>
          </h2>
          <p className="text-xs text-gray-500">Saved items you are watching for discounts</p>
        </div>
      </div>

      {wishlistProducts.length === 0 ? (
        <div className="max-w-md mx-auto py-16 text-center">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-500 flex items-center justify-center mx-auto mb-3">
            <Heart className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-800">Your Wishlist is Empty</h3>
          <p className="text-xs text-gray-400 mt-1">
            Tap the heart icon on any product to save it here for later.
          </p>
          <button
            onClick={() => setActiveScreen('home')}
            className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 cursor-pointer"
          >
            Start Browsing
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3.5">
          {wishlistProducts.map((prod) => (
            <div
              key={prod.id}
              className="group bg-white rounded-2xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all p-3 flex flex-col justify-between relative shadow-2xs"
            >
              <button
                onClick={() => toggleWishlist(prod.id)}
                className="absolute top-2.5 right-2.5 z-10 p-1.5 rounded-full bg-white/90 hover:bg-white text-rose-500 shadow-2xs"
                title="Remove from Wishlist"
              >
                <Heart className="w-4 h-4 fill-rose-500" />
              </button>

              <div 
                onClick={() => viewProduct(prod)}
                className="cursor-pointer"
              >
                <div className="aspect-square rounded-xl bg-gray-50 p-2 mb-2.5 flex items-center justify-center">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform"
                  />
                </div>

                <span className="text-[10px] font-bold uppercase text-gray-400">{prod.brand}</span>
                <h4 className="text-xs font-bold text-slate-800 line-clamp-1 group-hover:text-blue-600">
                  {prod.name}
                </h4>
                <div className="flex items-center text-[10px] text-gray-500 mt-0.5">
                  <Star className="w-3 h-3 text-amber-400 fill-amber-400 mr-0.5" />
                  <span>{Number(prod.rating || 0).toFixed(1)}</span>
                </div>
              </div>

              <div className="mt-3 pt-2 border-t border-gray-100">
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-sm font-bold text-slate-900">
                    ₹{prod.price.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-gray-400 line-through">
                    ₹{prod.originalPrice.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[9px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded-xs">
                    {prod.discountPercent}% OFF
                  </span>
                </div>

                <button
                  onClick={() => addToCart(prod)}
                  className="w-full py-1.5 rounded-lg bg-blue-50 hover:bg-blue-600 text-blue-700 hover:text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Move to Cart</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
