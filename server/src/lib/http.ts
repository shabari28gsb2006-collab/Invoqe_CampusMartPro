import type { Request, Response, NextFunction } from 'express';
export function sessionKey(req: Request): string {
  const value = String(req.header('x-session-id') || '');
  if (!/^guest_[a-zA-Z0-9_-]{8,100}$/.test(value)) throw Object.assign(new Error('A valid X-Session-Id header is required'), { status: 400 });
  return value;
}
export function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>) {
  return (req: Request, res: Response, next: NextFunction) => Promise.resolve(fn(req, res, next)).catch(next);
}
export function safeText(value: unknown, max = 200): string {
  return String(value ?? '').trim().slice(0, max);
}
