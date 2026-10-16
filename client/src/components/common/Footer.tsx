import React from 'react';
import { 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Headphones, 
  Gift, 
  HelpCircle, 
  Lock,
  ChevronUp,
  MapPin,
  CreditCard,
  Building,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const Footer: React.FC = () => {
  const { setActiveScreen, showToast } = useShop();

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="campusmart-premium-footer bg-slate-950 text-slate-300 border-t border-slate-800 mt-12 md:mt-20 text-xs select-none relative z-10 pb-20 md:pb-0">
      {/* Back to top button */}
      <button 
        onClick={scrollToTop}
        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold transition-colors flex items-center justify-center gap-1.5 cursor-pointer border-b border-white/10"
      >
        <ChevronUp className="w-4 h-4" />
        <span>Back to Top</span>
      </button>

      {/* Premium brand close: immersive gradient panel with restrained depth */}
      <section className="footer-premium-showcase relative isolate overflow-hidden border-b border-white/10">
        <div className="footer-glow footer-glow-a" aria-hidden="true"></div>
        <div className="footer-glow footer-glow-b" aria-hidden="true"></div>
        <div className="relative mx-auto flex max-w-[1440px] flex-col gap-7 px-5 py-10 sm:px-8 md:flex-row md:items-center md:justify-between md:py-14 lg:px-10">
          <div className="max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-[10px] font-extrabold uppercase tracking-[0.22em] text-cyan-200"><Sparkles className="h-3.5 w-3.5" /> Made for campus life</div>
            <h2 className="max-w-xl text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-[2.7rem]">Your campus. Your essentials. <span className="footer-gradient-text">One smarter marketplace.</span></h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300 sm:text-base">Discover student-friendly finds, compare deals and make campus living feel effortless.</p>
          </div>
          <div className="flex shrink-0 flex-col gap-3 sm:flex-row md:flex-col lg:flex-row">
            <button onClick={() => setActiveScreen('product-listing')} className="footer-primary-cta inline-flex items-center justify-center gap-2 rounded-xl px-5 py-3 text-sm font-bold text-white transition-all">Explore products <ExternalLink className="h-4 w-4" /></button>
            <button onClick={() => setActiveScreen('offers')} className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/[0.06] px-5 py-3 text-sm font-bold text-white backdrop-blur transition-all hover:border-cyan-200/50 hover:bg-white/10"><Gift className="h-4 w-4 text-cyan-200" /> Browse campus offers</button>
          </div>
        </div>
      </section>

      {/* 1. TOP ASSURANCE & TRUST STRIP (Flipkart / Amazon India Hallmark) */}
      <div className="border-b border-slate-800 py-6 bg-slate-950/60">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 text-slate-200">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-blue-500/10 text-[#2874F0] flex items-center justify-center shrink-0 border border-blue-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">100% Student Verified</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Authenticated college accounts</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0 border border-emerald-500/20">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">Hostel Doorstep Drop</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">2-hour express campus dispatch</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/20">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">7-Day Free Replacement</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Instant room pick & exchange</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 md:w-11 md:h-11 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center shrink-0 border border-purple-500/20">
                <Headphones className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-white text-xs">24x7 Student Desk</h4>
                <p className="text-[11px] text-slate-400 mt-0.5">Dedicated campus support team</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. SITEMAP (Desktop 5-Column, Mobile Sleek 2-Column) */}
      <div className="max-w-[1440px] mx-auto px-4 lg:px-8 py-8 md:py-12">
        {/* Desktop 5-Column Grid */}
        <div className="hidden md:grid grid-cols-12 gap-8 divide-x divide-slate-800">
          {/* Col 1: ABOUT */}
          <div className="col-span-2 space-y-3">
            <h5 className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">ABOUT</h5>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><button onClick={() => { setActiveScreen('home'); showToast('CampusMart: India’s #1 Student Marketplace'); }} className="hover:text-white transition-colors cursor-pointer">About CampusMart</button></li>
              <li><button onClick={() => { setActiveScreen('home'); showToast('Hostel & Gate delivery operational in 120+ colleges'); }} className="hover:text-white transition-colors cursor-pointer">Campus Coverage</button></li>
              <li><button onClick={() => { setActiveScreen('offers'); }} className="hover:text-white transition-colors cursor-pointer">Student Prime Pass</button></li>
              <li><button onClick={() => { setActiveScreen('home'); showToast('Campus Ambassador recruitment open for 2026!'); }} className="hover:text-white transition-colors cursor-pointer">Campus Ambassador</button></li>
              <li><button onClick={() => { setActiveScreen('home'); }} className="hover:text-white transition-colors cursor-pointer">Corporate Information</button></li>
            </ul>
          </div>

          {/* Col 2: STUDENT COMMUNITY */}
          <div className="col-span-2 pl-6 space-y-3">
            <h5 className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">STUDENT COMMUNITY</h5>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><button onClick={() => setActiveScreen('offers')} className="hover:text-white transition-colors cursor-pointer">Semester Start Deals</button></li>
              <li><button onClick={() => setActiveScreen('offers')} className="hover:text-white transition-colors cursor-pointer">Student ID Discounts</button></li>
              <li><button onClick={() => setActiveScreen('categories')} className="hover:text-white transition-colors cursor-pointer">Senior Peer Market</button></li>
              <li><button onClick={() => setActiveScreen('offers')} className="hover:text-white transition-colors cursor-pointer">Hostel Furniture Swap</button></li>
              <li><button onClick={() => setActiveScreen('home')} className="hover:text-white transition-colors cursor-pointer">Campus Tech Grants</button></li>
            </ul>
          </div>

          {/* Col 3: HELP */}
          <div className="col-span-2 pl-6 space-y-3">
            <h5 className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">HELP & SUPPORT</h5>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><button onClick={() => setActiveScreen('track-order')} className="hover:text-white transition-colors cursor-pointer">Hostel Delivery & Tracking</button></li>
              <li><button onClick={() => setActiveScreen('track-order')} className="hover:text-white transition-colors cursor-pointer">Payments, UPI & SuperCoins</button></li>
              <li><button onClick={() => setActiveScreen('track-order')} className="hover:text-white transition-colors cursor-pointer">Doorstep Returns & Refund</button></li>
              <li><button onClick={() => { setActiveScreen('account'); showToast('24x7 Student Help Desk active'); }} className="hover:text-white transition-colors cursor-pointer">Campus Support Desk</button></li>
              <li><button onClick={() => setActiveScreen('home')} className="hover:text-white transition-colors cursor-pointer">FAQ & Safety Guidelines</button></li>
            </ul>
          </div>

          {/* Col 4: CONSUMER POLICY */}
          <div className="col-span-2 pl-6 space-y-3">
            <h5 className="font-bold text-slate-400 uppercase tracking-wider text-[11px]">CONSUMER POLICY</h5>
            <ul className="space-y-2 text-slate-400 text-xs">
              <li><button onClick={() => showToast('7-Day Replacement Guarantee applies')} className="hover:text-white transition-colors cursor-pointer">Cancellation & Returns</button></li>
              <li><button onClick={() => showToast('Escrow protection active on senior trade-ins')} className="hover:text-white transition-colors cursor-pointer">Security & Escrow</button></li>
              <li><button onClick={() => showToast('Verified Student PII Protected by 256-bit SSL')} className="hover:text-white transition-colors cursor-pointer">Privacy & Data Security</button></li>
              <li><button onClick={() => showToast('Terms of Student Service updated')} className="hover:text-white transition-colors cursor-pointer">Terms of Use</button></li>
              <li><button onClick={() => showToast('Grievance Officer: grievance@campusmart.in')} className="hover:text-white transition-colors cursor-pointer">Grievance Redressal</button></li>
            </ul>
          </div>

          {/* Col 5: Mail Us & Registered Address (Authentic Flipkart Style) */}
          <div className="col-span-4 pl-6 space-y-4">
            <div>
              <h5 className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-[#2874F0]" />
                <span>MAIL US:</span>
              </h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                CampusMart Internet Private Limited,<br />
                Buildings Alyssa, Begonia & Clove Embassy Tech Village,<br />
                Outer Ring Road, Devarabeesanahalli Village,<br />
                Bengaluru, 560103, Karnataka, India
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800">
              <h5 className="font-bold text-slate-400 uppercase tracking-wider text-[11px] mb-1.5">
                REGISTERED OFFICE ADDRESS:
              </h5>
              <p className="text-[11px] text-slate-400 leading-relaxed">
                CampusMart Internet Private Limited,<br />
                Vaishnavi Summit, Ground Floor, 7th Main, 80 Feet Road,<br />
                3rd Block, Koramangala Industrial Layout, Bengaluru - 560034<br />
                CIN: U51109KA2012PTC066107 | Contact: 044-45614700
              </p>
            </div>
          </div>
        </div>

        {/* Mobile View: High-Density Premium Accordion/Grid */}
        <div className="md:hidden space-y-5">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800 text-xs">
            <div className="space-y-2">
              <h5 className="font-bold text-white text-[11px] uppercase tracking-wider">Quick Links</h5>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => setActiveScreen('home')} className="hover:text-white">Home Store</button></li>
                <li><button onClick={() => setActiveScreen('categories')} className="hover:text-white">All Categories</button></li>
                <li><button onClick={() => setActiveScreen('offers')} className="text-amber-400 font-bold">Student Deals</button></li>
                <li><button onClick={() => setActiveScreen('track-order')} className="hover:text-white">Track Delivery</button></li>
              </ul>
            </div>
            <div className="space-y-2">
              <h5 className="font-bold text-white text-[11px] uppercase tracking-wider">Student Help</h5>
              <ul className="space-y-2 text-slate-400">
                <li><button onClick={() => setActiveScreen('account')} className="hover:text-white">My Account</button></li>
                <li><button onClick={() => setActiveScreen('wishlist')} className="hover:text-white">Wishlist</button></li>
                <li><button onClick={() => showToast('24x7 Student Support: 1800-CAMPUS')} className="hover:text-white">Support Hotline</button></li>
                <li><button onClick={() => showToast('Free returns within 7 days of delivery')} className="hover:text-white">Return Policy</button></li>
              </ul>
            </div>
          </div>

          {/* Mobile Address & CIN Badge */}
          <div className="text-[10px] text-slate-400 space-y-1 bg-slate-950/40 p-3 rounded-xl border border-slate-800">
            <p className="font-semibold text-slate-300">CampusMart Internet Pvt. Ltd.</p>
            <p>Outer Ring Road, Bengaluru, 560103, Karnataka, India</p>
            <p className="text-slate-500">CIN: U51109KA2012PTC066107 • 100% Secure Student Escrow</p>
          </div>
        </div>
      </div>

      {/* 3. BOTTOM TRUST & DISCREET PORTAL LINK */}
      <div className="border-t border-slate-800 py-4 bg-slate-950">
        <div className="max-w-[1440px] mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] text-slate-400">
          <div className="flex flex-wrap items-center justify-center gap-4">
            <span>© 2024-2026 CampusMart.in. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span>Made with ❤️ for Indian University Students</span>
          </div>

          <div className="flex items-center gap-3">
            {/* Payment Icons */}
            <div className="flex items-center gap-1.5 opacity-80">
              <span className="px-1.5 py-0.5 bg-slate-800 rounded font-bold text-[9px] text-blue-400 border border-slate-700">UPI</span>
              <span className="px-1.5 py-0.5 bg-slate-800 rounded font-bold text-[9px] text-amber-400 border border-slate-700">RuPay</span>
              <span className="px-1.5 py-0.5 bg-slate-800 rounded font-bold text-[9px] text-white border border-slate-700">VISA</span>
              <span className="px-1.5 py-0.5 bg-slate-800 rounded font-bold text-[9px] text-emerald-400 border border-slate-700">COD</span>
            </div>

            {/* Staff portals use direct /seller and /admin URLs and are hidden from shoppers. */}
          </div>
        </div>
      </div>
    </footer>
  );
};
