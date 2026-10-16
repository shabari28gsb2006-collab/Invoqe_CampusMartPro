import React, { useState } from 'react';
import { ShieldCheck, Store, LockKeyhole, ArrowLeft, AlertCircle } from 'lucide-react';
import { apiRequest } from '../../services/api';
import { useShop } from '../../context/ShopContext';

type PortalRole = 'seller' | 'admin';
export const PortalLogin: React.FC<{ role: PortalRole }> = ({ role }) => {
  const { setPortalMode } = useShop();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const isAdmin = role === 'admin';
  const submit = async (event: React.FormEvent) => {
    event.preventDefault(); setError(''); setBusy(true);
    try {
      const result = await apiRequest<{token:string; role:PortalRole}>('/api/v1/auth/portal/login', { method:'POST', body:JSON.stringify({ role, username:username.trim(), password }) });
      if (role === 'admin') sessionStorage.setItem('campusmart-admin-token', result.token);
      else sessionStorage.setItem('campusmart-access-token', result.token);
      sessionStorage.setItem('campusmart-portal-role', role);
      window.history.replaceState({}, '', isAdmin ? '/admin' : '/seller');
      setPortalMode(role);
    } catch (e) { setError(e instanceof Error ? e.message : 'Sign in failed.'); }
    finally { setBusy(false); }
  };
  return <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10"><div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl"><div className={`p-7 text-white ${isAdmin?'bg-slate-900':'bg-gradient-to-br from-emerald-800 to-slate-900'}`}><button onClick={()=>{window.history.replaceState({}, '', '/');setPortalMode('customer');}} className="mb-6 inline-flex items-center gap-2 text-sm text-white/75 hover:text-white"><ArrowLeft size={16}/> Back to storefront</button><div className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">{isAdmin?<ShieldCheck size={25}/>:<Store size={25}/>}</div><h1 className="text-2xl font-black">{isAdmin?'Admin login':'Seller login'}</h1><p className="mt-2 text-sm text-white/70">CampusMart Pro · {isAdmin?'Administrator access':'Seller workspace'}</p></div><form onSubmit={submit} className="space-y-4 p-7"><label className="block text-sm font-semibold text-slate-700">Username<input required autoComplete="username" value={username} onChange={e=>setUsername(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder={isAdmin?'admin@campusmart':'seller@campusmart'}/></label><label className="block text-sm font-semibold text-slate-700">Password<input required type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} className="mt-2 w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100" placeholder="Enter password"/></label>{error&&<div role="alert" className="flex items-start gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700"><AlertCircle size={17} className="mt-0.5 shrink-0"/>{error}</div>}<button disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3.5 font-bold text-white transition hover:bg-blue-700 disabled:opacity-60"><LockKeyhole size={17}/>{busy?'Checking credentials…':'Sign in securely'}</button><p className="text-xs leading-5 text-slate-500">Credentials are checked by the backend. Do not use these demo credentials on a public production deployment.</p></form></div></main>;
};
