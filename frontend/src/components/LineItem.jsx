import { useState, useEffect, useRef } from 'react'
import { updateItem, deleteItem } from '../api'
import { formatCurrency } from '../constants'

export default function LineItem({ item, onReload, autoFocus }) {
  const [name, setName] = useState(item.name)
  const [amount, setAmount] = useState(item.amount)
  const nameRef = useRef(null)

  useEffect(() => {
    if (autoFocus && nameRef.current) {
      nameRef.current.focus()
      nameRef.current.select()
    }
  }, [autoFocus])

  async function handleNameBlur() {
    const trimmed = name.trim()
    if (!trimmed) { setName(item.name); return }
    await updateItem(item.id, { name: trimmed })
    onReload()
  }

  async function handleAmountBlur() {
    const val = parseFloat(amount)
    const next = isNaN(val) || val < 0 ? 0 : val
    setAmount(next)
    await updateItem(item.id, { amount: next })
    onReload()
  }

  async function handleDelete() {
    await deleteItem(item.id)
    onReload()
  }

  return (
    <div className="line-item">
      <input
        ref={nameRef}
        className="line-item-name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleNameBlur}
      />
      <input
        className="line-item-amount"
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        onBlur={handleAmountBlur}
        min="0"
      />
      <button className="line-item-delete" onClick={handleDelete} title="Delete">×</button>
    </div>
  )
}
