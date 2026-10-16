# CampusMart Pro — separate frontend and backend

The project is organized into two independent applications:

- `client/` — React + TypeScript + Vite storefront (port 3000)
- `server/` — Node.js + Express + TypeScript + MongoDB/Mongoose API (port 4000)

## Requirements

Install Node.js 20.19+ (Node.js 22 LTS recommended).

## 1. Start the backend

Open a terminal in the project root and run:

```powershell
cd server
npm install
```

Create `server/.env` manually using `server/.env.example` as a reference. Configure your working `MONGODB_URI` and a unique `SESSION_SECRET` (32+ random characters) in `server/.env` to enable database-backed features. The example file contains demo credentials for the internship task; these must be changed before public deployment. The API can start without MongoDB for health checks, but database routes return HTTP 503 until connected. Then run:

```powershell
npm run dev
```

Before starting the API the first time, run `npm run seed` once from `server/` to insert the starter catalogue and categories into your configured database. Then start the API with `npm run dev`. The API runs on port 4000. Keep this terminal open.

## 2. Start the frontend

Open a second terminal in the project root:

```powershell
cd client
npm install
npm run dev
```

In development, the client defaults to `http://localhost:4000` and uses the local sample catalogue if the database has no products. For a custom API URL, create `client/.env.local` with `VITE_API_BASE_URL=http://localhost:4000`. Open `http://localhost:3000`. Restart Vite after changing environment variables.

## Build checks

Frontend (from `client/`): `npm run lint` and `npm run build`

Backend (from `server/`): `npm run build` and `npm test`

## Important limitations

This is not production-verified in this environment. Configure a test database before running seeds or integration tests. Email OTP delivery and online payment processing are not fully enabled just by adding credentials; review `server/README.md` before production. Do not commit `client/.env.local` or `server/.env`.


## Demo portal login (internship project)

Backend-only credentials are configured in `server/.env` (copy values from `.env.example` manually):
- Seller: `seller@campusmart` / `seller`
- Admin: `admin@campusmart` / `admin`

The credentials are read only from `server/.env` (`SELLER_USERNAME`, `SELLER_PASSWORD`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`). Set all four variables using the example file; the backend does not hardcode fallback credentials. Production startup rejects these demo values.

Login URLs: `http://localhost:3000/seller/login` and `http://localhost:3000/admin/login`.
The backend validates these values and issues a signed, expiring token. Change all demo credentials and `SESSION_SECRET` before any public deployment. Customer registration/login is stored in MongoDB with bcrypt-hashed passwords and signed expiring tokens. Basic profile fields sync to the customer API; address and payment preference remain browser-local demo settings, and no payment is processed.


## Deployment checklist (internship demo)

- **Frontend:** deploy `client/` as a Vite static site (for example, Vercel or Netlify). Set `VITE_API_BASE_URL` to the deployed API URL at build time.
- **Backend:** deploy `server/` as a Node service (for example, Render). Build command: `npm install && npm run build`; start command: `npm start`.
- Set backend environment variables on the hosting provider: `NODE_ENV=production`, `PORT` (provided by the host), `MONGODB_URI`, a unique `SESSION_SECRET` (32+ random characters), `CLIENT_ORIGIN` (your exact deployed frontend origin), and custom `SELLER_USERNAME`, `SELLER_PASSWORD`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`. Do not upload `.env` files or put backend secrets in Vite variables.
- Run `npm run seed` once from `server/` only after configuring the intended database.
- Use HTTPS and a separate test database before demo day. This project does not charge real payments; Razorpay credentials alone do not complete payment integration. Email OTP, seller campaigns, some analytics/review/customer panels, and some address/payment preference features are still demo/local-only. Do not present these as production integrations.
