import 'dotenv/config';
import dns from 'node:dns';
import mongoose from 'mongoose';
import { Product, Category, Coupon } from './models/index.js';

dns.setServers(['8.8.8.8', '1.1.1.1']);

if (!process.env.MONGODB_URI) throw new Error('Set MONGODB_URI in server/.env before seeding.');
await mongoose.connect(process.env.MONGODB_URI);
const frontendDataPath = new URL('../../client/src/data/mockData.ts', import.meta.url).href;
const { PRODUCTS, CATEGORIES_DATA } = await import(frontendDataPath);
try {
  const sellerEmail = (process.env.SELLER_USERNAME || 'seller@campusmart').toLowerCase();
  const seller = await mongoose.model('User').findOneAndUpdate(
    { email: sellerEmail },
    { $set: { name: 'CampusMart Official Store', role: 'seller', status: 'active', emailVerifiedAt: new Date() }, $setOnInsert: { email: sellerEmail } },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: false },
  );
  const catalog: [string, string, string, number, number, string][] = [
    // Mobiles (5)
    ['mobiles','Samsung Galaxy A35 5G','Samsung',27999,32999,'photo-1511707171634-5f897ff02aa9'],
    ['mobiles','OnePlus Nord CE4 Lite 5G','OnePlus',19999,22999,'photo-1592750475338-74b7b21085ab'],
    ['mobiles','Redmi Note 13 5G','Xiaomi',16999,21999,'photo-1511707171634-5f897ff02aa9'],
    ['mobiles','iQOO Z9x 5G','iQOO',14999,19999,'photo-1598327105666-5b89351aff97'],
    ['mobiles','Realme Narzo 70 Pro 5G','realme',18999,23999,'photo-1592750475338-74b7b21085ab'],
    // Laptops (5)
    ['laptops','Lenovo IdeaPad Slim 3','Lenovo',42990,55990,'photo-1496181133206-80ce9b88a853'],
    ['laptops','ASUS Vivobook 15','ASUS',46990,62990,'photo- laptop'],
    ['laptops','Acer Aspire Lite','Acer',37990,49990,'photo-1496181133206-80ce9b88a853'],
    ['laptops','Dell Inspiron 15','Dell',51990,64990,'photo- laptops'],
    ['laptops','Apple MacBook Air M2','Apple',79990,99900,'photo-1517336714731-489689fd1ca8'],
    // Fashion (5)
    ['fashion','Men Regular Fit Cotton Shirt','Roadster',799,1499,'photo- shirt'],
    ['fashion','Women Floral Kurta','Biba',1199,1999,'photo- women'],
    ['fashion','Classic Denim Jeans','Levis',1799,2999,'photo-1542272604-787c3835535d'],
    ['fashion','Unisex Campus Hoodie','CampusMart',699,1299,'photo-1556821840-3a63f95609a7'],
    ['fashion','Cotton Everyday T-Shirt','Puma',599,999,'photo-1521572163474-6864f9cf17ab'],
    // Footwear (5)
    ['footwear','Nike Revolution Running Shoes','Nike',2999,4995,'photo-1542291026-7eec264c27ff'],
    ['footwear','Adidas Grand Court Sneakers','Adidas',3499,5999,'photo-1542291026-7eec264c27ff'],
    ['footwear','Campus Men Running Shoes','Campus',1199,2499,'photo- shoes'],
    ['footwear','Puma Smashic Casual Shoes','Puma',2299,3999,'photo-1549298916-b41d501d3772'],
    ['footwear','Bata Formal Lace-up Shoes','Bata',1599,2499,'photo- footwear'],
    // Electronics (5)
    ['electronics','boAt Airdopes 141','boAt',999,2990,'photo-1606220945770-b5b6c2c55bf1'],
    ['electronics','Sony WH-CH520 Wireless Headphones','Sony',3490,4990,'photo-150 dist'],
    ['electronics','JBL Go 3 Portable Speaker','JBL',2499,3999,'photo-1608043152269-423dbba4e7e1'],
    ['electronics','Logitech M331 Silent Mouse','Logitech',1095,1695,'photo-1527814050087-3793815479db'],
    ['electronics','Portronics 65W USB-C Charger','Portronics',1499,2499,'photo- charger'],
    // Home (5)
    ['home','Milton Thermosteel Bottle 750ml','Milton',699,1099,'photo-1602143407151-7111542de6e8'],
    ['home','Cello Plastic Storage Organizer','Cello',499,799,'photo- storage'],
    ['home','Wakefit Memory Foam Pillow','Wakefit',899,1499,'photo- pillow'],
    ['home','Prestige Electric Kettle 1.5L','Prestige',1299,1995,'photo- kettle'],
    ['home','Portronics LED Study Lamp','Portronics',799,1299,'photo- lamp'],
    // Books (5)
    ['books','Atomic Habits','Penguin',399,799,'photo-1544947950-fa07a98d237f'],
    ['books','The Psychology of Money','Jaico',299,499,'photo-1544947950-fa07a98d237f'],
    ['books','Clean Code','Pearson',599,899,'photo- books'],
    ['books','Computer Networking: A Top-Down Approach','Pearson',699,999,'photo- books'],
    ['books','A Brief History of Time','Bantam',349,599,'photo- books'],
    // Sports (5)
    ['sports','Cosco Basketball','Cosco',699,999,'photo- basketball'],
    ['sports','Nivia Football Size 5','Nivia',599,899,'photo- football'],
    ['sports','Boldfit Yoga Mat','Boldfit',599,1199,'photo- yoga'],
    ['sports','Strauss Adjustable Skipping Rope','Strauss',199,399,'photo- sport'],
    ['sports','Yonex Mavis 350 Shuttlecock Pack','Yonex',699,999,'photo- badminton'],
    // Beauty (5)
    ['beauty','Minimalist 10% Niacinamide Serum','Minimalist',599,699,'photo-1608248543803-ba4f8c70ae0b'],
    ['beauty','Nivea Soft Moisturising Cream','Nivea',199,299,'photo-1608248543803-ba4f8c70ae0b'],
    ['beauty','Cetaphil Gentle Skin Cleanser','Cetaphil',399,499,'photo- skincare'],
    ['beauty','Lakme Eyeconic Kajal','Lakme',180,250,'photo- cosmetics'],
    ['beauty','The Derma Co Sunscreen SPF 50','The Derma Co',499,599,'photo- sunscreen'],
    // Stationery (5)
    ['stationery','Casio FX-991CW Scientific Calculator','Casio',1595,1995,'photo- calculator'],
    ['stationery','Classmate Long Notebook Pack of 6','Classmate',299,360,'photo- notebooks'],
    ['stationery','Parker Vector Roller Ball Pen','Parker',350,450,'photo- pen'],
    ['stationery','Faber-Castell Connector Pens Set','Faber-Castell',199,299,'photo- pens'],
    ['stationery','Amazon Basics Laptop Backpack','Amazon Basics',999,1499,'photo- backpack'],
    // More (5) — miscellaneous campus essentials
    ['more','Portronics MODESK Universal Mobile Stand','Portronics',299,499,'photo- mobile-stand'],
    ['more','Duracell AA Alkaline Batteries Pack of 4','Duracell',199,299,'photo- batteries'],
    ['more','Mi 10000mAh Power Bank','Xiaomi',999,1499,'photo- powerbank'],
    ['more','Safari Compact Cabin Trolley Bag','Safari',2499,3999,'photo- suitcase'],
    ['more','Amazon Basics Reusable Water-resistant Raincoat','Amazon Basics',699,999,'photo- raincoat'],
  ];
  const photoIds: Record<string,string> = {
    'photo- laptop':'photo-1496181133206-80ce9b88a853','photo- laptops':'photo-1496181133206-80ce9b88a853','photo- shirt':'photo-1521572163474-6864f9cf17ab','photo- women':'photo-1594633312681-425c7b97ccd1','photo- shoes':'photo-1542291026-7eec264c27ff','photo- footwear':'photo-1549298916-b41d501d3772','photo-150 dist':'photo-1505740420928-5e560c06d30e','photo- charger':'photo-1583394838336-acd977736f90','photo- storage':'photo-1558618666-fcd25c85cd64','photo- pillow':'photo-1631049307264-da0ec9d70304','photo- kettle':'photo-1570137928861-0c1a9c8f4f4a','photo- lamp':'photo-1507473885765-e6ed057f782c','photo- books':'photo-1544947950-fa07a98d237f','photo- basketball':'photo-1546519638-68e109498ffc','photo- football':'photo-1579952363873-27f3bade9f55','photo- yoga':'photo-1592432678016-e910b452f9a2','photo- sport':'photo-1517836357463-d25dfeac3438','photo- badminton':'photo-1626224583764-f87db24ac4ea','photo- skincare':'photo-1608248543803-ba4f8c70ae0b','photo- cosmetics':'photo-1522335789203-aabd1fc54bc9','photo- sunscreen':'photo-1556229010-6c3f2c9ca5f8','photo- calculator':'photo-1587145820266-a5951ee6f620','photo- notebooks':'photo-1531346878377-a5be20888e57','photo- pen':'photo-1583485088034-697b5bc54ccd','photo- pens':'photo-1513364776144-60967b0f800f','photo- backpack':'photo-1553062407-98eeb64c6a62','photo- mobile-stand':'photo-1583394838336-acd977736f90','photo- batteries':'photo-1599599810694-b5b37304c041','photo- powerbank':'photo-1609091839311-d5365f9ff1c5','photo- suitcase':'photo-1565026057447-bc90a3d2b3d3','photo- raincoat':'photo-1523381210434-271e8be1f52b'
  };
  const generated = catalog.map(([category,name,brand,price,originalPrice,photo], i) => {
    const image = `https://images.unsplash.com/${photoIds[photo] || photo}?auto=format&fit=crop&w=800&q=80`;
    return { sku: `CM-${String(i+1).padStart(3,'0')}`, name, shortDesc: `${brand} ${name} · Student-friendly price`, category, brand, price, originalPrice, discountPercent: Math.round((1-price/originalPrice)*100), rating: Number((4.2 + (i%7)*0.1).toFixed(1)), reviewCount: 35 + i*13, image, gallery: [image], isBestSeller: i%5===0, isDealOfTheDay: i%9===0, isFlashDeal: i%7===0, isRecommended: i%3===0, specs: { Brand: brand, Condition: 'Brand New' }, highlights: ['Product details and price shown for catalogue setup', 'Seller-managed listing', 'Stock status shown at checkout'], colors: ['As shown'], stock: 8 + (i%25), soldCount: `${12+i*3} sold`, listingStatus: 'active', condition: 'Brand New' };
  });
  for (const product of generated) await Product.updateOne({ sku: product.sku }, { $setOnInsert: product, $set: { sellerId: seller._id } }, { upsert: true, setDefaultsOnInsert: false });
  // Keep the original catalogue items visible and manageable by the same configured seller.
  for (const p of PRODUCTS) {
    const image = p.image || '';
    await Product.updateOne({ sku: p.id }, { $setOnInsert: { sku:p.id, name:p.name, shortDesc:p.shortDesc||'', category:p.category, brand:p.brand||'', price:p.price, originalPrice:p.originalPrice, discountPercent:p.discountPercent||0, rating:p.rating||0, reviewCount:p.reviewCount||0, image, gallery:p.gallery||[], isBestSeller:p.isBestSeller, isDealOfTheDay:p.isDealOfTheDay, isFlashDeal:p.isFlashDeal, isRecommended:p.isRecommended, specs:p.specs||{}, highlights:p.highlights||[], colors:p.colors||[], stock:p.stock||0, soldCount:p.soldCount||'0', condition:'Brand New' }, $set: { sellerId:seller._id } }, { upsert:true, setDefaultsOnInsert: false });
  }
  // Normalize legacy floating-point ratings and repair only products whose image is missing.
  const existingProducts = await Product.find({}).select('_id rating image category').lean();
  const fallbackByCategory: Record<string, string> = {
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
  for (const item of existingProducts) {
    const update: Record<string, unknown> = {};
    if (Number.isFinite(Number(item.rating))) update.rating = Number(Number(item.rating).toFixed(1));
    if (typeof item.image !== 'string' || !item.image.trim()) update.image = fallbackByCategory[String(item.category || 'more')] || fallbackByCategory.more;
    if (Object.keys(update).length) await Product.updateOne({ _id: item._id }, { $set: update });
  }
  console.log(`Catalogue ready: ${catalog.length} new starter listings plus ${PRODUCTS.length} existing catalogue items; assigned to ${sellerEmail}.`);
  for (const [i, c] of CATEGORIES_DATA.entries()) {
    await Category.updateOne({ slug: c.id }, { $setOnInsert: { slug: c.id, name: c.name, sortOrder: i, isActive: true } }, { upsert: true, setDefaultsOnInsert: false });
  }
  console.log(`Verified ${CATEGORIES_DATA.length} marketplace categories.`);
  const coupons = [
    { code: 'CAMPUS2024', type: 'fixed', value: 500, minOrderAmount: 0, isActive: true },
    { code: 'STUDENT10', type: 'fixed', value: 800, minOrderAmount: 0, isActive: true },
    { code: 'DIWALI50', type: 'fixed', value: 1200, minOrderAmount: 0, isActive: true },
  ];
  for (const coupon of coupons) await Coupon.updateOne({ code: coupon.code }, { $setOnInsert: coupon }, { upsert: true });
  console.log('Seeded starter coupons.');
} finally { await mongoose.disconnect(); }
