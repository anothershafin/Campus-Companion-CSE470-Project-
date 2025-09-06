import React from 'react'
import {api} from '../api.js'
import {Link} from 'react-router-dom'

export default function Explore() {
  const token = localStorage.getItem('token')
  const [q, setQ] = React.useState('')
  const [items, setItems] = React.useState([])

  async function search() {
    const data = await api(`/folders/explore?q=${encodeURIComponent(q)}`)
    setItems(data)
  }
  React.useEffect(()=>{ search() }, [])

  return (
    <div>
      <div className="card">
        <div className="form-row">
          <label>Search public folders (by name or tags)</label>
          <input
            value={q}
            onChange={e=>setQ(e.target.value)}
            onKeyDown={e=>e.key==='Enter' && search()}
            placeholder="e.g., CSE370, database, calculus"
          />
        </div>
        <button className="btn" onClick={search}>Search</button>
      </div>

      <div className="grid cols-3" style={{marginTop:16}}>
        {items.map(f => (
          <Link key={f._id} className="card" to={`/resources/${f._id}`}>
            <div style={{fontWeight:800, fontSize:20}}>{f.name}</div>
            {f.description && <div className="small" style={{marginTop:6}}>{f.description}</div>}
            {f.tags?.length > 0 && (
              <div className="small" style={{marginTop:6}}>Tags: {f.tags.join(', ')}</div>
            )}
            <div className="small" style={{marginTop:10, opacity:0.9}}>
              Avg rating: <b>{(f.avgRating ?? 0).toFixed(1)}</b>{' '}
              <span style={{opacity:0.7}}>({f.ratingCount ?? 0} rating{(f.ratingCount ?? 0)===1 ? '' : 's'})</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
