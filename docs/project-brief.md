# Project Brief — Budget Planner

## Problem Statement

Managing a household budget across multiple "what-if" scenarios (moving, changing jobs, a new child) is painful with generic spreadsheets. There is no easy way to create named plans, compare them side-by-side, and instantly see the surplus or deficit each scenario produces. Existing apps (Monarch Money, YNAB, EveryDollar) require cloud accounts, subscriptions, and sharing financial data with third parties.

## Vision

A fast, local-only budget planning tool that lets a single user model their monthly finances across multiple scenarios — no account, no subscription, no data leaving the machine.

## Goals

| # | Goal | Success Metric |
|---|------|----------------|
| G1 | Create and edit named budget scenarios | User can create, rename, and delete scenarios in under 10 seconds |
| G2 | Track income and categorised expenses | All standard household categories pre-seeded; surplus/deficit always visible |
| G3 | Compare scenarios side by side | Comparison table loads in < 200 ms with 10 scenarios |
| G4 | Model spending visually | Donut chart and per-category progress bars render from live data |
| G5 | Zero-friction local setup | Backend + frontend start with two commands; DB auto-created |

## Non-Goals

- No cloud sync, no user accounts, no authentication
- No mobile layout (desktop-only)
- No real-time multi-user collaboration
- No bank/account import or CSV import (v1)
- No recurring transaction tracking or calendar view (v1)
- No currency conversion

## Users

Single user — the person running the app locally. No personas beyond that.

## Success Criteria (v1 Done)

1. Can create two scenarios, fill in all standard categories, and see a correct surplus/deficit on each.
2. Comparison view shows correct per-category totals and net surplus for all scenarios.
3. Spending-mix donut chart and category progress bars reflect live data.
4. All data persists across backend restarts via SQLite.
5. App starts from scratch (empty DB) with a clear empty-state prompt.

## Chosen Design Direction

**Fintech Dashboard** — dark UI inspired by Monarch Money / EveryDollar.
- Black/dark-gray background (`#0f1117` / `#16181f`)
- Teal (`#00c896`) for surplus; red (`#ff4d4d`) for deficit
- Spending-mix donut chart (CSS/SVG, no chart library)
- Per-category progress bars (% of income)
- Emoji icons per category
- Reference file: `mockups/mockup-fintech.html`

## Constraints

- Stack locked: Python (FastAPI) + React (Vite) + SQLite (`sqlite3`, no ORM)
- Runs on localhost only; CORS restricted to `localhost:5173`
- No external UI component library — plain CSS only
- Single SQLite file at `backend/budget.db`
