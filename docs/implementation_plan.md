# Phase 0: App Hygiene & Invisible Infrastructure

Transform the Code Weaver MVP into a production-ready app with proper error handling, authentication flows, and brutalist design system.

> [!IMPORTANT]
> **Design Constraints**: Brutalist design with zero colors (except status badges), Pirata One + Inter fonts, 2px borders, mobile-first approach.

---

## Proposed Changes

### Authentication & User Management

#### [MODIFY] [AuthModal.tsx](file:///Users/pranavpadmanabhan/Documents/The%20Good/code-weaver/src/components/AuthModal.tsx)
- Add "Forgot password?" link below password field (login mode only)
- Link calls `supabase.auth.resetPasswordForEmail(email)`
- Show toast: "Password reset email sent"

#### [NEW] [UserMenu.tsx](file:///Users/pranavpadmanabhan/Documents/The%20Good/code-weaver/src/components/UserMenu.tsx)
- Dropdown component for authenticated users
- Shows user display name/email
- Contains "Sign Out" action that:
  - Calls `signOut()` from AuthContext
  - Clears React Query cache
  - Redirects to `/`
  - Shows toast: "Signed out."

---

### Error Handling & States

#### [MODIFY] [NotFound.tsx](file:///Users/pranavpadmanabhan/Documents/The%20Good/code-weaver/src/pages/NotFound.tsx)
- Large Pirata One "404" heading
- Text: "This page does not exist in the Registry."
- Brutalist "Return Home" button (2px black border)

#### [NEW] [ErrorBoundary.tsx](file:///Users/pranavpadmanabhan/Documents/The%20Good/code-weaver/src/components/ErrorBoundary.tsx)
- Uses `react-error-boundary` package (needs install)
- Brutalist fallback: "Something broke. We'll fix it." + "Return Home" button
- Logs errors for debugging

#### [MODIFY] [App.tsx](file:///Users/pranavpadmanabhan/Documents/The%20Good/code-weaver/src/App.tsx)
- Wrap Routes with ErrorBoundary component

#### [NEW] [StoryCardSkeleton.tsx](file:///Users/pranavpadmanabhan/Documents/The%20Good/code-weaver/src/components/StoryCardSkeleton.tsx)
- 3-line shimmer loading state
- Uses `animate-pulse` + gray placeholders
- Matches ArticleCard dimensions

#### [NEW] [EmptyState.tsx](file:///Users/pranavpadmanabhan/Documents/The%20Good/code-weaver/src/components/EmptyState.tsx)
- Reusable empty state component
- Props: `title`, `description`, `actionLabel`, `onAction`
- Default: "The Registry is waiting for your truth." + "Write Story" button

---

### Toast Styling

#### [MODIFY] [sonner.tsx](file:///Users/pranavpadmanabhan/Documents/The%20Good/code-weaver/src/components/ui/sonner.tsx)
- Update `toastOptions.classNames` for brutalist design:
  - `border-2 border-black bg-white text-black font-mono`
- Force `theme="light"` instead of dynamic theming

---

## Dependencies to Install

```bash
npm install react-error-boundary
```

---

## Verification Plan

### Automated Tests

**TypeScript Compilation:**
```bash
cd /Users/pranavpadmanabhan/Documents/The\ Good/code-weaver
npx tsc --noEmit
```
Expected: Clean, no errors

**ESLint:**
```bash
cd /Users/pranavpadmanabhan/Documents/The\ Good/code-weaver
npm run lint -- --fix
```
Expected: Clean, no errors or warnings

### Manual Verification

1. **Login Flow**
   - Open http://localhost:8080
   - Click "Write" to trigger auth modal
   - Attempt login with valid credentials
   - Verify toast appears on success

2. **Logout Flow**
   - While logged in, click user menu
   - Click "Sign Out"
   - Verify toast: "Signed out."
   - Verify redirect to home page

3. **Forgot Password Flow**
   - Open auth modal in login mode
   - Click "Forgot password?" link
   - Enter email, submit
   - Verify toast: "Password reset email sent"

4. **404 Page**
   - Navigate to http://localhost:8080/nonexistent-page
   - Verify brutalist 404 design with Pirata One heading
   - Verify "Return Home" button works

5. **Error Boundary**
   - Temporarily add `throw new Error('test')` in a component
   - Verify fallback UI appears
   - Verify "Return Home" button works

6. **Empty States**
   - View empty feed/my stories section
   - Verify empty state message appears
   - Verify "Write Story" call-to-action

7. **Toast Styling**
   - Trigger any toast action
   - Verify brutalist styling (black border, mono font, white background)

---

## Phase 0 Fixes (Auth Reliability)

> [!CAUTION]
> **User Action Required**: Configure Supabase Dashboard → Authentication → URL Configuration:
> - Site URL: `http://localhost:8080`
> - Additional Redirect URLs: `http://localhost:8080/**` and `http://localhost:8080/reset-password`

