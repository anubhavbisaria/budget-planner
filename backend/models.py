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
