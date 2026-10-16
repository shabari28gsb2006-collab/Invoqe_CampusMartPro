import { Router } from 'express';
import mongoose from 'mongoose';
import { createHash, randomInt } from 'node:crypto';
import bcrypt from 'bcryptjs';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import { Product, Category, Cart, Wishlist, Coupon, Order, Address, OtpChallenge, User, ThemeCampaign, MarketplaceSettings } from '../models/index.js';
import { asyncHandler, sessionKey, safeText } from '../lib/http.js';
import { calculateCouponDiscount, isCouponEligible } from '../lib/pricing.js';
import { createAccessToken, verifyAccessToken } from '../lib/auth.js';

export const api = Router();
const authRateLimit = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20, standardHeaders: true, legacyHeaders: false, message: { message: 'Too many sign-in attempts. Please try again in 15 minutes.' } });
const objectId = (value: string) => mongoose.Types.ObjectId.isValid(value);
const addressSchema = z.object({
  name: z.string().trim().min(2).max(120), phone: z.string().trim().min(8).max(20),
  addressLine: z.string().trim().min(5).max(300), city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100), pincode: z.string().trim().regex(/^[0-9A-Za-z -]{4,12}$/),
  college: z.string().max(120).optional(), hostel: z.string().max(100).optional(), room: z.string().max(30).optional(),
});
const checkoutSchema = z.object({
  items: z.array(z.object({ productId: z.string().min(1), quantity: z.number().int().min(1).max(50), selectedColor: z.string().max(80).optional() })).min(1).max(50),
  couponCode: z.string().max(40).nullable().optional(), deliveryAddress: addressSchema,
  paymentMethod: z.enum(['cod','upi','razorpay']).default('cod'),
});
function requireSeller(req: any, res: any, next: any) {
  const authorization = String(req.header('authorization') || '');
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  const payload = process.env.SESSION_SECRET ? verifyAccessToken(token, process.env.SESSION_SECRET) : null;
  if (!payload || payload.role !== 'seller') return res.status(401).json({ message: 'Seller authentication required. Please sign in.' });
  req.authUserId = payload.sub;
  return next();
}


function authenticatedPayload(req: any) {
  const authorization = String(req.header('authorization') || '');
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  return process.env.SESSION_SECRET ? verifyAccessToken(token, process.env.SESSION_SECRET) : null;
}
function requireCustomer(req: any, res: any, next: any) {
  const payload = authenticatedPayload(req);
  if (!payload || payload.role !== 'customer' || !objectId(payload.sub)) return res.status(401).json({ message: 'Customer sign-in required.' });
  req.authUserId = payload.sub;
  return next();
}

const productDto = (p: any) => ({ id: String(p._id), legacyId: p.sku || undefined, name: p.name, shortDesc: p.shortDesc, category: p.category, brand: p.brand, price: p.price, originalPrice: p.originalPrice, discountPercent: p.discountPercent, rating: p.rating, reviewCount: p.reviewCount, image: p.image, gallery: p.gallery || [], isBestSeller: p.isBestSeller, isDealOfTheDay: p.isDealOfTheDay, isFlashDeal: p.isFlashDeal, isRecommended: p.isRecommended, specs: p.specs || {}, highlights: p.highlights || [], colors: p.colors || [], stock: p.stock, soldCount: p.soldCount, listingStatus: p.listingStatus, sellerId: p.sellerId ? String(p.sellerId) : undefined });

api.get('/health/live', (_req, res) => res.json({ ok: true, service: 'campusmart-api', time: new Date().toISOString() }));
api.get('/health/ready', (_req, res) => res.json({ ok: mongoose.connection.readyState === 1, database: ['disconnected','connected','connecting','disconnecting'][mongoose.connection.readyState] }));

api.get('/products', asyncHandler(async (req, res) => {
  const filter: Record<string, unknown> = { listingStatus: 'active' };
  if (req.query.category && req.query.category !== 'all') filter.category = safeText(req.query.category, 50);
  if (req.query.brand) filter.brand = safeText(req.query.brand, 100);
  if (req.query.q) filter.$text = { $search: safeText(req.query.q, 100) };
  if (req.query.id) filter._id = objectId(String(req.query.id)) ? req.query.id : null;
  const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 200);
  const products = await Product.find(filter).sort({ createdAt: -1 }).limit(limit).lean();
  res.json({ products: products.map(productDto), total: products.length });
}));
api.get('/products/:id', asyncHandler(async (req, res) => {
  const product = objectId(req.params.id) ? await Product.findOne({ _id: req.params.id, listingStatus: 'active' }).lean() : await Product.findOne({ sku: req.params.id, listingStatus: 'active' }).lean();
  if (!product) return res.status(404).json({ message: 'Product not found' });
  return res.json({ product: productDto(product) });
}));
api.get('/marketplace/theme', asyncHandler(async (_req, res) => {
  const now = new Date();
  const campaign = await ThemeCampaign.findOne({ isEnabled: true, startAt: { $lte: now }, endAt: { $gte: now } }).sort({ priority: -1, startAt: -1 }).lean();
  const settings = await MarketplaceSettings.findOne({ key: 'global' }).lean();
  res.json({ themeId: campaign?.themeId || 'classic', campaign: campaign || null, settings: settings || null, serverTime: now.toISOString() });
}));
api.get('/categories', asyncHandler(async (_req, res) => res.json({ categories: await Category.find({ isActive: true }).sort({ sortOrder: 1 }).lean() })));

