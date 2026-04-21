import { useState, useEffect } from 'react'
import { updateScenario, createItem } from '../api'
import StatsStrip from './StatsStrip'
import CategoryCard from './CategoryCard'
import DonutChart from './DonutChart'

export default function ScenarioDetail({ detail, onReload, onDelete, onReview }) {
  const [editName, setEditName] = useState('')

  useEffect(() => {
    if (detail) setEditName(detail.name)
  }, [detail?.id])

  if (!detail) {
    return <div className="loading">Loading…</div>
  }

  async function handleNameBlur() {
    const trimmed = editName.trim()
    if (!trimmed) { setEditName(detail.name); return }
    await updateScenario(detail.id, { name: trimmed })
    onReload()
  }

  async function handleUpdate(fields) {
    await updateScenario(detail.id, fields)
    onReload()
  }

  async function handleDelete() {
    if (window.confirm(`Delete "${detail.name}"?`)) {
      onDelete()
    }
  }

  async function handleAddCategory() {
    await createItem(detail.id, { category: 'New Category', name: 'New item', amount: 0 })
    onReload()
  }

  const categories = detail.categories ?? {}
  const totalExpenses = detail.total_expenses ?? 0

  return (
    <div className="scenario-detail">
      <div className="detail-header">
        <input
          className="scenario-name-input"
          value={editName}
          onChange={(e) => setEditName(e.target.value)}
          onBlur={handleNameBlur}
        />
        <button className="btn-review" onClick={onReview}>📋 Review</button>
        <button className="btn-delete" onClick={handleDelete}>Delete</button>
      </div>

      <StatsStrip detail={detail} onUpdate={handleUpdate} />

      <div className="detail-body">
        <div className="chart-panel">
          <DonutChart categories={categories} totalExpenses={totalExpenses} income={detail.income} />
        </div>
        <div className="categories-panel">
          {Object.entries(categories).map(([cat, items]) => (
            <CategoryCard
              key={cat}
              category={cat}
              items={items}
              income={detail.income}
              scenarioId={detail.id}
              onReload={onReload}
            />
          ))}
          <button className="btn-add-category" onClick={handleAddCategory}>+ Add Category</button>
        </div>
      </div>
    </div>
  )
}
