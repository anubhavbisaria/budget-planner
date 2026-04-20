# Epic 3 — Scenario Detail View

**Goal:** Full scenario detail page with income input, KPI tiles (income / expenses / surplus), and the category + line-item list. All edits persist on blur.

---

## Story 3.1 — Scenario header (name editing)

**As a** user  
**I want** to rename a scenario by clicking its title  
**So that** I can give it a meaningful name

**Acceptance Criteria:**
- `ScenarioDetail.jsx` renders scenario name as a controlled text input
- On `blur`: if name is non-empty (trimmed), call `updateScenario(id, { name })` then reload sidebar list
- On `blur` with empty value: revert input to previous name (no API call)
- "Delete" button triggers `window.confirm()`, then `deleteScenario(id)`, then navigates to first remaining scenario or shows empty state

**Tasks:**
1. Create `ScenarioDetail.jsx` with header section
2. Manage local `editName` state separate from global state
3. Wire delete flow

---

## Story 3.2 — Stats strip (KPI tiles)

**As a** user  
**I want** to see income, total expenses, and surplus/deficit at a glance  
**So that** I always know my financial position

**Acceptance Criteria:**
- `StatsStrip.jsx` renders three tiles: Monthly Income (editable), Total Expenses (read-only), Surplus/Deficit (read-only)
- Income tile: number input; on `blur` call `updateScenario(id, { income })` then reload detail
- Surplus tile: green background + teal text (`#00c896`) when positive; red background + red text (`#ff4d4d`) when negative or zero
- Label switches: "Surplus" when `surplus >= 0`, "Deficit" when `surplus < 0`
- Values formatted as `$X,XXX` (no decimals)
- Design matches fintech mockup KPI row

**Tasks:**
1. Create `StatsStrip.jsx`
2. Currency formatter utility function (shared across components)
3. Verify: change income → surplus tile updates after blur

---

## Story 3.3 — Category cards (read)

**As a** user  
**I want** to see my expenses grouped by category  
**So that** I can understand where my money goes

**Acceptance Criteria:**
- `CategoryCard.jsx` renders: emoji icon, category name, total badge, progress bar, and list of line items
- Progress bar fill = `(category_total / income) * 100%`, capped at 100%, colour from palette in `architecture.md`
- If income = 0, progress bar shows 0%
- Line items render name (left) and amount (right) for each item
- Category ordering: same as `SEED_ITEMS` insertion order (Housing first, Savings last)

**Tasks:**
1. Create `CategoryCard.jsx`
2. Define `CATEGORY_META` constant (colour + icon per category name); default for unknowns: `{ color: '#8b949e', icon: '📌' }`
3. Render all categories from `state.detail.categories`

---

## Story 3.4 — Line item editing

**As a** user  
**I want** to edit an expense name and amount inline  
**So that** I can adjust my budget without leaving the page

**Acceptance Criteria:**
- `LineItem.jsx` has two controlled inputs: name (text) and amount (number, right-aligned)
- Both inputs save on `blur` via `updateItem(id, { name })` or `updateItem(id, { amount })`
- Amount input: if value is non-numeric or negative, revert to 0 on blur (no negative expenses)
- Focus styles: input text turns `#00c896` (teal) on focus
- After save: dispatch `LOAD_DETAIL` with re-fetched scenario so totals + progress bars update

**Tasks:**
1. Create `LineItem.jsx`
2. Handle amount validation on blur
3. Verify: edit amount → category total, expenses KPI, and surplus all update

---

## Story 3.5 — Add item

**As a** user  
**I want** to add a new expense to any category  
**So that** I can track items not in the default list

**Acceptance Criteria:**
- Each `CategoryCard` has a "+ Add item" button at the bottom
- Clicking calls `createItem({ scenario_id, category, name: 'New item', amount: 0 })`
- New item appears immediately; name input is auto-focused via `useEffect` + `ref`
- After creation: `LOAD_DETAIL` re-fetch (new item's `id` comes from API response)

**Tasks:**
1. Add `onAddItem` handler in `ScenarioDetail`, passed to each `CategoryCard`
2. Auto-focus logic in `LineItem` via `autoFocus` prop

---

## Story 3.6 — Delete item

**As a** user  
**I want** to delete an expense line item  
**So that** I can remove items I don't need

**Acceptance Criteria:**
- Each `LineItem` shows a "×" delete button, visible on row hover only (CSS `opacity: 0` → `1` on `.line-item:hover`)
- No confirmation dialog (amounts are easily re-added)
- Clicking calls `deleteItem(id)` then dispatches `LOAD_DETAIL` re-fetch

**Tasks:**
1. Add delete button and hover visibility to `LineItem.jsx`
2. Wire handler

---

## Story 3.7 — Add custom category

**As a** user  
**I want** to create a new expense category  
**So that** I can track items outside the standard list

**Acceptance Criteria:**
- "+ Add Category" button appears below all category cards
- Clicking calls `createItem({ scenario_id, category: 'New Category', name: 'New item', amount: 0 })`
- This creates a new category group with one item; the category name and item name are both editable inline
- After creation: `LOAD_DETAIL` re-fetch renders the new group using default `📌` icon and `#8b949e` colour

**Tasks:**
1. Add "Add Category" button to `ScenarioDetail.jsx`
2. Verify new category appears in correct position and comparison view