api.get('/cart', asyncHandler(async (req, res) => {
  const sessionId = sessionKey(req);
  const cart = await Cart.findOne({ sessionId }).populate('items.productId').lean();
  res.json({ items: (cart?.items || []).map((item: any) => ({ product: item.productId ? productDto(item.productId) : null, quantity: item.quantity, selectedColor: item.selectedColor })).filter((i: any) => i.product) });
}));
api.put('/cart', asyncHandler(async (req, res) => {
  const sessionId = sessionKey(req);
  const body = z.object({ items: z.array(z.object({ productId: z.string().refine(objectId), quantity: z.number().int().min(1).max(50), selectedColor: z.string().max(80).optional() })).max(50) }).parse(req.body);
  for (const item of body.items) if (!(await Product.exists({ _id: item.productId, listingStatus: 'active', stock: { $gte: item.quantity } }))) return res.status(409).json({ message: 'A product is unavailable or has insufficient stock.' });
  await Cart.findOneAndUpdate({ sessionId }, { $set: { items: body.items.map(i => ({ productId: i.productId, quantity: i.quantity, selectedColor: i.selectedColor })) } }, { upsert: true, new: true, runValidators: true });
  return res.json({ ok: true });
}));
api.get('/wishlist', asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ sessionId: sessionKey(req) }).populate('productIds', 'name').lean();
  res.json({ productIds: (wishlist?.productIds || []).map((p: any) => String(p._id)) });
}));
api.put('/wishlist', asyncHandler(async (req, res) => {
  const ids = z.array(z.string().refine(objectId)).max(500).parse(req.body.productIds || []);
  await Wishlist.findOneAndUpdate({ sessionId: sessionKey(req) }, { $set: { productIds: [...new Set(ids)] } }, { upsert: true, new: true });
  res.json({ ok: true, productIds: [...new Set(ids)] });
}));

api.post('/coupons/validate', asyncHandler(async (req, res) => {
  const code = safeText(req.body?.code, 40).toUpperCase();
  const subtotal = Number(req.body?.subtotal);
  if (!Number.isFinite(subtotal) || subtotal < 0) return res.status(400).json({ message: 'Invalid subtotal' });
  const coupon = await Coupon.findOne({ code, isActive: true }).lean();
  if (!coupon) return res.status(404).json({ message: 'Coupon is invalid or inactive' });
  const now = new Date();
  if (!isCouponEligible({ subtotal, minOrderAmount: coupon.minOrderAmount, startsAt: coupon.startsAt, endsAt: coupon.endsAt, isActive: coupon.isActive, usageLimit: coupon.usageLimit, usedCount: coupon.usedCount, now })) return res.status(400).json({ message: 'Coupon is not eligible for this order' });
  res.json({ code, discount: calculateCouponDiscount(subtotal, coupon) });
}));

