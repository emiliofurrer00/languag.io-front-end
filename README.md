# Languag.io Frontend

Languag.io is a modern language-learning web app built around deck creation, flashcard study flows, profiles, friends, feeds, notifications, and custom profile pictures. The frontend is a focused Next.js application that handles routing, polished UI, Kinde session state, authenticated API proxying, browser-side image compression, and direct-to-S3 profile-picture uploads.

## Stack

| Layer            | Technology                                                         |
| ---------------- | ------------------------------------------------------------------ |
| App framework    | Next.js 16 App Router                                              |
| UI runtime       | React 19, TypeScript                                               |
| Styling          | Tailwind CSS 4, custom neo UI primitives                           |
| Auth             | Kinde Auth for Next.js                                             |
| State            | React context, lightweight query invalidation, Zustand             |
| Images           | Browser canvas compression, S3 direct uploads, CloudFront delivery |
| Motion and icons | Framer Motion, Lucide React                                        |
| Tooling          | ESLint 9, Prettier 3, Husky, Yarn                                  |

## Getting Started

```bash
yarn install
yarn dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

The backend API is expected to run separately, usually at:

```text
http://localhost:5222/api
```

## Environment

Create `.env.local` with the values required by the app, backend API, Kinde, and profile image CDN:

```bash
API_URL=http://localhost:5222/api
NEXT_PUBLIC_API_URL=http://localhost:5222/api
NEXT_PUBLIC_PROFILE_IMAGE_CDN_BASE_URL=https://dxxxxxxxxxxxxx.cloudfront.net

KINDE_SITE_URL=http://localhost:3000
KINDE_POST_LOGIN_REDIRECT_URL=http://localhost:3000/auth/continue
KINDE_POST_LOGOUT_REDIRECT_URL=http://localhost:3000
KINDE_ISSUER_URL=
KINDE_CLIENT_ID=
KINDE_CLIENT_SECRET=
KINDE_AUDIENCE=
```

`API_URL` is used by server-side route handlers. `NEXT_PUBLIC_API_URL` is available to browser-side code when needed. `NEXT_PUBLIC_PROFILE_IMAGE_CDN_BASE_URL` configures `next/image` remote image allowlisting for CloudFront-backed profile pictures.

Kinde also requires matching application settings in the Kinde dashboard, including callback/logout URLs and the API audience used by the backend.

## Profile Picture Uploads

Custom profile pictures are uploaded through a two-step API flow:

1. The user chooses an image on `/profile/me`.
2. The browser compresses and center-crops the image to `256x256` WebP.
3. The frontend requests a presigned S3 POST target from the backend.
4. The browser uploads the WebP directly to S3.
5. The frontend asks the backend to complete the upload.
6. The backend validates the S3 object and stores the object key.
7. Profiles, feeds, friend lists, and notifications render the resulting CloudFront image URL.

AWS credentials never exist in the frontend. The frontend only receives the short-lived upload target and fields returned by the backend.

## Scripts

```bash
yarn dev           # Start local development
yarn build         # Create a production build
yarn start         # Run the production server
yarn lint          # Run ESLint
yarn format        # Format source files
yarn format:check  # Check formatting
```

## Project Docs

- [Architecture](./docs/ARCHITECTURE.md) describes the application structure, routing model, auth flow, API boundary, profile-picture upload flow, and state patterns.
- [Project Structure](./docs/PROJECT_STRUCTURE.md) documents the folder layout, file placement rules, and best-practice improvement opportunities.
