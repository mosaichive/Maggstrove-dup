# Maggs Trove Storefront

Maggs Trove is a Vite + React + TypeScript storefront with Supabase-backed auth, customer accounts, order management, and an admin dashboard.

## Stack

- Vite
- React 18
- TypeScript
- Tailwind CSS
- Supabase
- Vercel

## Local development

1. Install dependencies:

```sh
npm install
```

2. Create a local env file:

```sh
cp .env.example .env
```

3. Fill in your Supabase values in `.env`.

4. Start the app:

```sh
npm run dev
```

## Available scripts

```sh
npm run dev
npm run build
npm run preview
npm run test
npm run typecheck
npm run lint
```

## Auth setup

This project uses Supabase auth directly and does not depend on Lovable.

Required app routes:

- `/login`
- `/admin/login`
- `/auth/callback`
- `/reset-password`

In Supabase Auth settings, add your local and production callback URLs, for example:

- `http://localhost:8080/auth/callback`
- `http://localhost:8080/reset-password`
- `https://your-domain.com/auth/callback`
- `https://your-domain.com/reset-password`

If you use Google or Apple sign-in, configure those providers in Supabase and include the same callback URLs.

## Vercel deployment

This repo includes a `vercel.json` rewrite so client-side routes work in production.

When importing the project into Vercel:

1. Connect the GitHub repo.
2. Add the same `VITE_SUPABASE_*` environment variables from `.env`.
3. Deploy.

## Notes

- The admin dashboard depends on the `user_roles` table in Supabase.
- A user must have the `admin` role in `public.user_roles` to access `/admin`.
- `npm run lint` still reports a large set of legacy typing/lint issues across the codebase. The auth and build path fixes in this pass are working, but the broader lint cleanup is still pending.
