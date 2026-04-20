# Architecture Document — Budget Planner

## System Overview

Single-user local web app. Python FastAPI backend serves a REST JSON API; React + Vite frontend runs in the browser. Data persists in a single SQLite file. Both processes run on localhost; no network exposure.

```
Browser (localhost:5173)
    ↕ fetch /api/*  (proxied by Vite dev server)
FastAPI (localhost:8000)
    ↕ sqlite3
budget.db  (backend/budget.db)
```

---

## Directory Structure

```
budget-planner/
├── CLAUDE.md
├── docs/
│   ├── project-brief.md
│   ├── prd.md
│   ├── architecture.md        ← this file
│   └── stories/
│       ├── epic-1-backend-foundation.md
│       ├── epic-2-scenario-management.md
│       ├── epic-3-budget-items.md
│       ├── epic-4-frontend-shell.md
│       ├── epic-5-scenario-detail.md
│       ├── epic-6-comparison-view.md
│       └── epic-7-fintech-polish.md
├── mockups/
│   ├── mockup-tabular.html
│   ├── mockup-modern.html
│   └── mockup-fintech.html        ← CHOSEN DESIGN
│
├── backend/
│   ├── main.py                    # FastAPI app entry point
│   ├── database.py                # sqlite3 helpers, schema DDL, seed data
│   ├── models.py                  # Python dataclasses
│   ├── routers/
│   │   ├── __init__.py
│   │   ├── scenarios.py           # /scenarios + /scenarios/{id} + /scenarios/compare
│   │   └── items.py               # /scenarios/{id}/items + /items/{id}
│   ├── requirements.txt
│   └── budget.db                  # gitignored, auto-created at runtime
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js             # proxy /api → http://localhost:8000
    └── src/
        ├── main.jsx
        ├── App.jsx                # global state (useReducer), view routing
        ├── api.js                 # fetch wrappers for all endpoints
        └── components/
            ├── Sidebar.jsx
            ├── EmptyState.jsx
            ├── ScenarioDetail.jsx
            ├── StatsStrip.jsx     # 3 KPI tiles: Income, Expenses, Surplus
            ├── DonutChart.jsx     # SVG donut + legend
            ├── CategoryCard.jsx   # icon + progress bar + line items
            ├── LineItem.jsx       # inline editable row
            └── ComparisonView.jsx
```

---

## Database Schema

```sql
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS scenarios (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT    NOT NULL,
    income     REAL    NOT NULL DEFAULT 0.0,
    created_at TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE TABLE IF NOT EXISTS budget_items (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    scenario_id INTEGER NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
    category    TEXT    NOT NULL,
    name        TEXT    NOT NULL,
    amount      REAL    NOT NULL DEFAULT 0.0
);
```

**Design decisions:**
- Category stored as a plain `TEXT` string on `budget_items` — no separate category table. Keeps schema flat and allows custom categories without schema changes.
- `ON DELETE CASCADE` so deleting a scenario atomically removes all its items.
- No `display_order` column in v1 — items rendered in insertion order.

---

## Seed Data

Applied to every newly created scenario (amount = 0 for all):

```python
SEED_ITEMS = [
    ("Housing",                "Rent / Mortgage"),
    ("Utilities",              "Electric"),
    ("Utilities",              "Gas"),
    ("Utilities",              "Water"),
    ("Phone & Internet",       "Phone"),
    ("Phone & Internet",       "Internet"),
    ("Groceries & Food",       "Groceries"),
    ("Child Expenses",         "Childcare"),
    ("Child Expenses",         "School"),
    ("Child Expenses",         "Activities"),
    ("Transportation",         "Car payment"),
    ("Transportation",         "Gas / Fuel"),
    ("Transportation",         "Car insurance"),
    ("Transportation",         "Transit"),
    ("Insurance",              "Health"),
    ("Insurance",              "Dental"),
    ("Insurance",              "Home / Renters"),
    ("Subscriptions",          "Streaming"),
    ("Subscriptions",          "Gym"),
    ("Personal Care",          "Personal care"),
    ("Entertainment & Dining", "Entertainment"),
    ("Entertainment & Dining", "Dining out"),
    ("Savings & Investments",  "Savings"),
    ("Savings & Investments",  "Investments"),
]
```

---

## API Contracts

All responses are JSON. Errors use FastAPI default `{"detail": "..."}` with appropriate HTTP status.

### Scenarios

#### `GET /scenarios`
Returns scenario list with computed fields.
```json
[
  {
    "id": 1,
    "name": "Current",
    "income": 5000.0,
    "total_expenses": 4280.0,
    "surplus": 720.0,
    "created_at": "2026-04-20 10:00:00"
  }
]
```

#### `POST /scenarios`
Body: `{ "name": "string", "income": 0.0 }` (income optional, defaults to 0)
- Creates scenario, seeds all default items
- Returns full scenario object (same shape as GET item)

#### `GET /scenarios/compare`
⚠️ Must be registered **before** `GET /scenarios/{id}` to avoid FastAPI path conflict.
```json
[
  {
    "id": 1,
    "name": "Current",
    "income": 5000.0,
    "surplus": 720.0,
    "category_totals": {
      "Housing": 1500.0,
      "Utilities": 210.0,
      "...": 0.0
    }
  }
]
```

