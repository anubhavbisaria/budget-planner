from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional

from database import get_connection

router = APIRouter()


class ItemCreate(BaseModel):
    category: str
    name: str
    amount: float = 0.0


class ItemUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[str] = None
    amount: Optional[float] = None


def _fetch_item(conn, item_id: int) -> dict:
    row = conn.execute(
        "SELECT id, scenario_id, category, name, amount FROM budget_items WHERE id = ?",
        (item_id,)
    ).fetchone()
    if row is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return dict(row)


@router.post("/scenarios/{scenario_id}/items", status_code=201)
def create_item(scenario_id: int, body: ItemCreate):
    with get_connection() as conn:
        existing = conn.execute("SELECT id FROM scenarios WHERE id = ?", (scenario_id,)).fetchone()
        if existing is None:
            raise HTTPException(status_code=404, detail="Scenario not found")
        cur = conn.execute(
            "INSERT INTO budget_items (scenario_id, category, name, amount) VALUES (?, ?, ?, ?)",
            (scenario_id, body.category, body.name, body.amount),
        )
        conn.commit()
        return _fetch_item(conn, cur.lastrowid)


@router.put("/items/{item_id}")
def update_item(item_id: int, body: ItemUpdate):
    with get_connection() as conn:
        _fetch_item(conn, item_id)
        if body.name is not None:
            conn.execute("UPDATE budget_items SET name = ? WHERE id = ?", (body.name, item_id))
        if body.category is not None:
            conn.execute("UPDATE budget_items SET category = ? WHERE id = ?", (body.category, item_id))
        if body.amount is not None:
            conn.execute("UPDATE budget_items SET amount = ? WHERE id = ?", (body.amount, item_id))
        conn.commit()
        return _fetch_item(conn, item_id)


@router.delete("/items/{item_id}", status_code=204)
def delete_item(item_id: int):
    with get_connection() as conn:
        _fetch_item(conn, item_id)
        conn.execute("DELETE FROM budget_items WHERE id = ?", (item_id,))
        conn.commit()
