import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCouponDiscount, isCouponEligible } from '../src/lib/pricing.js';

test('fixed coupon discount is capped at subtotal', () => {
  assert.equal(calculateCouponDiscount(250, { type: 'fixed', value: 500 }), 250);
});
test('percentage coupon applies max discount', () => {
  assert.equal(calculateCouponDiscount(10_000, { type: 'percent', value: 25, maxDiscount: 1_000 }), 1_000);
});
test('coupon is rejected below minimum order amount', () => {
  assert.equal(isCouponEligible({ subtotal: 499, minOrderAmount: 500, isActive: true, usedCount: 0 }), false);
});
test('coupon eligibility respects expiry and usage limit', () => {
  const now = new Date('2026-10-16T00:00:00Z');
  assert.equal(isCouponEligible({ subtotal: 1000, startsAt: new Date('2026-10-01'), endsAt: new Date('2026-10-15'), isActive: true, usedCount: 0, now }), false);
  assert.equal(isCouponEligible({ subtotal: 1000, usageLimit: 2, usedCount: 2, isActive: true, now }), false);
});
