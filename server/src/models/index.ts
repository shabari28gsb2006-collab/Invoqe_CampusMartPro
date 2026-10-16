import mongoose, { Schema, model } from 'mongoose';

// Access registered models via the default Mongoose instance (ESM-safe).
const models = mongoose.models;

const productSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 180 },
  shortDesc: { type: String, default: '' }, category: { type: String, required: true, index: true },
  brand: { type: String, default: '' }, sku: { type: String, trim: true, sparse: true, unique: true },
  price: { type: Number, required: true, min: 0 }, originalPrice: { type: Number, required: true, min: 0 },
  discountPercent: { type: Number, default: 0, min: 0, max: 100 }, rating: { type: Number, default: 0, min: 0, max: 5 },
  reviewCount: { type: Number, default: 0, min: 0 }, image: { type: String, default: '' }, gallery: { type: [String], default: [] },
  isBestSeller: Boolean, isDealOfTheDay: Boolean, isFlashDeal: Boolean, isRecommended: Boolean,
  specs: { type: Schema.Types.Mixed, default: {} }, highlights: [String], colors: [String],
  stock: { type: Number, required: true, min: 0, default: 0 }, soldCount: { type: String, default: '0' },
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', index: true }, sellerSessionId: { type: String, index: true }, condition: { type: String, enum: ['Brand New','Like New','Gently Used'], default: 'Brand New' }, views: { type: Number, default: 0 }, inquiries: { type: Number, default: 0 }, listingStatus: { type: String, enum: ['pending','active','rejected','suspended'], default: 'active', index: true },
}, { timestamps: true });
productSchema.index({ name: 'text', shortDesc: 'text', brand: 'text' });

const userSchema = new Schema({
  name: { type: String, required: true, trim: true, maxlength: 120 }, email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String, default: '' }, passwordHash: { type: String, select: false }, role: { type: String, enum: ['customer','seller','admin'], default: 'customer', index: true },
  status: { type: String, enum: ['pending','active','suspended','banned'], default: 'pending' }, emailVerifiedAt: Date,
}, { timestamps: true });

const orderSchema = new Schema({
  orderNumber: { type: String, unique: true, index: true },
  sessionId: { type: String, index: true }, userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  items: [{ productId: { type: Schema.Types.ObjectId, ref: 'Product' }, name: String, quantity: Number, unitPrice: Number, image: String, selectedColor: String }],
  subtotal: { type: Number, required: true, min: 0 }, discount: { type: Number, default: 0, min: 0 }, shipping: { type: Number, default: 0, min: 0 },
  totalAmount: { type: Number, required: true, min: 0 },
  deliveryAddress: { name: String, phone: String, addressLine: String, city: String, state: String, pincode: String, college: String, hostel: String, room: String },
  paymentMethod: { type: String, enum: ['cod','upi','razorpay'], default: 'cod' },
  paymentStatus: { type: String, enum: ['pending','paid','failed','refunded'], default: 'pending' },
  status: { type: String, enum: ['placed','confirmed','packed','shipped','delivered','cancelled','refunded'], default: 'placed', index: true },
  trackingNumber: String, trackingCarrier: String, statusHistory: [{ status: String, note: String, at: { type: Date, default: Date.now } }],
}, { timestamps: true });

const categorySchema = new Schema({
  slug: { type: String, unique: true, lowercase: true, trim: true }, name: { type: String, required: true, trim: true },
  description: String, isActive: { type: Boolean, default: true }, sortOrder: { type: Number, default: 0 },
}, { timestamps: true });

const cartSchema = new Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  items: [{ productId: { type: Schema.Types.ObjectId, ref: 'Product', required: true }, quantity: { type: Number, min: 1, max: 50, required: true }, selectedColor: String }],
}, { timestamps: true });

const wishlistSchema = new Schema({
  sessionId: { type: String, required: true, unique: true, index: true },
  productIds: [{ type: Schema.Types.ObjectId, ref: 'Product' }],
}, { timestamps: true });

