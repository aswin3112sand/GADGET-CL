# Vercel Deployment Notes

This repo is split into:

- `frontend`: Vite + React storefront/admin client
- `backend`: Spring Boot API

## Recommended production shape

Deploy the frontend to Vercel and keep the Spring Boot API on a Java-friendly host such as Render, Railway, Fly.io, or a VM/container platform.

Why:

- Vercel is an excellent fit for the Vite frontend.
- The current backend is a full Spring Boot Java service, and Vercel's official function runtimes are not designed around Spring Boot.

## Frontend on Vercel

1. Import the repo into Vercel.
2. Keep the root as the project directory.
3. Build command: `npm run build`
4. Output directory: `dist`
5. Add environment variable:

```bash
VITE_API_BASE_URL=https://your-backend-domain.example.com
```

The frontend now falls back to `/api` in production only when you intentionally place it behind a reverse proxy. If you are deploying the API separately, set `VITE_API_BASE_URL`.

## Backend requirements

Make sure the deployed backend allows your Vercel domain in:

```bash
CORS_ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

You should also configure the rest of the backend production env values described in [backend/README.md](/c:/Users/Admin/Downloads/GADGET%20CL/backend/README.md).

## Optional same-domain setup

If you later place the backend behind a reverse proxy and expose it under `/api`, the frontend is already compatible with that path and no code changes are needed.
