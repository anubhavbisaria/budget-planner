import { useState, useEffect } from 'react'
import { compareScenarios } from '../api'
import { formatCurrency } from '../constants'

export default function ComparisonView() {
  const [data, setData] = useState([])

  useEffect(() => {
    compareScenarios().then(setData).catch(console.error)
  }, [])

  if (data.length === 0) return <div className="loading">Loading comparison…</div>

  const allCategories = [...new Set(data.flatMap((s) => Object.keys(s.category_totals)))]

  return (
    <div className="comparison-view">
      <h2 className="comparison-title">Scenario Comparison</h2>
      <div className="comparison-table-wrap">
        <table className="comparison-table">
          <thead>
            <tr>
              <th>Category</th>
              {data.map((s) => <th key={s.id}>{s.name}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr className="summary-row">
              <td>Income</td>
              {data.map((s) => <td key={s.id}>{formatCurrency(s.income)}</td>)}
            </tr>
            {allCategories.map((cat) => (
              <tr key={cat}>
                <td>{cat}</td>
                {data.map((s) => (
                  <td key={s.id}>{formatCurrency(s.category_totals[cat] ?? 0)}</td>
                ))}
              </tr>
            ))}
            <tr className="summary-row">
              <td>Surplus / Deficit</td>
              {data.map((s) => (
                <td key={s.id} className={s.surplus >= 0 ? 'text-teal' : 'text-red'}>
                  {s.surplus >= 0 ? '+' : '−'}{formatCurrency(Math.abs(s.surplus))}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}
