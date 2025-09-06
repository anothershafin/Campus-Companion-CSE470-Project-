import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { api } from '../api.js'

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
      setNotes(data.notes)
    } catch (e) {
      console.error(e)
      alert('Failed to load folder')
    } finally {
      setLoading(false)
    }
  }
  React.useEffect(()=>{ load() }, [id])

  if (loading) return <div className="card">Loading…</div>
  if (!folder) return <div className="card">Folder not found.</div>

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
          </div>
          <Link to="/resources" className="btn secondary">← Back to My Folders</Link>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className="card"><b>Empty Folder</b><div className="small">No notes yet.</div></div>
      ) : (
        <div className="grid">
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