api.post('/orders', asyncHandler(async (req, res) => {
  const sessionId = sessionKey(req);
  const body = checkoutSchema.parse(req.body);
  const ids = body.items.map(i => i.productId);
  if (ids.some(id => !objectId(id))) return res.status(400).json({ message: 'Invalid product id. Refresh the catalogue before checkout.' });
  const products = await Product.find({ _id: { $in: ids }, listingStatus: 'active' });
  const byId = new Map(products.map(p => [String(p._id), p]));
  if (products.length !== new Set(ids).size) return res.status(409).json({ message: 'One or more products are no longer available.' });
  const sellerOwners = new Set(products.map(p => p.sellerId ? String(p.sellerId) : 'campusmart'));
  if (sellerOwners.size > 1) return res.status(409).json({ message: 'Please place separate orders for items from different sellers.' });
  let subtotal = 0;
  const orderItems: any[] = [];
  for (const item of body.items) {
    const product = byId.get(item.productId)!;
    if (product.stock < item.quantity) return res.status(409).json({ message: `${product.name} has only ${product.stock} left.` });
    subtotal += product.price * item.quantity;
    orderItems.push({ productId: product._id, name: product.name, quantity: item.quantity, unitPrice: product.price, image: product.image, selectedColor: item.selectedColor });
  }
  let discount = 0;
  let couponDoc: any = null;
  if (body.couponCode) {
    couponDoc = await Coupon.findOne({ code: body.couponCode.toUpperCase(), isActive: true });
    if (!couponDoc) return res.status(400).json({ message: 'Coupon is invalid or inactive.' });
    const orderSellerId = products[0]?.sellerId ? String(products[0].sellerId) : '';
    if (couponDoc.sellerId && String(couponDoc.sellerId) !== orderSellerId) return res.status(400).json({ message: 'This seller coupon does not apply to the selected order.' });
    const now = new Date();
    if (!isCouponEligible({ subtotal, minOrderAmount: couponDoc.minOrderAmount, startsAt: couponDoc.startsAt, endsAt: couponDoc.endsAt, isActive: couponDoc.isActive, usageLimit: couponDoc.usageLimit, usedCount: couponDoc.usedCount, now })) return res.status(400).json({ message: 'Coupon is not eligible for this order.' });
    discount = calculateCouponDiscount(subtotal, couponDoc);
  }
  const reserved: { id: string; quantity: number }[] = [];
  let createdOrderId: string | null = null;
  let couponIncremented = false;
  try {
    for (const item of body.items) {
      const p = await Product.findOneAndUpdate({ _id: item.productId, listingStatus: 'active', stock: { $gte: item.quantity } }, { $inc: { stock: -item.quantity } }, { new: true });
      if (!p) throw Object.assign(new Error('Stock changed while placing your order. Please retry.'), { status: 409 });
      reserved.push({ id: item.productId, quantity: item.quantity });
    }
    const orderNumber = `CM${Date.now().toString().slice(-9)}${Math.floor(Math.random()*90+10)}`;
    const order = await Order.create({
      orderNumber, sessionId, items: orderItems, subtotal, discount, shipping: 0, totalAmount: Math.max(0, subtotal - discount),
      deliveryAddress: body.deliveryAddress, paymentMethod: body.paymentMethod, paymentStatus: 'pending',
      status: 'placed', statusHistory: [{ status: 'placed', note: 'Order placed', at: new Date() }],
    });
    createdOrderId = String(order._id);
    if (couponDoc) { await Coupon.updateOne({ _id: couponDoc._id }, { $inc: { usedCount: 1 } }); couponIncremented = true; }
    await Cart.updateOne({ sessionId }, { $set: { items: [] } });
    return res.status(201).json({ order: { id: String(order._id), orderNumber: order.orderNumber, status: order.status, totalAmount: order.totalAmount, createdAt: order.createdAt, items: orderItems.map(i => ({ productId: String(i.productId), name: i.name, quantity: i.quantity, unitPrice: i.unitPrice, image: i.image })) } });
  } catch (err) {
    if (createdOrderId) await Order.deleteOne({ _id: createdOrderId });
    if (couponDoc && couponIncremented) await Coupon.updateOne({ _id: couponDoc._id }, { $inc: { usedCount: -1 } });
    await Promise.all(reserved.map(r => Product.updateOne({ _id: r.id }, { $inc: { stock: r.quantity } })));
    throw err;
  }
}));
api.get('/orders', asyncHandler(async (req, res) => {
  const orders = await Order.find({ sessionId: sessionKey(req) }).sort({ createdAt: -1 }).lean();
  res.json({ orders: orders.map(o => ({ id: String(o._id), orderNumber: o.orderNumber, status: o.status, totalAmount: o.totalAmount, createdAt: o.createdAt, trackingNumber: o.trackingNumber, trackingCarrier: o.trackingCarrier, items: o.items, statusHistory: o.statusHistory, deliveryAddress: o.deliveryAddress })) });
}));
api.get('/orders/:orderNumber/track', asyncHandler(async (req, res) => {
  const order = await Order.findOne({ orderNumber: safeText(req.params.orderNumber, 40), sessionId: sessionKey(req) }).lean();
  if (!order) return res.status(404).json({ message: 'Order not found' });
  res.json({ order: { orderNumber: order.orderNumber, status: order.status, trackingNumber: order.trackingNumber, trackingCarrier: order.trackingCarrier, statusHistory: order.statusHistory, createdAt: order.createdAt } });
}));

