import { useReducer, useEffect } from 'react'
import { getScenarios, createScenario, getScenario, deleteScenario } from './api'
import Sidebar from './components/Sidebar'
import EmptyState from './components/EmptyState'
import ScenarioDetail from './components/ScenarioDetail'
import ComparisonView from './components/ComparisonView'
import './index.css'

const initialState = {
  scenarios: [],
  activeId: null,
  activeView: 'detail',
  detail: null,
  loading: false,
  error: null,
}

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_SCENARIOS':
      return { ...state, scenarios: action.payload }
    case 'SET_ACTIVE':
      return { ...state, activeId: action.payload, activeView: 'detail', detail: null }
    case 'SET_VIEW':
      return { ...state, activeView: action.payload }
    case 'LOAD_DETAIL':
      return { ...state, detail: action.payload }
    case 'SET_LOADING':
      return { ...state, loading: action.payload }
    case 'SET_ERROR':
      return { ...state, error: action.payload }
    default:
      return state
  }
}

export default function App() {
  const [state, dispatch] = useReducer(reducer, initialState)

  async function loadScenarios() {
    try {
      const list = await getScenarios()
      dispatch({ type: 'LOAD_SCENARIOS', payload: list })
      return list
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message })
      return []
    }
  }

  async function loadDetail(id) {
    try {
      const detail = await getScenario(id)
      dispatch({ type: 'LOAD_DETAIL', payload: detail })
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message })
    }
  }

  async function handleNewScenario() {
    try {
      const s = await createScenario({ name: 'New Scenario' })
      await loadScenarios()
      dispatch({ type: 'SET_ACTIVE', payload: s.id })
      await loadDetail(s.id)
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message })
    }
  }

  async function handleSelectScenario(id) {
    dispatch({ type: 'SET_ACTIVE', payload: id })
    await loadDetail(id)
  }

  async function handleDeleteScenario(id) {
    try {
      await deleteScenario(id)
      const list = await loadScenarios()
      if (list.length > 0) {
        dispatch({ type: 'SET_ACTIVE', payload: list[0].id })
        await loadDetail(list[0].id)
      } else {
        dispatch({ type: 'SET_ACTIVE', payload: null })
        dispatch({ type: 'LOAD_DETAIL', payload: null })
      }
    } catch (e) {
      dispatch({ type: 'SET_ERROR', payload: e.message })
    }
  }

  useEffect(() => {
    loadScenarios().then((list) => {
      if (list.length > 0) {
        dispatch({ type: 'SET_ACTIVE', payload: list[0].id })
        loadDetail(list[0].id)
      }
    })
  }, [])

  function renderMain() {
    if (state.scenarios.length === 0 && !state.loading) {
      return <EmptyState onNew={handleNewScenario} />
    }
    if (state.activeView === 'compare') {
      return <ComparisonView />
    }
    return (
      <ScenarioDetail
        detail={state.detail}
        onReload={() => {
          loadDetail(state.activeId)
          loadScenarios()
        }}
        onDelete={() => handleDeleteScenario(state.activeId)}
      />
    )
  }

  return (
    <div className="app-layout">
      <Sidebar
        scenarios={state.scenarios}
        activeId={state.activeId}
        onSelect={handleSelectScenario}
        onNew={handleNewScenario}
        onCompare={() => dispatch({ type: 'SET_VIEW', payload: 'compare' })}
      />
      <main className="main-panel">
        {state.error && <div className="error-banner">{state.error}</div>}
        {renderMain()}
      </main>
    </div>
  )
}
