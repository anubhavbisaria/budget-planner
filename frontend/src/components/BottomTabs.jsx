export default function BottomTabs({ activeView, hasActive, onScenarios, onDetail, onCompare, onReview }) {
  const tabs = [
    { key: 'scenarios', icon: '☰', label: 'Scenarios', action: onScenarios },
    { key: 'detail',    icon: '📊', label: 'Detail',    action: onDetail,   disabled: !hasActive },
    { key: 'compare',  icon: '⇄',  label: 'Compare',   action: onCompare },
    { key: 'review',   icon: '📋', label: 'Review',     action: onReview,   disabled: !hasActive },
  ]

  return (
    <nav className="bottom-tabs no-print">
      {tabs.map((t) => (
        <button
          key={t.key}
          className={`bottom-tab${activeView === t.key ? ' active' : ''}${t.disabled ? ' disabled' : ''}`}
          onClick={t.disabled ? undefined : t.action}
          disabled={t.disabled}
        >
          <span className="bottom-tab-icon">{t.icon}</span>
          <span className="bottom-tab-label">{t.label}</span>
        </button>
      ))}
    </nav>
  )
}