api.get('/addresses', asyncHandler(async (req, res) => res.json({ addresses: await Address.find({ sessionId: sessionKey(req) }).sort({ isDefault: -1, createdAt: -1 }).lean() })));
api.post('/addresses', asyncHandler(async (req, res) => {
  const body = addressSchema.parse(req.body);
  const sessionId = sessionKey(req);
  const count = await Address.countDocuments({ sessionId });
  const address = await Address.create({ ...body, sessionId, isDefault: count === 0 });
  res.status(201).json({ address });
}));


const sellerProductSchema = z.object({
  name: z.string().trim().min(3).max(180), shortDesc: z.string().max(500).optional(),
  category: z.string().trim().min(2).max(50), brand: z.string().max(100).optional(),
  price: z.number().min(0).max(100000000), originalPrice: z.number().min(0).max(100000000),
  stock: z.number().int().min(0).max(100000), image: z.string().max(2000).optional(),
  gallery: z.array(z.string().max(2000)).max(5).optional(), colors: z.array(z.string().max(80)).max(30).optional(),
  specs: z.record(z.string()).optional(), highlights: z.array(z.string().max(250)).max(30).optional(),
  condition: z.enum(['Brand New','Like New','Gently Used']).optional(),
});
api.use('/seller', requireSeller);


api.get('/seller/coupons', asyncHandler(async (req, res) => {
  const coupons = await Coupon.find({ sellerId: (req as any).authUserId }).sort({ createdAt: -1 }).lean();
  res.json({ coupons });
}));
api.post('/seller/coupons', asyncHandler(async (req, res) => {
  const data = z.object({
    code: z.string().trim().min(3).max(40).regex(/^[A-Za-z0-9_-]+$/), type: z.enum(['fixed','percent']),
    value: z.number().positive(), minOrderAmount: z.number().min(0).optional(), maxDiscount: z.number().positive().optional(),
    endsAt: z.coerce.date().optional(),
  }).parse(req.body);
  const coupon = await Coupon.create({ ...data, code: data.code.toUpperCase(), sellerId: (req as any).authUserId, isActive: true });
  res.status(201).json({ coupon });
}));

api.get('/seller/orders', asyncHandler(async (req, res) => {
  const sellerId = (req as any).authUserId;
  const sellerProducts = await Product.find({ sellerId }).select('_id').lean();
  const productIds = sellerProducts.map(p => p._id);
  const orders = productIds.length ? await Order.find({ 'items.productId': { $in: productIds } }).sort({ createdAt: -1 }).limit(200).lean() : [];
  res.json({ orders: orders.map(o => ({
    id: String(o._id), orderNumber: o.orderNumber, customer: o.deliveryAddress?.name || 'Customer',
    date: o.createdAt, items: o.items.filter((item: any) => productIds.some(id => String(id) === String(item.productId))).reduce((n: number, item: any) => n + item.quantity, 0),
    total: o.items.filter((item: any) => productIds.some(id => String(id) === String(item.productId))).reduce((n: number, item: any) => n + item.unitPrice * item.quantity, 0),
    status: o.status, payment: o.paymentStatus, address: [o.deliveryAddress?.city, o.deliveryAddress?.state].filter(Boolean).join(', '),
    trackingNumber: o.trackingNumber,
  })) });
}));
api.patch('/seller/orders/:id/status', asyncHandler(async (req, res) => {
  const sellerId = (req as any).authUserId;
  const status = z.enum(['confirmed','packed','shipped','delivered','cancelled']).parse(req.body.status);
  const sellerProducts = await Product.find({ sellerId }).select('_id').lean();
  const ids = sellerProducts.map(p => String(p._id));
  const order = await Order.findById(req.params.id);
  if (!order || !order.items.some((item: any) => ids.includes(String(item.productId)))) return res.status(404).json({ message: 'Seller order not found.' });
  if (['delivered','cancelled'].includes(order.status)) return res.status(409).json({ message: 'Order is already closed.' });
  if (status === 'cancelled') {
    for (const item of order.items) await Product.updateOne({ _id: item.productId }, { $inc: { stock: item.quantity } });
  }
  order.status = status;
  if (req.body.trackingNumber) order.trackingNumber = safeText(req.body.trackingNumber, 100);
  if (req.body.trackingCarrier) order.trackingCarrier = safeText(req.body.trackingCarrier, 80);
  order.statusHistory.push({ status, note: `Seller updated order to ${status}`, at: new Date() });
  await order.save();
  res.json({ ok: true, orderNumber: order.orderNumber, status: order.status, trackingNumber: order.trackingNumber });
}));

