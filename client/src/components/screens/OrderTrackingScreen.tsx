import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Check, 
  Truck, 
  Package, 
  Clock, 
  MapPin, 
  PhoneCall, 
  ShieldCheck,
  CheckCircle2,
  Calendar
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

export const OrderTrackingScreen: React.FC = () => {
  const { trackOrder, setActiveScreen, showToast } = useShop();
  const [isChangingAddress, setIsChangingAddress] = useState(false);
  const [hostelRoom, setHostelRoom] = useState('Room 214, Hostel 4, RIT Campus');
  const progress = Math.round((Math.min(trackOrder.currentStep + 1, trackOrder.steps.length) / trackOrder.steps.length) * 100);
  const statusLabel = trackOrder.status === 'delivered' ? 'Delivered' : trackOrder.status === 'shipped' ? 'In transit' : trackOrder.status === 'packed' ? 'Packed' : 'Order confirmed';

  const handleUpdateAddress = (e: React.FormEvent) => {
    e.preventDefault();
    setIsChangingAddress(false);
    showToast('Campus delivery point updated to: ' + hostelRoom);
  };

  return (
    <div className="max-w-3xl mx-auto pb-24 md:pb-16 pt-2 px-3 md:px-0">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
        <button 
          onClick={() => setActiveScreen('home')}
          className="p-1.5 rounded-full hover:bg-gray-100 text-gray-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Track Order</h2>
          <p className="text-xs text-gray-500">Live timeline & delivery tracking</p>
        </div>
      </div>

      {/* Order Status Card (Directly from Mobile Reference Screen 9) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs mb-5">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-wider text-blue-600 block">
              Order ID
            </span>
            <h3 className="text-sm sm:text-base font-extrabold text-slate-900">
              #{trackOrder.orderNumber}
            </h3>
            <span className="text-[11px] text-gray-400">
              Placed on {trackOrder.placedDate}
            </span>
          </div>

          <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            {statusLabel}
          </span>
        </div>

        <div className="mb-2">
          <div className="flex items-center justify-between text-xs mb-2"><span className="font-semibold text-slate-600">Shipment progress</span><span className="font-extrabold text-blue-700">{progress}%</span></div>
          <div className="h-2 rounded-full bg-slate-100 overflow-hidden"><div className="h-full rounded-full bg-gradient-to-r from-blue-600 to-emerald-500 transition-all duration-500" style={{ width: `${progress}%` }} /></div>
        </div>

        {/* Stepper Timeline (Placed -> Packed -> Shipped -> Delivered) */}
        <div className="py-6 px-2">
          <div className="relative flex justify-between items-center">
            {/* Background connecting bar */}
            <div className="absolute left-6 right-6 top-4 h-1 bg-gray-200 -z-0">
              <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${(trackOrder.currentStep / 3) * 100}%` }}></div>
            </div>

            {trackOrder.steps.map((step, idx) => {
              const isPast = idx < trackOrder.currentStep;
              const isCurrent = idx === trackOrder.currentStep;

              return (
                <div key={step.title} className="flex flex-col items-center relative z-10">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                      isPast
                        ? 'bg-emerald-600 text-white ring-4 ring-emerald-50'
                        : isCurrent
                        ? 'bg-blue-600 text-white ring-4 ring-blue-100 animate-pulse'
                        : 'bg-white border-2 border-gray-300 text-gray-400'
                    }`}
                  >
                    {isPast ? <Check className="w-4 h-4 stroke-[3]" /> : idx + 1}
                  </div>
                  <span
                    className={`text-xs font-bold mt-2 ${
                      isPast || isCurrent ? 'text-slate-900' : 'text-gray-400'
                    }`}
                  >
                    {step.title}
                  </span>
                  <span className="text-[10px] text-gray-400 mt-0.5 text-center max-w-[80px]">
                    {step.date.split(',')[0]}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Live Delivery Note */}
        <div className="bg-blue-50/80 border border-blue-100 rounded-xl p-3 flex items-center gap-3 text-xs text-blue-900">
          <Truck className="w-5 h-5 text-blue-600 shrink-0" />
          <div className="flex-1">
            <span className="font-bold">Next Milestone: Campus Hub Arrival</span>
            <p className="text-[11px] text-blue-700">Estimated delivery by tomorrow 04:00 PM to hostel reception</p><p className="text-[10px] text-blue-600 mt-1">Demo tracking timeline · carrier live updates require a courier API integration</p>
          </div>
        </div>
      </div>

      {/* Product Summary Card (From Mobile Reference Screen 9) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs mb-5">
        <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-3">
          Item in This Shipment
        </h4>
        <div className="flex gap-4">
          <div className="w-20 h-20 rounded-xl bg-gray-50 p-2 shrink-0 flex items-center justify-center">
            <img 
              src={trackOrder.product.image} 
              alt={trackOrder.product.name}
              className="w-full h-full object-contain mix-blend-multiply"
            />
          </div>

          <div className="flex-1 flex flex-col justify-between">
            <div>
              <span className="text-[10px] font-bold uppercase text-blue-600">{trackOrder.product.brand}</span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-800 line-clamp-1">
                {trackOrder.product.name}
              </h4>
              <p className="text-[11px] text-gray-400 mt-0.5">{trackOrder.product.shortDesc}</p>
            </div>

            <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-50 text-xs">
              <span className="text-gray-500">Qty: <strong className="text-slate-800">{trackOrder.quantity}</strong></span>
              <span className="font-bold text-slate-900 text-sm">
                ₹{trackOrder.totalPrice.toLocaleString('en-IN')}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delivery Address Card (From Mobile Reference Screen 9) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-2xs">
        <div className="flex items-center justify-between mb-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span>Delivery Address</span>
          </h4>
          <button
            onClick={() => setIsChangingAddress(!isChangingAddress)}
            className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
          >
            {isChangingAddress ? 'Cancel' : 'Change'}
          </button>
        </div>

        {isChangingAddress ? (
          <form onSubmit={handleUpdateAddress} className="mt-3 space-y-2">
            <input
              type="text"
              value={hostelRoom}
              onChange={(e) => setHostelRoom(e.target.value)}
              placeholder="Hostel, Block, Room Number"
              className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:outline-hidden focus:border-blue-500"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-blue-600 text-white rounded-lg text-xs font-bold"
            >
              Update Drop Point
            </button>
          </form>
        ) : (
          <div className="text-xs text-gray-600 space-y-0.5">
            <p className="font-bold text-slate-800">{trackOrder.deliveryAddress.name}</p>
            <p>{hostelRoom}</p>
            <p>{trackOrder.deliveryAddress.addressLine}</p>
            <p>{trackOrder.deliveryAddress.city}, {trackOrder.deliveryAddress.state} - {trackOrder.deliveryAddress.pincode}</p>
          </div>
        )}
      </div>
    </div>
  );
};
