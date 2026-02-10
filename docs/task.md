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

## Future Phases
- Phase 2: TBD
- Phase 3: TBD

---

## Change Log
| Date | Phase | Change |
|------|-------|--------|
| 2026-02-09 | 0 | Initial task breakdown created |
| 2026-02-09 | 0 | Implemented: logout, forgot password, 404, error boundary, skeletons, empty states, toast styling |
| 2026-02-09 | 0 | FIX: Auth reliability - logout race condition, password reset redirect, ResetPassword page |
| 2026-02-10 | 1 | Added Phase 1: Database & Types plan |