api.get('/seller/products', asyncHandler(async (req, res) => {
  const items = await Product.find({ sellerId: (req as any).authUserId }).sort({ createdAt: -1 }).lean();
  res.json({ products: items.map(p => ({ ...productDto(p), condition: p.condition, views: p.views || 0, inquiries: p.inquiries || 0, status: p.listingStatus === 'active' ? 'active' : p.listingStatus === 'rejected' ? 'sold' : 'under_review', dateListed: p.createdAt })) });
}));
api.post('/seller/products', asyncHandler(async (req, res) => {
  const data = sellerProductSchema.parse(req.body);
  if (data.price > data.originalPrice) return res.status(400).json({ message: 'Selling price cannot exceed original price.' });
  const product = await Product.create({ ...data, sellerId: (req as any).authUserId, listingStatus: 'pending', discountPercent: data.originalPrice ? Math.round((data.originalPrice - data.price) / data.originalPrice * 100) : 0 });
  res.status(201).json({ product: { ...productDto(product), status: 'under_review', condition: product.condition } });
}));
api.patch('/seller/products/:id', asyncHandler(async (req, res) => {
  if (!objectId(req.params.id)) return res.status(400).json({ message: 'Invalid product id' });
  const data = sellerProductSchema.partial().parse(req.body);
  const existing = await Product.findOne({ _id: req.params.id, sellerId: (req as any).authUserId });
  if (!existing) return res.status(404).json({ message: 'Listing not found' });
  const nextPrice = data.price ?? existing.price;
  const nextOriginalPrice = data.originalPrice ?? existing.originalPrice;
  if (nextPrice > nextOriginalPrice) return res.status(400).json({ message: 'Selling price cannot exceed original price.' });
  const requiresReview = ['name','category','price','originalPrice','image','shortDesc','condition'].some(key => (data as any)[key] !== undefined);
  const updates: Record<string, unknown> = { ...data, ...(requiresReview ? { listingStatus: 'pending' } : {}) };
  if (data.price !== undefined || data.originalPrice !== undefined) updates.discountPercent = nextOriginalPrice > 0 ? Math.round((nextOriginalPrice - nextPrice) / nextOriginalPrice * 100) : 0;
  const product = await Product.findOneAndUpdate({ _id: req.params.id, sellerId: (req as any).authUserId }, { $set: updates }, { new: true, runValidators: true });
  if (!product) return res.status(404).json({ message: 'Listing not found' });
  res.json({ product: { ...productDto(product), status: product.listingStatus === 'active' ? 'active' : 'under_review', condition: product.condition } });
}));
api.delete('/seller/products/:id', asyncHandler(async (req, res) => {
  const deleted = await Product.findOneAndDelete({ _id: req.params.id, sellerId: (req as any).authUserId });
  if (!deleted) return res.status(404).json({ message: 'Listing not found' });
  res.json({ ok: true });
}));
api.patch('/seller/products/:id/status', asyncHandler(async (req, res) => {
  const status = z.enum(['pending']).parse(req.body.status);
  const product = await Product.findOneAndUpdate({ _id: req.params.id, sellerId: (req as any).authUserId }, { $set: { listingStatus: status } }, { new: true });
  if (!product) return res.status(404).json({ message: 'Listing not found' });
  res.json({ ok: true, status: product.listingStatus });
}));

// Admin endpoints require a separately configured secret; never rely on a client-supplied role.
function requireAdmin(req: any, res: any, next: any) {
  const authorization = String(req.header('authorization') || '');
  const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
  const payload = process.env.SESSION_SECRET ? verifyAccessToken(token, process.env.SESSION_SECRET) : null;
  if (!payload || payload.role !== 'admin') return res.status(403).json({ message: 'Admin authentication required. Please sign in.' });
  return next();
}




