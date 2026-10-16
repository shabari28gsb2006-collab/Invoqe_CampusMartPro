CampusMart Pro — Seller & Admin UI Refresh

This ZIP refreshes the seller and admin portals with a structured, light-theme marketplace operations interface. It is a FRONTEND UI PROTOTYPE. Do not treat demo actions or sample data as production business operations.

Run locally
1. Extract the ZIP.
2. Open the campusmart-full-final folder in VS Code / terminal.
3. Run: npm install
4. Run: npm run lint
5. Run: npm run build
6. Run: npm run dev

Routes
- Customer storefront: /
- Seller portal: /seller
- Admin portal: /admin

Seller UI areas
- Overview metrics, recent orders, action queue
- Product create/edit/delete, category, description, price, original price, stock, image upload, condition and size/model/colour variants
- Order status management, downloadable demo invoice and shipping-label text files
- Inventory count controls, low-stock alert threshold, CSV inventory export and CSV bulk stock/price update by product ID or exact title
- Customer/order history, message reply UI, review visibility controls
- Coupon creation, campaign dates, configurable loyalty reward values
- Analytics range selector, revenue bars, best-selling products and CSV export
- Store settings, contact details, return-policy toggle and order-alert toggle

Admin UI areas
- Overview metrics and action queue
- User/seller directory, seller approve/reject, suspend/ban/reactivate controls, profile editing and password-reset link preview
- Product moderation approval/rejection, global categories and product attributes
- All-orders/payment monitoring, refund/dispute review UI
- Theme previews, theme activation and campaign schedule fields
- Site settings, seller commission, tax, shipping threshold, return window, notification toggles, fraud checks, seller-approval policy, payment-gateway placeholders and shipping-zone rows
- Sales/revenue, seller performance, tax, compliance, reconciliation and growth report cards with CSV export
- Security event review and policy checklist

Important limitations
- All seller/admin users, orders, payment states, reviews, security events and analytics in the new dashboards are mock data or local UI state. They are not connected to a server or database.
- Seller product listing data currently persists in this browser's localStorage. It is not shared between devices and should not be used as production storage.
- Invoice and shipping-label downloads are clearly marked demo text documents, not valid tax invoices or carrier-issued shipping labels.
- Refund buttons only simulate local UI state; no money is moved. Payment gateway and webhook integration is pending.
- Theme schedules are stored in local browser state; real scheduled activation needs a backend scheduler.
- SSL/TLS, PCI responsibilities, secure authentication, role-based authorization, audit logging, rate limiting, privacy controls and production compliance must be implemented/verified before launch.
- Campus Offers and search still rely on the current frontend demo catalogue/rules.

Fonts: Inter body, Plus Jakarta Sans headings.

Validation status for this package
- TS/TSX transpile syntax check completed with zero syntax diagnostics.
- A complete TypeScript semantic check and Vite production build were NOT verified because dependency installation could not complete in the packaging environment. Please run npm install, npm run lint and npm run build locally and share any errors.
