export default function EmptyState({ onNew }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">💰</div>
      <h2>No scenarios yet</h2>
      <p>Create your first budget scenario to get started.</p>
      <button className="btn-primary" onClick={onNew}>+ New Scenario</button>
    </div>
  )
}
