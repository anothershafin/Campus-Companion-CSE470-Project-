import React from 'react'
import { Link } from 'react-router-dom'

export default function Landing() {
  return (
    <div>
      <header className="hero">
        <h1>All your campus life, in one tab.</h1>
        <p>Folders, notes, deadlines, Kanban, and to‑dos — designed for students.</p>
        <div style={{marginTop:16}}>
          <Link to="/register" className="btn">Get Started</Link>
          <Link to="/explore" className="btn secondary" style={{marginLeft:8}}>Explore Public</Link>
        </div>
      </header>
      <div className="grid cols-3">
        <div className="card"><b>Public/Private Folders</b><p className="small">Share resources with tags and ratings.</p></div>
        <div className="card"><b>Deadlines & Reminders</b><p className="small">Emails 1 day before due.</p></div>
        <div className="card"><b>Kanban + To‑Dos</b><p className="small">Track topics and tasks with ease.</p></div>
      </div>
    </div>
  )
}
