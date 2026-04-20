import { formatCurrency } from '../constants'

export default function Sidebar({ scenarios, activeId, onSelect, onNew, onCompare }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <span className="sidebar-logo">💰</span>
        <span className="sidebar-title">BudgetWise</span>
      </div>

      <nav className="sidebar-nav">
        {scenarios.map((s) => {
          const surplus = s.surplus ?? 0
          const isActive = s.id === activeId
          return (
            <button
              key={s.id}
              className={`scenario-btn${isActive ? ' active' : ''}`}
              onClick={() => onSelect(s.id)}
            >
              <span className="scenario-name">{s.name}</span>
              <span className={`surplus-badge ${surplus >= 0 ? 'positive' : 'negative'}`}>
                {surplus >= 0 ? '+' : '−'}{formatCurrency(Math.abs(surplus))}
              </span>
            </button>
          )
        })}
      </nav>

      <div className="sidebar-actions">
        <button className="btn-compare" onClick={onCompare}>⇄ Compare All</button>
        <button className="btn-new" onClick={onNew}>+ New Scenario</button>
      </div>
    </aside>
  )
}
