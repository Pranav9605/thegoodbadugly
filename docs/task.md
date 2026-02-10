# Code Weaver: MVP → Production Upgrade

## Project Overview
Transform the existing Code Weaver MVP into a bullet-proof production app, scalable to 10k monthly users.

**Design Constraints:**
- Brutalist design, zero colors except status badges
- Fonts: Pirata One + Inter
- 2px borders, mobile-first

---

## Phase 0: App Hygiene & Invisible Infrastructure

### 0.1 Authentication & User Management
- [x] **Logout functionality** - Add signOut to user menu/sidebar with toast confirmation
- [x] **Forgot Password** - Add reset password link in login modal

### 0.2 Error Handling & States
- [x] **404 Page** - Redesign with Pirata One "404" + brutalist styling
- [x] **Error Boundary** - Wrap routes with react-error-boundary
- [x] **Loading Skeletons** - Create `StoryCardSkeleton.tsx` with shimmer effect
- [x] **Empty States** - Add proper empty states for My Stories, Jury, Feed

### 0.3 Toast Styling
- [x] **Sonner Toasts** - Apply brutalist theme (2px black border, mono font)

### 0.4 Validation
- [x] Run `tsc --noEmit` → passed clean ✓
- [x] Run `eslint . --fix` → pre-existing issues in shadcn/services (not from Phase 0)
- [ ] Manual flow: login → logout → forgot password → broken URL → empty dashboard → toast

### 0.5 Phase 0 Fixes (Auth Reliability)
- [x] **Fix Logout** - Add `scope: 'local'`, cache clear race handling, fallback redirect
- [x] **Fix Forgot Password** - Add `redirectTo` parameter for proper redirect
- [x] **Create ResetPassword page** - New `/reset-password` route with password update form
- [x] **Supabase Dashboard** - User configured Site URL + redirect URLs

### 0.6 Password Reset Final Fix
- [x] **Dynamic redirectTo** - Use `window.location.origin` instead of hardcoded URL
- [x] **Hash fragment parsing** - Parse `#access_token=...&type=recovery` from URL
- [x] **Session refresh** - Call `getSession()` before `updateUser()`
- [x] **Homepage redirect** - Delayed redirect after success toast

---

## Phase 1: Database & Types (Schema + RLS + Types)

### 1.1 Alter `stories` Table
- [x] Expand `status` enum: `draft` → `pending` → `cooling` → `live` → `rejected`
- [x] Add `publish_at TIMESTAMPTZ` column
- [x] Add `admin_notes TEXT` column
- [x] Add `views INTEGER DEFAULT 0` column

### 1.2 Create `disputes` Table
- [x] Create table with: `id`, `story_id` (FK), `reporter_id`, `reason`, `status`, `admin_response`, timestamps

### 1.3 RLS Policies
- [x] **stories**: Public `SELECT` only where `status = 'live'` AND `publish_at <= now()`
- [x] **stories**: Authenticated `INSERT` (own stories)
- [x] **stories**: Admin `UPDATE`/`SELECT ALL`
- [x] **disputes**: Public `INSERT`
- [x] **disputes**: Admin `SELECT`/`UPDATE`

### 1.4 Generate & Update Types
- [x] Update `database.types.ts` with new fields + disputes table
- [x] Update `stories.ts` with new status values (`pending`, `live`)
- [x] Run `tsc --noEmit` → clean ✓

### 1.5 Validation
- [x] SQL migrations run by user in Supabase Dashboard ✓
- [x] `tsc --noEmit` clean ✓

---

## Phase 2: Writer Flow + Category Labels (Anti-AI + My Stories)

### 2.1 Rewrite `/write` Page
- [x] Add Zod schema: title ≥5 chars, content ≥50 words, category required
- [x] Zod validation inline in EditorView (no react-hook-form needed — existing controlled state works)
- [x] Wire to real DB via `createStory()` → `status='pending'`
- [x] Toast: "Story submitted for review" + redirect to `/my-stories`
- [x] Anti-paste on content textarea (kept existing paste blocking + switched to Sonner toast)

### 2.2 Create `/my-stories` Page
- [x] New `MyStories.tsx` page component
- [x] Add route in `App.tsx`
- [x] TanStack Query: fetch user's stories via `fetchUserStories()`
- [x] Loading skeleton + empty state
- [x] Link from navigation/header

### 2.3 Status Badges
- [x] `StatusBadge.tsx` component with brutalist borders
  - `pending` → gray border
  - `cooling` → blue border + countdown timer
  - `rejected` → red border + admin_notes disclosure
  - `live` → black border (solid)
  - `draft` → dashed border

### 2.4 Category Labels
- [x] `CategoryLabel.tsx` component
  - GOOD → "Hope" subtitle
  - BAD → "Failure" subtitle
  - UGLY → "Fallout" subtitle
- [x] Bold text, 2px border, used in My Stories + Story cards

### 2.5 Validation
- [ ] Submit story → appears in My Stories with correct badge + category
- [x] Paste attempt → error toast (Sonner)
- [x] `tsc --noEmit` clean ✓
- [x] No network → skeleton + error boundary

---

## Future Phases
- Phase 3: TBD

---

## Change Log
| Date | Phase | Change |
|------|-------|--------|
| 2026-02-09 | 0 | Initial task breakdown created |
| 2026-02-09 | 0 | Implemented: logout, forgot password, 404, error boundary, skeletons, empty states, toast styling |
| 2026-02-09 | 0 | FIX: Auth reliability - logout race condition, password reset redirect, ResetPassword page |
| 2026-02-10 | 1 | Added Phase 1: Database & Types plan |
| 2026-02-10 | 2 | Added Phase 2: Writer Flow + Category Labels plan |
