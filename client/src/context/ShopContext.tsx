import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, ActiveScreen, ProductCategory, OrderTrack, PortalMode, SellerListing } from '../types';
import { PRODUCTS, INITIAL_CART_ITEMS, INITIAL_WISHLIST_IDS, MOCK_ORDER } from '../data/mockData';
import { apiEnabled, apiRequest } from '../services/api';

// Reliable, category-matched fallbacks for legacy database products with missing images.
// Prefer each product's own stored image; these are only used when it is blank.
const CATEGORY_IMAGE_FALLBACKS: Record<string, string> = {
  mobiles: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=85',
  laptops: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=85',
  electronics: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=85',
  footwear: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=85',
  fashion: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800&auto=format&fit=crop&q=85',
  home: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=800&auto=format&fit=crop&q=85',
  books: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&auto=format&fit=crop&q=85',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=85',
  beauty: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800&auto=format&fit=crop&q=85',
  stationery: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=800&auto=format&fit=crop&q=85',
  more: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=85',
};

function normalizeCatalogProduct<T extends Product>(product: T): T {
  const image = typeof product.image === 'string' && product.image.trim()
    ? product.image
    : (CATEGORY_IMAGE_FALLBACKS[String(product.category || 'more')] || CATEGORY_IMAGE_FALLBACKS.more);
  const gallery = Array.isArray(product.gallery) ? product.gallery.filter((item): item is string => typeof item === 'string' && item.trim().length > 0) : [];
  return { ...product, rating: Number(Number(product.rating || 0).toFixed(1)), image, gallery: gallery.length ? gallery : [image] };
}

interface Toast {
  id: string;
  message: string;
  type?: 'success' | 'info';
}

const INITIAL_SELLER_LISTINGS: SellerListing[] = [
  {
    id: 'sell-1',
    title: 'Concepts of Physics (Vol 1 & 2) - H.C. Verma',
    category: 'books',
    price: 450,
    originalPrice: 900,
    condition: 'Like New',
    stock: 1,
    views: 142,
    inquiries: 12,
    status: 'active',
    dateListed: '12 Oct 2024',
    image: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'sell-2',
    title: 'Casio FX-991EX Classwiz Scientific Calculator',
    category: 'stationery',
    price: 950,
    originalPrice: 1595,
    condition: 'Like New',
    stock: 1,
    views: 310,
    inquiries: 24,
    status: 'active',
    dateListed: '10 Oct 2024',
    image: 'https://images.unsplash.com/photo-1594980596870-8aa52a78d8cd?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'sell-3',
    title: 'Hero Sprint 26T Mountain Bicycle (Hostel Commute)',
    category: 'sports',
    price: 3200,
    originalPrice: 7500,
    condition: 'Gently Used',
    stock: 1,
    views: 480,
    inquiries: 38,
    status: 'sold',
    dateListed: '05 Oct 2024',
    image: 'https://images.unsplash.com/photo-1485965120184-e220f721d03e?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'sell-4',
    title: 'Bajaj 1.5L Stainless Steel Electric Kettle for Dorm',
    category: 'home',
    price: 550,
    originalPrice: 1200,
    condition: 'Like New',
    stock: 1,
    views: 195,
    inquiries: 18,
    status: 'active',
    dateListed: '08 Oct 2024',
    image: 'https://images.unsplash.com/photo-1577733966973-d680bffd2e80?w=400&auto=format&fit=crop&q=80',
  },
];

interface ShopContextType {
  portalMode: PortalMode;
  setPortalMode: (mode: PortalMode) => void;
  activeScreen: ActiveScreen;
  setActiveScreen: (screen: ActiveScreen) => void;
  selectedCategory: ProductCategory;
  setSelectedCategory: (cat: ProductCategory) => void;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  selectedBrand: string | null;
  setSelectedBrand: (brand: string | null) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  catalogProducts: Product[];
  cartItems: CartItem[];
  addToCart: (product: Product, quantity?: number, color?: string) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  clearCart: () => void;
  appliedCoupon: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  couponDiscount: number;

  wishlistIds: string[];
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  trackOrder: OrderTrack;
  setTrackOrder: (order: OrderTrack) => void;
  toasts: Toast[];
  showToast: (message: string) => void;

