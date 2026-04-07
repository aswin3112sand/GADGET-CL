# E-Commerce Backend

Spring Boot backend for the React storefront and admin console. It ships with two operating modes:

- `local` profile: H2 file database, demo upload/payment fallback, and sample admin credentials for near-zero setup
- default profile: PostgreSQL + Flyway + env-driven Cloudinary and Razorpay integrations

## What It Handles

- JWT-protected admin login and admin CRUD APIs
- Signed-in admin password change API
- Public section and product catalog APIs
- Product stock tracking and checkout-time stock validation
- Cloudinary uploads with local demo asset fallback
- Razorpay checkout with local demo payment fallback
- Order persistence for verified live and demo checkouts

## Stack

- Java 17+
- Spring Boot 3
- Maven wrapper (`mvnw`, `mvnw.cmd`)
- H2 for local development
- PostgreSQL + Flyway for production-style environments
- Spring Security + JWT
- Cloudinary
- Razorpay

## Local Quick Start

This is the default developer-first path. No Docker or PostgreSQL is required.

1. Create the frontend `.env` file in the repo root from [`.env.example`](../.env.example):

```bash
VITE_API_BASE_URL=http://localhost:8080
VITE_RAZORPAY_KEY_ID=rzp_test_your_key_id
```

2. Create `backend/.env` from [`backend/.env.example`](./.env.example).

For real Cloudinary uploads, set:

```bash
APP_DEMO_ENABLED=false
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_FOLDER=ecommerce
```

The backend auto-loads `backend/.env` and `backend/.env.local`.

3. Start the backend in the `local` profile:

Windows PowerShell:

```powershell
cd backend
.\run-local.ps1
```

macOS / Linux:

```bash
cd backend
./run-local.sh
```

For PostgreSQL / Neon instead of the local H2 profile, leave `SPRING_PROFILES_ACTIVE` unset in `backend/.env` and run:

Windows PowerShell:

```powershell
cd backend
.\run-postgres.ps1
```

macOS / Linux:

```bash
cd backend
./run-postgres.sh
```

4. Start the frontend from the repo root:

```bash
npm run dev
```

Local mode defaults:

- database: H2 file at `backend/.local/ecommerce-local`
- demo mode: enabled unless `APP_DEMO_ENABLED=false` is set in `backend/.env` or the shell environment
- admin email: `admin@example.com`
- admin password: `change-this-password`

Recover a local admin password without wiping data:

1. Open `backend/.env`.
2. Set `ADMIN_EMAIL=admin@example.com`.
3. Set `ADMIN_PASSWORD=change-this-password` or your preferred local password.
4. Set `ADMIN_RESET_EXISTING_PASSWORD=true`.
5. Restart the backend in the `local` profile.
6. Sign in at `/admin/login`.
7. Set `ADMIN_RESET_EXISTING_PASSWORD=false` again after login succeeds.
8. Optionally change the password from `Admin -> Settings`.

Add a section from the admin UI:

1. Sign in to the admin app.
2. Open `Admin -> Sections` from the sidebar.
3. Enter the new section name.
4. Click `Create section`.
5. Confirm the new section appears in the live section list.

What local demo mode means:

- if Cloudinary keys are missing and demo mode is enabled, admin uploads return stable demo media URLs
- if Razorpay keys are missing, checkout switches to a guided demo payment confirmation
- catalog, admin CRUD, order save flow, and stock decrement still work normally

When real Cloudinary config is present:

- `POST /admin/upload` sends images and videos to Cloudinary
- uploaded media returns a secure Cloudinary URL
- admin product media in the React workflow uses that URL for preview and save flow

## Local Commands

Backend tests:

Windows:

```powershell
cd backend
.\mvnw.cmd test -Dspring.profiles.active=local
```

macOS / Linux:

```bash
cd backend
./mvnw test -Dspring.profiles.active=local
```

Package jar:

```bash
./mvnw clean package
```

The wrapper downloads Maven automatically on first run if it is not already available in `~/.m2/wrapper/dists`.

## Neon / PostgreSQL Notes

- keep `DB_URL` in JDBC format: `jdbc:postgresql://...`
- do not use a plain `postgresql://...` URL in Spring Boot datasource config
- Neon query params like `sslmode=require&channel_binding=require` are usually optional here
- `run-local` always forces the H2-backed `local` profile, so use `run-postgres` when you want Neon

## Production-Style Environment Variables

Use [`.env.example`](./.env.example) as the backend reference. Main variables:

```bash
PORT=8080
DB_URL=jdbc:postgresql://localhost:5432/ecommerce
DB_USERNAME=postgres
DB_PASSWORD=postgres
JPA_SHOW_SQL=false

JWT_SECRET=replace-with-a-long-random-secret
JWT_EXPIRATION_MINUTES=1440
CHECKOUT_TOKEN_EXPIRATION_MINUTES=30
JWT_ISSUER=ecommerce-backend

RAZORPAY_KEY_ID=rzp_test_xxxxx
RAZORPAY_KEY_SECRET=xxxxxxxx
RAZORPAY_API_BASE_URL=https://api.razorpay.com/v1
RAZORPAY_CURRENCY=INR

CLOUDINARY_CLOUD_NAME=xxxxxx
CLOUDINARY_API_KEY=xxxxxx
CLOUDINARY_API_SECRET=xxxxxx
CLOUDINARY_FOLDER=ecommerce

APP_DEMO_ENABLED=false

ADMIN_BOOTSTRAP_ENABLED=true
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=change-this-password
ADMIN_RESET_EXISTING_PASSWORD=false

CORS_ALLOWED_ORIGINS=http://localhost:5173,https://your-frontend.vercel.app
UPLOAD_MAX_FILE_SIZE_MB=200
MULTIPART_MAX_FILE_SIZE=200MB
MULTIPART_MAX_REQUEST_SIZE=200MB
```

Notes:

- keep real admin credentials in runtime env only
- do not commit real Razorpay or Cloudinary secrets
- do not commit real database credentials; keep them in `backend/.env` or runtime env only
- the default profile expects PostgreSQL and Flyway migrations

## API Summary

- `POST /admin/login`
- `POST /admin/change-password`
- `GET /sections`
- `POST /admin/sections`
- `PUT /admin/sections/{id}`
- `DELETE /admin/sections/{id}`
- `GET /products`
- `GET /products/{id}`
- `POST /admin/products`
- `PUT /admin/products/{id}`
- `DELETE /admin/products/{id}`
- `POST /admin/upload`
- `POST /create-order`
- `POST /verify-payment`
- `POST /orders`
- `GET /admin/orders`

## Deployment Notes

Production-style deployment should keep the default profile:

1. Provision PostgreSQL.
2. Set all backend env vars.
3. Keep `APP_DEMO_ENABLED=false`.
4. Build with:

```bash
./mvnw clean package
```

5. Run with:

```bash
java -jar target/ecommerce-backend-0.0.1-SNAPSHOT.jar
```

6. Point frontend `VITE_API_BASE_URL` to the deployed backend.

## Workflow Notes

- Orders are saved only after backend verification.
- Cart data is never persisted before checkout verification.
- Checkout always recalculates pricing from product records and rechecks stock.
- Successful verified orders decrement product stock.
- Admin bootstrap creates the first admin only if the configured admin email does not already exist.
- In the `local` profile, set `ADMIN_RESET_EXISTING_PASSWORD=true` for one restart if you need to overwrite the stored local admin password without deleting the H2 file.
