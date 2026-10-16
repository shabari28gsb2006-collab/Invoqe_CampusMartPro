import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Trash2, 
  Plus, 
  Minus, 
  ShieldCheck, 
  Tag, 
  ShoppingBag, 
  CheckCircle,
  Truck,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useTheme } from '../../context/ThemeContext';
import { apiEnabled, apiRequest, ApiOrderInput, ApiOrderResult } from '../../services/api';

export const CartScreen: React.FC = () => {
  const { 
    cartItems, 
    updateQuantity, 
    removeFromCart, 
    clearCart,
    appliedCoupon, 
    applyCoupon, 
    removeCoupon, 
    couponDiscount,
    setActiveScreen,
    viewProduct,
    showToast
  } = useShop();
  const { currentThemeConfig } = useTheme();

  const [couponInput, setCouponInput] = useState('');
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);

  // Price calculations matching reference style
  const totalMRP = cartItems.reduce((acc, item) => acc + (item.product.originalPrice * item.quantity), 0);
  const itemSellingPrice = cartItems.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);
  const catalogDiscount = totalMRP - itemSellingPrice;
  const deliveryCharges = 0; // Free for campus students
  const totalAmount = Math.max(0, itemSellingPrice - couponDiscount);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    applyCoupon(couponInput);
    setCouponInput('');
  };

  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [placedOrderNumber, setPlacedOrderNumber] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState({
    name: '', phone: '', addressLine: '', city: '', state: 'Tamil Nadu', pincode: '', college: '', hostel: '', room: '',
  });

  const handlePlaceOrder = async () => {
    if (isPlacingOrder) return;
    setIsPlacingOrder(true);
    try {
      if (apiEnabled) {
        if (!deliveryAddress.name.trim() || !deliveryAddress.phone.trim() || !deliveryAddress.addressLine.trim() ||
            !deliveryAddress.city.trim() || !deliveryAddress.state.trim() || !deliveryAddress.pincode.trim()) {
          showToast('Please complete all required delivery address fields.');
          return;
        }
        const orderInput: ApiOrderInput = {
          items: cartItems.map(item => ({ productId: item.product.id, quantity: item.quantity, selectedColor: item.selectedColor })),
          couponCode: appliedCoupon,
          deliveryAddress,
          paymentMethod: 'cod',
        };
        const response = await apiRequest<ApiOrderResult>('/api/v1/orders', { method: 'POST', body: JSON.stringify(orderInput) });
        setPlacedOrderNumber(response.order.orderNumber);
        showToast(`Order ${response.order.orderNumber} placed successfully`);
      } else {
        setPlacedOrderNumber(`CM${Date.now().toString().slice(-9)}`);
      }
      setIsOrderPlaced(true);
      setTimeout(() => {
        setIsCheckoutModalOpen(false);
        clearCart();
        setActiveScreen('track-order');
      }, 1800);
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Could not place order. Please retry.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  if (cartItems.length === 0 && !isOrderPlaced) {
    return (
      <div className="max-w-2xl mx-auto py-16 px-4 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-4">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h3 className="text-xl font-bold text-slate-800">Your Campus Cart is Empty</h3>
        <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
          Add laptops, electronics, campus shoes, books or dorm essentials to begin.
        </p>
        <button
          onClick={() => setActiveScreen('home')}
          className="mt-6 px-6 py-2.5 rounded-xl bg-blue-600 text-white font-bold text-xs hover:bg-blue-700 transition-colors shadow-md cursor-pointer"
        >
          Explore Campus Deals
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto pb-28 md:pb-16 pt-2 px-3 lg:px-8">
      {/* Screen Title & Back */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <button 
          onClick={() => setActiveScreen('home')}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">
            My Cart <span className="text-gray-400 font-normal text-sm">({cartItems.length} items)</span>
          </h2>
          <p className="text-xs text-gray-500 hidden sm:block">Campus Hostel Delivery address active</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Cart Items List */}
        <div className="lg:col-span-8 space-y-3.5">
          {cartItems.map((item) => (
            <div 
              key={item.product.id}
              className="bg-white rounded-2xl border border-gray-200 p-4 flex gap-4 relative shadow-2xs hover:border-gray-300 transition-all"
            >
              {/* Product Thumbnail */}
              <div 
                onClick={() => viewProduct(item.product)}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-xl bg-gray-50 p-2 shrink-0 flex items-center justify-center cursor-pointer"
              >
                <img 
                  src={item.product.image} 
                  alt={item.product.name}
                  className="w-full h-full object-contain mix-blend-multiply"
                />
              </div>

              {/* Product Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
                        {item.product.brand}
                      </span>
                      <h4 
                        onClick={() => viewProduct(item.product)}
                        className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1 hover:text-blue-600 cursor-pointer"
                      >
                        {item.product.name}
                      </h4>
                      {item.selectedColor && (
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Color: <span className="text-slate-600 font-medium">{item.selectedColor}</span>
                        </p>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-1.5 text-gray-400 hover:text-rose-600 transition-colors"
                      title="Remove Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Price & Stepper */}
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-gray-50">
                  <div className="flex items-baseline gap-2">
                    <span className="text-sm sm:text-base font-black text-slate-900">
                      ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] text-gray-400 line-through">
                      ₹{(item.product.originalPrice * item.quantity).toLocaleString('en-IN')}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1 py-0.5 rounded-xs">
                      {item.product.discountPercent}% OFF
                    </span>
                  </div>

                  {/* Quantity Stepper */}
                  <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 overflow-hidden">
                    <button
                      onClick={() => updateQuantity(item.product.id, -1)}
                      className="p-1.5 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="px-3 font-bold text-xs text-slate-800">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.product.id, 1)}
                      className="p-1.5 text-gray-600 hover:bg-gray-200 transition-colors cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Student Perks Banner inside Cart */}
          <div className="bg-blue-50/70 border border-blue-100 rounded-xl p-3.5 flex items-center justify-between text-xs text-blue-900">
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <div>
                <span className="font-bold">Campus Student Protection</span>
                <p className="text-[11px] text-blue-700">Verified student ID verified at hostel delivery</p>
              </div>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-white px-2 py-1 rounded-md shadow-2xs">
              FREE DELIVERY
            </span>
          </div>
        </div>

        {/* Right Column: Price Details & Coupon Breakdown */}
        <div className="lg:col-span-4 space-y-4">
          {/* Coupon Box */}
          <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5 mb-2.5">
              <Tag className="w-3.5 h-3.5 text-blue-600" />
              <span>Apply Campus Coupon</span>
            </h4>

            {appliedCoupon ? (
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 rounded-xl px-3 py-2 text-xs">
                <div>
                  <span className="font-bold text-emerald-800">{appliedCoupon}</span>
                  <span className="text-[11px] text-emerald-600 block">Saved ₹{couponDiscount}!</span>
                </div>
                <button
                  onClick={removeCoupon}
                  className="text-xs font-bold text-rose-600 hover:underline"
                >
                  Remove
                </button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="flex gap-2">
                <input
                  type="text"
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Enter CAMPUS2024 or STUDENT10"
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-800 focus:outline-hidden focus:border-blue-500 uppercase"
                />
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </form>
            )}
          </div>

          {/* Price Details Card (Matches Desktop Reference Lower Right) */}
          <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs space-y-3.5">
            <h3 className="text-sm font-bold text-slate-900 pb-2 border-b border-gray-100">
              Price Details
            </h3>

            <div className="space-y-2.5 text-xs text-gray-600">
              <div className="flex justify-between">
                <span>Total MRP</span>
                <span className="font-medium text-slate-800">₹{totalMRP.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-emerald-600 font-medium">
                <span>Catalog Discount</span>
                <span>- ₹{catalogDiscount.toLocaleString('en-IN')}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Coupon Discount ({appliedCoupon})</span>
                  <span>- ₹{couponDiscount.toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span className="font-bold text-emerald-600">FREE</span>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex justify-between items-baseline">
              <div>
                <span className="text-sm font-bold text-slate-900 block">Total Amount</span>
                <span className="text-[10px] text-gray-400">Including all discounts</span>
              </div>
              <span className="text-xl font-black text-slate-900">
                ₹{totalAmount.toLocaleString('en-IN')}
              </span>
            </div>

            <button
              onClick={() => setIsCheckoutModalOpen(true)}
              className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Proceed to Buy</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* CHECKOUT MODAL */}
      {isCheckoutModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl relative">
            {isOrderPlaced ? (
              <div className="text-center py-6">
                <CheckCircle className="w-16 h-16 text-emerald-600 mx-auto mb-3 animate-bounce" />
                <h3 className="text-xl font-black text-slate-900">Order Confirmed!</h3>
                <p className="text-xs text-gray-500 mt-1">
                  Order #{placedOrderNumber} placed successfully. Redirecting to Track Order...
                </p>
              </div>
            ) : (
              <div>
                <h3 className="text-base font-bold text-slate-900 mb-1">Confirm Campus Order</h3>
                <p className="text-xs text-gray-500 mb-4">Hostel delivery address confirmed</p>

                {apiEnabled ? (
                  <div className="bg-slate-50 p-3 rounded-xl border border-gray-100 mb-4 space-y-2">
                    <p className="text-[11px] font-bold text-slate-700">Delivery address</p>
                    <input aria-label="Recipient name" value={deliveryAddress.name} onChange={e => setDeliveryAddress(a => ({...a, name:e.target.value}))} placeholder="Full name *" className="w-full rounded-lg border border-gray-200 p-2 text-xs" />
                    <input aria-label="Phone number" value={deliveryAddress.phone} onChange={e => setDeliveryAddress(a => ({...a, phone:e.target.value}))} placeholder="Phone number *" className="w-full rounded-lg border border-gray-200 p-2 text-xs" />
                    <input aria-label="Address" value={deliveryAddress.addressLine} onChange={e => setDeliveryAddress(a => ({...a, addressLine:e.target.value}))} placeholder="House / hostel / street address *" className="w-full rounded-lg border border-gray-200 p-2 text-xs" />
                    <div className="grid grid-cols-2 gap-2">
                      <input aria-label="City" value={deliveryAddress.city} onChange={e => setDeliveryAddress(a => ({...a, city:e.target.value}))} placeholder="City *" className="min-w-0 rounded-lg border border-gray-200 p-2 text-xs" />
                      <input aria-label="State" value={deliveryAddress.state} onChange={e => setDeliveryAddress(a => ({...a, state:e.target.value}))} placeholder="State *" className="min-w-0 rounded-lg border border-gray-200 p-2 text-xs" />
                    </div>
                    <input aria-label="Postal code" value={deliveryAddress.pincode} onChange={e => setDeliveryAddress(a => ({...a, pincode:e.target.value}))} placeholder="PIN / postal code *" className="w-full rounded-lg border border-gray-200 p-2 text-xs" />
                    <div className="text-[10px] text-blue-600 font-semibold">Delivery estimate appears after the seller confirms the order.</div>
                  </div>
                ) : (
                  <div className="bg-slate-50 p-3 rounded-xl border border-gray-100 mb-4 text-xs">
                    <div className="font-bold text-slate-800">Demo checkout preview</div>
                    <div className="text-gray-500 mt-0.5">Configure the API to place a persisted order with a delivery address.</div>
                  </div>
                )}

                <div className="border-t border-b border-gray-100 py-3 mb-4 text-xs space-y-1.5">
                  <div className="flex justify-between text-gray-600">
                    <span>Items Total ({cartItems.length}):</span>
                    <span>₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>Payment Method:</span>
                    <span className="text-emerald-700">Cash on Delivery</span>
                  </div>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={() => setIsCheckoutModalOpen(false)}
                    className="flex-1 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => void handlePlaceOrder()}
                    disabled={isPlacingOrder}
                    className="flex-1 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md"
                  >
                    Confirm & Place Order
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