api.post('/auth/customer/register', authRateLimit, asyncHandler(async (req, res) => {
  const body = z.object({ name: z.string().trim().min(2).max(120), email: z.string().email().max(254), password: z.string().min(8).max(100), phone: z.string().max(20).optional() }).parse(req.body);
  const email = body.email.toLowerCase();
  if (await User.exists({ email })) return res.status(409).json({ message: 'An account with this email already exists.' });
  const passwordHash = await bcrypt.hash(body.password, 12);
  const user = await User.create({ name: body.name, email, phone: body.phone || '', passwordHash, role: 'customer', status: 'active' });
  const token = createAccessToken(String(user._id), process.env.SESSION_SECRET!, 'customer');
  return res.status(201).json({ token, user: { id: String(user._id), name: user.name, email: user.email, phone: user.phone, role: user.role } });
}));
api.post('/auth/customer/login', authRateLimit, asyncHandler(async (req, res) => {
  const body = z.object({ email: z.string().email().max(254), password: z.string().min(1).max(100) }).parse(req.body);
  const user = await User.findOne({ email: body.email.toLowerCase(), role: 'customer', status: 'active' }).select('+passwordHash');
  if (!user?.passwordHash || !(await bcrypt.compare(body.password, user.passwordHash))) return res.status(401).json({ message: 'Wrong email or password.' });
  const token = createAccessToken(String(user._id), process.env.SESSION_SECRET!, 'customer');
  return res.json({ token, user: { id: String(user._id), name: user.name, email: user.email, phone: user.phone, role: user.role } });
}));
api.get('/auth/customer/me', requireCustomer, asyncHandler(async (req, res) => {
  const user = await User.findById((req as any).authUserId).lean();
  if (!user) return res.status(404).json({ message: 'Account not found.' });
  return res.json({ user: { id: String(user._id), name: user.name, email: user.email, phone: user.phone, role: user.role } });
}));
api.patch('/auth/customer/me', requireCustomer, asyncHandler(async (req, res) => {
  const body = z.object({ name: z.string().trim().min(2).max(120).optional(), email: z.string().email().max(254).optional(), phone: z.string().max(20).optional() }).strict().parse(req.body);
  if (body.email && await User.exists({ email: body.email.toLowerCase(), _id: { $ne: (req as any).authUserId } })) return res.status(409).json({ message: 'That email is already in use.' });
  const updates = { ...body, ...(body.email ? { email: body.email.toLowerCase() } : {}) };
  const user = await User.findByIdAndUpdate((req as any).authUserId, { $set: updates }, { new: true, runValidators: true }).lean();
  if (!user) return res.status(404).json({ message: 'Account not found.' });
  return res.json({ user: { id: String(user._id), name: user.name, email: user.email, phone: user.phone, role: user.role } });
}));

// Demo portal credentials are read only by the server; they are never bundled into the frontend.
api.post('/auth/portal/login', authRateLimit, asyncHandler(async (req, res) => {
  const body = z.object({ role: z.enum(['seller','admin']), username: z.string().trim().min(1).max(120), password: z.string().min(1).max(200) }).parse(req.body);
  const expectedUsername = body.role === 'seller' ? (process.env.SELLER_USERNAME || '') : (process.env.ADMIN_USERNAME || '');
  const expectedPassword = body.role === 'seller' ? (process.env.SELLER_PASSWORD || '') : (process.env.ADMIN_PASSWORD || '');
  if (!expectedUsername || !expectedPassword || body.username !== expectedUsername || body.password !== expectedPassword) return res.status(401).json({ message: 'Wrong username or password.' });
  if (!process.env.SESSION_SECRET) return res.status(500).json({ message: 'Server session secret is not configured.' });
  let subject = body.role === 'admin' ? 'campusmart-admin' : '';
  if (body.role === 'seller') {
    const seller = await User.findOneAndUpdate(
      { email: expectedUsername.toLowerCase() },
      { $set: { name: 'CampusMart Demo Seller', role: 'seller', status: 'active', emailVerifiedAt: new Date() }, $setOnInsert: { email: expectedUsername.toLowerCase() } },
      { upsert: true, new: true, runValidators: true },
    );
    subject = String(seller._id);
  }
  const token = createAccessToken(subject, process.env.SESSION_SECRET, body.role);
  return res.json({ ok: true, role: body.role, token, message: 'Signed in successfully.' });
}));

