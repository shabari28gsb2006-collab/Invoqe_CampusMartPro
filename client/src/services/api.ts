const API_BASE = (import.meta.env.VITE_API_BASE_URL || (import.meta.env.DEV ? 'http://localhost:4000' : '')).replace(/\/$/, '');
const SESSION_KEY = 'campusmart-session-id';

function sessionId(): string {
  try {
    let id = localStorage.getItem(SESSION_KEY);
    if (!id) {
      id = `guest_${crypto.randomUUID()}`;
      localStorage.setItem(SESSION_KEY, id);
    }
    return id;
  } catch {
    return 'guest-session';
  }
}

export const apiEnabled = Boolean(API_BASE);
export const apiSessionId = sessionId();

export async function apiRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  if (!API_BASE) throw new Error('API is not configured. Set VITE_API_BASE_URL in .env.local.');
  const headers = new Headers(init.headers);
  if (!headers.has('Content-Type')) headers.set('Content-Type', 'application/json');
  headers.set('X-Session-Id', apiSessionId);
  if (typeof sessionStorage !== 'undefined') {
    const token = sessionStorage.getItem('campusmart-access-token');
    const adminToken = sessionStorage.getItem('campusmart-admin-token');
    if (token) headers.set('Authorization', `Bearer ${token}`);
    if (adminToken) headers.set('Authorization', `Bearer ${adminToken}`);
  }
  const response = await fetch(`${API_BASE}${path}`, {
    ...init,
    headers,
    credentials: 'include',
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || `Request failed (${response.status})`);
  return payload as T;
}

export interface ApiOrderInput {
  items: { productId: string; quantity: number; selectedColor?: string }[];
  couponCode?: string | null;
  deliveryAddress: {
    name: string; phone: string; addressLine: string; city: string; state: string; pincode: string;
    college?: string; hostel?: string; room?: string;
  };
  paymentMethod: 'cod' | 'upi' | 'razorpay';
}

export interface ApiOrderResult {
  order: {
    id: string; orderNumber: string; status: string; totalAmount: number; createdAt: string;
    items: { productId: string; name: string; quantity: number; unitPrice: number; image?: string }[];
  };
}
