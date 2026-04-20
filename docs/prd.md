# Product Requirements Document — Budget Planner

## Overview

Local-only monthly budget planner with multi-scenario modelling, fintech-style dark dashboard UI. See `docs/project-brief.md` for vision and constraints.

---

## Feature Areas

### F1 — Scenario Management

**F1.1 Create scenario**
- User clicks "+ New Scenario" in sidebar
- App creates a new scenario named "New Scenario" (editable) with `income = 0`
- All standard seed categories and items are inserted automatically (amount = 0)
- New scenario appears in sidebar immediately; app navigates to it

**F1.2 Rename scenario**
- Scenario name is an inline text input in the detail header
- Saving: on `blur` or `Enter` key — calls `PUT /scenarios/{id}`
- Validation: name must be non-empty after trim; revert to previous on empty blur

**F1.3 Delete scenario**
- "Delete" button in scenario header
- Requires `window.confirm()` confirmation
- All associated budget items are cascade-deleted by the DB
- After deletion: navigate to the first remaining scenario, or show empty state

**F1.4 Scenario list (sidebar)**
- Shows all scenario names sorted by `created_at` ascending
- Each entry shows a surplus/deficit badge (green `+$X` or red `−$X`)
- Active scenario highlighted with left border accent

---

### F2 — Income & Surplus

**F2.1 Income input**
- Prominent number input at the top of the scenario detail view
- Label: "Monthly Income"
- Saves on `blur` via `PUT /scenarios/{id}`
- Must be ≥ 0

**F2.2 Surplus / deficit display**
- `surplus = income − total_expenses`
- Displayed as a KPI tile: green background + teal text when positive; red background + red text when deficit
- Label switches: "Surplus" vs "Deficit"
- Updates immediately after any income or expense blur-save

**F2.3 Total expenses display**
- Second KPI tile showing sum of all budget item amounts
- Updates alongside surplus

---

### F3 — Budget Items (Expenses)

**F3.1 Pre-seeded categories and items**
Every new scenario is seeded with these categories and items (amount = 0):

| Category | Default Items |
|----------|--------------|
| Housing | Rent / Mortgage |
| Utilities | Electric, Gas, Water |
| Phone & Internet | Phone, Internet |
| Groceries & Food | Groceries |
| Child Expenses | Childcare, School, Activities |
| Transportation | Car payment, Gas / Fuel, Car insurance, Transit |
| Insurance | Health, Dental, Home / Renters |
| Subscriptions | Streaming, Gym |
| Personal Care | Personal care |
| Entertainment & Dining | Entertainment, Dining out |
| Savings & Investments | Savings, Investments |

**F3.2 Edit item name**
- Inline text input per item row
- Saves on `blur` via `PUT /items/{id}`
- Empty name reverts to previous value

**F3.3 Edit item amount**
- Inline number input per item row, right-aligned
- Saves on `blur` via `PUT /items/{id}`
- Must be ≥ 0; non-numeric input reverts to 0

**F3.4 Add item to category**
- "+ add item" button at the bottom of each category group
- Creates a new item: category = current category, name = "New item", amount = 0
- Item appears inline immediately; name input is auto-focused

**F3.5 Delete item**
- "×" button on each item row (visible on hover)
- No confirmation required (item amounts are small, easily recreated)
- Row disappears immediately; totals recalculate

**F3.6 Add custom category**
- "+ Add Category" button below all existing groups
- Creates a new empty category group with a placeholder name input
- User types the category name; first "+ add item" click seeds the first item

---

### F4 — Fintech Dashboard Visuals

**F4.1 Spending-mix donut chart**
- SVG donut chart, CSS-only (no chart library)
- Each slice = one category, proportional to its total
- Colour palette: one distinct colour per category (11 colours, see architecture doc)
- Legend below chart: colour dot, category name, % of total expenses
- Chart updates when any amount changes (re-renders on data fetch)
- Chart sits in a sidebar card on the left of the category list

**F4.2 Category progress bars**
- Each category card header shows a thin progress bar below it
- Bar fill = `category_total / income * 100%`, capped at 100%
- Colour matches the category's donut slice colour
- If income = 0, bars show 0%

**F4.3 Category icons**
- One emoji icon per category, shown in the category card header
- Hardcoded mapping (see architecture doc); no user customisation in v1

---

### F5 — Scenario Comparison

