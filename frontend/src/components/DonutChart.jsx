import { getCategoryMeta } from '../constants'

const R = 38
const CIRCUMFERENCE = 2 * Math.PI * R

function buildSlices(categories, totalExpenses) {
  if (totalExpenses === 0) return []
  const slices = []
  let cumulative = 0
  for (const [cat, items] of Object.entries(categories)) {
    const total = items.reduce((s, i) => s + i.amount, 0)
    if (total === 0) continue
    const arcLength = (total / totalExpenses) * CIRCUMFERENCE
    const offset = -(cumulative)
    slices.push({ category: cat, total, arcLength, offset, pct: Math.round((total / totalExpenses) * 100) })
    cumulative += arcLength
  }
  return slices
}

export default function DonutChart({ categories, totalExpenses, income, compact = false }) {
  const slices = buildSlices(categories, totalExpenses)
  const centerLabel = income > 0 ? Math.round((totalExpenses / income) * 100) + '%' : '—'
  const svgSize = compact ? 120 : 160

  return (
    <div className={`donut-chart-card${compact ? ' compact' : ''}`}>
      <svg viewBox="0 0 100 100" width={svgSize} height={svgSize} className="donut-svg">
        <circle
          cx="50" cy="50" r={R}
          fill="none"
          stroke="#2a2a3e"
          strokeWidth="14"
        />
        {slices.map((s) => {
          const { color } = getCategoryMeta(s.category)
          return (
            <circle
              key={s.category}
              cx="50" cy="50" r={R}
              fill="none"
              stroke={color}
              strokeWidth="14"
              strokeDasharray={`${s.arcLength} ${CIRCUMFERENCE - s.arcLength}`}
              strokeDashoffset={s.offset}
              transform="rotate(-90 50 50)"
            />
          )
        })}
        <text x="50" y="50" textAnchor="middle" dominantBaseline="central" className="donut-center-label">
          {centerLabel}
        </text>
        <text x="50" y="62" textAnchor="middle" className="donut-center-sub">spent</text>
      </svg>

      <ul className={`donut-legend${compact ? ' compact' : ''}`}>
        {slices.map((s) => {
          const { color } = getCategoryMeta(s.category)
          return (
            <li key={s.category} className="legend-item">
              <span className="legend-dot" style={{ background: color }} />
              <span className="legend-name">{s.category}</span>
              <span className="legend-pct">{s.pct}%</span>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
