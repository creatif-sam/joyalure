
# Copilot Instructions for Joyalure Codebase

## Project Overview
This is a Next.js 14+ app using the App Router, TypeScript, Tailwind CSS, shadcn/ui, and Supabase for backend and auth. The project is structured for e-commerce and content, with admin, public, and protected areas, and deep integration with Supabase (RLS, auth, storage, SQL migrations).

## Architecture & Key Patterns
- **App Directory Structure:**
	- `app/` uses Next.js App Router. Subfolders (e.g., `admin/`, `public/`, `protected/`, `auth/`, `blog/`) map to routes and layouts. Use server components by default; use `'use client'` for interactivity.
	- `components/` contains UI, admin, blog, and tutorial components. Prefer composition and co-location.
	- `lib/` holds data access, context, and utility logic. E.g., `lib/supabase/` for Supabase client/server helpers.
	- `services/` and `config/` are for integrations and configuration.
	- `supabase/` contains SQL migrations and RLS setup scripts. See `DATABASE_SETUP.md` for DB onboarding.

- **Supabase Integration:**
	- Use `@/lib/supabase/server` for server-side and `@/lib/supabase/client` for client-side Supabase access.
	- Auth flows are handled in `app/auth/` and related components.
	- RLS and admin queries require special keys—never expose service_role keys to the client.

- **UI Patterns:**
	- UI is built with shadcn/ui and Tailwind. See `components.json` for shadcn blocks.
	- Use `components/ui/` for base UI, `components/admin/` for admin dashboard widgets, and `components/blog/` for blog-specific UI.
	- Use composition and props for reusability. Prefer functional components and hooks.

- **State & Context:**
	- Use React context for global settings (`lib/settings-context.tsx`) and cart state (`lib/cart-store.ts`).
	- Use Zustand for local state where needed.

## Developer Workflows
- **Local Development:**
	- `npm run dev` — Start Next.js dev server (localhost:3000)
	- `npm run build` — Build for production
	- `npm run start` — Start production server
	- `npm run lint` — Lint codebase with ESLint (see `eslint.config.mjs`)
	- For shadcn/ui: delete `components.json` to reset, then follow [shadcn/ui docs](https://ui.shadcn.com/docs/installation/next)

- **Database Setup:**
	- See `DATABASE_SETUP.md` and `supabase-rls-setup.sql` for onboarding and RLS policies.
	- Run SQL migrations in Supabase SQL Editor as described in docs.
	- For admin queries, uncomment code in `app/admin/customers/page.tsx` as instructed.

- **Environment Variables:**
	- Copy `.env.example` to `.env.local` and fill in Supabase keys as described in README.
	- Never commit secrets. Service role keys are for server-side only.

- **Deployment:**
	- Deploy to Vercel for production. See README for Vercel/Supabase integration and environment setup.

## Conventions & Patterns
- Use absolute imports with `@/` alias (see `tsconfig.json`).
- Use server components by default; add `'use client'` only when needed.
- Use Tailwind for all styling; avoid inline styles unless necessary.
- Prefer async/await for all data fetching and server actions.
- Use SQL migrations for all schema changes; do not edit DB via UI except for prototyping.
- Keep business logic in `lib/` or `services/`, not in components.

## Integration Points
- Supabase: Auth, RLS, storage, SQL migrations
- shadcn/ui: UI primitives and blocks
- Vercel: Deployment, environment variables

## References
- [README.md](../README.md): Setup, local dev, deployment
- [DATABASE_SETUP.md](../DATABASE_SETUP.md): Database and RLS setup
- [supabase-rls-setup.sql](../supabase/supabase-rls-setup.sql): RLS policies
- [components.json](../components.json): shadcn/ui blocks

---
For new patterns or changes, update this file to keep AI agents productive.
