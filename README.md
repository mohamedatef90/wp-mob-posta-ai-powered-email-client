# Posta Mobile - AI-Powered Email Client

A front-end prototype of the Posta email client for desktop and mobile layouts, with Gemini-powered assistance. It runs on sample data (`constants.ts`); there is no email backend. The layout switches between desktop and mobile components at a 768 px width.

It was created in Google AI Studio and can be viewed there: https://ai.studio/apps/drive/1gm0F9aZksc5Tv9k7MW3DoHsEB6t0GNZk

## Features

- **Email:** mailbox sidebar, email list and detail views, composer, folder management, filters and search popover, snooze, out-of-office, signatures, attach-email and insert-meeting dialogs, context menus, and configurable swipe actions on mobile.
- **Other views:** chat, calendar, a cloud drive view, a copilot view, a mailboxes view, settings, and add-account and onboarding screens.
- **AI features (Gemini `gemini-2.5-flash`, called from the browser):**
  - AI search: expands the search query into related keywords (`App.tsx`)
  - Thread summarization and AI-drafted replies (`App.tsx`)
  - Copilot view: a streaming Gemini chat (`components/CopilotView.tsx`)
  - AI assistant panel and modal components (`components/AIAssistant*.tsx`), and AI feature steps in onboarding
- **Light, dark, and system themes**, and a design-system view (`components/DesignSystemView.tsx`).
- **Installable web app:** `manifest.json` defines a standalone display mode.

## Tech stack

- React 19 and TypeScript
- Vite 6
- Tailwind CSS and Font Awesome (both loaded from CDNs in `index.html`)
- Google Gemini through `@google/genai`

## Getting started

Prerequisites: Node.js and npm.

```bash
npm install
npm run dev       # http://localhost:3000 (host 0.0.0.0)
npm run build     # production build
npm run preview   # preview the production build
```

### Environment variable

`GEMINI_API_KEY`, read from `.env.local` by `vite.config.ts` (set it in the `.env.local` file in the project root). It is inlined into the client bundle at build time, so use it only for local demos. Without a key the AI features are not available.

## Project structure

```
App.tsx, index.tsx   App state, views, and Gemini calls
components/          UI components; *.mobile.tsx files are the mobile variants
components/context/  App context
constants.ts, types.ts   Sample data and types
manifest.json        Web app manifest
```
