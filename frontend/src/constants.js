export const CATEGORY_META = {
  'Housing':                { color: '#4f74e8', icon: '🏠' },
  'Utilities':              { color: '#00a3e0', icon: '⚡' },
  'Phone & Internet':       { color: '#2ea043', icon: '📱' },
  'Groceries & Food':       { color: '#e3b341', icon: '🛒' },
  'Child Expenses':         { color: '#f5a623', icon: '👦' },
  'Transportation':         { color: '#ff5a5f', icon: '🚗' },
  'Insurance':              { color: '#9b59b6', icon: '🛡️' },
  'Subscriptions':          { color: '#fb8f44', icon: '📺' },
  'Personal Care':          { color: '#56d364', icon: '🪥' },
  'Entertainment & Dining': { color: '#ef476f', icon: '🎬' },
  'Savings & Investments':  { color: '#00c896', icon: '💵' },
}

export const DEFAULT_META = { color: '#8b949e', icon: '📌' }

export function getCategoryMeta(category) {
  return CATEGORY_META[category] ?? DEFAULT_META
}

export function formatCurrency(amount) {
  return '$' + Math.round(amount).toLocaleString('en-US')
}