### [MODIFY] [UserMenu.tsx](file:///Users/pranavpadmanabhan/Documents/The%20Good/code-weaver/src/components/UserMenu.tsx)
- Add `scope: 'local'` to signOut call
- Add fallback redirect with setTimeout to handle race conditions
- Better error handling with try/catch

### [MODIFY] [AuthModal.tsx](file:///Users/pranavpadmanabhan/Documents/The%20Good/code-weaver/src/components/AuthModal.tsx)
- Add `redirectTo: 'http://localhost:8080/reset-password'` to resetPasswordForEmail

### [NEW] [ResetPassword.tsx](file:///Users/pranavpadmanabhan/Documents/The%20Good/code-weaver/src/pages/ResetPassword.tsx)
- Password reset form with confirmation
- Validates password match and minimum length
- Uses `supabase.auth.updateUser()` to set new password
- Brutalist design matching app style

### [MODIFY] [App.tsx](file:///Users/pranavpadmanabhan/Documents/The%20Good/code-weaver/src/App.tsx)
- Add route: `<Route path="/reset-password" element={<ResetPassword />} />`

---

## Password Reset Final Fix

> [!NOTE]
> Issue: Password reset form not redirecting to homepage after success. Supabase uses URL hash fragments for recovery tokens.

### [MODIFY] [AuthModal.tsx](file:///Users/pranavpadmanabhan/Documents/The%20Good/code-weaver/src/components/AuthModal.tsx)
- Use dynamic origin: `${window.location.origin}/reset-password` instead of hardcoded localhost

### [MODIFY] [ResetPassword.tsx](file:///Users/pranavpadmanabhan/Documents/The%20Good/code-weaver/src/pages/ResetPassword.tsx)
- Parse hash fragment (`#access_token=...&type=recovery`) from URL
- Call `supabase.auth.getSession()` to refresh session before update
- Add loading state while session initializes
- Add invalid/expired link fallback UI
- Delayed redirect (800ms) after success toast for visibility

---

# Phase 1: Database & Types (Schema + RLS + Types)

Expand the `stories` table with production-ready columns, create a `disputes` table, lock down data with RLS policies, and update TypeScript types.

> [!IMPORTANT]
> All SQL below must be run in **Supabase Dashboard → SQL Editor**. The user runs each migration manually.

---

## Proposed Changes

### 1. Alter `stories` Table

> [!WARNING]
> The existing `status` enum changes from `('draft','pending_review','published')` to `('draft','pending','cooling','live','rejected')`. Any existing rows with `pending_review` or `published` must be migrated.

#### SQL Migration

```sql
-- Step 1: Add new columns
ALTER TABLE stories
  ADD COLUMN IF NOT EXISTS publish_at TIMESTAMPTZ,
  ADD COLUMN IF NOT EXISTS admin_notes TEXT,
  ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- Step 2: Migrate existing status values
UPDATE stories SET status = 'pending' WHERE status = 'pending_review';
UPDATE stories SET status = 'live' WHERE status = 'published';

-- Step 3: Update the status check constraint
-- (Drop old constraint if it exists, then add new one)
ALTER TABLE stories DROP CONSTRAINT IF EXISTS stories_status_check;
ALTER TABLE stories ADD CONSTRAINT stories_status_check
  CHECK (status IN ('draft','pending','cooling','live','rejected'));
```

---

### 2. Create `disputes` Table

```sql
CREATE TABLE IF NOT EXISTS disputes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID NOT NULL REFERENCES stories(id) ON DELETE CASCADE,
  reporter_id UUID NOT NULL REFERENCES auth.users(id),
  reason TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open','reviewing','resolved','dismissed')),
  admin_response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

### 3. RLS Policies

```sql
-- Enable RLS on both tables
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE disputes ENABLE ROW LEVEL SECURITY;

-- ── stories ──

-- Public can only read live stories past their publish date
CREATE POLICY "Public read live stories" ON stories
  FOR SELECT USING (
    status = 'live' AND (publish_at IS NULL OR publish_at <= NOW())
  );

-- Authenticated users can insert their own stories
CREATE POLICY "Auth insert own stories" ON stories
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = author_id);

-- Authors can update their own draft stories
CREATE POLICY "Authors update own drafts" ON stories
  FOR UPDATE TO authenticated
  USING (auth.uid() = author_id AND status = 'draft')
  WITH CHECK (auth.uid() = author_id);

-- Admin full access (reads all, updates all)
CREATE POLICY "Admin full access stories" ON stories
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'editor')
  );

-- ── disputes ──

-- Anyone authenticated can report a dispute
CREATE POLICY "Auth insert disputes" ON disputes
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = reporter_id);

-- Admin can read and update all disputes
CREATE POLICY "Admin manage disputes" ON disputes
  FOR ALL TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'editor')
  );
