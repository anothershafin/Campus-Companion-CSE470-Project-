import React from 'react'
import {api} from '../api.js'
import RatingStars from '../components/RatingStars.jsx'
import {Link} from 'react-router-dom'

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
    <Link
      key={f._id}
      to={`/resources/${f._id}`}         // click → detail page
      className="card"
      style={{ display:'block', cursor:'pointer' }}
      title="Open folder"
    >
      <b>{f.name}</b>
      {f.description && <div className="small" style={{marginTop:6}}>{f.description}</div>}
      <div className="small" style={{marginTop:6}}>{f.tags?.join(', ')}</div>

      {/* keep rating clicks without navigating */}
      <div
        style={{marginTop:6}}
        onClick={(e)=>{ e.preventDefault(); e.stopPropagation(); }}
      >
        <RatingStars
          value={Math.round(f.avgRating || 0)}
          onChange={(s)=>rate(f._id, s)}
        />
      </div>
    </Link>
  ))}
</div>

    </div>
  )
}
