import { createHmac, timingSafeEqual } from 'node:crypto';

export type AuthRole = 'seller' | 'admin' | 'customer';
type TokenPayload = { sub: string; role: AuthRole; exp: number };

export function createAccessToken(userId: string, secret: string, role: AuthRole = 'seller'): string {
  const payload: TokenPayload = { sub: userId, role, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8 };
  const encoded = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = createHmac('sha256', secret).update(encoded).digest('base64url');
  return `${encoded}.${signature}`;
}

export function verifyAccessToken(token: string, secret: string): TokenPayload | null {
  const [encoded, supplied, extra] = token.split('.');
  if (!encoded || !supplied || extra) return null;
  const expected = createHmac('sha256', secret).update(encoded).digest();
  let actual: Buffer;
  try { actual = Buffer.from(supplied, 'base64url'); } catch { return null; }
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) return null;
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString()) as TokenPayload;
    if (!['seller','admin','customer'].includes(payload.role) || !payload.sub || payload.exp <= Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch { return null; }
}
