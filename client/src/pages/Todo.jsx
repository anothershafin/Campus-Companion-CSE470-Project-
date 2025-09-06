import React from 'react'
import { api } from '../api.js'

export default function Todo() {
  const token = localStorage.getItem('token')
  const [text, setText] = React.useState('')
  const [items, setItems] = React.useState([])

  async function load() {
    const data = await api('/todos', { token })
    setItems(data)
  }
  React.useEffect(()=>{ load() }, [])

  async function add(e) {
    e.preventDefault()
    if (!text.trim()) return
    await api('/todos', { method:'POST', token, body:{ text } })
    setText('')
    load()
  }
  async function toggle(id) {
    await api(`/todos/${id}/toggle`, { method:'PATCH', token })
    load()
  }
  async function remove(id) {
    await api(`/todos/${id}`, { method:'DELETE', token })
    load()
  }

  return (
    <div className="grid cols-2">
      <div className="card">
        <b>Add Task</b>
        <form onSubmit={add} className="grid cols-2">
          <input value={text} onChange={e=>setText(e.target.value)} placeholder="e.g., revise lec 5"/>
          <button className="btn">Add</button>
        </form>
      </div>
      <div className="card">
        <b>Tasks</b>
        <ul>
          {items.map(t => (
            <li key={t._id} style={{display:'flex', alignItems:'center', gap:8, marginBottom:6}}>
              <input type="checkbox" checked={t.done} onChange={()=>toggle(t._id)}/>
              <span style={{textDecoration: t.done ? 'line-through' : 'none'}}>{t.text}</span>
              <button className="btn secondary" onClick={()=>remove(t._id)} style={{marginLeft:'auto'}}>Delete</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
