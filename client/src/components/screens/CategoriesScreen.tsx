import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  Smartphone, 
  Laptop, 
  Shirt, 
  Footprints, 
  Headphones, 
  Armchair, 
  BookOpen, 
  Trophy, 
  Sparkles, 
  ChevronRight,
  Zap,
  Tag,
  ShieldCheck,
  Flame,
  ArrowRight
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { ProductCategory } from '../../types';

export const CategoriesScreen: React.FC = () => {
  const { setActiveScreen, viewCategory, showToast } = useShop();
  const [filterQuery, setFilterQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'tech' | 'lifestyle' | 'study'>('all');

  const categories = [
    { 
      id: 'mobiles' as ProductCategory, 
      name: 'Mobiles & 5G Tech', 
      subtitle: 'Smartphones, Tablets & Cases',
      tag: 'Up to 45% Off',
      badge: 'Bestseller',
      popularBrands: ['Apple', 'iQOO', 'Samsung', 'Realme'],
      icon: Smartphone, 
      group: 'tech',
      image: '/images/smartphone_flagship_1791969326350.jpg',
      gradient: 'from-blue-600 to-indigo-800'
    },
    { 
      id: 'laptops' as ProductCategory, 
      name: 'Laptops & IT Gear', 
      subtitle: 'Coding, Gaming & Thin/Light',
      tag: 'Min ₹10,000 Off',
      badge: 'Campus Choice',
      popularBrands: ['HP', 'Asus ROG', 'Apple M-Series', 'Lenovo'],
      icon: Laptop, 
      group: 'tech',
      image: '/images/laptop_deal_showcase_1791969325835.jpg',
      gradient: 'from-slate-800 to-blue-900'
    },
    { 
      id: 'electronics' as ProductCategory, 
      name: 'Audio & Wearables', 
      subtitle: 'ANC Headphones & Smartwatches',
      tag: 'Up to 70% Off',
      badge: 'Hot Deals',
      popularBrands: ['boAt', 'Sony', 'Noise', 'JBL'],
      icon: Headphones, 
      group: 'tech',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
      gradient: 'from-cyan-700 to-blue-900'
    },
    { 
      id: 'fashion' as ProductCategory, 
      name: 'Campus Fashion', 
      subtitle: 'Hoodies, Denim & Oversized Fits',
      tag: 'Under ₹799',
      badge: 'New Season',
      popularBrands: ['Campus Fits', 'Puma', 'Snitch', 'Zara'],
      icon: Shirt, 
      group: 'lifestyle',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=600&auto=format&fit=crop&q=80',
      gradient: 'from-rose-600 to-pink-800'
    },
    { 
      id: 'footwear' as ProductCategory, 
      name: 'Sneakers & Slides', 
      subtitle: 'Hostel Slides, Trainers & Kicks',
      tag: 'Flat 50% Off',
      badge: 'Trending',
      popularBrands: ['Nike', 'Puma', 'Campus', 'Crocs'],
      icon: Footprints, 
      group: 'lifestyle',
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      gradient: 'from-emerald-700 to-teal-900'
    },
    { 
      id: 'home' as ProductCategory, 
      name: 'Hostel & Dorm Setup', 
      subtitle: 'Study Desks, Chairs, Kettles & LED',
      tag: 'From ₹199',
      badge: 'Hostel Essential',
      popularBrands: ['Pigeon', 'Solimo', 'Wipro', 'IKEA'],
      icon: Armchair, 
      group: 'lifestyle',
      image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600&auto=format&fit=crop&q=80',
      gradient: 'from-amber-600 to-orange-800'
    },
    { 
      id: 'books' as ProductCategory, 
      name: 'Books & Reference', 
      subtitle: 'B.Tech, Medical & Exam Notes',
      tag: 'Senior Exchange',
      badge: 'Save 80%',
      popularBrands: ['Pearson', 'McGraw Hill', 'Arihant', 'S.Chand'],
      icon: BookOpen, 
      group: 'study',
      image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80',
      gradient: 'from-purple-700 to-indigo-900'
    },
    { 
      id: 'stationery' as ProductCategory, 
      name: 'Stationery & Drafters', 
      subtitle: 'Scientific Calcs, Sheets, Drafters',
      tag: 'Instant 2-Hr Drop',
      badge: 'Lab Gear',
      popularBrands: ['Casio', 'Classmate', 'Staedtler', 'Doms'],
      icon: Tag, 
      group: 'study',
      image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?w=600&auto=format&fit=crop&q=80',
      gradient: 'from-sky-700 to-blue-900'
    },
    { 
      id: 'sports' as ProductCategory, 
      name: 'Campus Sports & Cycles', 
      subtitle: 'Bicycles, Badminton & Gym Shakers',
      tag: 'Trade-in Ready',
      badge: 'Healthy Campus',
      popularBrands: ['Hero', 'Yonex', 'Nivia', 'Decathlon'],
      icon: Trophy, 
      group: 'study',
      image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80',
      gradient: 'from-indigo-600 to-purple-800'
    },
  ];

  const filteredCategories = categories.filter(cat => {
    const matchesQuery = cat.name.toLowerCase().includes(filterQuery.toLowerCase()) ||
      cat.subtitle.toLowerCase().includes(filterQuery.toLowerCase()) ||
      cat.popularBrands.some(b => b.toLowerCase().includes(filterQuery.toLowerCase()));
    
    if (activeTab === 'all') return matchesQuery;
    return matchesQuery && cat.group === activeTab;
  });

  return (
    <div className="max-w-6xl mx-auto pb-24 md:pb-12 pt-1 px-3 md:px-0 select-none">
      {/* 1. Header with Breadcrumb */}
      <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-gray-200">
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
                Explore Categories
              </h1>
              <span className="px-2 py-0.5 rounded-full bg-blue-100 text-[#2874F0] text-xs font-bold">
                {categories.length} Departments
              </span>
            </div>
            <p className="text-xs text-gray-500 mt-0.5">
              Direct hostel delivery & senior exchange across SRM, IIT, NIT & VIT
            </p>
          </div>
        </div>

        <button
          onClick={() => setActiveScreen('offers')}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs shadow-xs transition-colors cursor-pointer"
        >
          <Flame className="w-3.5 h-3.5 text-rose-600 fill-rose-600" />
          <span>View All Deals</span>
        </button>
      </div>

      {/* 2. Top Promotional Banner (Flipkart Style) */}
      <div className="rounded-2xl p-4 sm:p-6 mb-5 text-white shadow-sm bg-gradient-to-r from-[#2874F0] via-indigo-700 to-blue-900 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-slate-900 text-[10px] font-black uppercase tracking-wider">
              Mega Campus Carnival
            </span>
            <span className="text-[11px] text-blue-200 font-medium">Free Hostel Delivery</span>
          </div>
          <h2 className="text-lg sm:text-2xl font-black leading-tight">
            Curated College Essentials with Instant Student Savings
          </h2>
          <p className="text-xs text-blue-100 mt-1">
            Genuine brand warranty + Verified senior pre-loved gear at up to 80% lower cost
          </p>
        </div>

        <button
          onClick={() => {
            viewCategory('laptops');
            showToast('Showing Top Student Laptops');
          }}
          className="relative z-10 px-4 py-2 bg-white text-[#2874F0] hover:bg-blue-50 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0 cursor-pointer self-start sm:self-auto"
        >
          <span>Explore Top Picks</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>

        <div className="absolute right-0 top-0 bottom-0 w-64 bg-white/5 transform skew-x-12 pointer-events-none" />
      </div>

      {/* 3. Search Bar & Filter Chips */}
      <div className="space-y-3 mb-6">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-3 text-gray-400" />
          <input 
            type="text"
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            placeholder="Search by category, brand (e.g. Apple, Casio, boAt, Nike)..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-10 pr-4 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-hidden focus:border-[#2874F0] focus:ring-2 focus:ring-blue-100 shadow-2xs transition-all"
          />
          {filterQuery && (
            <button 
              onClick={() => setFilterQuery('')}
              className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600 font-bold"
            >
              Clear
            </button>
          )}
        </div>

        {/* Tab pills */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-1">
          {[
            { id: 'all', label: 'All Departments' },
            { id: 'tech', label: 'Tech & Gadgets' },
            { id: 'lifestyle', label: 'Campus Living & Style' },
            { id: 'study', label: 'Academics & Sports' },
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
      </div>

      {/* 4. Rich Category Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat) => {
          const Icon = cat.icon;
          return (
            <div
              key={cat.id}
              onClick={() => viewCategory(cat.id)}
              className="group bg-white rounded-2xl border border-gray-200 hover:border-[#2874F0] hover:shadow-lg transition-all p-4 flex flex-col justify-between cursor-pointer relative overflow-hidden"
            >
              <div>
                {/* Header row: Icon, Badge, Discount Pill */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#2874F0] group-hover:bg-[#2874F0] group-hover:text-white transition-colors flex items-center justify-center shadow-2xs">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900 group-hover:text-[#2874F0] transition-colors leading-tight">
                        {cat.name}
                      </h3>
                      <p className="text-[11px] text-gray-500 line-clamp-1">
                        {cat.subtitle}
                      </p>
                    </div>
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-wider bg-rose-50 text-rose-600 border border-rose-200 px-2 py-0.5 rounded-full shrink-0">
                    {cat.tag}
                  </span>
                </div>

                {/* Studio Product Graphic Thumbnail */}
                <div className="aspect-16/9 rounded-xl overflow-hidden bg-slate-50 border border-gray-100 relative mb-3 flex items-center justify-center p-2">
                  <img
                    src={cat.image}
                    alt={cat.name}
                    className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-300 drop-shadow-sm"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-slate-900/80 backdrop-blur-xs text-white text-[9px] font-bold">
                    {cat.badge}
                  </div>
                </div>

                {/* Popular Brands preview */}
                <div className="pt-2 border-t border-gray-100">
                  <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider block mb-1.5">
                    Top Campus Brands
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {cat.popularBrands.map(b => (
                      <span
                        key={b}
                        className="px-2 py-0.5 bg-gray-50 rounded-md text-[10px] font-medium text-slate-700 border border-gray-100"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Action row */}
              <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-[#2874F0] group-hover:text-[#1254C2]">
                <span>View Products & Deals</span>
                <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          );
        })}
      </div>

      {/* 5. Trust Guarantee Matrix */}
      <div className="mt-8 bg-white rounded-2xl p-4 sm:p-5 border border-gray-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-slate-900">100% Genuine Student Guarantee</h4>
            <p className="text-[11px] text-gray-500">Every tech item tested, sealed and covered under official campus warranty.</p>
          </div>
        </div>

        <button
          onClick={() => {
            setActiveScreen('home');
            showToast('Ready to explore all campus rails');
          }}
          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-colors cursor-pointer shrink-0"
        >
          Return to Storefront
        </button>
      </div>
    </div>
  );
};