api.post('/auth/seller/request-otp', asyncHandler(async (req, res) => {
  const body = z.object({ email: z.string().email().max(254), name: z.string().trim().min(2).max(120), rollNumber: z.string().trim().min(3).max(40) }).parse(req.body);
  const email = body.email.toLowerCase();
  const existing = await OtpChallenge.findOne({ email, consumedAt: { $exists: false } }).sort({ createdAt: -1 });
  if (existing && Date.now() - existing.lastSentAt.getTime() < 60_000) return res.status(429).json({ message: 'Please wait one minute before requesting another OTP.' });
  const otp = String(randomInt(0, 1_000_000)).padStart(6, '0');
  const otpHash = createHash('sha256').update(`${otp}:${process.env.SESSION_SECRET}`).digest('hex');
  await OtpChallenge.deleteMany({ email });
  await OtpChallenge.create({ email, name: body.name, rollNumber: body.rollNumber, otpHash, expiresAt: new Date(Date.now() + 5 * 60_000), lastSentAt: new Date() });
  if (process.env.NODE_ENV !== 'development' || process.env.OTP_MODE !== 'development') return res.status(503).json({ message: 'Email OTP delivery is not configured. Configure an email provider before using production authentication.' });
  return res.json({ ok: true, expiresInSeconds: 300, developmentOtp: otp, message: 'Development OTP generated. This code is available only in development mode.' });
}));
api.post('/auth/seller/verify-otp', asyncHandler(async (req, res) => {
  const body = z.object({ email: z.string().email().max(254), otp: z.string().regex(/^[0-9]{6}$/) }).parse(req.body);
  const challenge = await OtpChallenge.findOne({ email: body.email.toLowerCase(), consumedAt: { $exists: false } }).sort({ createdAt: -1 });
  if (!challenge || challenge.expiresAt.getTime() < Date.now()) return res.status(400).json({ message: 'OTP expired or not requested. Request a new code.' });
  if (challenge.attempts >= 5) return res.status(429).json({ message: 'Too many attempts. Request a new OTP.' });
  const otpHash = createHash('sha256').update(`${body.otp}:${process.env.SESSION_SECRET}`).digest('hex');
  if (otpHash !== challenge.otpHash) {
    challenge.attempts += 1; await challenge.save();
    return res.status(400).json({ message: 'Incorrect OTP.' });
  }
  challenge.consumedAt = new Date(); await challenge.save();
  let user = await User.findOne({ email: body.email.toLowerCase() });
  if (user && user.role !== 'seller') return res.status(409).json({ message: 'This email belongs to a non-seller account.' });
  if (!user) user = await User.create({ name: challenge.name, email: body.email.toLowerCase(), role: 'seller', status: 'active', emailVerifiedAt: new Date() });
  else { user.name = challenge.name; user.status = 'active'; user.emailVerifiedAt = new Date(); await user.save(); }
  return res.json({ ok: true, token: createAccessToken(String(user._id), process.env.SESSION_SECRET!), user: { id: String(user._id), name: user.name, email: user.email, role: user.role, status: user.status }, message: 'Seller email verified.' });
}));

api.get('/admin/settings', requireAdmin, asyncHandler(async (_req, res) => {
  const settings = await MarketplaceSettings.findOneAndUpdate({ key: 'global' }, { $setOnInsert: { key: 'global' } }, { upsert: true, new: true });
  res.json({ settings });
}));
api.put('/admin/settings', requireAdmin, asyncHandler(async (req, res) => {
  const data = z.object({
    siteName: z.string().trim().min(2).max(100).optional(), supportEmail: z.string().email().optional(),
    commissionPercent: z.number().min(0).max(100).optional(), taxPercent: z.number().min(0).max(100).optional(),
    freeShippingThreshold: z.number().min(0).optional(), returnWindowDays: z.number().int().min(0).max(365).optional(),
    maintenanceMode: z.boolean().optional(), emailNotifications: z.boolean().optional(), smsNotifications: z.boolean().optional(),
    fraudChecks: z.boolean().optional(), requireSellerApproval: z.boolean().optional(),
  }).parse(req.body);
  const settings = await MarketplaceSettings.findOneAndUpdate({ key: 'global' }, { $set: data, $setOnInsert: { key: 'global' } }, { upsert: true, new: true, runValidators: true });
  res.json({ settings });
}));
api.get('/admin/themes', requireAdmin, asyncHandler(async (_req, res) => res.json({ campaigns: await ThemeCampaign.find({}).sort({ priority: -1, startAt: -1 }).lean() })));
api.put('/admin/themes', requireAdmin, asyncHandler(async (req, res) => {
  const campaigns = z.array(z.object({
    themeId: z.enum(['classic','diwali','christmas','pongal','newyear','campusfest']),
    campaignName: z.string().trim().min(2).max(120), startAt: z.coerce.date(), endAt: z.coerce.date(),
    isEnabled: z.boolean(), priority: z.number().int().min(0).max(100).default(0), bannerNote: z.string().max(250).optional(),
  }).refine(c => c.endAt > c.startAt, { message: 'Campaign end must be after start' })).max(30).parse(req.body.campaigns);
  await ThemeCampaign.deleteMany({});
  const inserted = campaigns.length ? await ThemeCampaign.insertMany(campaigns) : [];
  res.json({ campaigns: inserted });
}));
api.get('/admin/overview', requireAdmin, asyncHandler(async (_req, res) => {
  const [products, pendingProducts, activeProducts, orders, paidOrders, users, sellers, revenue, recentOrders] = await Promise.all([
    Product.countDocuments(), Product.countDocuments({ listingStatus: 'pending' }), Product.countDocuments({ listingStatus: 'active' }), Order.countDocuments(),
    Order.countDocuments({ paymentStatus: 'paid' }), User.countDocuments(), User.countDocuments({ role: 'seller' }),
    Order.aggregate([{ $match: { status: { $nin: ['cancelled','refunded'] } } }, { $group: { _id: null, total: { $sum: '$totalAmount' } } }]),
    Order.aggregate([{ $match: { createdAt: { $gte: new Date(Date.now() - 7 * 86400000) }, status: { $ne: 'cancelled' } } }, { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 }, amount: { $sum: '$totalAmount' } } }, { $sort: { _id: 1 } }]),
  ]);
  res.json({ products, activeProducts, pendingProducts, orders, paidOrders, users, sellers, revenue: revenue[0]?.total || 0, recentOrders });
}));

