import { useState } from 'react'
import { getCategoryMeta, formatCurrency } from '../constants'
import { createItem } from '../api'
import LineItem from './LineItem'

export default function CategoryCard({ category, items, income, scenarioId, onReload }) {
  const meta = getCategoryMeta(category)
  const total = items.reduce((sum, i) => sum + i.amount, 0)
  const pct = income > 0 ? Math.min((total / income) * 100, 100) : 0
  const [newItemId, setNewItemId] = useState(null)

  async function handleAddItem() {
    const created = await createItem(scenarioId, { category, name: 'New item', amount: 0 })
    setNewItemId(created.id)
    onReload()
  }

  return (
    <div className="category-card">
      <div className="category-header">
        <span className="category-icon" style={{ background: meta.color + '22' }}>
          {meta.icon}
        </span>
        <span className="category-name">{category}</span>
        <span className="category-total">{formatCurrency(total)}</span>
      </div>
      <div className="progress-bar-track">
        <div
          className="progress-bar-fill"
          style={{ width: `${pct}%`, background: meta.color }}
        />
      </div>
      <div className="line-items">
        {items.map((item) => (
          <LineItem
            key={item.id}
            item={item}
            onReload={() => { setNewItemId(null); onReload() }}
            autoFocus={item.id === newItemId}
          />
        ))}
      </div>
      <button className="btn-add-item" onClick={handleAddItem}>+ Add item</button>
    </div>
  )
}