  sellerListings: SellerListing[];
  addSellerListing: (listing: Omit<SellerListing, 'id' | 'views' | 'inquiries' | 'status' | 'dateListed'>) => void;
  updateSellerListing: (id: string, updates: Partial<Omit<SellerListing, 'id' | 'views' | 'inquiries' | 'dateListed'>>) => void;
  deleteSellerListing: (id: string) => void;
  toggleListingStatus: (id: string) => void;
  
  viewProduct: (product: Product) => void;
  viewCategory: (cat: ProductCategory) => void;
  viewBrand: (brand: string) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [portalMode, setPortalModeState] = useState<PortalMode>('customer');
  const [catalogProducts, setCatalogProducts] = useState<Product[]>(PRODUCTS);
  const [activeScreen, setActiveScreen] = useState<ActiveScreen>('home');
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(
    PRODUCTS.find(p => p.id === 'hp-pavilion-15') || PRODUCTS[0]
  );
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [cartItems, setCartItems] = useState<CartItem[]>(() => { try { const saved = localStorage.getItem('campusmart-cart'); return saved ? JSON.parse(saved) as CartItem[] : INITIAL_CART_ITEMS; } catch { return INITIAL_CART_ITEMS; } });
  useEffect(() => { try { localStorage.setItem('campusmart-cart', JSON.stringify(cartItems)); } catch { /* storage may be unavailable */ } }, [cartItems]);
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => { try { const saved = localStorage.getItem('campusmart-wishlist'); return saved ? JSON.parse(saved) as string[] : INITIAL_WISHLIST_IDS; } catch { return INITIAL_WISHLIST_IDS; } });
  useEffect(() => { try { localStorage.setItem('campusmart-wishlist', JSON.stringify(wishlistIds)); } catch { /* storage may be unavailable */ } }, [wishlistIds]);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>('CAMPUS2024');
  const [validatedCouponDiscount, setValidatedCouponDiscount] = useState<number | null>(null);
  const [toasts, setToasts] = useState<Toast[]>([]);
  const [trackOrder, setTrackOrder] = useState<OrderTrack>(MOCK_ORDER);
  const [sellerListings, setSellerListings] = useState<SellerListing[]>(() => { try { const saved = localStorage.getItem('campusmart-seller-listings'); return saved ? JSON.parse(saved) as SellerListing[] : INITIAL_SELLER_LISTINGS; } catch { return INITIAL_SELLER_LISTINGS; } });
  useEffect(() => { try { localStorage.setItem('campusmart-seller-listings', JSON.stringify(sellerListings)); } catch { /* storage may be unavailable */ } }, [sellerListings]);

  // When an API URL is configured, hydrate the storefront from MongoDB and migrate
  // legacy demo cart/wishlist IDs to the persisted product IDs.
  useEffect(() => {
    if (!apiEnabled) return;
    let cancelled = false;
    (async () => {
      try {
        const response = await apiRequest<{ products: (Product & { legacyId?: string })[] }>('/api/v1/products?limit=200');
        if (cancelled || !Array.isArray(response?.products) || response.products.length === 0) return;
        // Never replace the working demo catalogue with an invalid API response.
        const normalizedProducts = response.products.map(normalizeCatalogProduct);
        setCatalogProducts(normalizedProducts);
        const byLegacyId = new Map(response.products.filter(p => p.legacyId).map(p => [p.legacyId as string, p]));
        setSelectedProduct(current => response.products.find(p => p.legacyId === current?.id) || normalizedProducts.find(p => p.id === current?.id) || normalizedProducts[0]);
        try {
          const sellerResult = await apiRequest<{ products: any[] }>('/api/v1/seller/products');
          setSellerListings(sellerResult.products.map(p => ({
            id: p.id, title: p.name, category: p.category, price: p.price, originalPrice: p.originalPrice,
            condition: p.condition || 'Brand New', stock: p.stock, views: p.views || 0, inquiries: p.inquiries || 0,
            status: p.status || 'under_review', dateListed: p.dateListed ? new Date(p.dateListed).toLocaleDateString() : 'Recently listed',
            image: p.image || '', gallery: Array.isArray(p.gallery) ? p.gallery : (p.image ? [p.image] : []), description: p.shortDesc || '',
          })));
        } catch { /* customer-only sessions may have no seller listings yet */ }
        // Only preserve cart lines that can be matched to a live database product.
        setCartItems(current => current.flatMap(item => {
          const product = response.products.find(p => p.id === item.product.id) || byLegacyId.get(item.product.id);
          return product ? [{ ...item, product }] : [];
        }));
        setWishlistIds(current => current.flatMap(id => {
          const product = response.products.find(p => p.id === id) || byLegacyId.get(id);
          return product ? [product.id] : [];
        }));
      } catch (error) {
        console.error('CampusMart API catalogue load failed:', error);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!apiEnabled || portalMode !== 'seller') return;
    let cancelled = false;
    void apiRequest<{ products: any[] }>('/api/v1/seller/products').then(({ products }) => {
      if (cancelled) return;
      setSellerListings(products.map(p => ({
        id: p.id, title: p.name, category: p.category, price: p.price, originalPrice: p.originalPrice,
        condition: p.condition || 'Brand New', stock: p.stock, views: p.views || 0, inquiries: p.inquiries || 0,
        status: p.status || 'under_review', dateListed: p.dateListed ? new Date(p.dateListed).toLocaleDateString() : 'Recently listed',
        image: p.image || '', gallery: Array.isArray(p.gallery) ? p.gallery : (p.image ? [p.image] : []), description: p.shortDesc || '',
      })));
    }).catch(error => console.error('Could not load seller listings:', error));
    return () => { cancelled = true; };
  }, [portalMode]);

  // Keep the guest cart and wishlist in MongoDB when API mode is enabled.
  useEffect(() => {
    if (!apiEnabled) return;
    const items = cartItems.filter(item => /^[a-f0-9]{24}$/i.test(item.product.id)).map(item => ({
      productId: item.product.id, quantity: item.quantity, selectedColor: item.selectedColor,
    }));
    void apiRequest('/api/v1/cart', { method: 'PUT', body: JSON.stringify({ items }) }).catch(() => undefined);
  }, [cartItems]);

  useEffect(() => {
    if (!apiEnabled) return;
    const ids = wishlistIds.filter(id => /^[a-f0-9]{24}$/i.test(id));
    void apiRequest('/api/v1/wishlist', { method: 'PUT', body: JSON.stringify({ productIds: ids }) }).catch(() => undefined);
  }, [wishlistIds]);

  useEffect(() => {
    if (!apiEnabled || activeScreen !== 'track-order') return;
    let cancelled = false;
    void apiRequest<{ orders: any[] }>('/api/v1/orders').then(({ orders }) => {
      if (cancelled || !orders.length) return;
      const order = orders[0];
      const statusMap: Record<string, OrderTrack['status']> = { placed: 'placed', confirmed: 'placed', packed: 'packed', shipped: 'shipped', delivered: 'delivered' };
      const currentStatus = statusMap[order.status] || 'placed';
      const firstItem = order.items?.[0];
      const base = PRODUCTS[0];
      const product: Product = {
        ...base, id: firstItem?.productId || base.id, name: firstItem?.name || base.name,
        price: firstItem?.unitPrice || 0, originalPrice: firstItem?.unitPrice || 0,
        image: firstItem?.image || base.image, gallery: firstItem?.image ? [firstItem.image] : base.gallery,
        stock: 0, category: 'more', brand: 'CampusMart',
      };
      const stages: OrderTrack['steps'] = ['placed','packed','shipped','delivered'].map((stage, index) => {
        const event = (order.statusHistory || []).find((entry: any) => entry.status === stage);
        const orderStage = currentStatus === 'placed' ? 0 : currentStatus === 'packed' ? 1 : currentStatus === 'shipped' ? 2 : 3;
        return { title: stage.charAt(0).toUpperCase() + stage.slice(1), date: event ? new Date(event.at).toLocaleString() : 'Awaiting update', completed: index <= orderStage };
      });
      const addr = order.deliveryAddress || {};
      setTrackOrder({
        id: order.id, orderNumber: order.orderNumber, placedDate: new Date(order.createdAt).toLocaleDateString(),
        status: currentStatus, currentStep: currentStatus === 'placed' ? 0 : currentStatus === 'packed' ? 1 : currentStatus === 'shipped' ? 2 : 3,
        steps: stages, product, quantity: firstItem?.quantity || 1, totalPrice: order.totalAmount || 0,
        deliveryAddress: { name: addr.name || '', addressLine: addr.addressLine || '', city: addr.city || '', state: addr.state || '', pincode: addr.pincode || '' },
      });
    }).catch(error => console.error('Could not load order tracking:', error));
    return () => { cancelled = true; };
  }, [activeScreen]);


  const setPortalMode = (mode: PortalMode) => {
    setPortalModeState(mode);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (mode === 'customer') {
      showToast('Switched to Customer Storefront');
    } else if (mode === 'seller') {
      showToast('Welcome to Student Creator & Seller Hub');
    } else if (mode === 'admin') {
      showToast('CampusMart Admin Command Center active');
    }
  };

  const showToast = (message: string) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    setToasts(prev => [...prev, { id, message, type: 'success' }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 2800);
  };

  const addToCart = (product: Product, quantity = 1, color?: string) => {
    setCartItems(prev => {
      const chosenColor = color || product.colors?.[0] || 'Default';
      const existing = prev.find(item => item.product.id === product.id && (item.selectedColor || item.product.colors?.[0] || 'Default') === chosenColor);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity, selectedColor: chosenColor }];
    });
    showToast(`Added "${product.name.slice(0, 24)}..." to cart`);
  };

  const removeFromCart = (productId: string) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
    showToast('Item removed from cart');
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCartItems(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const clearCart = () => setCartItems([]);

  const applyCoupon = (code: string): boolean => {
    const normalized = code.trim().toUpperCase();
    if (!normalized) return false;
    if (apiEnabled) {
      const subtotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
      setAppliedCoupon(normalized);
      setValidatedCouponDiscount(null);
      void apiRequest<{ code: string; discount: number }>('/api/v1/coupons/validate', {
        method: 'POST', body: JSON.stringify({ code: normalized, subtotal }),
      }).then(result => {
        setValidatedCouponDiscount(result.discount);
        showToast(`Coupon ${result.code} applied. You save ₹${result.discount}.`);
      }).catch(error => {
        setAppliedCoupon(null);
        setValidatedCouponDiscount(null);
        showToast(error instanceof Error ? error.message : 'Coupon could not be validated.');
      });
      return true;
    }
    if (normalized === 'CAMPUS2024' || normalized === 'STUDENT10' || normalized === 'DIWALI50') {
      setAppliedCoupon(normalized);
      showToast(`Coupon ${normalized} applied successfully!`);
      return true;
    }
    showToast('Invalid coupon code. Try CAMPUS2024 or STUDENT10');
    return false;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setValidatedCouponDiscount(null);
    showToast('Coupon removed');
  };

  const couponDiscount = validatedCouponDiscount ?? (appliedCoupon === 'CAMPUS2024' ? 500 : appliedCoupon === 'STUDENT10' ? 800 : appliedCoupon === 'DIWALI50' ? 1200 : 0);

  const toggleWishlist = (productId: string) => {
    setWishlistIds(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from wishlist');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to your wishlist');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlistIds.includes(productId);

  const addSellerListing = (item: Omit<SellerListing, 'id' | 'views' | 'inquiries' | 'status' | 'dateListed'>) => {
    const newListing: SellerListing = {
      ...item,
      id: 'sell-' + Date.now() + '-' + Math.random().toString(36).slice(2, 7),
      views: 1,
      inquiries: 0,
      status: 'active',
      dateListed: 'Just now',
    };
    setSellerListings(prev => [newListing, ...prev]);
    if (apiEnabled) {
      void apiRequest<{ product: any }>('/api/v1/seller/products', {
        method: 'POST',
        body: JSON.stringify({
          name: item.title, category: item.category, price: item.price, originalPrice: item.originalPrice,
          stock: item.stock, image: item.image, condition: item.condition, shortDesc: item.description || '',
          gallery: item.gallery?.length ? item.gallery : (item.image ? [item.image] : []),
        }),
      }).then(({ product }) => {
        setSellerListings(prev => prev.map(listing => listing.id === newListing.id ? {
          ...listing, id: product.id, status: product.status || 'under_review', dateListed: new Date().toLocaleDateString(),
        } : listing));
        showToast('Listing submitted for review');
      }).catch(error => showToast(error instanceof Error ? error.message : 'Could not save listing to server'));
    }
    showToast('New student listing submitted on CampusMart!');
  };

  const updateSellerListing = (id: string, updates: Partial<Omit<SellerListing, 'id' | 'views' | 'inquiries' | 'dateListed'>>) => {
    const needsReview = ['title','category','price','originalPrice','image','description','condition'].some(key => (updates as any)[key] !== undefined);
    setSellerListings(prev => prev.map(item => item.id === id ? { ...item, ...updates, ...(apiEnabled && needsReview && /^[a-f0-9]{24}$/i.test(id) ? { status: 'under_review' as const } : {}) } : item));
    if (apiEnabled && /^[a-f0-9]{24}$/i.test(id)) {
      const payload: Record<string, unknown> = {};
      if (updates.title !== undefined) payload.name = updates.title;
      if (updates.category !== undefined) payload.category = updates.category;
      if (updates.price !== undefined) payload.price = updates.price;
      if (updates.originalPrice !== undefined) payload.originalPrice = updates.originalPrice;
      if (updates.stock !== undefined) payload.stock = updates.stock;
      if (updates.image !== undefined) payload.image = updates.image;
      if (updates.gallery !== undefined) payload.gallery = updates.gallery;
      if (updates.description !== undefined) payload.shortDesc = updates.description;
      if (updates.condition !== undefined) payload.condition = updates.condition;
      void apiRequest(`/api/v1/seller/products/${id}`, { method: 'PATCH', body: JSON.stringify(payload) })
        .catch(error => showToast(error instanceof Error ? error.message : 'Could not update listing on server'));
    }
    showToast('Product details updated');
  };

  const deleteSellerListing = (id: string) => {
    setSellerListings(prev => prev.filter(item => item.id !== id));
    if (apiEnabled && /^[a-f0-9]{24}$/i.test(id)) {
      void apiRequest(`/api/v1/seller/products/${id}`, { method: 'DELETE' })
        .catch(error => showToast(error instanceof Error ? error.message : 'Could not remove listing from server'));
    }
    showToast('Listing removed from campus marketplace');
  };

  const toggleListingStatus = (id: string) => {
    const listing = sellerListings.find(item => item.id === id);
    const nextStatus = listing?.status === 'active' ? 'sold' : 'active';
    setSellerListings(prev => prev.map(item => item.id === id ? { ...item, status: nextStatus } : item));
    if (apiEnabled && /^[a-f0-9]{24}$/i.test(id)) {
      void apiRequest(`/api/v1/seller/products/${id}/status`, { method: 'PATCH', body: JSON.stringify({ status: 'pending' }) })
        .catch(error => showToast(error instanceof Error ? error.message : 'Could not update listing status'));
    }
    showToast('Listing status updated');
  };

  const viewProduct = (product: Product) => {
    setSelectedProduct(product);
    setActiveScreen('product-detail');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewCategory = (cat: ProductCategory) => {
    setSelectedCategory(cat);
    setActiveScreen('product-listing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const viewBrand = (brand: string) => {
    setSelectedBrand(brand);
    setActiveScreen('brand-store');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <ShopContext.Provider
      value={{
        portalMode,
        setPortalMode,
        activeScreen,
        setActiveScreen,
        selectedCategory,
        setSelectedCategory,
        selectedProduct,
        setSelectedProduct,
        selectedBrand,
        setSelectedBrand,
        searchQuery,
        setSearchQuery,
        // Expose the catalogue state to all storefront screens. Without this,
        // useShop().catalogProducts is undefined and home/listing screens crash.
        catalogProducts: Array.isArray(catalogProducts) ? catalogProducts : PRODUCTS,
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        couponDiscount,
        wishlistIds,
        toggleWishlist,
        isInWishlist,
        trackOrder,
        setTrackOrder,
        toasts,
        showToast,
        sellerListings,
        addSellerListing,
        updateSellerListing,
        deleteSellerListing,
        toggleListingStatus,
        viewProduct,
        viewCategory,
        viewBrand,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
