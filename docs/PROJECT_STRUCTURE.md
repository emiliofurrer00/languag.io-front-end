# Project Folder Structure

This document explains how the Languag.io frontend is organized, where new files should go, and which folder-structure improvements would make the codebase easier to scale.

The project uses a root-level Next.js App Router layout:

```text
.
|-- app/
|-- components/
|-- docs/
|-- hooks/
|-- lib/
|-- providers/
|-- public/
|-- proxy.ts
|-- next.config.ts
|-- package.json
|-- tailwind.config.ts
`-- tsconfig.json
```

Generated or local-only folders such as `.next/`, `node_modules/`, `.git/`, `.clerk/`, `.agents/`, and local log files are intentionally omitted here. They are already excluded by `.gitignore`.

## Structure Summary

| Path                                                       | Purpose                                                                         | Notes                                                                                                |
| ---------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| `app/`                                                     | Next.js App Router routes, layouts, loading states, errors, and route handlers. | This is the public routing surface. URL shape should be obvious from this tree.                      |
| `components/`                                              | Reusable React UI grouped by feature or shared UI role.                         | Current pattern is mostly feature-oriented: decks, sagas, profile, social, study mode, landing, etc. |
| `lib/`                                                     | Shared utilities, typed API clients, server helpers, and domain data functions. | Domain folders mirror product concepts such as `decks`, `profile`, `sagas`, and `social`.            |
| `hooks/`                                                   | Shared client hooks used by more than one feature.                              | Keep feature-only hooks closer to the feature that owns them.                                        |
| `providers/`                                               | React context providers and application-level state boundaries.                 | Currently used for query invalidation.                                                               |
| `docs/`                                                    | Human-facing project documentation.                                             | Architecture and folder-structure documentation live here.                                           |
| `public/`                                                  | Static assets served directly from the site root.                               | Good for stable images and files that do not need bundling.                                          |
| `proxy.ts`                                                 | App-wide request/auth boundary.                                                 | Uses Kinde auth to define public paths and protected routes.                                         |
| `next.config.ts`                                           | Next.js configuration.                                                          | Includes remote image configuration for Pexels and profile image CDN hosts.                          |
| `tailwind.config.ts`, `postcss.config.mjs`                 | Styling pipeline configuration.                                                 | Tailwind CSS is the styling foundation.                                                              |
| `eslint.config.mjs`, `.prettierrc.json`, `.prettierignore` | Code quality and formatting configuration.                                      | Formatting and linting are exposed through package scripts.                                          |
| `.husky/`                                                  | Git hook configuration.                                                         | Used by the `prepare` script.                                                                        |

## App Router Layout

The `app/` directory owns route structure and server entry points:

```text
app/
|-- layout.tsx
|-- page.tsx
|-- globals.css
|-- AuthProvider.tsx
|-- (development)/
|-- (profile)/
|   `-- profile/
|-- (social)/
|   |-- feed/
|   |-- friends/
|   `-- notifications/
|-- (studymode)/
|   `-- study/[slug]/
|-- api/
|-- auth/continue/
|-- create-saga/
|-- decks/
|-- onboarding/
`-- sagas/
```

Important conventions:

- `page.tsx` defines a route segment's UI.
- `layout.tsx` defines shared UI for a route segment and its children.
- `loading.tsx` defines route-level loading UI.
- `error.tsx` defines route-level error UI and must be a client component.
- `route.ts` defines a route handler, usually under `app/api`.
- Route groups such as `(profile)`, `(social)`, and `(studymode)` organize routes without changing the URL.

Current route areas:

| Route area                                                           | Responsibility                                                           |
| -------------------------------------------------------------------- | ------------------------------------------------------------------------ |
| `/`                                                                  | Public landing page.                                                     |
| `/auth/continue`                                                     | Post-auth continuation route.                                            |
| `/onboarding`                                                        | First-run profile and learning setup.                                    |
| `/profile`, `/profile/me`, `/profile/me/edit`, `/profile/[username]` | Profile viewing and editing.                                             |
| `/feed`, `/friends`, `/notifications`                                | Social surfaces.                                                         |
| `/decks`, `/decks/[slug]`, `/decks/editor/[slug]`                    | Deck listing, detail, and editing.                                       |
| `/study/[slug]`                                                      | Study mode for a deck.                                                   |
| `/sagas`, `/sagas/create`, `/sagas/[id]`                             | Saga listing, creation, and detail.                                      |
| `/create-saga`                                                       | Additional saga creation entry point.                                    |
| `/api/*`                                                             | Frontend-owned route handlers and authenticated backend proxy endpoints. |

## Component Organization

The current `components/` tree is split between shared UI and feature UI:

```text
components/
|-- create-form/
|-- decks-list/
|-- landing/
|-- layout/
|-- onboarding/
|-- profile/
|-- sagas/
|-- social/
|-- study-mode/
`-- ui/
```

Use these rules when adding components:

- Put reusable product primitives in `components/ui`.
- Put application chrome and navigation shells in `components/layout`.
- Put feature-specific UI in `components/<feature>`.
- If a component is only used by one route and is unlikely to be reused, consider colocating it under an `app/<route>/_components/` folder instead of adding it to the global `components/` tree.
- Keep client boundaries explicit with `'use client'` only where browser APIs, React state, effects, or client-only hooks are required.

## Domain Logic And Data Access

The `lib/` directory contains shared helpers and feature-specific data modules:

```text
lib/
|-- api.ts
|-- auth-flow.ts
|-- env.ts
|-- kinde-server.ts
|-- utils.ts
|-- decks/
|-- feed/
|-- profile/
|-- sagas/
|-- social/
`-- theme/
```

The strongest pattern in the current codebase is the domain split under `lib/<feature>`. Keep using it:

| File pattern    | Use for                                                                     |
| --------------- | --------------------------------------------------------------------------- |
| `client.ts`     | Browser-safe calls and client-side feature operations.                      |
| `server.ts`     | Server-only data loading, token-aware fetching, and response normalization. |
| `types.ts`      | Shared feature types and DTO normalization types.                           |
| `query-keys.ts` | Stable cache or invalidation key definitions.                               |
| `hooks.ts`      | Feature-specific hooks used by multiple components in that feature.         |
| `paths.ts`      | Route/path builders for a domain.                                           |

When adding a new product area, prefer this shape before creating broad shared abstractions:

```text
lib/<feature>/
|-- client.ts
|-- server.ts
|-- types.ts
`-- query-keys.ts
```

## API Route Handlers

The API layer lives under `app/api` and is grouped by backend resource:

```text
app/api/
|-- ai/
|-- auth/
|-- decks/
|-- friends/
|-- notifications/
|-- sagas/
|-- users/
|-- backend-unavailable.ts
|-- proxy-authorized.ts
`-- request-guards.ts
```

This is a good fit for Next.js route handlers because the frontend can keep backend access tokens and backend URLs on the server side. Continue using `route.ts` files for HTTP endpoints and shared helpers for token forwarding, request validation, and backend error handling.

As this folder grows, consider moving helper files into a clearly private location such as:

```text
app/api/_shared/
|-- backend-unavailable.ts
|-- proxy-authorized.ts
`-- request-guards.ts
```

or, if the helpers are not tightly coupled to route handlers:

```text
lib/server/api/
|-- backend-unavailable.ts
|-- proxy-authorized.ts
`-- request-guards.ts
```

Both options reduce ambiguity between real API route segments and implementation helpers.

## Placement Guide

Use this checklist when deciding where a new file belongs:

| New file type               | Preferred location                   |
| --------------------------- | ------------------------------------ |
| Public route page           | `app/<route>/page.tsx`               |
| Route-specific layout       | `app/<route>/layout.tsx`             |
| Route loading state         | `app/<route>/loading.tsx`            |
| Route error state           | `app/<route>/error.tsx`              |
| API endpoint                | `app/api/<resource>/route.ts`        |
| One-route-only component    | `app/<route>/_components/<Name>.tsx` |
| Reusable feature component  | `components/<feature>/<Name>.tsx`    |
| Shared UI primitive         | `components/ui/<Name>.tsx`           |
| Shared app shell/navigation | `components/layout/<Name>.tsx`       |
| Browser-only shared hook    | `hooks/use<Name>.ts`                 |
| Feature data client         | `lib/<feature>/client.ts`            |
| Feature server loader       | `lib/<feature>/server.ts`            |
| Feature type definitions    | `lib/<feature>/types.ts`             |
| Global provider             | `providers/<Name>Provider.tsx`       |
| Static asset                | `public/<asset>`                     |
| Project documentation       | `docs/<TOPIC>.md`                    |

## Best-Practice Assessment

### What Is Working Well

- The project follows App Router conventions with colocated `page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, and `route.ts` files.
- Route groups are used well for URL-neutral organization of profile, social, and study routes.
- Feature-specific data logic is separated from UI through `lib/<feature>` folders.
- Server and client data access are usually split into `server.ts` and `client.ts`, which helps preserve React Server Component boundaries.
- Shared visual primitives are isolated in `components/ui`, while application chrome lives in `components/layout`.
- Authenticated backend calls are routed through server-side route handlers instead of exposing backend credentials to the browser.
- `.gitignore` already excludes generated build outputs, TypeScript build info, local env files, local logs, and local agent artifacts.

### Improvement Opportunities

1. Clarify private helper files inside `app/api`.
   Move non-route helper files such as `backend-unavailable.ts`, `proxy-authorized.ts`, and `request-guards.ts` into `app/api/_shared` or `lib/server/api`. This keeps `app/api` visually reserved for actual API routes and private implementation support.

2. Normalize feature naming across routes, components, and libraries.
   Some domains map cleanly (`sagas` -> `components/sagas` -> `lib/sagas`), while others are split by screen shape (`decks` -> `components/decks-list` and `components/create-form`). Consider a consistent `components/decks/list` and `components/decks/editor` structure, or a larger `features/decks` structure if the domain keeps growing.

3. Decide when to colocate route-only components.
   The current global `components/` folder is manageable, but route-only UI can make it harder to see true reuse. For future one-off screens, prefer `app/<route>/_components` until the component is reused elsewhere.

4. Consolidate providers.
   `providers/` already exists, but `app/AuthProvider.tsx` also defines an app-level provider. Moving it to `providers/AuthProvider.tsx` or `app/_providers/AuthProvider.tsx` would make the provider boundary easier to scan.

5. Remove empty or unused structure.
   `app/(development)` is currently empty. Remove it if it is not reserved for active work. The default static SVG files in `public/` also appear unused and can be removed if no design or docs reference them.

6. Prefer TypeScript consistently.
   The project is TypeScript-first, but a few component files still use `.jsx`. Migrating `components/create-form/DeckDetails.jsx` and `components/decks-list/Navbar.jsx` to `.tsx` would improve type coverage and keep folder expectations consistent.

7. Establish a test placement convention before the suite grows.
   If tests are added, pick one convention early: colocated `*.test.tsx` beside the feature file for focused unit tests, and a top-level `tests/` or `e2e/` folder for cross-route flows.

8. Keep `src/` optional.
   A `src/` migration is not required. The current root-level `app/`, `components/`, and `lib/` layout is valid for Next.js and easy to navigate. Consider `src/` only if the repository accumulates many root-level non-app folders and the root starts feeling noisy.

## Suggested Target Direction

No large restructure is required right now. The most useful incremental direction is:

```text
app/
|-- api/
|   `-- _shared/
|-- <route>/
|   `-- _components/
components/
|-- decks/
|   |-- editor/
|   `-- list/
|-- layout/
|-- sagas/
|-- social/
|-- profile/
`-- ui/
lib/
|-- server/
|   `-- api/
|-- decks/
|-- sagas/
|-- social/
`-- profile/
providers/
`-- AuthProvider.tsx
```

This keeps the current architecture intact while making ownership clearer:

- `app/` stays focused on routing and route handlers.
- `components/` stays focused on reusable UI.
- `lib/` stays focused on data access, server helpers, and domain logic.
- `providers/` becomes the single home for app-wide React context.
