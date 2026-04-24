# Languag.io

Languag.io is a modern language-learning web app built around deck creation, flashcard study flows, profiles, friends, feeds, and notifications. The frontend is designed as a focused Next.js application that proxies authenticated requests to a backend API while keeping the user experience fast, polished, and component-driven.

## Stack

| Layer | Technology |
| --- | --- |
| App framework | Next.js 16 App Router |
| UI runtime | React 19, TypeScript |
| Styling | Tailwind CSS 4, custom neo UI primitives |
| Auth | Kinde Auth for Next.js |
| State | React context, lightweight query invalidation, Zustand |
| Motion and icons | Framer Motion, Lucide React |
| Tooling | ESLint 9, Prettier 3, Husky, Yarn |

## Getting Started

```bash
yarn install
yarn dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Environment

Create `.env.local` with the values required by the app and auth provider:

```bash
API_URL=
NEXT_PUBLIC_API_URL=
KINDE_AUDIENCE=
```

Kinde also requires its standard Next.js application settings, such as issuer URL, client credentials, site URL, and redirect URLs.

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

- [Architecture](./docs/ARCHITECTURE.md) describes the application structure, routing model, auth flow, API boundary, and state patterns.

