from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from database import get_connection, seed_scenario

router = APIRouter()


class ScenarioCreate(BaseModel):
    name: str
    income: float = 0.0


class ScenarioUpdate(BaseModel):
    name: Optional[str] = None
    income: Optional[float] = None


def _row_to_summary(row) -> dict:
    return {
        "id": row["id"],
        "name": row["name"],
        "income": row["income"],
        "total_expenses": row["total_expenses"],
        "surplus": row["surplus"],
        "created_at": row["created_at"],
    }


def _fetch_summary(conn, scenario_id: int) -> dict:
    row = conn.execute("""
        SELECT s.id, s.name, s.income, s.created_at,
               COALESCE(SUM(b.amount), 0.0) AS total_expenses,
               s.income - COALESCE(SUM(b.amount), 0.0) AS surplus
        FROM scenarios s
        LEFT JOIN budget_items b ON b.scenario_id = s.id
        WHERE s.id = ?
        GROUP BY s.id
    """, (scenario_id,)).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Scenario not found")
    return _row_to_summary(row)


def _fetch_detail(conn, scenario_id: int) -> dict:
    summary = _fetch_summary(conn, scenario_id)
    items = conn.execute(
        "SELECT id, category, name, amount FROM budget_items WHERE scenario_id = ? ORDER BY id",
        (scenario_id,)
    ).fetchall()

    categories: dict = {}
    for item in items:
        cat = item["category"]
        if cat not in categories:
            categories[cat] = []
        categories[cat].append({
            "id": item["id"],
            "name": item["name"],
            "amount": item["amount"],
        })

    return {**summary, "categories": categories}


@router.get("/scenarios")
def list_scenarios():
    with get_connection() as conn:
        rows = conn.execute("""
            SELECT s.id, s.name, s.income, s.created_at,
                   COALESCE(SUM(b.amount), 0.0) AS total_expenses,
                   s.income - COALESCE(SUM(b.amount), 0.0) AS surplus
            FROM scenarios s
            LEFT JOIN budget_items b ON b.scenario_id = s.id
            GROUP BY s.id
            ORDER BY s.id
        """).fetchall()
        return [_row_to_summary(r) for r in rows]


@router.post("/scenarios", status_code=201)
def create_scenario(body: ScenarioCreate):
    with get_connection() as conn:
        cur = conn.execute(
            "INSERT INTO scenarios (name, income) VALUES (?, ?)",
            (body.name, body.income),
        )
        scenario_id = cur.lastrowid
        seed_scenario(conn, scenario_id)
        conn.commit()
        return _fetch_summary(conn, scenario_id)


# IMPORTANT: /scenarios/compare must be registered before /scenarios/{id}
@router.get("/scenarios/compare")
def compare_scenarios():
    with get_connection() as conn:
        scenarios = conn.execute("""
            SELECT s.id, s.name, s.income,
                   s.income - COALESCE(SUM(b.amount), 0.0) AS surplus
            FROM scenarios s
            LEFT JOIN budget_items b ON b.scenario_id = s.id
            GROUP BY s.id
            ORDER BY s.id
        """).fetchall()

        result = []
        for s in scenarios:
            items = conn.execute(
                "SELECT category, SUM(amount) AS total FROM budget_items WHERE scenario_id = ? GROUP BY category",
                (s["id"],)
            ).fetchall()
            category_totals = {row["category"]: row["total"] for row in items}
            result.append({
                "id": s["id"],
                "name": s["name"],
                "income": s["income"],
                "surplus": s["surplus"],
                "category_totals": category_totals,
            })
        return result


@router.get("/scenarios/{scenario_id}")
def get_scenario(scenario_id: int):
    with get_connection() as conn:
        return _fetch_detail(conn, scenario_id)


@router.put("/scenarios/{scenario_id}")
def update_scenario(scenario_id: int, body: ScenarioUpdate):
    with get_connection() as conn:
        existing = conn.execute("SELECT id FROM scenarios WHERE id = ?", (scenario_id,)).fetchone()
        if existing is None:
            raise HTTPException(status_code=404, detail="Scenario not found")
        if body.name is not None:
            conn.execute("UPDATE scenarios SET name = ? WHERE id = ?", (body.name, scenario_id))
        if body.income is not None:
            conn.execute("UPDATE scenarios SET income = ? WHERE id = ?", (body.income, scenario_id))
        conn.commit()
        return _fetch_summary(conn, scenario_id)


@router.delete("/scenarios/{scenario_id}", status_code=204)
def delete_scenario(scenario_id: int):
    with get_connection() as conn:
        existing = conn.execute("SELECT id FROM scenarios WHERE id = ?", (scenario_id,)).fetchone()
        if existing is None:
            raise HTTPException(status_code=404, detail="Scenario not found")
        conn.execute("DELETE FROM scenarios WHERE id = ?", (scenario_id,))
        conn.commit()
