import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api.js'
import RatingStars from '../components/RatingStars.jsx'

export default function ResourceDetail() {
  const token = localStorage.getItem('token')
  const { id } = useParams()
  const [folder, setFolder] = React.useState(null)
  const [notes, setNotes] = React.useState([])
  const [loading, setLoading] = React.useState(true)
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  async function load() {
    try {
      const data = await api(`/folders/${id}`, { token })
      setFolder(data.folder)
      setNotes(data.notes || [])
    } finally {
      setLoading(false)
    }
  }
  React.useEffect(()=>{ load() }, [id])

  async function submitRating(stars) {
    if (!token) return alert('Login to rate')
    await api('/ratings', { method: 'POST', token, body: { folderId: id, stars } })
    await load() // refresh avg + count after rating
  }

  if (loading) return <div className="card">Loading…</div>
  if (!folder) return <div className="card">Not found</div>

  return (
    <div>
      <div className="card" style={{marginBottom:16}}>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <div>
            <div style={{fontWeight:800, fontSize:20}}>{folder.name}</div>
            {folder.description && <div className="small" style={{marginTop:6}}>{folder.description}</div>}
            {folder.tags?.length > 0 && (
              <div className="small" style={{marginTop:6}}>Tags: {folder.tags.join(', ')}</div>
            )}
            <div className="small" style={{marginTop:10}}>
              Average rating: <b>{(folder.avgRating ?? 0).toFixed(1)}</b>{' '}
              <span style={{opacity:0.8}}>({folder.ratingCount ?? 0} rating{(folder.ratingCount ?? 0)===1 ? '' : 's'})</span>
            </div>
            <div className="small" style={{marginTop:8}}>
              Rate: <span style={{fontSize:22, marginLeft:6}}>
                <RatingStars value={0} onChange={submitRating} />
              </span>
            </div>
          </div>
          <Link to="/resources" className="btn secondary">← Back to My Folders</Link>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="card">Empty Folder<br/><span className="small">No notes yet.</span></div>
      ) : (
        <div className="grid cols-2">
          {notes.map(n => (
            <div key={n._id} className="card">
              <div style={{fontWeight:700}}>Note: {n.title}</div>
              {n.content && <p className="small" style={{marginTop:6}}>{n.content}</p>}
              {n.fileUrl && (
                <div className="small" style={{marginTop:6}}>
                  Attachment: <a href={apiBase + n.fileUrl} target="_blank">Open</a>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
