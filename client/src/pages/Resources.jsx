import React from 'react'
import { api } from '../api.js'
import RatingStars from '../components/RatingStars.jsx'

export default function Resources() {
  const token = localStorage.getItem('token')
  const [form, setForm] = React.useState({ name:'', description:'', visibility:'private', tags:'' })
  const [folders, setFolders] = React.useState([])
  const [noteForm, setNoteForm] = React.useState({ folderId:'', title:'', content:'', file:null, tags:'' })
  const [notes, setNotes] = React.useState([])

  async function load() {
    const data = await api('/folders/mine', { token })
    setFolders(data)
  }
  React.useEffect(()=>{ load() }, [])

  async function createFolder(e) {
    e.preventDefault()
    const body = { ...form, tags: form.tags.split(',').map(s=>s.trim()).filter(Boolean) }
    await api('/folders', { method:'POST', body, token })
    setForm({ name:'', description:'', visibility:'private', tags:'' })
    load()
  }

  async function selectFolder(id) {
    const data = await api(`/folders/${id}`, { token })
    setNoteForm(n => ({...n, folderId: id}))
    setNotes(data.notes)
  }

  async function createNote(e) {
    e.preventDefault()
    const fd = new FormData()
    fd.append('folderId', noteForm.folderId)
    fd.append('title', noteForm.title)
    fd.append('content', noteForm.content)
    if (noteForm.file) fd.append('file', noteForm.file)
    if (noteForm.tags) fd.append('tags', noteForm.tags)
    await api('/notes', { method:'POST', token, isForm:true, body: fd })
    setNoteForm({ folderId: noteForm.folderId, title:'', content:'', file:null, tags:'' })
    selectFolder(noteForm.folderId)
  }

  return (
    <div className="grid cols-2">
      <div className="card">
        <b>Create Folder</b>
        <form onSubmit={createFolder}>
          <div className="form-row"><label>Name</label><input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
          <div className="form-row"><label>Description</label><input value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
          <div className="form-row">
            <label>Visibility</label>
            <select value={form.visibility} onChange={e=>setForm({...form,visibility:e.target.value})}>
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select>
          </div>
          <div className="form-row"><label>Tags (comma separated)</label><input value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})}/></div>
          <button className="btn">Create</button>
        </form>
        <hr/>
        <b>My Folders</b>
        <div className="grid">
          {folders.map(f => (
            <div key={f._id} className="card" onClick={()=>selectFolder(f._id)}>
              <div style={{display:'flex', justifyContent:'space-between'}}>
                <div><b>{f.name}</b><div className="small">{f.visibility.toUpperCase()} • {f.tags?.join(', ')}</div></div>
                <div><RatingStars value={Math.round(f.avgRating)} /></div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="card">
        <b>Add Note</b>
        <form onSubmit={createNote}>
          <div className="form-row"><label>Folder</label>
            <select required value={noteForm.folderId} onChange={e=>setNoteForm({...noteForm,folderId:e.target.value})}>
              <option value="">Select folder</option>
              {folders.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
            </select>
          </div>
          <div className="form-row"><label>Title</label><input required value={noteForm.title} onChange={e=>setNoteForm({...noteForm,title:e.target.value})}/></div>
          <div className="form-row"><label>Content</label><textarea rows="4" value={noteForm.content} onChange={e=>setNoteForm({...noteForm,content:e.target.value})}/></div>
          <div className="form-row"><label>Attachment (optional)</label><input type="file" onChange={e=>setNoteForm({...noteForm,file:e.target.files[0]})}/></div>
          <div className="form-row"><label>Tags</label><input value={noteForm.tags} onChange={e=>setNoteForm({...noteForm,tags:e.target.value})}/></div>
          <button className="btn">Add Note</button>
        </form>
        <hr/>
        <b>Notes</b>
        <div className="grid">
          {notes.map(n => (
            <div key={n._id} className="card">
              <b>{n.title}</b>
              {n.fileUrl && <div className="small"><a href={import.meta.env.VITE_API_URL + n.fileUrl} target="_blank">Attachment</a></div>}
              <p className="small">{n.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
