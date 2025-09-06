import React from 'react'
import { api } from '../api.js'
import { Link } from 'react-router-dom'
import RatingStars from '../components/RatingStars.jsx'

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
      <div className="card" style={{marginBottom:16}}>
        <b>My Folders</b>
        <p className="small">Only folders you created. Click any card to view its notes.</p>
      </div>

      <div className="grid cols-3">
        {folders.map(f => (
          <Link key={f._id} to={`/resources/${f._id}`} className="card" style={{display:'block'}}>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'start', gap:8}}>
              <div>
                <div style={{fontWeight:800}}>{f.name}</div>
                {f.description && <div className="small" style={{marginTop:6}}>{f.description}</div>}
                {f.tags?.length > 0 && (
                  <div className="small" style={{marginTop:6}}>Tags: {f.tags.join(', ')}</div>
                )}
                <div className="small" style={{marginTop:6}}>Visibility: {f.visibility?.toUpperCase()}</div>
              </div>
              <div>
                <RatingStars value={Math.round(f.avgRating||0)} />
                <div className="small" style={{textAlign:'right'}}>{f.ratingCount||0} rating(s)</div>
              </div>
            </div>
          </Link>
        ))}

        {folders.length === 0 && (
          <div className="card">You have no folders yet.</div>
        )}
      </div>
      <div style={{ textAlign: 'center', marginTop: 24 }}>
  <Link to="/resources/manage" className="btn">Add New Folder / Notes</Link>
      </div>
    </div>
  )
}
