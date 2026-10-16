# CampusMart Pro API

Node.js + Express + TypeScript + MongoDB/Mongoose API for the existing CampusMart React UI.

## Setup

1. Install Node.js 20+.
2. Create `server/.env` manually using `server/.env.example` as a reference.
3. Set `MONGODB_URI` to a disposable MongoDB database. For Atlas, allow the machine running the API in Network Access. If `mongodb+srv://...` fails specifically with `querySrv ECONNREFUSED`, copy the standard non-SRV `mongodb://...` connection string from Atlas Connect → Drivers (if Atlas offers it for your cluster) and use that exact host list/replica-set options. Do not guess shard hostnames or commit credentials.
4. Set `SESSION_SECRET` to a random value with at least 32 characters. Set `CLIENT_ORIGIN=http://localhost:3000`.
5. From the repository root, run `npm --prefix server install`.
6. Seed the starter catalogue and coupon codes with `npm --prefix server run seed`.
7. Start the API with `npm --prefix server run dev`.
8. The frontend defaults to `http://localhost:4000` during development and falls back to the local catalogue if no database products are returned. Configure a real MongoDB Atlas connection in `server/.env`, then run `npm run seed` from `server/` once to populate starter products/categories. A custom API URL can be set in `client/.env.local` with `VITE_API_BASE_URL=http://localhost:4000`. Run the frontend from `client/` with `npm run dev`.

The API starts even when MongoDB is unavailable so health checks remain usable; database-backed endpoints return HTTP 503 until MongoDB connects. If `MONGODB_URI` is blank or still contains example placeholders, the server will not attempt a connection. Configure a real URI in `server/.env`; transient connection failures are retried every 15 seconds. A development-only session secret is used when no secret is supplied, but set a strong random `SESSION_SECRET` before production. Do not use a production database for first-run testing.

## Main endpoints

- `POST /api/v1/auth/portal/login` (seller/admin demo credentials from environment)
- `POST /api/v1/auth/customer/register`, `POST /api/v1/auth/customer/login`, `GET/PATCH /api/v1/auth/customer/me`
- `GET /api/v1/health/live`, `GET /api/v1/health/ready`
- `GET /api/v1/products`, `GET /api/v1/products/:id`, `GET /api/v1/categories`
- `GET/PUT /api/v1/cart`, `GET/PUT /api/v1/wishlist`
- `POST /api/v1/coupons/validate`
- `POST /api/v1/orders`, `GET /api/v1/orders`, `GET /api/v1/orders/:orderNumber/track`
- `GET/POST /api/v1/addresses`
- `GET/POST/PATCH/DELETE /api/v1/seller/products`
- `GET /api/v1/admin/overview`, `GET/PATCH /api/v1/admin/products`, `PATCH /api/v1/admin/orders/:id/status`
- `POST /api/v1/uploads/cloudinary-signature`

Guest cart, wishlist, order and address endpoints require an `X-Session-Id` header beginning with `guest_`; the frontend creates and persists this automatically. Seller routes require a signed, eight-hour bearer token with the seller role. The internship demo portal login at `/api/v1/auth/portal/login` checks `SELLER_USERNAME`/`SELLER_PASSWORD` or `ADMIN_USERNAME`/`ADMIN_PASSWORD` from `server/.env`; admin routes require a signed token with the admin role. Customer registration/login uses bcrypt-hashed passwords and signed, expiring tokens. The static portal credentials are development-only and must be replaced before public deployment.

## Order / inventory behavior

Checkout recalculates prices from MongoDB, validates coupon eligibility, atomically decrements stock per product, creates the order, and restores reserved stock if order creation fails. For multi-document guarantees under concurrent failures, use a MongoDB replica set and transaction-backed checkout before production. Payment methods currently record the requested method and pending payment status; no real payment is charged. Configure and verify a provider webhook before enabling online payments.

## Configuration and production checklist

- Configure email/SMS OTP provider and real user authentication before production; no production OTP delivery is configured in this build.
- Configure Cloudinary values to enable signed uploads.
- Configure a payment provider and signature-verified webhooks before accepting payments.
- Replace guest-session seller ownership with authenticated user ownership.
- Set `CLIENT_ORIGIN` to the exact production frontend origin, use HTTPS, secure cookies/session authentication, and rotate secrets.
- Add monitoring, backups, retention policy, integration tests and deployment-specific rate limits.
