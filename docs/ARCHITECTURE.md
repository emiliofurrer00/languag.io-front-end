# Architecture

Languag.io is organized as a Next.js App Router frontend with server-aware routes, client components for rich interactions, and a thin authenticated proxy layer between the browser and backend API.

## System Overview

```text
Browser
  -> Next.js App Router pages and layouts
  -> Client components and local UI state
  -> Next.js route handlers
  -> Authenticated backend API requests
  -> Railway-hosted API
  -> PostgreSQL / S3 / CloudFront
```

The frontend owns routing, presentation, authentication session handling, browser-side interaction state, and direct browser uploads to S3 using backend-issued presigned POST targets. Durable product data lives behind the backend API exposed through `API_URL` or `NEXT_PUBLIC_API_URL`.

## Application Layers

| Layer          | Location                             | Responsibility                                                                   |
| -------------- | ------------------------------------ | -------------------------------------------------------------------------------- |
| Routes         | `app/`                               | Pages, layouts, loading states, and API route handlers                           |
| Features       | `components/*`                       | Deck editing, study mode, landing, profile, and social experiences               |
| Shared UI      | `components/ui`, `components/layout` | Reusable buttons, cards, progress, toast, navigation, and visual primitives      |
| Domain clients | `lib/*`                              | Typed API access, server helpers, feature-specific clients, and shared utilities |
| Providers      | `app/AuthProvider.tsx`, `providers/` | Auth session context, toast mounting, and query invalidation                     |
| Public assets  | `public/`                            | Static images and framework assets                                               |

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

## Profile Pictures And Image Delivery

The frontend is responsible for user interaction, browser-side compression, and direct S3 upload orchestration. The backend remains responsible for validation, signing, ownership checks, object-key persistence, and CloudFront URL generation.

```text
/profile/me
  -> ProfilePictureUploader
  -> canvas/image bitmap compression to 256x256 WebP
  -> POST /api/users/me/profile-picture/upload-request
  -> browser POST to S3
  -> POST /api/users/me/profile-picture/complete
  -> router.refresh()
  -> profile and social surfaces render CloudFront URL
```

Frontend profile-picture modules:

- `components/profile/ProfilePictureUploader.tsx` handles file selection, image processing, S3 upload, completion, preview, and toast feedback.
- `components/profile/ProfilePicture.tsx` renders the profile page picture and initials fallback.
- `lib/profile/client.ts` owns the client-side upload-request, S3 POST, and completion calls.
- `app/api/users/me/profile-picture/*` proxies authenticated upload lifecycle calls to the backend.
- `components/social/SocialAvatar.tsx` renders social avatars from uploaded image URLs with initials fallback.

The profile picture is surfaced in:

- the `/profile/me` profile header,
- public profile pages,
- friend activity rows on the feed,
- suggested people,
- friends list rows,
- friend requests and notifications when avatar URLs are provided.

`NEXT_PUBLIC_PROFILE_IMAGE_CDN_BASE_URL` must match the CloudFront distribution used by the backend. `next.config.ts` uses this value to allow CloudFront-backed profile images.

## State And Interaction

The app favors local React state and feature-scoped hooks. Cross-screen refresh needs are handled by `QueryInvalidationProvider`, which exposes versioned query keys without introducing a heavy data-fetching layer. Zustand is available for lightweight shared client state where a feature needs it.

Profile-picture upload state is intentionally local to the uploader. After a successful upload, the route refreshes so server-rendered profile and feed data pull the latest CloudFront URL from the backend.

## Styling And UI Direction

Tailwind CSS 4 provides the styling foundation. The component system mixes feature-specific interfaces with reusable neo-style primitives in `components/ui`, keeping product flows expressive while preserving a consistent design language.

Profile avatars preserve the neo visual language with bold borders, hard shadows, rounded geometry, and color-backed initials when uploaded images are unavailable.

## Operational Notes

- Use `yarn build` before production deployment checks.
- Keep API access behind route handlers when a backend token is required.
- Never expose AWS credentials in frontend environment variables.
- Ensure S3 CORS allows `POST` from every frontend origin that performs uploads.
- Ensure CloudFront can read the S3 object path returned by the backend; a `403` image response means AWS access is failing before the frontend sees an image.
- Prefer feature-local types and clients under `lib/<feature>` before adding shared abstractions.
- Add new user-facing routes in `app/` and colocate loading states with the route they support.