**F5.1 Comparison view**
- Accessible via "⇄ Compare All" button in sidebar
- Displays all scenarios as columns; categories/items as rows
- Row groups: one section per category (collapsed to category subtotals by default)
- Pinned rows at bottom: Total Expenses | Income | Surplus / Deficit
- Surplus cell: green background if positive, red if negative

**F5.2 Empty cells**
- If a category does not exist in a scenario (user deleted all its items), show "—"
- If a scenario has a category the others don't, show "—" in those columns

**F5.3 Refresh**
- Comparison data is fetched fresh each time the view is activated
- No manual refresh button needed in v1

---

### F6 — Empty State

- When no scenarios exist, main panel shows:
  - Title: "No scenarios yet"
  - Subtitle: "Create your first budget scenario to get started."
  - CTA button: "+ New Scenario" (same action as sidebar button)

---

### F7 — Mobile-Responsive Layout

The app must be usable on mobile devices (phones and tablets) for viewing and light editing.

**F7.1 Responsive breakpoints**
- **≥ 768px (tablet/desktop)**: full sidebar + main panel side-by-side layout
- **< 768px (mobile)**: sidebar collapses; bottom tab bar replaces it

**F7.2 Mobile bottom tab bar**
- Replaces sidebar on screens < 768px
- Four tabs: Scenarios list (icon + label), active scenario detail, Compare, Review
- Active tab indicated by teal underline/fill
- Scenario list opens a slide-up sheet or full-screen list view

**F7.3 Mobile content layout**
- KPI tiles stack vertically (single column) on mobile
- Category cards remain full-width
- Donut chart and category list stack vertically (chart above, list below)
- Comparison table scrolls horizontally on mobile (`overflow-x: auto`)
- All tap targets ≥ 44px height
- No horizontal overflow on the main content area

**F7.4 Mobile typography**
- Scenario title font size: 18px (down from 22px)
- KPI value font size: 22px (down from 26px)
- Body text: 14px (unchanged)

---

### F8 — Review / Share Page

A clean, screenshot-optimised summary of a single scenario designed to be shared as an image on mobile.

**F8.1 Review view**
- Accessible via a "📋 Review" button in the scenario header (desktop) or bottom tab bar (mobile)
- Route/view: `activeView === 'review'`
- White/light background option so it looks good as a screenshot on any device

**F8.2 Review page content**
- **Header**: app name, scenario name, date generated (`April 2026`)
- **Income / Expenses / Surplus** — three stat boxes in a row
- **Category breakdown list**: each row shows icon, category name, total amount, and a mini progress bar
- **Spending-mix donut** (compact, below the list)
- **Footer**: "Generated with Budget Planner" watermark

**F8.3 Screenshot mode**
- Review page uses a fixed max-width (390px — iPhone 14 width) centred on screen
- Designed to fill a phone screen when screenshotted from a mobile browser
- Light theme: `#ffffff` background, `#1a1a2e` text — high contrast for screenshots
- Surplus: bold green (`#1a7a3a`); Deficit: bold red (`#c62828`)
- No interactive inputs on the review page — display only

**F8.4 Print / save**
- "Print / Save as PDF" button triggers `window.print()`
- `@media print` CSS hides the button and navigation, keeps only the review card

---

## Acceptance Criteria Summary

| ID | Criterion |
|----|-----------|
| AC-1 | Creating a scenario seeds all 11 categories with their default items at $0 |
| AC-2 | Editing an amount and tabbing away immediately updates the surplus KPI tile |
| AC-3 | Donut chart slices are proportional to category totals |
| AC-4 | Progress bar for a category never exceeds full width even if over-budget |
| AC-5 | Comparison table shows correct surplus/deficit for each scenario |
| AC-6 | Deleting a scenario removes it from sidebar and cascades items in DB |
| AC-7 | Refreshing the browser reloads all data correctly from SQLite |
| AC-8 | App shows empty state when no scenarios exist |
| AC-9 | On screens < 768px, sidebar is hidden and bottom tab bar is shown |
| AC-10 | All tap targets on mobile are at least 44px tall |
| AC-11 | Review page renders correctly at 390px width and is screenshot-ready |
| AC-12 | "Print / Save as PDF" button triggers browser print dialog |

---

## Out of Scope (v1)

- Editing category names after creation
- Drag-to-reorder categories or items
- Budget limits / target amounts per category
- Historical tracking (month-over-month)
- Export to CSV or PDF
- Dark/light mode toggle (dark mode only)
