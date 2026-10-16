import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Store, 
  GraduationCap, 
  X, 
  CheckCircle2, 
  Key, 
  ArrowRight,
  AlertCircle
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { apiEnabled, apiRequest } from '../../services/api';

interface PortalAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'seller' | 'admin';
}

export const PortalAuthModal: React.FC<PortalAuthModalProps> = ({
  isOpen,
  onClose,
  initialTab = 'seller'
}) => {
  const { setPortalMode, showToast } = useShop();
  const [activeTab, setActiveTab] = useState<'seller' | 'admin'>(initialTab);

  // Seller Form State
  const [sellerEmail, setSellerEmail] = useState('');
  const [sellerRoll, setSellerRoll] = useState('');

  // Admin Form State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminKey, setAdminKey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSellerLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setErrorMsg('');
    if (!apiEnabled) { setErrorMsg('Backend API is not configured.'); return; }
    try {
      const auth = await apiRequest<{ token: string }>('/api/v1/auth/portal/login', { method: 'POST', body: JSON.stringify({ role: 'seller', username: sellerEmail.trim(), password: sellerRoll }) });
      sessionStorage.setItem('campusmart-access-token', auth.token);
      sessionStorage.setItem('campusmart-portal-role', 'seller');
      window.history.replaceState({}, '', '/seller');
      showToast('Seller credentials verified.'); setPortalMode('seller'); onClose();
    } catch (error) { setErrorMsg(error instanceof Error ? error.message : 'Seller sign-in failed.'); }
  };

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault(); setErrorMsg('');
    if (!apiEnabled) { setErrorMsg('Backend API is not configured.'); return; }
    try {
      const auth = await apiRequest<{ token: string }>('/api/v1/auth/portal/login', { method: 'POST', body: JSON.stringify({ role: 'admin', username: adminEmail.trim(), password: adminKey }) });
      sessionStorage.setItem('campusmart-admin-token', auth.token);
      sessionStorage.setItem('campusmart-portal-role', 'admin');
      window.history.replaceState({}, '', '/admin');
      showToast('Admin credentials verified.'); setPortalMode('admin'); onClose();
    } catch (error) { setErrorMsg(error instanceof Error ? error.message : 'Admin sign-in failed.'); }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-gray-100 overflow-hidden relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-700 transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-6 pb-5">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              Enterprise Portal Authentication
            </h3>
          </div>
          <p className="text-xs text-slate-400">
            Secure single-sign-on for verified university sellers and marketplace administrators.
          </p>

          {/* Tab Switcher */}
          <div className="mt-4 grid grid-cols-2 p-1 bg-slate-800 rounded-xl gap-1">
            <button
              onClick={() => {
                setActiveTab('seller');
                setErrorMsg('');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'seller'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Store className="w-3.5 h-3.5" />
              <span>Student Seller Hub</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('admin');
                setErrorMsg('');
              }}
              className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                activeTab === 'admin'
                  ? 'bg-[#2874F0] text-white shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Admin Console</span>
            </button>
          </div>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {activeTab === 'seller' ? (
            <form onSubmit={handleSellerLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Seller username
                </label>
                <input
                  type="text"
                  autoComplete="username"
                  value={sellerEmail}
                  onChange={(e) => setSellerEmail(e.target.value)}
                  placeholder="seller@campusmart"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Password
                  </label>
                  <input
                    type="password"
                    autoComplete="current-password"
                    value={sellerRoll}
                    onChange={(e) => setSellerRoll(e.target.value)}
                    placeholder="Enter seller password"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-hidden focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                    required
                  />
                </div>

              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Authorize & Open Seller Hub</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Admin username
                </label>
                <input
                  type="text"
                  autoComplete="username"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@campusmart"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-hidden focus:border-[#2874F0] focus:ring-2 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <Key className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="Enter admin password"
                    className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-gray-200 text-xs font-semibold focus:outline-hidden focus:border-[#2874F0] focus:ring-2 focus:ring-blue-100 font-mono"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-[#2874F0] hover:bg-[#1254C2] text-white font-bold text-xs shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <span>Authenticate Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <div className="mt-5 pt-4 border-t border-gray-100 flex items-center justify-center text-[11px] text-gray-400 gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-Bit SSL Encrypted Campus Infrastructure</span>
          </div>
        </div>
      </div>
    </div>
  );
};
