# Mentorly

Private, Ukrainian-first tutor marketplace MVP. Built with React, Vinext, Cloudflare Workers, D1 and R2 using the Sites starter.

## Working flows

- Landing → demo profile → student preferences → Explore.
- Tutor catalog, natural-language demo search, 17 filters, five sorting modes, per-result explanations.
- Individual tutor pages, education, availability, persisted demo messages and bookings, cancellation and reviews.
- Favorites, named lists, comparison of 2–4 tutors, preference- and activity-based recommendations.
- Five-step tutor onboarding, image/document upload, persisted profile publication in this Site's catalog.
- Account settings, light/dark/system theme, Ukrainian/English/Polish navigation and control dictionaries, notification preferences, hiding/blocking tutors, profile deletion.

## Deliberate demo boundaries

The user explicitly allowed realistic mock data before external APIs are configured. The six initial tutor identities, statistics and reviews are fictional; photographs are illustrative. Messages never leave the Site, bookings do not notify real tutors, and there is no payment processing.

Google OAuth, Apple Sign In and independent email/password authentication are not connected. Buttons disclose this and offer the demo profile flow. The private deployment is protected by Sites; all data ownership derives exclusively from the dispatcher-supplied authenticated user ID. No password is collected or stored. Do not make the Site public as a substitute for implementing consumer authentication.

`lib/search.ts` exports a typed `SearchProvider` contract. `demoSearch` currently extracts a supported subset of natural-language criteria, applies actual catalog filters and produces factual explanations. It is a deterministic parser, not a live LLM; the interface labels this clearly. Frequency such as “twice per week” remains a tutor conversation. A future provider should return the same typed structure, validate inferred criteria, preserve hard budget constraints and enforce server-side request limits. No API key is embedded or used.

Roles are server-owned: Student by default, Tutor after publication. Admin is reserved for a future explicit server-side allowlist and moderation workflow; clients cannot self-promote. Certificates uploaded during onboarding remain unverified. A production launch also needs verified OAuth setup, moderation, consent/privacy policies, notifications delivery, real tutor messaging, conflict-safe global bookings and complete localization of remaining demo prose.

## Structure

- `app/`: landing, app routes, tutor detail route and HTTP endpoints.
- `components/platform-context.tsx`: shared state, persisted mutations, theme and locale.
- `components/platform-ui.tsx`: reusable form, modal, card and registration components.
- `components/platform.tsx`: application shell and product screens.
- `lib/tutors.ts`: typed catalog and shared filtering predicates.
- `lib/search.ts`: search-provider seam and deterministic demo search.
- `lib/server.ts`: D1/R2 access, ownership and request validation helpers.
- `lib/i18n.ts`: extensible dictionaries; tutor-written descriptions remain in their original language.
- `db/schema.ts` and `drizzle/`: normalized D1 schema and migrations.

Favorites, profiles, lists, messages, bookings, tutor profiles, reviews and upload metadata live in D1. Uploaded bytes live in R2. Browser storage holds only the device's theme/language preferences.

## Development

`npm install`, then `npm run dev`. For local authenticated flows, navigate to `/signin-with-chatgpt?return_to=/`. The starter simulates a local identity; it never includes that identity in production.

Generate schema migrations with `npm run db:generate`. Local D1 migrations use the generated Worker configuration and `.wrangler/state` as the persistence directory. Sites applies the checked-in migration during deployment.

`npm run build` compiles the Worker and client. `npx tsc --noEmit` checks TypeScript. `scripts/smoke.mjs` checks catalog filtering, identity boundaries, persistence and the demo journey against an already-running local server.

The search screen exposes the optional imperative `search_tutors` WebMCP tool when `document.modelContext` exists. No supported WebMCP validation context was available in this task; registration/behavior were not browser-verified. Browser UI testing was not requested and was not performed.

## Photography

Illustrative portraits used under the Unsplash License: https://unsplash.com/license.

- Michael Dam: https://unsplash.com/photos/closeup-photography-of-woman-smiling-mEZ3PoFGs_k
- Jake Nackos: https://unsplash.com/photos/woman-in-white-crew-neck-shirt-smiling-IF9TK5Uy-KI
- Christopher Campbell: https://unsplash.com/photos/shallow-focus-photography-of-woman-outdoor-during-day-rDEOVtE7vOs
- Morten Pedersen: https://unsplash.com/photos/smiling-man-Z-bgD8pMv30
- The Connected Narrative: https://unsplash.com/photos/a-man-smiling-for-the-camera-N8lRH2uxih4
- Andre Tan: https://unsplash.com/photos/smiling-man-nX0mSJ999Og
