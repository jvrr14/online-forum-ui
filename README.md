# Commons — forum UI

React 19 + TypeScript + Vite front end for the Commons community forum.
Talks to the [forum API](../fullstack-online-forum) over `/api/v1`.

## Stack

- React 19 with the React Compiler, React Router 7, Redux Toolkit
- Tailwind CSS 4
- Oxlint

## Getting started

```sh
npm install
cp .env.example .env
npm run dev        # http://localhost:5173
```

The dev server (and `vite preview`) proxy `/api` to `http://localhost:3000`, so
start the API first.

| Script            | What it does                      |
| ----------------- | --------------------------------- |
| `npm run dev`     | Start the dev server              |
| `npm run build`   | Type-check and build to `dist/`   |
| `npm run preview` | Serve the production build        |
| `npm run lint`    | Lint with Oxlint                  |

## Project layout

```
src/
  api/          fetch client, token handling, endpoint modules
  components/   layout, navigation, shared form pieces
  features/     auth and posts pages, Redux slice
  lib/          app-wide constants (name, tagline)
  routes/       router and route guards
  store/        Redux store and typed hooks
  types/        API types
```

## Auth

The access token is kept in memory only. The refresh token is an `httpOnly`
cookie set by the API, and the app silently refreshes the session on load.

## Renaming the app

The product name lives in one place: `src/lib/brand.ts` (plus the `<title>` and
description in `index.html`).
