import React from 'react'
import { api } from '../api.js'

export default function Deadlines() {
  const token = localStorage.getItem('token')
  const [form, setForm] = React.useState({ title:'', course:'', dueDate:'' })
  const [items, setItems] = React.useState([])

  async function load() {
    const data = await api('/deadlines', { token })
    setItems(data)
  }
  React.useEffect(()=>{ load() }, [])

  async function add(e) {
    e.preventDefault()
    await api('/deadlines', { method:'POST', token, body: form })
    setForm({ title:'', course:'', dueDate:'' })
    load()
  }
  async function remove(id) {
    await api(`/deadlines/${id}`, { method:'DELETE', token })
    load()
  }

  return (
    <div className="grid cols-2">
      <div className="card">
        <b>Add Deadline</b>
        <form onSubmit={add}>
          <div className="form-row"><label>Title</label><input required value={form.title} onChange={e=>setForm({...form,title:e.target.value})}/></div>
          <div className="form-row"><label>Course</label><input value={form.course} onChange={e=>setForm({...form,course:e.target.value})}/></div>
          <div className="form-row"><label>Due Date</label><input type="date" required value={form.dueDate} onChange={e=>setForm({...form,dueDate:e.target.value})}/></div>
          <button className="btn">Add</button>
          <p className="small">Email reminder is sent 1 day before at 09:00 (Asia/Dhaka).</p>
        </form>
      </div>
      <div className="card">
        <b>Your Deadlines</b>
        <table className="table">
          <thead><tr><th>Title</th><th>Course</th><th>Due</th><th/></tr></thead>
          <tbody>
            {items.map(d => (
              <tr key={d._id}>
                <td>{d.title}</td>
                <td>{d.course || '-'}</td>
                <td>{new Date(d.dueDate).toLocaleDateString()}</td>
                <td><button className="btn secondary" onClick={()=>remove(d._id)}>Delete</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
