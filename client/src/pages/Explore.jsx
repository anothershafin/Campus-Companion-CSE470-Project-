import React from 'react'
import { api } from '../api.js'
import RatingStars from '../components/RatingStars.jsx'

export default function Explore() {
  const token = localStorage.getItem('token')
  const [q, setQ] = React.useState('')
  const [items, setItems] = React.useState([])

  async function search() {
    const data = await api(`/folders/explore?q=${encodeURIComponent(q)}` + '')
    setItems(data)
  }
  React.useEffect(()=>{ search() }, [])

  async function rate(folderId, stars) {
    if (!token) return alert('Login to rate')
    await api('/ratings', { method:'POST', token, body: { folderId, stars } })
    search()
  }

  return (
    <div>
      <div className="card">
        <div className="form-row">
          <label>Search public folders (by name or tags)</label>
          <input value={q} onChange={e=>setQ(e.target.value)} onKeyDown={e=>e.key==='Enter'&&search()} placeholder="e.g., CSE370, database, calculus"/>
        </div>
        <button className="btn" onClick={search}>Search</button>
      </div>
      <div className="grid cols-3" style={{marginTop:16}}>
        {items.map(f => (
          <div key={f._id} className="card">
            <b>{f.name}</b>
            <div className="small">{f.tags?.join(', ')}</div>
            <div style={{marginTop:6}}><RatingStars value={Math.round(f.avgRating)} onChange={(s)=>rate(f._id, s)}/></div>
          </div>
        ))}
      </div>
    </div>
  )
}
