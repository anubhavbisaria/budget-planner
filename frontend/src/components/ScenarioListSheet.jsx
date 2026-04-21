import { formatCurrency } from '../constants'

export default function ScenarioListSheet({ scenarios, activeId, onSelect, onNew, onClose }) {
  return (
    <div className="sheet-overlay" onClick={onClose}>
      <div className="sheet-panel" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-top">
          <span className="sheet-title">Scenarios</span>
          <button className="sheet-close" onClick={onClose}>×</button>
        </div>

        <div className="sheet-list">
          {scenarios.map((s) => {
            const surplus = s.surplus ?? 0
            return (
              <button
                key={s.id}
                className={`sheet-scenario-btn${s.id === activeId ? ' active' : ''}`}
                onClick={() => { onSelect(s.id); onClose() }}
              >
                <span className="sheet-scenario-name">{s.name}</span>
                <span className={`surplus-badge ${surplus >= 0 ? 'positive' : 'negative'}`}>
                  {surplus >= 0 ? '+' : '−'}{formatCurrency(Math.abs(surplus))}
                </span>
              </button>
            )
          })}
        </div>

        <div className="sheet-footer">
          <button className="btn-new" onClick={() => { onNew(); onClose() }}>+ New Scenario</button>
        </div>
      </div>
    </div>
  )
}
