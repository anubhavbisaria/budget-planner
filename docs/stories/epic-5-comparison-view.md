# Epic 5 — Scenario Comparison View

**Goal:** Side-by-side table showing all scenarios with per-category subtotals, income, and surplus/deficit. Accessible via "⇄ Compare All" in the sidebar.

---

## Story 5.1 — Comparison data fetch

**As a** developer  
**I want** a single API call that returns all scenarios' category totals  
**So that** the comparison view can render without multiple round trips

**Acceptance Criteria:**
- `GET /scenarios/compare` returns array of scenario objects each with `category_totals` dict (see `architecture.md`)
- `api.js` `compareScenarios()` function fetches this endpoint
- Called in `App.jsx` when `activeView === 'compare'` is activated (and on each activation to stay fresh)

**Tasks:**
1. Verify backend `GET /scenarios/compare` is correctly implemented (Epic 1 prerequisite)
2. Dispatch `LOAD_DETAIL` (or a new `LOAD_COMPARE` action) with comparison data on view activation

---

## Story 5.2 — Comparison table rendering

**As a** user  
**I want** to see all my scenarios side-by-side  
**So that** I can compare how different budget choices affect my surplus

**Acceptance Criteria:**
- `ComparisonView.jsx` renders a table:
  - Columns: one per scenario (scenario name as header)
  - Rows: one section per category found in ANY scenario
  - Cell value: formatted dollar amount or "—" if scenario has no items in that category
- Pinned rows at table bottom:
  1. **Total Expenses** (bold, separator line above)
  2. **Income**
  3. **Surplus / Deficit** (green background if positive, red if negative)
- Category order: same canonical order as `SEED_ITEMS` where applicable; custom categories appended
- Values formatted as `$X,XXX` (no decimals)

**Tasks:**
1. Create `ComparisonView.jsx`
2. Build `buildCompareRows(scenarios)` helper:
   - Collects union of all category names across all scenarios
   - Sorts by canonical category order, custom categories last
   - Returns row array: `[{ category, values: [amountOrNull, ...] }]`
3. Render table with category section headers matching fintech mockup style
4. Verify with 2 scenarios that have different category sets

---

## Story 5.3 — Comparison view styling

**As a** user  
**I want** the comparison table to look consistent with the rest of the app  
**So that** the experience feels cohesive

**Acceptance Criteria:**
- Dark table: background `#16181f`, header row `#1e2028`, text `#aaa`
- Category section headers: `#0f1117` background, `#444` text, uppercase, smaller font
- Total/Income rows: `#1a1c24` background
- Surplus cell: `background: #0a2e20; color: #00c896` when positive
- Deficit cell: `background: #2e0a0a; color: #ff4d4d` when negative
- Consistent with fintech mockup compare table

**Tasks:**
1. Add scoped CSS for comparison table (in `ComparisonView.jsx` via `<style>` or separate `.css` import)
