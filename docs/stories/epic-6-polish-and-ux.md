# Epic 6 — Polish & UX

**Goal:** Edge cases handled, error states surfaced, small UX details that make the app feel complete.

---

## Story 6.1 — Loading states

**As a** user  
**I want** visual feedback when data is loading  
**So that** I know the app is working and not frozen

**Acceptance Criteria:**
- While `state.loading === true`, main panel shows a subtle loading indicator (simple text "Loading…" or spinner CSS animation — no library)
- Loading is triggered on: initial fetch, scenario switch, any blur-save that causes a re-fetch
- Loading indicator does not flash for fast responses (< 100 ms); use a 100 ms delay before showing it

**Tasks:**
1. Add loading state to reducer
2. Create minimal `Spinner.jsx` (CSS animation, no library)
3. Show/hide in `App.jsx` render based on `state.loading`

---

## Story 6.2 — Error banner

**As a** user  
**I want** to see a clear message if the API call fails  
**So that** I know something went wrong and can take action

**Acceptance Criteria:**
- If any API call throws, dispatch `SET_ERROR` with message
- Error banner renders at top of main panel: red/dark background, error message, dismiss "×" button
- Banner auto-dismissed after 5 seconds
- Does not crash the app; existing data remains visible

**Tasks:**
1. Add `error` to state; reducer handles `SET_ERROR` and `CLEAR_ERROR`
2. Create `ErrorBanner.jsx`
3. Wrap all `api.js` calls in `try/catch` and dispatch error

---

## Story 6.3 — Input validation

**As a** user  
**I want** the app to handle bad input gracefully  
**So that** I can't accidentally break my budget data

**Acceptance Criteria:**
- Scenario name: empty string on blur → revert to previous name (no API call, no error)
- Item name: empty string on blur → revert to previous name
- Item amount: non-numeric or negative on blur → save as 0 (not an error)
- Income: non-numeric or negative on blur → save as 0
- All number inputs use `type="number"` with `min="0"`

**Tasks:**
1. Add validation logic to blur handlers in `StatsStrip.jsx` and `LineItem.jsx`
2. Verify: type letters into amount field, blur → shows 0

---

## Story 6.4 — Keyboard navigation

**As a** user  
**I want** to use the keyboard to move between fields  
**So that** data entry is fast without reaching for the mouse

**Acceptance Criteria:**
- `Enter` key in scenario name input: triggers same save as `blur`
- `Enter` key in item name input: moves focus to the amount input in the same row
- `Enter` key in item amount input: blurs (saves) and moves focus to name input of next row (or "+ Add item" button if last row)
- `Tab` follows natural DOM order

**Tasks:**
1. Add `onKeyDown` handlers to inputs in `LineItem.jsx` and `StatsStrip.jsx`
2. Use `ref` arrays for next-item focus in `CategoryCard.jsx`

---

## Story 6.5 — Number formatting

**As a** user  
**I want** amounts to display as formatted currency  
**So that** large numbers are easy to read

**Acceptance Criteria:**
- All display-only values (KPI tiles, category totals, comparison table) formatted as `$X,XXX` (comma separator, no decimals)
- Input fields show raw numbers (no comma formatting while editing)
- Formatting handled by a shared `formatCurrency(amount)` utility in `src/utils.js`

**Tasks:**
1. Create `src/utils.js` with `formatCurrency(n)` → `'$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 })`
2. Replace all inline formatting with this utility

---

## Story 6.6 — Global CSS and dark theme

**As a** developer  
**I want** a single global CSS file that sets the dark theme baseline  
**So that** all components inherit consistent colours and typography

**Acceptance Criteria:**
- `src/styles/global.css` sets: `background: #0f1117`, `color: #e8eaf0`, base font, `box-sizing: border-box`
- Scrollbar styled dark (webkit scrollbar CSS)
- Imported in `main.jsx`
- Colour tokens documented as CSS custom properties:
  ```css
  :root {
    --bg-base: #0f1117;
    --bg-surface: #16181f;
    --bg-elevated: #1e2028;
    --border: #252830;
    --text-primary: #e8eaf0;
    --text-secondary: #8b949e;
    --text-muted: #4a5060;
    --accent-teal: #00c896;
    --accent-blue: #00a3e0;
    --surplus-bg: #0a2e20;
    --surplus-text: #00c896;
    --deficit-bg: #2e0a0a;
    --deficit-text: #ff4d4d;
  }
  ```

**Tasks:**
1. Create `src/styles/global.css` with tokens and base styles
2. Update all components to use CSS variables where they currently use hardcoded colours
