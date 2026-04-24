# Architecture

Languag.io is organized as a Next.js App Router frontend with server-aware routes, client components for rich interactions, and a thin authenticated proxy layer between the browser and backend API.

## System Overview

```text
Browser
  -> Next.js App Router pages and layouts
  -> Client components and local UI state
  -> Next.js route handlers
  -> Authenticated backend API requests
  -> External API service
```

The frontend owns routing, presentation, authentication session handling, and user interaction state. Durable product data lives behind the backend API exposed through `API_URL` or `NEXT_PUBLIC_API_URL`.

## Application Layers

| Layer | Location | Responsibility |
| --- | --- | --- |
| Routes | `app/` | Pages, layouts, loading states, and API route handlers |
| Features | `components/*` | Deck editing, study mode, landing, profile, and social experiences |
| Shared UI | `components/ui`, `components/layout` | Reusable buttons, cards, progress, toast, navigation, and visual primitives |
| Domain clients | `lib/*` | Typed API access, server helpers, feature-specific clients, and shared utilities |
| Providers | `app/AuthProvider.tsx`, `providers/` | Auth session context, toast mounting, and query invalidation |
| Public assets | `public/` | Static images and framework assets |

## Routing Model

The app uses route groups to keep product areas readable without changing public URLs:

- `(profile)` contains profile pages and nested profile views.
- `(social)` contains feed, friends, and notifications.
- `(studymode)` contains study sessions by slug.
- `decks` contains deck listing and editor screens.
- `api` contains route handlers that proxy or coordinate backend API requests.

Public paths are configured in `proxy.ts`; authenticated routes are protected through Kinde middleware.

## Data And API Boundary

Shared fetch behavior lives in `lib/api.ts`. It normalizes backend URLs, attaches JSON headers, handles bearer tokens, and raises typed `ApiError` failures.

Server route handlers use `app/api/proxy-authorized.ts` to:

- read the current Kinde access token,
- forward authorized requests to the backend API,
- preserve response status and content type,
- surface clear diagnostics for rejected or missing API audiences.

Feature-specific API logic is kept in folders such as `lib/decks`, `lib/profile`, `lib/social`, and `lib/feed` so UI components stay focused on rendering and interaction.

## Auth Flow

Kinde is mounted once in `app/AuthProvider.tsx`. The root layout wraps the application with:

- `KindeProvider` for auth session access,
- `QueryInvalidationProvider` for client-side refresh signaling,
- `Toaster` for global feedback.

Server-side token helpers live in `lib/kinde-server.ts`, including audience diagnostics for backend API integration.

## State And Interaction

The app favors local React state and feature-scoped hooks. Cross-screen refresh needs are handled by `QueryInvalidationProvider`, which exposes versioned query keys without introducing a heavy data-fetching layer. Zustand is available for lightweight shared client state where a feature needs it.

## Styling And UI Direction

Tailwind CSS 4 provides the styling foundation. The component system mixes feature-specific interfaces with reusable neo-style primitives in `components/ui`, keeping product flows expressive while preserving a consistent design language.

## Operational Notes

- Use `yarn build` before production deployment checks.
- Keep API access behind route handlers when a backend token is required.
- Prefer feature-local types and clients under `lib/<feature>` before adding shared abstractions.
- Add new user-facing routes in `app/` and colocate loading states with the route they support.

