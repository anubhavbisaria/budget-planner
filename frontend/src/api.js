async function request(path, options = {}) {
  const res = await fetch(`/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }))
    throw new Error(err.detail || res.statusText)
  }
  if (res.status === 204) return null
  return res.json()
}

export const getScenarios = () => request('/scenarios')
export const createScenario = (body) => request('/scenarios', { method: 'POST', body: JSON.stringify(body) })
export const getScenario = (id) => request(`/scenarios/${id}`)
export const updateScenario = (id, body) => request(`/scenarios/${id}`, { method: 'PUT', body: JSON.stringify(body) })
export const deleteScenario = (id) => request(`/scenarios/${id}`, { method: 'DELETE' })
export const compareScenarios = () => request('/scenarios/compare')
export const createItem = (scenarioId, body) => request(`/scenarios/${scenarioId}/items`, { method: 'POST', body: JSON.stringify(body) })
export const updateItem = (id, body) => request(`/items/${id}`, { method: 'PUT', body: JSON.stringify(body) })
export const deleteItem = (id) => request(`/items/${id}`, { method: 'DELETE' })
