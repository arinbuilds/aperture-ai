# Aperture AI · PS-3: Bridge the Gap

Aperture AI helps learners turn activities into skill evidence, understand opportunity requirements, connect with mentor examples, discuss practical questions, and join mentor-led demo classes. This project preserves its dependency-free JavaScript app and builds on it incrementally.

## Run locally

Requires Node.js 20 or newer. No package installation is required.

```sh
cd aperture-ai
cp -n .env.example .env
```

Add `GEMINI_API_KEY=...` to `.env` to enable full-video analysis. Keep the file private; the API key is read only by the local server. Video analysis uploads the selected video (including its audio track, if present) to Google Gemini after the user consents. API charges may apply; the app requests deletion after analysis.

To enable real email/password, email-link, password-reset, and OAuth sign-in, add `SUPABASE_URL` and the project's public anon/publishable key as `SUPABASE_ANON_KEY`. Never put a Supabase service-role key in this app. In Supabase Auth settings, allow your local callback URL (for example `http://127.0.0.1:4174/auth/callback`) and enable/configure each OAuth provider you want to use. Restart the server after editing `.env`. Google, Apple, and GitHub also require their own provider credentials in Supabase. Passkeys need a separate WebAuthn provider and are currently shown as unavailable; email magic links work as the passwordless option.

```sh
npm start
```

Open the Local URL printed by the server. It starts at port 4173 and automatically uses the next available port if 4173 is already occupied. The root page is the light sign-in experience. Choose **Enter the local demo** to explore without signing in. Stop the server with Ctrl+C; set `PORT=4174` to request a specific port.

## What works in this prototype

- AI video skill evaluation: identify the activity without a written description, draft a skill form, attach timestamped visual evidence, estimate per-skill practice ratings, and recommend specific corrections and safe practice. The learner reviews and edits every suggestion before saving.
- Professional Profile: LinkedIn-inspired profile preview with an about section, headline, skill tags, featured projects, evidence labels, and a shareable snapshot.
- Skill Passport: edit profile evidence, add projects and achievements, and export or share a snapshot.
- Skill Analytics: an evidence map, clip-by-clip 0–100 estimates of observed skill evidence, and a practice plan drawn from saved video feedback. Clearly labeled demo placeholders appear where a video score is missing; they are not real assessments.
- Mentor directory: searchable demo mentor profiles with browser-local follow state. Profiles are examples, not real or verified people.
- Reddit-inspired discussion communities: join skill groups, publish text posts, add comments, upvote, and switch between recent and top feeds. Activity is saved in this browser; it does not publish educational videos.
- Opportunity Decoder: compare supported requirements with profile evidence, explain gaps without ranking the learner, and suggest small practice steps.
- English/Hindi interface, bilingual drafts, and mentor conversation preparation.
- Learner class flow: follow the sample mentor, filter upcoming classes, enroll, leave before the session, see the meeting link only after enrollment, and view joined sessions on My Classes and the calendar.
- Mentor class flow: create, edit, cancel, and inspect participants for classes. Inputs validate HTTPS meeting/resource links, future dates, capacity, end-after-start, and IANA timezone.
- Month/week calendar views, timezone switching, localized display, event details, and upcoming sessions. Class events derive from one stored class record; edits and cancellations update all views.

Switch roles from **Switch demo portal**. Class data and demo roles are stored in this browser under `aperture-classes-v1`. Example roles and participant names are fixtures, not real accounts.

## Prototype boundary

The repository that was provided is a static JavaScript app with a small Node server. Supabase Auth is configured for sign-in, but learner profiles, practice ratings, discussions, and class records stay in this browser. The role switch is for demonstration only and is not authorization. Class flows are not cross-device, concurrent, or safe for private production meeting links. There is no backend class API, Supabase Realtime, secure enrollment transaction, file storage, or server-enforced permission check yet.

The pasted target stack describes a production direction. The Supabase schema and backend services needed to make classes, ratings, and communities multi-user are not present in this prototype. Do not expose real meeting links or sensitive learner data in this prototype. Its class UI should be treated as a functional demo, not a deployment-ready secure class service.

The sign-in screen supports email/password, email magic links, password reset, and Google OAuth in the configured local preview. Passkeys are not implemented. Authentication currently serves the local preview entry flow only: existing demo pages and class operations are not yet gated by server-side auth or backed by RLS, so do not treat this prototype as a secure multi-user service. Other limitations: no external calendar sync or video-conferencing integration; no assignments, attendance, grades, or notifications. Opportunity matching uses a small local vocabulary. AI ratings and advice may be wrong and are neither certifications nor standardized scores.

## Routes

- `/` — sign-in entry; **Enter the local demo** opens the prototype without pretending to authenticate.
- `/studio` — video-to-form (also available from the dashboard).
- `/analytics` — practice ratings, evidence map, and rating history.
- `/profile` — professional profile preview and featured work.
- `/passport` — profile, projects, and evidence passport.
- `/opportunities` — opportunity translator.
- `/mentors` — searchable example mentor directory.
- `/communities` — local text discussion prototype.
- `/classes`, `/classes/my-classes`, `/mentor/classes`, `/calendar` — demo class and calendar flows.

## Checks

```sh
npm run check
npm test
```

Tests cover the existing evidence-matching behavior and timezone conversion, including a daylight-saving transition and a nonexistent local time.
