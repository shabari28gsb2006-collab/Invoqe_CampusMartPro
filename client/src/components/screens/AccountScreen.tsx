import React, { useEffect, useState } from 'react';
import { 
  User, 
  Package, 
  Truck, 
  RotateCcw, 
  XCircle, 
  MapPin, 
  CreditCard, 
  Globe, 
  HelpCircle, 
  Info, 
  LogOut, 
  ChevronRight, 
  Edit3,
  Sparkles,
  ShieldCheck,
  Check
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useTheme } from '../../context/ThemeContext';
import { apiEnabled, apiRequest } from '../../services/api';

export const AccountScreen: React.FC = () => {
  const { setActiveScreen, wishlistIds, showToast, setPortalMode } = useShop();
  const { setIsThemeStudioOpen, currentThemeConfig } = useTheme();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileName, setProfileName] = useState(() => localStorage.getItem('campusmart-profile-name') || 'Student');
  const [profileEmail, setProfileEmail] = useState(() => localStorage.getItem('campusmart-profile-email') || '');
  const [profileRoll, setProfileRoll] = useState(() => localStorage.getItem('campusmart-profile-roll') || '');
  const [profileCollege, setProfileCollege] = useState(() => localStorage.getItem('campusmart-profile-college') || '');
  const [settingsModal, setSettingsModal] = useState<'address'|'payment'|null>(null);
  const [address, setAddress] = useState(() => localStorage.getItem('campusmart-profile-address') || '');
  const [paymentPreference, setPaymentPreference] = useState(() => localStorage.getItem('campusmart-payment-preference') || 'Cash on Delivery');
  const [authMode, setAuthMode] = useState<'login'|'register'>('register');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authMessage, setAuthMessage] = useState('');
  const [authBusy, setAuthBusy] = useState(false);
  const [customerSignedIn, setCustomerSignedIn] = useState(() => Boolean(sessionStorage.getItem('campusmart-access-token') && sessionStorage.getItem('campusmart-portal-role') === 'customer'));

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('campusmart-profile-name', profileName.trim());
    localStorage.setItem('campusmart-profile-email', profileEmail.trim());
    localStorage.setItem('campusmart-profile-roll', profileRoll.trim());
    localStorage.setItem('campusmart-profile-college', profileCollege.trim());
    const token = sessionStorage.getItem('campusmart-access-token');
    if (apiEnabled && token) { try { await apiRequest('/api/v1/auth/customer/me', { method: 'PATCH', body: JSON.stringify({ name: profileName.trim(), email: profileEmail.trim() }) }); } catch (error) { showToast(error instanceof Error ? error.message : 'Profile saved locally; server update failed.'); return; } }
    setIsEditingProfile(false);
    showToast(token ? 'Campus profile saved to your account.' : 'Campus profile saved on this device.');
  };

  const handleCustomerAuth = async (e: React.FormEvent) => {
    e.preventDefault(); setAuthMessage('');
    if (!apiEnabled) { setAuthMessage('Backend is not configured. Set VITE_API_BASE_URL in client/.env.local and restart the frontend.'); return; }
    setAuthBusy(true);
    try {
      const path = authMode === 'register' ? '/api/v1/auth/customer/register' : '/api/v1/auth/customer/login';
      const body = authMode === 'register' ? { name: authName, email: authEmail, password: authPassword } : { email: authEmail, password: authPassword };
      const result = await apiRequest<{token:string;user:{name:string;email:string;phone?:string}}> (path, { method: 'POST', body: JSON.stringify(body) });
      sessionStorage.setItem('campusmart-access-token', result.token); sessionStorage.setItem('campusmart-portal-role', 'customer');
      setCustomerSignedIn(true); setProfileName(result.user.name); setProfileEmail(result.user.email);
      localStorage.setItem('campusmart-profile-name', result.user.name); localStorage.setItem('campusmart-profile-email', result.user.email);
      setAuthPassword(''); setAuthMessage(''); showToast(authMode === 'register' ? 'Customer account created.' : 'Signed in successfully.');
    } catch (error) { setAuthMessage(error instanceof Error ? error.message : 'Could not authenticate.'); }
    finally { setAuthBusy(false); }
  };

  return (
    <div className="max-w-4xl mx-auto pb-24 md:pb-16 pt-2 px-3 md:px-0">
      <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-bold text-slate-900">Customer account</h2><p className="mt-1 text-xs text-slate-500">{customerSignedIn ? `Signed in as ${profileEmail || 'customer'}` : 'Create an account or sign in to store your profile in MongoDB.'}</p></div>{customerSignedIn && <button onClick={() => { sessionStorage.removeItem('campusmart-access-token'); sessionStorage.removeItem('campusmart-portal-role'); setCustomerSignedIn(false); showToast('Customer logged out.'); }} className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-rose-600">Log out</button>}</div>
        {!customerSignedIn && <><div className="mt-4 inline-flex rounded-xl bg-slate-100 p-1"><button type="button" onClick={() => {setAuthMode('register');setAuthMessage('')}} className={`rounded-lg px-3 py-2 text-xs font-bold ${authMode==='register'?'bg-white shadow-sm text-blue-700':'text-slate-500'}`}>Create account</button><button type="button" onClick={() => {setAuthMode('login');setAuthMessage('')}} className={`rounded-lg px-3 py-2 text-xs font-bold ${authMode==='login'?'bg-white shadow-sm text-blue-700':'text-slate-500'}`}>Sign in</button></div><form onSubmit={handleCustomerAuth} className="mt-4 grid gap-3 sm:grid-cols-2">{authMode==='register' && <label className="text-xs font-semibold text-slate-600">Full name<input required minLength={2} value={authName} onChange={e=>setAuthName(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"/></label>}<label className="text-xs font-semibold text-slate-600">Email<input type="email" required value={authEmail} onChange={e=>setAuthEmail(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm"/></label><label className="text-xs font-semibold text-slate-600">Password<input type="password" required minLength={authMode==='register'?8:1} value={authPassword} onChange={e=>setAuthPassword(e.target.value)} className="mt-1.5 w-full rounded-xl border border-slate-300 px-3 py-2.5 text-sm" placeholder={authMode==='register'?'At least 8 characters':'Your password'}/></label><div className="flex items-end"><button disabled={authBusy} className="w-full rounded-xl bg-blue-600 px-4 py-3 text-xs font-bold text-white disabled:opacity-60">{authBusy?'Please wait…':authMode==='register'?'Create account':'Sign in'}</button></div></form>{authMessage && <p role="alert" className="mt-3 rounded-lg bg-rose-50 p-3 text-xs text-rose-700">{authMessage}</p>}</>}
      </section>

      {/* Profile Header Card (Matches Mobile Screen 7 & Desktop Account View) */}
      <div 
        className="rounded-2xl p-6 text-white shadow-md relative overflow-hidden mb-6"
        style={{
          background: `linear-gradient(135deg, ${currentThemeConfig.primaryColor} 0%, #0F172A 100%)`
        }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md text-white font-black text-2xl flex items-center justify-center border-2 border-white/40 shadow-inner">
              {profileName.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold tracking-tight">{profileName}</h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-400/30">
                  Verified Student
                </span>
              </div>
              <p className="text-xs text-blue-100">{profileEmail}</p>
              <p className="text-[11px] text-blue-200/80 mt-0.5">{profileCollege} • Roll: {profileRoll}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-3.5 py-1.5 rounded-xl bg-white/20 hover:bg-white/30 text-white font-semibold text-xs backdrop-blur-xs transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
            </button>
            <button
              onClick={() => setIsThemeStudioOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-900 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Theme Studio</span>
            </button>
          </div>
        </div>
      </div>

      {/* Edit Profile Form if open */}
      {isEditingProfile && (
        <form onSubmit={handleSaveProfile} className="bg-white rounded-2xl border border-gray-200 p-5 shadow-xs mb-6 space-y-4">
          <h3 className="text-sm font-bold text-slate-900">Update Student Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-gray-500 mb-1 font-medium">Full Name</label>
              <input
                type="text"
                value={profileName}
                onChange={(e) => setProfileName(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2 focus:outline-hidden focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-500 mb-1 font-medium">College Email</label>
              <input
                type="email"
                value={profileEmail}
                onChange={(e) => setProfileEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2 focus:outline-hidden focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-500 mb-1 font-medium">University / College</label>
              <input
                type="text"
                value={profileCollege}
                onChange={(e) => setProfileCollege(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2 focus:outline-hidden focus:border-blue-500"
              />
            </div>
            <div>
              <label className="block text-gray-500 mb-1 font-medium">Roll Number</label>
              <input
                type="text"
                value={profileRoll}
                onChange={(e) => setProfileRoll(e.target.value)}
                className="w-full border border-gray-200 rounded-lg p-2 focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => setIsEditingProfile(false)}
              className="px-4 py-2 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-xs"
            >
              Save Changes
            </button>
          </div>
        </form>
      )}

      {/* 1. "My Orders" Row of 4 Icon Buttons (Directly from Mobile Reference Screen 7) */}
      <div className="bg-white rounded-2xl border border-gray-200 p-5 shadow-2xs mb-6">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800 mb-4">
          My Orders
        </h3>
        <div className="grid grid-cols-4 gap-2 text-center">
          <button 
            onClick={() => setActiveScreen('track-order')}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-2xs">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">All Orders</span>
            <span className="text-[10px] text-gray-400">1 Active</span>
          </button>

          <button 
            onClick={() => setActiveScreen('track-order')}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-2xs">
              <Truck className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Track Order</span>
            <span className="text-[10px] text-emerald-600 font-bold">In Transit</span>
          </button>

          <button 
            onClick={() => showToast('No active returns currently pending.')}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-2xs">
              <RotateCcw className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Returns</span>
            <span className="text-[10px] text-gray-400">0 Pending</span>
          </button>

          <button 
            onClick={() => showToast('No canceled orders')}
            className="flex flex-col items-center p-2 rounded-xl hover:bg-gray-50 transition-colors group cursor-pointer"
          >
            <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center mb-2 group-hover:scale-105 transition-transform shadow-2xs">
              <XCircle className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-800">Cancellations</span>
            <span className="text-[10px] text-gray-400">0 Total</span>
          </button>
        </div>
      </div>

      {/* 2. "Account Settings" Menu (Directly from Mobile Reference Screen 7 & Desktop Account) */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-2xs overflow-hidden divide-y divide-gray-100">
        <div className="p-4 bg-gray-50/50">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-800">
            Account Settings
          </h3>
        </div>

        <button 
          onClick={() => setSettingsModal('address')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-500" />
            <div>
              <span className="text-xs sm:text-sm font-semibold text-slate-800 block">Address Book</span>
              <span className="text-[11px] text-gray-400">{address || 'No saved delivery address'}</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        <button 
          onClick={() => setSettingsModal('payment')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <CreditCard className="w-5 h-5 text-gray-500" />
            <div>
              <span className="text-xs sm:text-sm font-semibold text-slate-800 block">Payment Methods</span>
              <span className="text-[11px] text-gray-400">Preferred: {paymentPreference}</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        <div className="w-full p-4 flex items-center justify-between text-left">
          <div className="flex items-center gap-3">
            <Globe className="w-5 h-5 text-gray-500" />
            <div>
              <span className="text-xs sm:text-sm font-semibold text-slate-800 block">Language</span>
              <span className="text-[11px] text-gray-400">Preferred app language</span>
            </div>
          </div>
          <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-md">English (India)</span>
        </div>

        <button 
          onClick={() => showToast('CampusMart Desk: Call 1800-CAMPUS or visit Admin Block Room 102')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <HelpCircle className="w-5 h-5 text-gray-500" />
            <div>
              <span className="text-xs sm:text-sm font-semibold text-slate-800 block">Help & Support</span>
              <span className="text-[11px] text-gray-400">24/7 dedicated campus student support</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        <button 
          onClick={() => showToast('CampusMart Pro v2.4 - Licensed for College Campuses')}
          className="w-full p-4 flex items-center justify-between text-left hover:bg-gray-50 transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-3">
            <Info className="w-5 h-5 text-gray-500" />
            <div>
              <span className="text-xs sm:text-sm font-semibold text-slate-800 block">About CampusMart</span>
              <span className="text-[11px] text-gray-400">Version 2.4.0 (Student Edition)</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </button>

        <button 
          onClick={() => { sessionStorage.removeItem('campusmart-access-token'); sessionStorage.removeItem('campusmart-admin-token'); sessionStorage.removeItem('campusmart-portal-role'); localStorage.removeItem('campusmart-customer-session'); setPortalMode('customer'); setActiveScreen('home'); showToast('You have been logged out.'); }}
          className="w-full p-4 flex items-center gap-3 text-left hover:bg-rose-50 transition-colors text-rose-600 font-bold text-xs sm:text-sm cursor-pointer"
        >
          <LogOut className="w-5 h-5" />
          <span>Log Out</span>
        </button>
      </div>
      {settingsModal && <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4"><form onSubmit={e => { e.preventDefault(); if (settingsModal === 'address') localStorage.setItem('campusmart-profile-address', address.trim()); else localStorage.setItem('campusmart-payment-preference', paymentPreference); showToast(settingsModal === 'address' ? 'Address saved on this device.' : 'Payment preference saved on this device.'); setSettingsModal(null); }} className="w-full max-w-md rounded-2xl bg-white p-5 shadow-2xl"><div className="mb-4 flex items-center justify-between"><h3 className="font-bold text-slate-900">{settingsModal === 'address' ? 'Address Book' : 'Payment Preference'}</h3><button type="button" onClick={() => setSettingsModal(null)} className="rounded-lg px-3 py-1 text-slate-500 hover:bg-slate-100">Close</button></div>{settingsModal === 'address' ? <label className="block text-sm font-medium">Delivery address<textarea value={address} onChange={e => setAddress(e.target.value)} rows={4} placeholder="Door / street, city, state and pincode" className="mt-2 w-full rounded-xl border border-slate-300 p-3" /></label> : <label className="block text-sm font-medium">Preferred payment method<select value={paymentPreference} onChange={e => setPaymentPreference(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 p-3"><option>Cash on Delivery</option><option>UPI (demo preference)</option><option>Card (demo preference)</option></select><p className="mt-2 text-xs text-slate-500">This saves your preference only. No payment provider is connected.</p></label>}<button className="mt-5 w-full rounded-xl bg-blue-600 py-3 font-bold text-white">Save</button></form></div>}
    </div>
  );
};
