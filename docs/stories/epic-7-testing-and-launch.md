# Epic 7 — Testing & Launch Readiness

**Goal:** End-to-end verification, README with run instructions, and repo clean-up so the app is ready to use.

---

## Story 7.1 — Backend smoke tests

**As a** developer  
**I want** a simple test script that exercises all API endpoints  
**So that** I can verify the backend in one command after any change

**Acceptance Criteria:**
- `backend/test_api.py` runs with `python test_api.py` (stdlib `urllib` or `requests` if already installed)
- Tests (in order): create scenario → assert 24 items seeded → update income → fetch detail → add item → update item → delete item → compare → delete scenario → assert gone
- All assertions pass on a fresh `budget.db`
- Script prints `✓ all tests passed` on success

**Tasks:**
1. Write `backend/test_api.py`
2. Verify against running backend

---

## Story 7.2 — End-to-end acceptance test

**As a** developer  
**I want** a checklist to verify the app end-to-end from the browser  
**So that** I can sign off on v1 completeness

**Acceptance Criteria — manually verify each item:**

- [ ] Fresh start (no `budget.db`): empty state shown in browser
- [ ] Create "Current" scenario: 11 category cards visible, all at $0
- [ ] Set income to $5,000: surplus KPI updates to $0
- [ ] Set Housing → Rent/Mortgage to $1,500: surplus updates to $3,500; progress bar fills 30%
- [ ] Donut chart shows Housing slice
- [ ] Add item "Netflix" to Subscriptions for $15: appears in card and donut
- [ ] Delete "Transit" item: gone from UI, totals correct
- [ ] Create "If I Move" scenario: seeded fresh at $0
- [ ] Set Housing to $2,500 in new scenario: shows deficit vs income
- [ ] Click "⇄ Compare All": both scenarios visible, correct totals
- [ ] Rename "If I Move" → "Higher Rent": sidebar updates
- [ ] Refresh browser: all data persists
- [ ] Delete "Higher Rent" scenario: sidebar shows only "Current"

**Tasks:**
1. Walk through checklist manually before declaring v1 done

---

## Story 7.3 — README

**As a** developer  
**I want** a README with setup and run instructions  
**So that** anyone can clone and run the app

**Acceptance Criteria:**
- `README.md` at project root covers: prerequisites, backend setup, frontend setup, how to open the app
- Includes a one-paragraph description of what the app does

**Tasks:**
1. Update `README.md` (currently just "Local budget planner")

---

## Story 7.4 — Repository clean-up

**As a** developer  
**I want** the repo to be clean before declaring v1 done  
**So that** there are no stray files or debug artifacts

**Acceptance Criteria:**
- `.gitignore` covers: `backend/budget.db`, `backend/.venv/`, `frontend/node_modules/`, `frontend/dist/`, `**/__pycache__/`, `**/*.pyc`
- No `console.log` debug statements in frontend source
- No commented-out code blocks
- `mockups/` folder present (kept as design reference)

**Tasks:**
1. Audit and update `.gitignore`
2. Search for `console.log` in `src/` and remove
3. Final `git status` should show clean working tree