```

---

### 4. Update TypeScript Types

#### [MODIFY] [database.types.ts](file:///Users/pranavpadmanabhan/Documents/The%20Good/code-weaver/src/lib/database.types.ts)
- Update `stories.status` enum: `'draft' | 'pending' | 'cooling' | 'live' | 'rejected'`
- Add `publish_at`, `admin_notes`, `views` fields to Row/Insert/Update
- Add `disputes` table type with Row/Insert/Update
- Add `Dispute` helper type export

---

## Verification Plan

### Automated
```bash
npx tsc --noEmit
```

### Manual (Supabase Dashboard)
1. **RLS tester**: Test `SELECT` on stories as anon → should only return `live` stories
2. **RLS tester**: Test `INSERT` on stories as authenticated → should succeed
3. **SQL Editor**: Insert a test story with `status = 'draft'` → confirm it does NOT appear in anon select
4. **SQL Editor**: Insert a test story with `status = 'live', publish_at = NOW()` → confirm it DOES appear

---

# Phase 2: Writer Flow + Category Labels

Rewrite the `/write` page with proper form validation, wire to real database, create `/my-stories` page with status badges and category labels.

> [!IMPORTANT]
> `react-hook-form` (^7.61.1) and `zod` (^3.25.76) are already installed. The existing `EditorView` component has anti-paste and writing metrics — we'll preserve its approach.

---

## Proposed Changes

### 1. Rewrite `/write` Page

#### [MODIFY] [Write.tsx](file:///Users/pranavpadmanabhan/Documents/The%20Good/code-weaver/src/pages/Write.tsx)
- Replace mock `handlePublish` with real `createStory()` call
- Import `useAuth` for `user.id` as `author_id`
- On submit → `status='pending'`, toast "Story submitted for review", redirect `/my-stories`
- Keep existing `EditorView` component (it already handles anti-paste + metrics)

#### [MODIFY] [EditorView.tsx](file:///Users/pranavpadmanabhan/Documents/The%20Good/code-weaver/src/components/EditorView.tsx)
- Add Zod validation schema:
  - `title`: min 5 characters
  - `content`: min 50 words
  - `category`: required, one of `good | bad | ugly`
  - `evidenceUrl`: optional but valid URL if provided
- Show inline validation errors below each field
- Replace internal toast with Sonner toast for paste blocking
- Keep existing anti-paste (`e.preventDefault()`) + writing metrics tracking

---

### 2. Create `/my-stories` Page

#### [NEW] [MyStories.tsx](file:///Users/pranavpadmanabhan/Documents/The%20Good/code-weaver/src/pages/MyStories.tsx)
- Auth guard: redirect to `/` if not logged in
- TanStack Query: `useQuery(['my-stories', user.id], () => fetchUserStories(user.id))`
- Loading state: `StoryCardSkeleton` grid
- Empty state: `EmptyState` component with "Write your first story" CTA
- Story cards: show title, category label, status badge, created date
- Click → navigate to `/story/:id`

#### [MODIFY] [App.tsx](file:///Users/pranavpadmanabhan/Documents/The%20Good/code-weaver/src/App.tsx)
- Add `<Route path="/my-stories" element={<MyStories />} />`

#### [MODIFY] [AppHeader.tsx](file:///Users/pranavpadmanabhan/Documents/The%20Good/code-weaver/src/components/AppHeader.tsx)
- Add "My Stories" nav link for authenticated users

---

### 3. Status Badges

#### [NEW] [StatusBadge.tsx](file:///Users/pranavpadmanabhan/Documents/The%20Good/code-weaver/src/components/StatusBadge.tsx)
- Props: `status: StoryStatus`, `publishAt?: string`, `adminNotes?: string`
- Styling per status:

| Status | Border | Text | Extra |
|--------|--------|------|-------|
| `draft` | 2px dashed gray | DRAFT | — |
| `pending` | 2px solid gray | PENDING | — |
| `cooling` | 2px solid blue | COOLING | Countdown to `publish_at` |
| `live` | 2px solid black | LIVE | — |
| `rejected` | 2px solid red | REJECTED | Expandable `admin_notes` |

---

### 4. Category Labels

#### [NEW] [CategoryLabel.tsx](file:///Users/pranavpadmanabhan/Documents/The%20Good/code-weaver/src/components/CategoryLabel.tsx)
- Props: `category: 'good' | 'bad' | 'ugly'`
- Display:

| Category | Label | Subtitle |
|----------|-------|----------|
| `good` | GOOD | Hope |
| `bad` | BAD | Failure |
| `ugly` | UGLY | Fallout |

- Styling: uppercase, bold, 2px black border, `font-display`

---

## Verification Plan

### Automated
```bash
npx tsc --noEmit
```

### Manual
1. Submit story → verify it appears in `/my-stories` with `pending` badge + correct category label
2. Paste in content textarea → verify error toast + paste blocked
3. Try submitting with title < 5 chars → verify validation error
4. Try submitting with content < 50 words → verify validation error
5. Disconnect network → verify skeleton loading + error boundary

