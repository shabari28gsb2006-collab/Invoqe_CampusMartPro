import React, { useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { ShopProvider, useShop } from './context/ShopContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { BottomNav } from './components/common/BottomNav';
import { OffersTicker } from './components/common/OffersTicker';
import { DesktopHome } from './components/desktop/DesktopHome';
import { MobileHome } from './components/mobile/MobileHome';
import { CategoriesScreen } from './components/screens/CategoriesScreen';
import { ProductListingScreen } from './components/screens/ProductListingScreen';
import { ProductDetailScreen } from './components/screens/ProductDetailScreen';
import { CartScreen } from './components/screens/CartScreen';
import { WishlistScreen } from './components/screens/WishlistScreen';
import { AccountScreen } from './components/screens/AccountScreen';
import { OffersScreen } from './components/screens/OffersScreen';
import { OrderTrackingScreen } from './components/screens/OrderTrackingScreen';
import { BrandStoreScreen } from './components/screens/BrandStoreScreen';
import { SellerPortal } from './components/seller/SellerPortal';
import { AdminPortal } from './components/admin/AdminPortal';
import { OnboardingModal } from './components/common/OnboardingModal';
import { CheckCircle2 } from 'lucide-react';
import { PortalLogin } from './components/common/PortalLogin';

const MainAppContent: React.FC = () => {
  const { activeScreen, portalMode, setPortalMode } = useShop();
  const currentPath = window.location.pathname.replace(/\/+$/, '').toLowerCase();
  useEffect(() => {
    const path = window.location.pathname.replace(/\/+$/, '').toLowerCase();
    if (path === '/seller' || path === '/seller/') {
      if (sessionStorage.getItem('campusmart-access-token') && sessionStorage.getItem('campusmart-portal-role') === 'seller') setPortalMode('seller');
      else { window.history.replaceState({}, '', '/seller/login'); setPortalMode('customer'); }
    } else if (path === '/admin' || path === '/admin/') {
      if (sessionStorage.getItem('campusmart-admin-token') && sessionStorage.getItem('campusmart-portal-role') === 'admin') setPortalMode('admin');
      else { window.history.replaceState({}, '', '/admin/login'); setPortalMode('customer'); }
    } else if (path === '/' || path === '') setPortalMode('customer');
    const handlePop = () => {
      const next = window.location.pathname.replace(/\/+$/, '').toLowerCase();
      if (next === '/admin' && (!sessionStorage.getItem('campusmart-admin-token') || sessionStorage.getItem('campusmart-portal-role') !== 'admin')) { window.history.replaceState({}, '', '/admin/login'); setPortalMode('customer'); return; }
      if (next === '/seller' && (!sessionStorage.getItem('campusmart-access-token') || sessionStorage.getItem('campusmart-portal-role') !== 'seller')) { window.history.replaceState({}, '', '/seller/login'); setPortalMode('customer'); return; }
      setPortalMode(next.startsWith('/admin') && next !== '/admin/login' ? 'admin' : next.startsWith('/seller') && next !== '/seller/login' ? 'seller' : 'customer');
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  // Route selection is intentionally initialized once; popstate keeps direct routes working.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  if (currentPath === '/admin/login') return <PortalLogin role="admin" />;
  if (currentPath === '/seller/login') return <PortalLogin role="seller" />;
  // If user authenticated into Student Seller Hub
  if (portalMode === 'seller') {
    return (
      <>
        <SellerPortal />
        <ToastContainer />
      </>
    );
  }

  // If user authenticated into Admin Command Center
  if (portalMode === 'admin') {
    return (
      <>
        <AdminPortal />
        <ToastContainer />
      </>
    );
  }

  // Pure, pristine Customer Storefront
  const renderCustomerScreen = () => {
    switch (activeScreen) {
      case 'home':
        return (
          <>
            <div className="hidden md:block">
              <DesktopHome />
            </div>
            <div className="md:hidden">
              <MobileHome />
            </div>
          </>
        );
      case 'categories':
        return <CategoriesScreen />;
      case 'product-listing':
        return <ProductListingScreen />;
      case 'product-detail':
        return <ProductDetailScreen />;
      case 'cart':
        return <CartScreen />;
      case 'wishlist':
        return <WishlistScreen />;
      case 'account':
        return <AccountScreen />;
      case 'offers':
        return <OffersScreen />;
      case 'track-order':
        return <OrderTrackingScreen />;
      case 'brand-store':
        return <BrandStoreScreen />;
      default:
        return <DesktopHome />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col text-slate-800 antialiased selection:bg-[#2874F0] selection:text-white">
      {/* Pristine Customer Header */}
      <Header />

      {/* Auto-moving animated offers ticker ribbon */}
      <OffersTicker />

      {/* Main Content Area with safe bottom clearance for mobile navigation */}
      <main className="flex-1 max-w-[1440px] mx-auto px-2.5 sm:px-6 lg:px-8 pt-2.5 sm:pt-6 pb-20 md:pb-8 w-full">
        {renderCustomerScreen()}
      </main>

      {/* Corporate Collegiate Footer */}
      <Footer />

      {/* Mobile Sticky Navigation (hidden on product-detail where purchase bar takes precedence) */}
      {activeScreen !== 'product-detail' && <BottomNav />}


      {/* Onboarding Welcome Splash Modal */}
      <OnboardingModal />

      {/* Global Toast Alerts */}
      <ToastContainer />
    </div>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts } = useShop();
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-20 md:bottom-6 right-4 z-50 space-y-2 pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className="bg-slate-900/95 text-white px-4 py-2.5 rounded-xl shadow-lg border border-slate-700 text-xs font-semibold flex items-center gap-2 pointer-events-auto backdrop-blur-md transform animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      ))}
    </div>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <ShopProvider>
        <MainAppContent />
      </ShopProvider>
    </ThemeProvider>
  );
}
