import React from 'react'
import { Link } from 'react-router-dom'

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem('user')||'{}')
  return (
    <div className="grid cols-3">
      <div className="card">
        <b>Hello, {user.name || 'Student'} 👋</b>
        <p className="small">Quick links</p>
        <div style={{display:'flex', gap:8, flexWrap:'wrap'}}>
          <Link className="btn" to="/resources">My Folders</Link>
          <Link className="btn" to="/deadlines">Deadlines</Link>
          <Link className="btn" to="/kanban">Kanban</Link>
          <Link className="btn" to="/todo">To‑Do</Link>
        </div>
      </div>
      <div className="card"><b>Tip</b><p className="small">Turn public on a folder to share with friends.</p></div>
      <div className="card"><b>Reminder</b><p className="small">Emails go out at 09:00 daily for next‑day deadlines.</p></div>
    </div>
  )
}
