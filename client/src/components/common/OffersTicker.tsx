import React from 'react';
import { Sparkles, Zap, ShieldCheck, Tag, Gift, Percent } from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const OffersTicker: React.FC = () => {
  const { setActiveScreen, showToast } = useShop();

  const offers = [
    { text: '🔥 MEGA CAMPUS FEST: Extra ₹2,500 Off on Laptops with Student ID', tag: 'Limited Time' },
    { text: '💳 HDFC & ICICI Bank: 10% Instant Discount on Credit Cards (Code: CAMPUS10)', tag: 'Bank Offer' },
    { text: '⚡ FREE 2-Hour Express Delivery to All University Hostels & Main Gates', tag: 'Fast Courier' },
    { text: '🔄 Senior-to-Junior Peer Market: Casio FX-991EX & Cycles up to 80% Off', tag: 'Save Big' },
    { text: '🪙 Earn 2x Campus SuperCoins on Every Tech & Electronics Order Today', tag: 'Rewards' },
    { text: '🛡️ 7-Day Hassle-Free Replacement & Escrow Safety on Every Delivery', tag: 'Assured' },
  ];

  return (
    <div 
      onClick={() => setActiveScreen('offers')}
      className="bg-gradient-to-r from-amber-500 via-rose-600 to-[#2874F0] text-white py-1.5 px-3 overflow-hidden cursor-pointer select-none shadow-xs group"
      title="Click to view all seasonal student offers & bank deals"
    >
      <div className="flex items-center">
        {/* Sticky Label */}
        <div className="shrink-0 z-10 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider mr-3 border border-white/20">
          <Zap className="w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" />
          <span>DEALS TICKER</span>
        </div>

        {/* Continuous Scrolling Marquee */}
        <div className="overflow-hidden whitespace-nowrap flex-1">
          <div className="animate-marquee flex items-center gap-8 text-[11px] font-bold">
            {offers.concat(offers).map((offer, idx) => (
              <div key={idx} className="flex items-center gap-2 shrink-0">
                <span className="text-white drop-shadow-xs">{offer.text}</span>
                <span className="bg-white/20 text-white text-[9px] font-black px-1.5 py-0.2 rounded-full border border-white/30 uppercase">
                  {offer.tag}
                </span>
                <span className="text-white/60 mx-2">•</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right CTA */}
        <div className="shrink-0 hidden md:flex items-center gap-1 text-[11px] font-bold bg-white text-slate-900 px-2 py-0.5 rounded-full shadow-2xs group-hover:bg-amber-300 transition-colors ml-3">
          <span>View All</span>
          <Percent className="w-3 h-3" />
        </div>
      </div>
    </div>
  );
};
