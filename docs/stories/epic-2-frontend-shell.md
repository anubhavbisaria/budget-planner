# Epic 2 — Frontend Shell & Navigation

**Goal:** Vite + React app scaffolded, API client wired, sidebar renders scenario list, navigation between scenarios and compare view works.

---

## Story 2.1 — Vite + React scaffold

**As a** developer  
**I want** the frontend project initialised and boilerplate removed  
**So that** I have a clean base to build on

**Acceptance Criteria:**
- `frontend/` contains a working Vite + React project (`npm run dev` starts on port 5173)
- Default Vite boilerplate (logo, counter, App.css) removed
- `frontend/.gitignore` excludes `node_modules/` and `dist/`

**Tasks:**
1. Run `npm create vite@latest frontend -- --template react` from project root
2. Remove boilerplate files and content
3. Verify: `npm run dev` shows blank page with no errors in console

---

## Story 2.2 — API proxy

**As a** developer  
**I want** all `/api/*` requests proxied to the backend  
**So that** frontend code uses relative URLs and CORS is not an issue in development

**Acceptance Criteria:**
- `frontend/vite.config.js` has a `server.proxy` rule: `/api` → `http://localhost:8000`
- `fetch('/api/scenarios')` in the browser reaches `localhost:8000/scenarios`
- Backend routes remain at `/scenarios` (no `/api` prefix on the backend)

**Tasks:**
1. Update `vite.config.js` with proxy config
2. Verify: with backend running, `fetch('/api/health')` returns `{"status":"ok"}`

---

## Story 2.3 — API client module

**As a** developer  
**I want** a thin `api.js` module with one function per endpoint  
**So that** components never contain raw `fetch` calls

**Acceptance Criteria:**
- `frontend/src/api.js` exports named async functions for all 9 endpoints
- Each function throws on non-2xx responses (check `response.ok`)
- Function names match: `getScenarios`, `createScenario`, `getScenario`, `updateScenario`, `deleteScenario`, `compareScenarios`, `createItem`, `updateItem`, `deleteItem`
- All use relative `/api/` prefix

**Tasks:**
1. Write `api.js` with all 9 functions
2. No mocking or stubs — these call the real backend

---

## Story 2.4 — Global app state

**As a** developer  
**I want** a `useReducer`-based state in `App.jsx`  
**So that** all components share a single source of truth without prop-drilling

**Acceptance Criteria:**
- `App.jsx` initialises state per architecture spec: `{ scenarios, activeId, activeView, detail, loading, error }`
- Reducer handles all actions: `LOAD_SCENARIOS`, `SET_ACTIVE`, `SET_VIEW`, `LOAD_DETAIL`, `SET_LOADING`, `SET_ERROR`
- `useEffect` on mount calls `getScenarios()` and dispatches `LOAD_SCENARIOS`
- State and dispatch passed down via props (no Context in v1)

**Tasks:**
1. Write reducer function and initial state
2. Wire `useEffect` for initial load
3. Verify: with backend running, `console.log(state.scenarios)` shows fetched list

---

## Story 2.5 — Sidebar component

**As a** user  
**I want** to see my scenarios listed in the sidebar and switch between them  
**So that** I can navigate the app

**Acceptance Criteria:**
- `Sidebar.jsx` renders one nav button per scenario with name and surplus/deficit badge
- Active scenario has left-border accent colour (`#00c896`)
- Surplus badge: green `+$X`; deficit badge: red `−$X`
- Clicking a scenario dispatches `SET_ACTIVE` and triggers `LOAD_DETAIL` fetch
- "⇄ Compare All" button dispatches `SET_VIEW('compare')`
- "+ New Scenario" button calls `createScenario({ name: 'New Scenario' })` then reloads list and navigates to new scenario
- Design matches `mockups/mockup-fintech.html` sidebar

**Tasks:**
1. Create `Sidebar.jsx`
2. Format currency helper: `$X,XXX` (no decimals in badges)
3. Verify: create two scenarios in backend, sidebar shows both with correct badges

---

## Story 2.6 — Empty state

**As a** user  
**I want** a clear prompt when no scenarios exist  
**So that** I know how to get started

**Acceptance Criteria:**
- `EmptyState.jsx` shows title "No scenarios yet", subtitle, and a "+ New Scenario" CTA button
- Rendered in main panel when `state.scenarios.length === 0`
- CTA button triggers same action as sidebar "+ New Scenario"

**Tasks:**
1. Create `EmptyState.jsx`
2. Wire into `App.jsx` render logic
