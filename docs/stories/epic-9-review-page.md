# Epic 9 — Review / Share Page

**Goal:** A clean, light-theme, screenshot-optimised single-scenario summary page. Designed to look great when screenshotted on a mobile device and shared.

---

## Story 9.1 — Review page component

**As a** user  
**I want** a dedicated review page for my scenario  
**So that** I can take a screenshot and share my budget with others

**Acceptance Criteria:**
- `ReviewPage.jsx` renders when `activeView === 'review'`
- Receives `detail` (full scenario object) from global state
- Light theme: white background (`#ffffff`), dark text (`#1a1a2e`) — regardless of app dark theme
- Fixed max-width: 390px, centred horizontally with `margin: 0 auto`
- On mobile: fills full viewport width with 16px horizontal padding
- "← Back" button at top returns to detail view (dispatches `SET_VIEW('detail')`)
- "🖨️ Print / Save PDF" button calls `window.print()`

**Tasks:**
1. Create `ReviewPage.jsx`
2. Add `SET_VIEW('review')` dispatch to a "📋 Review" button in `ScenarioDetail.jsx` header (desktop) and `BottomTabs.jsx` (mobile)
3. Verify component renders with correct scenario data

---

## Story 9.2 — Review page header

**As a** user  
**I want** the review page to be clearly labelled  
**So that** the screenshot is identifiable when shared

**Acceptance Criteria:**
- Top section shows:
  - Left: app name "BudgetWise" in small caps, muted colour
  - Right: month + year of generation (`April 2026` — uses `new Date()`)
- Below header: scenario name in large bold text (e.g. "Current")
- Thin horizontal rule divides header from body
- Fonts: system sans-serif (no external font dependency)

**Tasks:**
1. Implement header section in `ReviewPage.jsx`
2. Date formatting: `new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })`

---

## Story 9.3 — Review page stat boxes

**As a** user  
**I want** to see income, expenses, and surplus prominently  
**So that** the key numbers are immediately visible in the screenshot

**Acceptance Criteria:**
- Three stat boxes in a row (same width):
  1. **Income** — `#1a1a2e` text
  2. **Expenses** — `#1a1a2e` text
  3. **Surplus / Deficit** — green (`#1a7a3a`) if positive, red (`#c62828`) if negative
- Each box: label (small caps, muted) above value (large bold)
- Boxes separated by thin vertical dividers
- On very narrow screens (< 360px): stack to 1 column

**Tasks:**
1. Implement stat boxes section
2. Reuse `formatCurrency` from `src/utils.js`

---

## Story 9.4 — Review page category rows

**As a** user  
**I want** to see all expense categories in the review  
**So that** the full breakdown is visible in the screenshot

**Acceptance Criteria:**
- One row per category with non-zero total (skip $0 categories)
- Row layout: `[icon] [category name] .............. [amount]`
- Below each category name: a thin filled progress bar (% of income), coloured per `CATEGORY_META`
- Bar width capped at 100%
- If income = 0, bars not shown (just amounts)
- Custom categories: `📌` icon, `#8b949e` bar colour
- Font size: 14px; amount: right-aligned, bold

**Tasks:**
1. Implement category rows using `CATEGORY_META` from `src/constants.js`
2. Only render categories where `sum(items.amount) > 0`
3. Sort by canonical category order (same as `SEED_ITEMS` order)

---

## Story 9.5 — Review page donut chart (compact)

**As a** user  
**I want** a compact spending-mix chart in the review  
**So that** the visual breakdown is preserved in the screenshot

**Acceptance Criteria:**
- Reuses `DonutChart.jsx` component, passed `compact={true}` prop
- In compact mode: SVG diameter 120px, legend in 2-column grid (not single column)
- Displayed below the category rows
- Only shown if `total_expenses > 0` (no empty donut)

**Tasks:**
1. Add `compact` prop to `DonutChart.jsx` that adjusts SVG size and legend layout
2. Render in `ReviewPage.jsx` at bottom of card

---

## Story 9.6 — Review page footer

**As a** user  
**I want** a watermark footer  
**So that** the screenshot source is identifiable

**Acceptance Criteria:**
- Footer text: "Generated with BudgetWise · Local Budget Planner"
- Small, centred, muted grey (`#9ca3af`)
- Horizontal rule above footer
- Not printed on the Back/Print buttons row

**Tasks:**
1. Implement footer in `ReviewPage.jsx`

---

## Story 9.7 — Print stylesheet

**As a** user  
**I want** a clean print output when I use "Print / Save as PDF"  
**So that** I can save the review as a PDF without nav chrome

**Acceptance Criteria:**
- `@media print` CSS rules:
  - Hide: `.no-print` class (applied to Back button, Print button, bottom tab bar)
  - `body` background: `#ffffff`; `color`: `#000`
  - Review card: full width, no box shadow, no border radius
  - Page margins: `@page { margin: 1cm }`
  - Force single page if possible (avoid page breaks inside category rows)

**Tasks:**
1. Add `@media print` block to `ReviewPage.jsx` CSS (or `global.css`)
2. Apply `no-print` class to navigation elements
3. Verify: Chrome → Print → Save as PDF produces clean single-page output
