import { useState } from 'react'
import { formatCurrency } from '../constants'

export default function StatsStrip({ detail, onUpdate }) {
  const [income, setIncome] = useState(detail.income)

  async function handleIncomeBlur() {
    const val = parseFloat(income)
    const next = isNaN(val) || val < 0 ? 0 : val
    setIncome(next)
    await onUpdate({ income: next })
  }

  const surplus = detail.surplus ?? (detail.income - detail.total_expenses)
  const isPositive = surplus >= 0

  return (
    <div className="stats-strip">
      <div className="stat-tile">
        <div className="stat-label">Monthly Income</div>
        <input
          className="stat-income-input"
          type="number"
          value={income}
          onChange={(e) => setIncome(e.target.value)}
          onBlur={handleIncomeBlur}
          min="0"
        />
      </div>
      <div className="stat-tile">
        <div className="stat-label">Total Expenses</div>
        <div className="stat-value">{formatCurrency(detail.total_expenses)}</div>
      </div>
      <div className={`stat-tile ${isPositive ? 'surplus-positive' : 'surplus-negative'}`}>
        <div className="stat-label">{isPositive ? 'Surplus' : 'Deficit'}</div>
        <div className={`stat-value ${isPositive ? 'text-teal' : 'text-red'}`}>
          {formatCurrency(Math.abs(surplus))}
        </div>
      </div>
    </div>
  )
}
