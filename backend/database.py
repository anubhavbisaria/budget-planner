import sqlite3
from pathlib import Path

DB_PATH = Path(__file__).parent / "budget.db"

SEED_ITEMS = [
    ("Housing", "Rent / Mortgage"),
    ("Utilities", "Electric"),
    ("Utilities", "Gas"),
    ("Utilities", "Water"),
    ("Phone & Internet", "Phone"),
    ("Phone & Internet", "Internet"),
    ("Groceries & Food", "Groceries"),
    ("Child Expenses", "Childcare"),
    ("Child Expenses", "School"),
    ("Child Expenses", "Activities"),
    ("Transportation", "Car payment"),
    ("Transportation", "Gas / Fuel"),
    ("Transportation", "Car insurance"),
    ("Transportation", "Transit"),
    ("Insurance", "Health"),
    ("Insurance", "Dental"),
    ("Insurance", "Home / Renters"),
    ("Subscriptions", "Streaming"),
    ("Subscriptions", "Gym"),
    ("Personal Care", "Personal care"),
    ("Entertainment & Dining", "Entertainment"),
    ("Entertainment & Dining", "Dining out"),
    ("Savings & Investments", "Savings"),
    ("Savings & Investments", "Investments"),
]


def get_connection() -> sqlite3.Connection:
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn


def init_db() -> None:
    with get_connection() as conn:
        conn.execute("""
            CREATE TABLE IF NOT EXISTS scenarios (
                id         INTEGER PRIMARY KEY AUTOINCREMENT,
                name       TEXT    NOT NULL,
                income     REAL    NOT NULL DEFAULT 0.0,
                created_at TEXT    NOT NULL DEFAULT (datetime('now'))
            )
        """)
        conn.execute("""
            CREATE TABLE IF NOT EXISTS budget_items (
                id          INTEGER PRIMARY KEY AUTOINCREMENT,
                scenario_id INTEGER NOT NULL REFERENCES scenarios(id) ON DELETE CASCADE,
                category    TEXT    NOT NULL,
                name        TEXT    NOT NULL,
                amount      REAL    NOT NULL DEFAULT 0.0
            )
        """)
        conn.commit()


def seed_scenario(conn: sqlite3.Connection, scenario_id: int) -> None:
    conn.executemany(
        "INSERT INTO budget_items (scenario_id, category, name, amount) VALUES (?, ?, ?, 0.0)",
        [(scenario_id, cat, name) for cat, name in SEED_ITEMS],
    )
