import React from 'react'
import { api } from '../api.js'
import { Link } from 'react-router-dom'

export default function Resources() {
  const token = localStorage.getItem('token')
  const [folders, setFolders] = React.useState([])

  async function load() {
    const data = await api('/folders/mine', { token })
    setFolders(data)
  }
  React.useEffect(()=>{ load() }, [])

  return (
    <div>
      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{fontWeight:800, fontSize:20}}>My Folders</div>
            <div className="small" style={{marginTop:6}}>Only folders you created. Click any card to view its notes.</div>
          </div>
          <Link className="btn" to="/resources/manage">Add New Folder / Notes</Link>
        </div>
      </div>

      <div className="grid cols-3" style={{marginTop:16}}>
        {folders.map(f => (
          <Link key={f._id} className="card" to={`/resources/${f._id}`}>
            <div style={{fontWeight:800, fontSize:20}}>{f.name}</div>
            {f.description && <div className="small" style={{marginTop:6}}>{f.description}</div>}
            <div className="small" style={{marginTop:6}}>Tags: {f.tags?.length ? f.tags.join(', ') : '—'}</div>
            <div className="small" style={{marginTop:10, opacity:0.9}}>
              Avg rating: <b>{(f.avgRating ?? 0).toFixed(1)}</b>{' '}
              <span style={{opacity:0.7}}>({f.ratingCount ?? 0} rating{(f.ratingCount ?? 0)===1 ? '' : 's'})</span>
            </div>
            <div className="small" style={{marginTop:6}}>Visibility: {f.visibility?.toUpperCase()}</div>
          </Link>
        ))}

        {folders.length === 0 && (
          <div className="card">You have no folders yet.</div>
        )}
      </div>
    </div>
  )
}
