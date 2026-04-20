# Epic 1 — Backend Foundation

**Goal:** Runnable FastAPI app with SQLite schema, seed data, and all CRUD endpoints. Verifiable via `/docs` Swagger UI before any frontend work begins.

---

## Story 1.1 — Project scaffold

**As a** developer  
**I want** the backend directory structure, dependencies, and entry point in place  
**So that** I can run `uvicorn main:app --reload` and get a 200 response

**Acceptance Criteria:**
- `backend/requirements.txt` contains `fastapi` and `uvicorn[standard]`
- `backend/main.py` creates a FastAPI app instance with a `GET /health` route returning `{"status": "ok"}`
- `uvicorn main:app --reload --port 8000` starts without errors
- `backend/budget.db` is listed in `.gitignore`

**Tasks:**
1. Create `backend/requirements.txt`
2. Create `backend/main.py` with app instance and health endpoint
3. Add `backend/budget.db` to `.gitignore`
4. Verify: `curl localhost:8000/health` returns `{"status":"ok"}`

---

## Story 1.2 — Database initialisation

**As a** developer  
**I want** the SQLite schema to be created automatically on startup  
**So that** a fresh clone can start the backend without any manual DB setup

**Acceptance Criteria:**
- `backend/database.py` exports `get_connection()` and `init_db()`
- `get_connection()` returns a `sqlite3.Connection` with `row_factory = sqlite3.Row` and `PRAGMA foreign_keys = ON`
- `init_db()` creates `scenarios` and `budget_items` tables if they don't exist
- Calling `init_db()` twice is idempotent (`CREATE TABLE IF NOT EXISTS`)
- `main.py` calls `init_db()` via FastAPI `lifespan` context manager

**Tasks:**
1. Write `database.py` with `get_connection()` and `init_db()` per schema in `architecture.md`
2. Wire `lifespan` in `main.py`
3. Verify: delete `budget.db`, restart backend, confirm tables exist with `sqlite3 budget.db ".tables"`

---

## Story 1.3 — Python data models

**As a** developer  
**I want** typed dataclasses for Scenario and BudgetItem  
**So that** router code has a clear contract instead of passing raw dicts

**Acceptance Criteria:**
- `backend/models.py` defines `BudgetItem` and `Scenario` dataclasses exactly as specified in `architecture.md`
- No third-party dependencies (stdlib `dataclasses` only)

**Tasks:**
1. Create `backend/models.py`

---

## Story 1.4 — Scenario seed function

**As a** developer  
**I want** a `seed_scenario(conn, scenario_id)` function  
**So that** every new scenario gets the standard 24 default items at $0

**Acceptance Criteria:**
- `database.py` exports `seed_scenario(conn, scenario_id)`
- Calling it inserts all 24 items from `SEED_ITEMS` into `budget_items` for the given scenario
- Uses a single `executemany` inside the same connection/transaction as scenario creation
- All items have `amount = 0.0`

**Tasks:**
1. Add `SEED_ITEMS` constant and `seed_scenario()` to `database.py`
2. Verify: create a scenario via SQL, call `seed_scenario`, count rows = 24

---

## Story 1.5 — Scenarios router

**As a** developer  
**I want** all scenario CRUD endpoints implemented  
**So that** I can create, read, update, and delete scenarios via the API

**Acceptance Criteria (per endpoint):**

| Endpoint | Expected behaviour |
|----------|--------------------|
| `GET /scenarios` | Returns list; each item has `id, name, income, total_expenses, surplus` |
| `POST /scenarios` | Creates scenario + seeds items; returns scenario object |
| `GET /scenarios/compare` | Returns all scenarios with `category_totals` dict |
| `GET /scenarios/{id}` | Returns scenario with nested `categories` dict |
| `PUT /scenarios/{id}` | Partial update (name and/or income); returns updated object |
| `DELETE /scenarios/{id}` | Returns 204; cascade deletes items |

**Important:** Register `GET /scenarios/compare` before `GET /scenarios/{id}` in the router to avoid FastAPI treating "compare" as an integer ID.

**Tasks:**
1. Create `backend/routers/scenarios.py` with all 6 endpoints
2. Include router in `main.py` with no prefix (paths as above)
3. Add CORS middleware: `allow_origins=["http://localhost:5173"]`, all methods, all headers
4. Verify all endpoints via Swagger UI at `localhost:8000/docs`

---

## Story 1.6 — Items router

**As a** developer  
**I want** CRUD endpoints for budget line items  
**So that** the frontend can add, edit, and delete individual expense rows

**Acceptance Criteria:**

| Endpoint | Expected behaviour |
|----------|--------------------|
| `POST /scenarios/{id}/items` | Creates item; returns new item object |
| `PUT /items/{id}` | Partial update (name/category/amount); returns updated item |
| `DELETE /items/{id}` | Returns 204 |

**Tasks:**
1. Create `backend/routers/items.py`
2. Include router in `main.py`
3. Verify via Swagger UI: create item, edit amount, delete item