#### `GET /scenarios/{id}`
Full scenario with items grouped by category. Used by detail view.
```json
{
  "id": 1,
  "name": "Current",
  "income": 5000.0,
  "total_expenses": 4280.0,
  "surplus": 720.0,
  "categories": {
    "Housing": [
      { "id": 3, "name": "Rent / Mortgage", "amount": 1500.0 }
    ],
    "Utilities": [
      { "id": 4, "name": "Electric", "amount": 90.0 },
      { "id": 5, "name": "Gas", "amount": 60.0 },
      { "id": 6, "name": "Water", "amount": 60.0 }
    ]
  }
}
```

#### `PUT /scenarios/{id}`
Body (all fields optional): `{ "name": "string", "income": 0.0 }`
Returns updated scenario (same shape as GET).

#### `DELETE /scenarios/{id}`
Returns `204 No Content`. Cascade handled by DB.

### Budget Items

#### `POST /scenarios/{id}/items`
Body: `{ "category": "Housing", "name": "New item", "amount": 0.0 }`
Returns: `{ "id": 42, "scenario_id": 1, "category": "Housing", "name": "New item", "amount": 0.0 }`

#### `PUT /items/{id}`
Body (all optional): `{ "name": "string", "category": "string", "amount": 0.0 }`
Returns updated item.

#### `DELETE /items/{id}`
Returns `204 No Content`.

---

## Python Data Models (`models.py`)

```python
from dataclasses import dataclass, field
from typing import List

@dataclass
class BudgetItem:
    id: int
    scenario_id: int
    category: str
    name: str
    amount: float

@dataclass
class Scenario:
    id: int
    name: str
    income: float
    created_at: str
    items: List[BudgetItem] = field(default_factory=list)
```

Used as typed intermediaries between raw `sqlite3.Row` objects and JSON responses.

---

## Frontend State

Managed with `useReducer` in `App.jsx`. No external state library.

```js
// State shape
{
  scenarios: [],          // list from GET /scenarios — name + surplus only
  activeId: null,         // currently selected scenario id
  activeView: 'detail',   // 'detail' | 'compare'
  detail: null,           // full object from GET /scenarios/{id}
  loading: false,
  error: null
}

// Actions
LOAD_SCENARIOS       // replace scenarios list
SET_ACTIVE           // change activeId, triggers detail fetch
SET_VIEW             // switch between 'detail' and 'compare'
LOAD_DETAIL          // replace detail object
SET_LOADING / SET_ERROR
```

**Blur-to-save pattern** (no debounce):
- Each `LineItem` holds local controlled state for name + amount inputs
- `onBlur` → `PUT /items/{id}` → dispatch `LOAD_DETAIL` with re-fetched scenario
- Same pattern for income field and scenario name: `onBlur` → `PUT /scenarios/{id}` → `LOAD_SCENARIOS` + `LOAD_DETAIL`

---

## Category Colour Palette

Used in both the donut chart and progress bars.

| Category | Colour |
|----------|--------|
| Housing | `#4f74e8` |
| Utilities | `#00a3e0` |
| Phone & Internet | `#2ea043` |
| Groceries & Food | `#e3b341` |
| Child Expenses | `#f5a623` |
| Transportation | `#ff5a5f` |
| Insurance | `#9b59b6` |
| Subscriptions | `#fb8f44` |
| Personal Care | `#56d364` |
| Entertainment & Dining | `#ef476f` |
| Savings & Investments | `#00c896` |

---

## Category Icon Mapping

| Category | Emoji |
|----------|-------|
| Housing | 🏠 |
| Utilities | ⚡ |
| Phone & Internet | 📱 |
| Groceries & Food | 🛒 |
| Child Expenses | 👦 |
| Transportation | 🚗 |
| Insurance | 🛡️ |
| Subscriptions | 📺 |
| Personal Care | 🪥 |
| Entertainment & Dining | 🎬 |
| Savings & Investments | 💵 |

Custom categories (user-created): default icon `📌`.

---

## Donut Chart Implementation

Pure SVG, no chart library. Uses `stroke-dasharray` technique.

```
circumference = 2π × r  (r = 38, so ≈ 239)
each slice offset = cumulative sum of previous slice lengths
slice length = (category_total / total_expenses) × circumference
```

Rendered in `DonutChart.jsx` with `categories` array from `GET /scenarios/{id}`.
Center label: percentage of income spent.

---

## Running Locally

**Backend**
```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# Swagger UI: http://localhost:8000/docs
```

**Frontend**
```bash
cd frontend
npm install
npm run dev
# App: http://localhost:5173
```

`budget.db` is created automatically on first backend start. Schema applied via `init_db()` in the FastAPI lifespan context.

---

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| ORM | None — raw `sqlite3` | Simple schema, no migration tooling needed |
| State management | `useReducer` | Sufficient for this app; avoids Redux/Zustand overhead |
| Chart library | None — plain SVG | Single donut chart; no dependency worth adding |
| CSS framework | None — plain CSS | Design is custom; avoids fighting a framework |
| Blur-to-save | Yes | Simpler than debounce; still feels responsive |
| Category as string | Yes | Avoids FK table; allows custom categories without schema change |
