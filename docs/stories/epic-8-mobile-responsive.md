# Epic 8 — Mobile Responsive Layout

**Goal:** The full app is usable on mobile phones. Sidebar replaced by bottom tab bar; all content stacks vertically; touch targets meet 44px minimum.

---

## Story 8.1 — Mobile-first CSS base

**As a** developer  
**I want** the global CSS to use a mobile-first approach  
**So that** mobile is the base and desktop is an enhancement

**Acceptance Criteria:**
- `global.css` default styles target mobile (no fixed widths, single column where needed)
- All desktop-specific layout (sidebar + main side-by-side, multi-column KPI grid) lives inside `@media (min-width: 768px)` blocks
- Existing desktop layout is visually unchanged at ≥ 768px
- No horizontal scroll on any screen ≤ 390px wide

**Tasks:**
1. Audit all existing CSS for hardcoded widths that break at mobile
2. Move desktop layout into `@media (min-width: 768px)` blocks
3. Verify: DevTools mobile emulation at 390px shows no horizontal overflow

---

## Story 8.2 — Hide sidebar on mobile

**As a** user on mobile  
**I want** the sidebar to be hidden  
**So that** the main content area fills the full screen width

**Acceptance Criteria:**
- `#sidebar` has `display: none` by default (mobile-first)
- `@media (min-width: 768px)` sets `#sidebar { display: flex; width: 240px }`
- Main panel takes full viewport width on mobile

**Tasks:**
1. Add responsive display rules to `Sidebar.jsx` CSS

---

## Story 8.3 — Bottom tab bar

**As a** user on mobile  
**I want** a bottom navigation bar  
**So that** I can switch between scenarios, compare, and review with my thumb

**Acceptance Criteria:**
- `BottomTabs.jsx` renders a fixed bar at the bottom of the viewport, 60px tall, dark background `#16181f`, top border `#252830`
- Four tabs:
  1. **Scenarios** (☰ icon) — opens `ScenarioListSheet`
  2. **Detail** (📊 icon) — shows active scenario detail
  3. **Compare** (⇄ icon) — shows comparison view
  4. **Review** (📋 icon) — shows review page for active scenario
- Active tab: teal (`#00c896`) icon + label; inactive: `#4a5060`
- Tab bar only visible at `< 768px` (hidden on desktop via `@media`)
- Bottom tab bar adds `padding-bottom: 60px` to main content to prevent overlap

**Tasks:**
1. Create `BottomTabs.jsx`
2. Wire tab actions to dispatch `SET_VIEW` and `SET_ACTIVE` as appropriate
3. Add `@media (min-width: 768px) { display: none }` to tab bar

---

## Story 8.4 — Scenario list sheet (mobile)

**As a** user on mobile  
**I want** to see and switch between scenarios  
**So that** I can navigate without a permanent sidebar

**Acceptance Criteria:**
- `ScenarioListSheet.jsx` renders as a full-screen overlay when "Scenarios" tab is tapped
- Shows all scenarios with name + surplus/deficit badge (same as sidebar)
- "× Close" button at top-right dismisses the sheet
- Tapping a scenario: sets it as active, closes sheet, navigates to detail view
- "+ New Scenario" button at bottom of list

**Tasks:**
1. Create `ScenarioListSheet.jsx` with slide-up animation (CSS `transform: translateY`)
2. Manage `sheetOpen` local state in `App.jsx`

---

## Story 8.5 — Mobile KPI tiles

**As a** user on mobile  
**I want** the income/expenses/surplus tiles to stack vertically  
**So that** they are readable on a narrow screen

**Acceptance Criteria:**
- KPI grid: default (mobile) = `grid-template-columns: 1fr` (3 rows)
- Desktop: `grid-template-columns: repeat(3, 1fr)` (3 columns)
- Surplus tile still uses green/red background regardless of stack direction

**Tasks:**
1. Update `StatsStrip.jsx` CSS with responsive grid

---

## Story 8.6 — Mobile donut chart layout

**As a** user on mobile  
**I want** the donut chart and category list to stack vertically  
**So that** both are visible without horizontal scrolling

**Acceptance Criteria:**
- On mobile: donut chart card sits above the category list (full width)
- On desktop: donut chart card sits to the left of the category list (220px fixed width)
- Donut SVG resizes: 160px diameter on mobile, 120px on desktop

**Tasks:**
1. Make the `overview-row` flex container `flex-direction: column` by default, `row` at ≥ 768px
2. Adjust donut SVG `viewBox` size via CSS `width`/`height`

---

## Story 8.7 — Mobile comparison table

**As a** user on mobile  
**I want** to scroll the comparison table horizontally  
**So that** I can see all scenario columns without layout breaking

**Acceptance Criteria:**
- Comparison table is wrapped in `<div style="overflow-x: auto">`
- Table minimum width: `max(100%, count_of_scenarios × 120px + 200px)`
- First column ("Category") is sticky left on mobile (`position: sticky; left: 0`)
- Sticky column has same background as table to prevent bleed-through

**Tasks:**
1. Wrap `<table>` in `ComparisonView.jsx` with scrollable container
2. Apply `sticky` to first column cells

---

## Story 8.8 — Touch target sizing

**As a** user on mobile  
**I want** all interactive elements to be easy to tap  
**So that** I don't accidentally hit the wrong button

**Acceptance Criteria:**
- All buttons, tab items, and clickable rows: `min-height: 44px`
- Line item rows (name + amount inputs): `padding: 12px 16px` on mobile (up from 8px)
- Delete item "×" button: `width: 44px; height: 44px; display: flex; align-items: center; justify-content: center`

**Tasks:**
1. Audit touch targets in `LineItem.jsx`, `CategoryCard.jsx`, `BottomTabs.jsx`
2. Add mobile-specific padding rules
