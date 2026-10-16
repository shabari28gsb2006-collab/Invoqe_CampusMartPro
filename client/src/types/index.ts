export type ProductCategory = 
  | 'all'
  | 'mobiles'
  | 'laptops'
  | 'fashion'
  | 'footwear'
  | 'electronics'
  | 'home'
  | 'books'
  | 'sports'
  | 'beauty'
  | 'stationery'
  | 'more';

export type PortalMode = 'customer' | 'seller' | 'admin';

export interface Product {
  id: string;
  name: string;
  shortDesc?: string;
  category: ProductCategory;
  brand: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  rating: number;
  reviewCount: number;
  image: string;
  gallery: string[];
  isBestSeller?: boolean;
  isDealOfTheDay?: boolean;
  isFlashDeal?: boolean;
  isRecommended?: boolean;
  specs: { [key: string]: string };
  highlights?: string[];
  colors?: string[];
  stock: number;
  soldCount?: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
}

export type SeasonalThemeType = 'classic' | 'diwali' | 'christmas' | 'pongal' | 'newyear';

export interface ThemeConfig {
  id: SeasonalThemeType;
  name: string;
  tagline: string;
  primaryColor: string;
  primaryDark: string;
  accentColor: string;
  badgeBg: string;
  badgeText: string;
  bannerGradient: string;
  heroHeadline: string;
  heroSubheadline: string;
  festiveIcon: string;
  greetingText: string;
  specialOfferBadge: string;
  extraDiscountPercent: number;
}

export interface CampaignSchedule {
  themeId: SeasonalThemeType;
  campaignName: string;
  startDate: string;
  startTime: string;
  endDate: string;
  endTime: string;
  isActive: boolean;
  bannerNote?: string;
}

export interface OrderTrack {
  id: string;
  orderNumber: string;
  placedDate: string;
  status: 'placed' | 'packed' | 'shipped' | 'delivered';
  currentStep: number;
  steps: {
    title: string;
    date: string;
    completed: boolean;
  }[];
  product: Product;
  quantity: number;
  totalPrice: number;
  deliveryAddress: {
    name: string;
    addressLine: string;
    city: string;
    state: string;
    pincode: string;
  };
}

export interface SellerListing {
  id: string;
  title: string;
  category: ProductCategory;
  price: number;
  originalPrice: number;
  condition: 'Brand New' | 'Like New' | 'Gently Used';
  stock: number;
  views: number;
  inquiries: number;
  status: 'active' | 'sold' | 'under_review';
  dateListed: string;
  image: string;
  gallery?: string[];
  description?: string;
  variants?: { size?: string; color?: string }[];
}

export type ActiveScreen = 
  | 'home'
  | 'categories'
  | 'product-listing'
  | 'product-detail'
  | 'cart'
  | 'wishlist'
  | 'account'
  | 'offers'
  | 'track-order'
  | 'brand-store';
