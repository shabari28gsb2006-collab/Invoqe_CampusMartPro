export type CouponPricing = {
  type: 'fixed' | 'percent';
  value: number;
  maxDiscount?: number | null;
  minOrderAmount?: number | null;
};

export function calculateCouponDiscount(subtotal: number, coupon: CouponPricing): number {
  if (!Number.isFinite(subtotal) || subtotal < 0) throw new Error('Subtotal must be a non-negative number');
  if (!Number.isFinite(coupon.value) || coupon.value < 0) throw new Error('Coupon value must be non-negative');
  const raw = coupon.type === 'percent'
    ? Math.min(Math.round(subtotal * coupon.value / 100), coupon.maxDiscount ?? Number.MAX_SAFE_INTEGER)
    : coupon.value;
  return Math.max(0, Math.min(subtotal, raw));
}

export function isCouponEligible(input: {
  subtotal: number; minOrderAmount?: number | null; startsAt?: Date | null; endsAt?: Date | null;
  now?: Date; isActive: boolean; usageLimit?: number | null; usedCount: number;
}): boolean {
  const now = input.now ?? new Date();
  return input.isActive
    && Number.isFinite(input.subtotal) && input.subtotal >= (input.minOrderAmount ?? 0)
    && (!input.startsAt || now.getTime() >= input.startsAt.getTime())
    && (!input.endsAt || now.getTime() <= input.endsAt.getTime())
    && (input.usageLimit == null || input.usedCount < input.usageLimit);
}
