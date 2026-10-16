import test from 'node:test';
import assert from 'node:assert/strict';
import { createAccessToken, verifyAccessToken } from '../src/lib/auth.js';

test('seller access token verifies with the correct secret', () => {
  const token = createAccessToken('507f1f77bcf86cd799439011', 'a'.repeat(40));
  assert.equal(verifyAccessToken(token, 'a'.repeat(40))?.sub, '507f1f77bcf86cd799439011');
});
test('seller access token rejects the wrong secret and malformed values', () => {
  const token = createAccessToken('507f1f77bcf86cd799439011', 'a'.repeat(40));
  assert.equal(verifyAccessToken(token, 'b'.repeat(40)), null);
  assert.equal(verifyAccessToken('not-a-token', 'a'.repeat(40)), null);
});

test('admin and customer roles are preserved in signed tokens', () => {
  const secret = 'a'.repeat(40);
  for (const role of ['admin', 'customer'] as const) {
    const token = createAccessToken('507f1f77bcf86cd799439011', secret, role);
    assert.equal(verifyAccessToken(token, secret)?.role, role);
  }
});
