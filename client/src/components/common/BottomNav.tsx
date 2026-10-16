import React from 'react';
import { Home, Grid, Tag, Heart, User, ShoppingBag } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useTheme } from '../../context/ThemeContext';
import { ActiveScreen } from '../../types';

export const BottomNav: React.FC = () => {
  const { activeScreen, setActiveScreen, wishlistIds, cartItems } = useShop();
  const { currentThemeConfig } = useTheme();

  const totalCartCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  const navItems: { screen: ActiveScreen; label: string; icon: any; badge?: number }[] = [
    { screen: 'home', label: 'Home', icon: Home },
    { screen: 'categories', label: 'Categories', icon: Grid },
    { screen: 'offers', label: 'Offers', icon: Tag },
    { screen: 'wishlist', label: 'Wishlist', icon: Heart, badge: wishlistIds.length },
    { screen: 'account', label: 'Account', icon: User },
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200/90 px-3 py-1.5 shadow-[0_-4px_20px_rgba(0,0,0,0.06)]">
      <div className="flex items-center justify-between max-w-md mx-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.screen;

          return (
            <button
              key={item.screen}
              onClick={() => {
                setActiveScreen(item.screen);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative flex flex-col items-center justify-center py-1 px-2.5 min-w-[54px] rounded-xl transition-all focus:outline-hidden ${
                isActive ? 'scale-105' : 'opacity-70 hover:opacity-100'
              }`}
            >
              <div className="relative">
                <Icon
                  className={`w-5 h-5 transition-transform duration-200 ${
                    isActive ? 'stroke-[2.5]' : 'text-slate-600'
                  }`}
                  style={{ color: isActive ? currentThemeConfig.primaryColor : undefined }}
                />
                {item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 bg-rose-500 text-white font-black text-[9px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs animate-in zoom-in-50">
                    {item.badge > 9 ? '9+' : item.badge}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] mt-1 transition-colors ${
                  isActive ? 'font-black text-[#2874F0]' : 'font-medium text-slate-600'
                }`}
                style={{ color: isActive ? currentThemeConfig.primaryColor : undefined }}
              >
                {item.label}
              </span>
              {isActive && (
                <span 
                  className="w-1.5 h-1.5 rounded-full mt-0.5"
                  style={{ backgroundColor: currentThemeConfig.primaryColor }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
