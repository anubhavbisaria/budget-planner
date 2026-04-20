# Epic 4 — Fintech Dashboard Visuals

**Goal:** Donut chart, progress bars, and category icons make the app look and feel like a premium fintech tool. All visuals derive from live data.

---

## Story 4.1 — Spending-mix donut chart

**As a** user  
**I want** to see a visual breakdown of my spending by category  
**So that** I can instantly understand my spending mix

**Acceptance Criteria:**
- `DonutChart.jsx` renders an SVG donut using `stroke-dasharray` technique (no chart library)
- Each category is a coloured arc sized proportionally to its total vs total_expenses
- Arc colours match `CATEGORY_META` palette from `architecture.md`
- Categories with `total = 0` are omitted from the chart (no zero-length arcs)
- Center label shows `XX%` of income spent (= `total_expenses / income * 100`, rounded; "—" if income = 0)
- Legend below chart: colour dot, category name, percentage of total expenses
- Chart and legend sit in a card on the left side of the detail view
- SVG radius = 38, circumference ≈ 239 (as per architecture doc)

**Implementation notes:**
```
circumference = 2 × π × 38 ≈ 238.76
For each category:
  arc_length = (category_total / total_expenses) × circumference
  dash_offset = -(cumulative arc lengths of previous categories)
```

**Tasks:**
1. Create `DonutChart.jsx`
2. Build `buildSlices(categories, totalExpenses)` helper that returns `[{ category, color, arcLength, offset, pct }]`
3. Render `<circle>` elements with correct `strokeDasharray` and `strokeDashoffset`
4. Render legend list
5. Verify: add amounts to multiple categories → chart slices resize correctly

---

## Story 4.2 — Category progress bars

**As a** user  
**I want** to see how much of my income each category consumes  
**So that** I can spot over-budget areas at a glance

**Acceptance Criteria:**
- Each `CategoryCard` renders a thin (3px) progress bar below the header
- Fill colour = category colour from `CATEGORY_META`
- Fill width = `Math.min((categoryTotal / income) * 100, 100)` percent
- If income = 0, bar is empty (0%)
- Bar is purely decorative — no tooltip or label needed in v1
- Updates when any amount changes (driven by `LOAD_DETAIL` re-fetch)

**Tasks:**
1. Add progress bar div to `CategoryCard.jsx` header section
2. Pass `income` prop down from `ScenarioDetail`
3. Verify: set income to $5,000, set Housing to $2,500 → bar at 50%

---

## Story 4.3 — Category icons

**As a** user  
**I want** to see an icon for each expense category  
**So that** the app is visually intuitive and easy to scan

**Acceptance Criteria:**
- Each category card header shows the emoji icon from `CATEGORY_META` mapping
- Custom categories (not in `CATEGORY_META`) show `📌`
- Icons are display-only (no interactivity)
- Icon sits in a small rounded square badge using the category colour (low opacity background)

**Tasks:**
1. Define `CATEGORY_META` in `src/constants.js`:
   ```js
   export const CATEGORY_META = {
     'Housing':                { color: '#4f74e8', icon: '🏠' },
     'Utilities':              { color: '#00a3e0', icon: '⚡' },
     'Phone & Internet':       { color: '#2ea043', icon: '📱' },
     'Groceries & Food':       { color: '#e3b341', icon: '🛒' },
     'Child Expenses':         { color: '#f5a623', icon: '👦' },
     'Transportation':         { color: '#ff5a5f', icon: '🚗' },
     'Insurance':              { color: '#9b59b6', icon: '🛡️' },
     'Subscriptions':          { color: '#fb8f44', icon: '📺' },
     'Personal Care':          { color: '#56d364', icon: '🪥' },
     'Entertainment & Dining': { color: '#ef476f', icon: '🎬' },
     'Savings & Investments':  { color: '#00c896', icon: '💵' },
   }
   export const DEFAULT_META = { color: '#8b949e', icon: '📌' }
   ```
2. Use in `CategoryCard.jsx` and `DonutChart.jsx`
