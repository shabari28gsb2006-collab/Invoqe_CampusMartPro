import React, { useState } from 'react';
import { GraduationCap, ArrowRight, X, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import { useShop } from '../../context/ShopContext';

export const OnboardingModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { currentThemeConfig } = useTheme();
  const { setActiveScreen } = useShop();

  // Expose toggle via custom event or button
  React.useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('open-onboarding', handleOpen);
    return () => window.removeEventListener('open-onboarding', handleOpen);
  }, []);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-[36px] max-w-sm w-full overflow-hidden shadow-2xl relative flex flex-col justify-between min-h-[580px] p-6 text-center border-4 border-slate-900">
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200 z-10 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Top Logo */}
        <div className="pt-4 flex flex-col items-center">
          <div 
            className="w-14 h-14 rounded-2xl flex items-center justify-center text-white shadow-md mb-2"
            style={{ backgroundColor: currentThemeConfig.primaryColor }}
          >
            <GraduationCap className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">CampusMart</h2>
          <span className="text-xs font-semibold text-gray-400">Student Verified Marketplace</span>
        </div>

        {/* Center Graphic */}
        <div className="my-6 relative flex items-center justify-center">
          <div className="w-56 h-56 rounded-full bg-blue-50 flex items-center justify-center relative overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80"
              alt="Campus Gear"
              className="w-44 h-44 object-contain drop-shadow-xl"
            />
          </div>
        </div>

        {/* Headlines (Faithful to Mobile Screen 12 from reference) */}
        <div className="space-y-1 mb-4">
          <h3 className="text-xl font-black text-slate-900 leading-tight">
            More Choices<br />
            Better Deals<br />
            For Campus Life
          </h3>
          <p className="text-xs font-bold text-blue-600 tracking-wider uppercase mt-1">
            Shop | Save | Grow
          </p>
        </div>

        {/* Action Button */}
        <div>
          <button
            onClick={() => {
              setIsOpen(false);
              setActiveScreen('home');
            }}
            className="w-full py-3.5 rounded-2xl text-white font-extrabold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            style={{ backgroundColor: currentThemeConfig.primaryColor }}
          >
            <span>Start Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
