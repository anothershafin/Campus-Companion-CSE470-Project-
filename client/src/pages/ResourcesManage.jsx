import React from 'react'
import { api } from '../api.js'
import { Link } from 'react-router-dom'

export default function ResourcesManage() {
  const token = localStorage.getItem('token')

  const [folders, setFolders] = React.useState([])
  const [form, setForm] = React.useState({ name:'', description:'', visibility:'private', tags:'' })
  const [noteForm, setNoteForm] = React.useState({ folderId:'', title:'', content:'', file:null, tags:'' })

  async function loadFolders() {
    const data = await api('/folders/mine', { token })
    setFolders(data)
    // keep currently selected folder if possible
    setNoteForm(n => ({ ...n, folderId: n.folderId || (data[0]?._id || '') }))
  }

  React.useEffect(() => { loadFolders() }, [])

  async function createFolder(e) {
    e.preventDefault()
    const body = { 
      ...form, 
      tags: form.tags.split(',').map(s => s.trim()).filter(Boolean) 
    }
    await api('/folders', { method:'POST', body, token })
    setForm({ name:'', description:'', visibility:'private', tags:'' })
    loadFolders()
    alert('Folder created!')
  }

  async function createNote(e) {
    e.preventDefault()
    if (!noteForm.folderId) return alert('Please select a folder')
    const fd = new FormData()
    fd.append('folderId', noteForm.folderId)
    fd.append('title', noteForm.title)
    fd.append('content', noteForm.content)
    if (noteForm.file) fd.append('file', noteForm.file)
    if (noteForm.tags) fd.append('tags', noteForm.tags)
    await api('/notes', { method:'POST', token, isForm:true, body: fd })
    setNoteForm({ folderId: noteForm.folderId, title:'', content:'', file:null, tags:'' })
    alert('Note added!')
  }

  return (
    <div className="grid cols-2">
      <div className="card">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
          <b>Add Folder</b>
          <Link to="/resources" className="btn secondary">← Back to My Folders</Link>
        </div>
        <form onSubmit={createFolder} style={{marginTop:10}}>
          <div className="form-row"><label>Name</label>
            <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></div>
          <div className="form-row"><label>Description</label>
            <input value={form.description} onChange={e=>setForm({...form,description:e.target.value})}/></div>
          <div className="form-row"><label>Visibility</label>
            <select value={form.visibility} onChange={e=>setForm({...form,visibility:e.target.value})}>
              <option value="private">Private</option>
              <option value="public">Public</option>
            </select></div>
          <div className="form-row"><label>Tags (comma separated)</label>
            <input value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})}/></div>
          <button className="btn">Create Folder</button>
        </form>
      </div>

      <div className="card">
        <b>Add Note</b>
        <form onSubmit={createNote} style={{marginTop:10}}>
          <div className="form-row"><label>Folder</label>
            <select required value={noteForm.folderId} onChange={e=>setNoteForm({...noteForm,folderId:e.target.value})}>
              <option value="">Select folder</option>
              {folders.map(f => <option key={f._id} value={f._id}>{f.name}</option>)}
            </select></div>
          <div className="form-row"><label>Title</label>
            <input required value={noteForm.title} onChange={e=>setNoteForm({...noteForm,title:e.target.value})}/></div>
          <div className="form-row"><label>Content</label>
            <textarea rows="4" value={noteForm.content} onChange={e=>setNoteForm({...noteForm,content:e.target.value})}/></div>
          <div className="form-row"><label>Attachment (optional)</label>
            <input type="file" onChange={e=>setNoteForm({...noteForm,file:e.target.files[0]})}/></div>
          <div className="form-row"><label>Tags</label>
            <input value={noteForm.tags} onChange={e=>setNoteForm({...noteForm,tags:e.target.value})}/></div>
          <button className="btn">Add Note</button>
        </form>
      </div>
    </div>
  )
}
