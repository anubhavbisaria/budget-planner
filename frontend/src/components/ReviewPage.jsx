import { getCategoryMeta, formatCurrency, CATEGORY_META } from '../constants'
import DonutChart from './DonutChart'

const CANONICAL_ORDER = Object.keys(CATEGORY_META)

function sortedCategories(categories) {
  const entries = Object.entries(categories).filter(
    ([, items]) => items.reduce((s, i) => s + i.amount, 0) > 0
  )
  return entries.sort(([a], [b]) => {
    const ai = CANONICAL_ORDER.indexOf(a)
    const bi = CANONICAL_ORDER.indexOf(b)
    if (ai === -1 && bi === -1) return 0
    if (ai === -1) return 1
    if (bi === -1) return -1
    return ai - bi
  })
}

export default function ReviewPage({ detail, onBack }) {
  if (!detail) return <div className="loading">Loading…</div>

  const month = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
  const surplus = detail.surplus ?? (detail.income - detail.total_expenses)
  const isPositive = surplus >= 0
  const cats = sortedCategories(detail.categories ?? {})

  return (
    <div className="review-page">
      <div className="review-actions no-print">
        <button className="review-back-btn" onClick={onBack}>← Back</button>
        <button className="review-print-btn" onClick={() => window.print()}>🖨️ Print / Save PDF</button>
      </div>

      <div className="review-card">
        <div className="review-header">
          <span className="review-app-name">BudgetWise</span>
          <span className="review-date">{month}</span>
        </div>
        <h1 className="review-scenario-name">{detail.name}</h1>
        <hr className="review-divider" />

        <div className="review-stats">
          <div className="review-stat">
            <div className="review-stat-label">Income</div>
            <div className="review-stat-value">{formatCurrency(detail.income)}</div>
          </div>
          <div className="review-stat-divider" />
          <div className="review-stat">
            <div className="review-stat-label">Expenses</div>
            <div className="review-stat-value">{formatCurrency(detail.total_expenses)}</div>
          </div>
          <div className="review-stat-divider" />
          <div className="review-stat">
            <div className="review-stat-label">{isPositive ? 'Surplus' : 'Deficit'}</div>
            <div className={`review-stat-value ${isPositive ? 'review-positive' : 'review-negative'}`}>
              {isPositive ? '+' : '−'}{formatCurrency(Math.abs(surplus))}
            </div>
          </div>
        </div>

        <hr className="review-divider" />

        <div className="review-categories">
          {cats.map(([cat, items]) => {
            const meta = getCategoryMeta(cat)
            const total = items.reduce((s, i) => s + i.amount, 0)
            const pct = detail.income > 0 ? Math.min((total / detail.income) * 100, 100) : 0
            return (
              <div key={cat} className="review-cat-row">
                <div className="review-cat-header">
                  <span className="review-cat-icon">{meta.icon}</span>
                  <span className="review-cat-name">{cat}</span>
                  <span className="review-cat-amount">{formatCurrency(total)}</span>
                </div>
                {detail.income > 0 && (
                  <div className="review-bar-track">
                    <div
                      className="review-bar-fill"
                      style={{ width: `${pct}%`, background: meta.color }}
                    />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {detail.total_expenses > 0 && (
          <div className="review-donut-section">
            <hr className="review-divider" />
            <DonutChart
              categories={detail.categories ?? {}}
              totalExpenses={detail.total_expenses}
              income={detail.income}
              compact={true}
            />
          </div>
        )}

        <hr className="review-divider" />
        <p className="review-footer">Generated with BudgetWise · Local Budget Planner</p>
      </div>
    </div>
  )
}