const couponSchema = new Schema({
  sellerId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  code: { type: String, required: true, unique: true, uppercase: true, trim: true }, type: { type: String, enum: ['fixed','percent'], default: 'fixed' },
  value: { type: Number, min: 0, required: true }, minOrderAmount: { type: Number, default: 0 }, maxDiscount: Number,
  startsAt: Date, endsAt: Date, usageLimit: Number, usedCount: { type: Number, default: 0 }, isActive: { type: Boolean, default: true },
}, { timestamps: true });

const themeCampaignSchema = new Schema({
  themeId: { type: String, enum: ['classic','diwali','christmas','pongal','newyear','campusfest'], required: true, index: true },
  campaignName: { type: String, required: true, maxlength: 120 }, startAt: { type: Date, required: true, index: true },
  endAt: { type: Date, required: true, index: true }, isEnabled: { type: Boolean, default: false, index: true },
  priority: { type: Number, default: 0 }, bannerNote: { type: String, maxlength: 250 },
}, { timestamps: true });

const marketplaceSettingsSchema = new Schema({
  key: { type: String, unique: true, default: 'global' }, siteName: { type: String, default: 'CampusMart' },
  supportEmail: { type: String, default: '' }, commissionPercent: { type: Number, default: 5, min: 0, max: 100 },
  taxPercent: { type: Number, default: 0, min: 0, max: 100 }, freeShippingThreshold: { type: Number, default: 999, min: 0 },
  returnWindowDays: { type: Number, default: 7, min: 0, max: 365 }, maintenanceMode: { type: Boolean, default: false },
  emailNotifications: { type: Boolean, default: true }, smsNotifications: { type: Boolean, default: false },
  fraudChecks: { type: Boolean, default: true }, requireSellerApproval: { type: Boolean, default: true },
}, { timestamps: true });

const otpChallengeSchema = new Schema({
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  role: { type: String, enum: ['seller'], default: 'seller' }, name: String, rollNumber: String,
  otpHash: { type: String, required: true }, expiresAt: { type: Date, required: true, index: { expires: 0 } },
  attempts: { type: Number, default: 0 }, consumedAt: Date, lastSentAt: { type: Date, default: Date.now },
}, { timestamps: true });

const addressSchema = new Schema({
  sessionId: { type: String, index: true }, userId: { type: Schema.Types.ObjectId, ref: 'User', index: true },
  name: { type: String, required: true }, phone: { type: String, required: true }, addressLine: { type: String, required: true },
  city: { type: String, required: true }, state: { type: String, required: true }, pincode: { type: String, required: true },
  college: String, hostel: String, room: String, isDefault: { type: Boolean, default: false },
}, { timestamps: true });

const auditSchema = new Schema({
  actorId: { type: Schema.Types.ObjectId, ref: 'User' }, actorRole: String, action: { type: String, required: true },
  entityType: String, entityId: String, ip: String, metadata: Schema.Types.Mixed,
}, { timestamps: true });

export const Product = (models.Product as any) || model('Product', productSchema);
export const User = (models.User as any) || model('User', userSchema);
export const Order = (models.Order as any) || model('Order', orderSchema);
export const Category = (models.Category as any) || model('Category', categorySchema);
export const Cart = (models.Cart as any) || model('Cart', cartSchema);
export const Wishlist = (models.Wishlist as any) || model('Wishlist', wishlistSchema);
export const Coupon = (models.Coupon as any) || model('Coupon', couponSchema);
export const Address = (models.Address as any) || model('Address', addressSchema);
export const OtpChallenge = (models.OtpChallenge as any) || model('OtpChallenge', otpChallengeSchema);
export const ThemeCampaign = (models.ThemeCampaign as any) || model('ThemeCampaign', themeCampaignSchema);
export const MarketplaceSettings = (models.MarketplaceSettings as any) || model('MarketplaceSettings', marketplaceSettingsSchema);
export const AuditLog = (models.AuditLog as any) || model('AuditLog', auditSchema);
