import React from 'react'
import { api } from '../api.js'

export default function Score() {
  const token = localStorage.getItem('token')
  const [items, setItems] = React.useState([])
  const [loading, setLoading] = React.useState(true)

  async function load() {
    try {
      const data = await api('/todos', { token })
      setItems(data)
    } finally {
      setLoading(false)
    }
  }
  React.useEffect(()=>{ load() }, [])

  const total = items.length
  const done = items.filter(t => t.done).length
  const score = total === 0 ? 0 : Math.round((done / total) * 100)

  if (loading) return <div className="card">Loading…</div>

  return (
    <div className="card">
      <b>Your Score</b>
      <p className="small" style={{marginTop:8}}>
        Calculated as (Completed tasks / Total tasks) × 100
      </p>

      <div style={{fontSize:28, fontWeight:800, marginTop:12}}>
        Your Score is: {score}
      </div>

      <div className="small" style={{marginTop:8}}>
        {done} completed out of {total} tasks
      </div>

      <div style={{marginTop:12, background:'#333', borderRadius:8, overflow:'hidden', height:10}}>
        <div style={{width: `${score}%`, height:'100%', background:'#6aa96b`'}}/>
      </div>

      {total === 0 && (
        <div className="small" style={{marginTop:10}}>
          Add tasks in the To-Do page to get a score.
        </div>
      )}
    </div>
  )
}
