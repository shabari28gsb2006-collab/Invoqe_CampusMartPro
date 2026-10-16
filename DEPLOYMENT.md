# CampusMart Pro — deployment checklist

## Local setup

1. Install Node.js 20.19+ (Node 22 LTS recommended).
2. Copy `server/.env.example` to `server/.env` and fill in real values. Keep `.env` private; never commit it.
3. Set `MONGODB_URI` to the intended Atlas database name. Ensure the Atlas database user has read/write access and the deployment host is allowed in Atlas Network Access.
4. Run `cd server && npm install && npm run seed && npm run dev`.
5. In a second terminal run `cd client && npm install`, copy `.env.example` to `.env.local`, set `VITE_API_BASE_URL=http://localhost:4000`, then `npm run dev`.

The seed is designed to be re-runnable and adds 55 starter listings (5 in each of the 11 displayed categories) and assigns the listings to the configured seller account. Existing products are not intentionally overwritten. Catalogue prices, stock, ratings, and sold counts are sample marketplace data and must be reviewed before real sales.

## Production deployment

- Deploy `server` as a Node.js service. Build with `npm ci && npm run build`, then start with `npm start`.
- Deploy `client` as a static Vite site. Build with `npm ci && npm run build`; publish `client/dist`.
- Set the production frontend origin in backend `CLIENT_ORIGIN` and the public backend URL in frontend `VITE_API_BASE_URL` before building the client.
- Set `NODE_ENV=production`, a strong unique `SESSION_SECRET` (at least 32 random characters), real MongoDB credentials, and real Cloudinary credentials as server environment variables.
- Replace the default seller/admin usernames and passwords with strong unique credentials before deployment. Do not use the example `seller` / `admin` passwords on a public site.
- Configure Cloudinary in the backend environment only. Never expose `CLOUDINARY_API_SECRET`, MongoDB credentials, `SESSION_SECRET`, or payment secrets in Vite variables.
- Configure Razorpay keys only if payments are enabled and the account/webhooks are set up. Do not advertise online payment as live until a complete test payment and webhook verification succeeds.
- Restrict Atlas Network Access to the deployment provider's egress IPs where practical; avoid `0.0.0.0/0` for production unless you understand the exposure.
- Verify product listing, seller edit/delete, customer registration/login, order placement, image upload, CORS, and production logs after deployment.

## Important

This repository is deployment-configurable, not a guarantee of production readiness. Before public launch, run builds/tests, test auth and authorization, review payment/webhook behavior, configure backups and monitoring, and remove or rotate any credentials that were ever committed or shared.

## Seller image uploads and admin metrics (latest update)
- Seller product forms accept up to 5 JPG, PNG, or WebP images, each up to 5 MB.
- Images are uploaded directly to Cloudinary using a backend-generated signed upload request; only secure image URLs are saved in MongoDB product `image` and `gallery` fields.
- The admin overview endpoint reports counts and revenue from MongoDB orders, users, sellers, and products. Metrics are live only when the admin portal has a valid admin token and the backend database is connected.
- Verify `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, and `CLOUDINARY_API_SECRET` in the backend environment before testing uploads. Do not put the API secret in frontend environment variables.
