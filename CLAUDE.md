# Budget Planner — Project Conventions

## Model routing

- **Planning / design / architecture** → use **Opus** (`claude-opus-4-7`).
  Covers: plan mode, breaking down work, weighing trade-offs, scoping tasks, code review.
- **Implementation / code writing / tests / refactors** → use **Sonnet** (`claude-sonnet-4-6`).
  Covers: writing files, editing code, running builds, fixing type errors, wiring endpoints.

When a session starts in plan mode, the user expects Opus; when the plan is approved and implementation begins, switch to Sonnet.

## Stack

- **Backend**: Python + FastAPI + SQLite (built-in sqlite3, no ORM). Lives in `backend/`.
- **Frontend**: React + Vite. Dark mode. Lives in `frontend/`.
- **Storage**: single local SQLite file (`backend/budget.db`), auto-created.

## Design direction

Dark mode across the entire app. See `mockups/` for the three design variants the user is choosing between.