api.get('/admin/orders', requireAdmin, asyncHandler(async (req, res) => {
  const orders = await Order.find({}).sort({ createdAt: -1 }).limit(200).lean();
  res.json({ orders: orders.map(o => ({ id: String(o._id), orderNumber: o.orderNumber, customer: o.deliveryAddress?.name || 'Customer', amount: o.totalAmount, payment: o.paymentStatus, status: o.status, date: o.createdAt, items: o.items })) });
}));
api.get('/admin/users', requireAdmin, asyncHandler(async (_req, res) => {
  const users = await mongoose.model('User').find({}).select('-passwordHash').sort({ createdAt: -1 }).limit(500).lean();
  res.json({ users });
}));

api.get('/admin/products', requireAdmin, asyncHandler(async (req, res) => {
  const status = ['pending','active','rejected','suspended'].includes(String(req.query.status)) ? String(req.query.status) : undefined;
  const products = await Product.find(status ? { listingStatus: status } : {}).sort({ createdAt: -1 }).limit(200).lean();
  res.json({ products: products.map(productDto) });
}));
api.patch('/admin/products/:id/moderation', requireAdmin, asyncHandler(async (req, res) => {
  const status = z.enum(['active','rejected','suspended','pending']).parse(req.body.status);
  const product = await Product.findByIdAndUpdate(req.params.id, { $set: { listingStatus: status } }, { new: true });
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json({ product: productDto(product) });
}));

api.patch('/admin/users/:id/status', requireAdmin, asyncHandler(async (req, res) => {
  const status = z.enum(['active','suspended','banned','pending']).parse(req.body.status);
  const user = await User.findByIdAndUpdate(req.params.id, { $set: { status } }, { new: true }).select('-passwordHash');
  if (!user) return res.status(404).json({ message: 'User not found' });
  res.json({ user: { id: String(user._id), status: user.status } });
}));

api.patch('/admin/orders/:id/status', requireAdmin, asyncHandler(async (req, res) => {
  const status = z.enum(['confirmed','packed','shipped','delivered','cancelled','refunded']).parse(req.body.status);
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  if (order.status === 'delivered' || order.status === 'cancelled') return res.status(409).json({ message: 'This order can no longer change status.' });
  if (status === 'cancelled') {
    for (const item of order.items) await Product.updateOne({ _id: item.productId }, { $inc: { stock: item.quantity } });
  }
  order.status = status;
  order.statusHistory.push({ status, note: `Status updated to ${status}`, at: new Date() });
  await order.save();
  res.json({ order: { id: String(order._id), orderNumber: order.orderNumber, status: order.status } });
}));
api.post('/admin/categories', requireAdmin, asyncHandler(async (req, res) => {
  const data = z.object({ slug: z.string().trim().min(2).max(60).regex(/^[a-z0-9-]+$/), name: z.string().trim().min(2).max(100), description: z.string().max(300).optional(), sortOrder: z.number().int().optional() }).parse(req.body);
  const category = await Category.create(data);
  res.status(201).json({ category });
}));
api.post('/admin/coupons', requireAdmin, asyncHandler(async (req, res) => {
  const data = z.object({ code: z.string().trim().min(3).max(40), type: z.enum(['fixed','percent']), value: z.number().min(0), minOrderAmount: z.number().min(0).optional(), maxDiscount: z.number().min(0).optional(), startsAt: z.coerce.date().optional(), endsAt: z.coerce.date().optional(), usageLimit: z.number().int().positive().optional(), isActive: z.boolean().optional() }).parse(req.body);
  const coupon = await Coupon.create({ ...data, code: data.code.toUpperCase() });
  res.status(201).json({ coupon });
}));

api.post('/uploads/cloudinary-signature', asyncHandler(async (req, res) => {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;
  if (!cloudName || !apiKey || !apiSecret) return res.status(503).json({ message: 'Cloudinary is not configured.' });
  const { v2: cloudinary } = await import('cloudinary');
  const timestamp = Math.floor(Date.now() / 1000);
  const folder = 'campusmart/products';
  const signature = cloudinary.utils.api_sign_request({ timestamp, folder }, apiSecret);
  res.json({ cloudName, apiKey, timestamp, folder, signature });
}));
