# CampusMart Pro — Vercel deployment (Free/Hobby)

This repository is configured for a single Vercel project: the Vite frontend is built as static assets and the Express API is exposed as a Vercel Node.js Function at `/api/*`.

## Before deploying

1. Push the contents of this folder to a GitHub repository.
2. Import that repository into Vercel. Keep the project root at the repository root (where `vercel.json` lives).
3. Add the environment variables below in Vercel → Project → Settings → Environment Variables for **Production** (and Preview if needed).
4. Deploy. Then check `/api/v1/health/live` and `/api/v1/health/ready` on your Vercel domain.

## Required backend environment variables

- `NODE_ENV=production`
- `MONGODB_URI=mongodb+srv://.../campusMart?retryWrites=true&w=majority` (use the exact database casing that exists in Atlas; URL-encode special characters in the password)
- `SESSION_SECRET=` a unique random string of at least 32 characters
- `CLIENT_ORIGIN=https://YOUR-PROJECT.vercel.app`
- `SELLER_USERNAME=` a custom seller login username/email
- `SELLER_PASSWORD=` a strong unique seller password
- `ADMIN_USERNAME=` a custom admin login username/email
- `ADMIN_PASSWORD=` a strong unique admin password
- `CLOUDINARY_CLOUD_NAME=` your Cloudinary cloud name
- `CLOUDINARY_API_KEY=` your Cloudinary API key
- `CLOUDINARY_API_SECRET=` your Cloudinary API secret

Set `CLIENT_ORIGIN` to the deployed Vercel URL exactly, with no trailing slash. If using Preview deployments, add the relevant Preview origin or use a separately managed preview environment. Never put server secrets in `client/.env` or variables beginning with `VITE_`.

## Frontend API URL

The frontend defaults to same-origin API requests in production, so do **not** set `VITE_API_BASE_URL` for this single-domain Vercel setup. Locally, `client/.env.local` can use `VITE_API_BASE_URL=http://localhost:4000`.

## Seed catalogue

Run the seed script from your local machine only after reviewing it and configuring `server/.env`:

```sh
cd server
npm install
npm run seed
```

Do not run seeding on every deployment. The deployed serverless app uses the same MongoDB Atlas database. Keep the database's existing name/casing and back up important data before seeding.

## Important free-tier limits and production notes

- Vercel Functions are stateless and may cold-start. MongoDB connection is opened lazily and reused while the function instance remains warm.
- Cloudinary should receive images directly via the signed-upload flow; do not send large image binaries through the API JSON body.
- Free/Hobby quotas, function duration, build limits, and account eligibility can change. Check the current Vercel dashboard/plan limits before launch.
- The app has not been verified against your live Atlas or Cloudinary accounts by this package step. Test customer registration/login, seller image upload and product CRUD, admin overview, checkout, and CORS after deployment.
- A single Vercel deployment is convenient for demos, but for sustained production traffic a separately hosted API may be more suitable.

## Cloudinary image upload troubleshooting (401 Unauthorized)

The app requests a signed upload from the Express API. A Cloudinary 401 means the Cloudinary account values do not match or the signature is invalid; changing frontend code cannot repair invalid credentials. In Vercel → Project → Settings → Environment Variables, set `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` from the **same** Cloudinary console/account. The cloud name must be the exact Cloudinary cloud name (usually lowercase; do not use a display name). Do not expose the API secret as a `VITE_` variable. Redeploy after changing environment variables. Then retry an image upload; the UI now displays Cloudinary's returned error plus the exact configuration fields to verify.

## Admin dashboard data

Admin pages load real products, orders, users, and settings from the API when those endpoints return records. When the database is empty, the interface keeps the realistic built-in sample records instead of replacing every table with an empty list. Sample records are illustrative and are not real customer transactions; seed/populate MongoDB to show actual marketplace records.
