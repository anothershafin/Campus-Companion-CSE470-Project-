import React from 'react'
import { api } from '../api.js'
import { Link } from 'react-router-dom'

export default function Profile() {
  const token = localStorage.getItem('token')
  const [user, setUser] = React.useState(null)
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  React.useEffect(() => {
    api('/auth/me', { token }).then(out => setUser(out.user))
  }, [])

  function logout() {
    localStorage.clear()
    window.dispatchEvent(new Event('auth-changed'))
    window.location.href = '/'
  }

  if (!user) return <div className="card">Loading...</div>

  return (
    <div className="card">
      <b>Profile</b>

      <div style={{display:'flex', gap:16, alignItems:'center', marginTop:10}}>
        <div style={{width:80, height:80, borderRadius:'50%', overflow:'hidden', background:'#222', flexShrink:0}}>
          {user.avatarUrl ? (
            <img src={apiBase + user.avatarUrl} alt="avatar" style={{width:'100%', height:'100%', objectFit:'cover'}}/>
          ) : (
            <div style={{width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', color:'#bbb'}}>
              No Photo
            </div>
          )}
        </div>
        <div>
          <p className="small"><b>Name:</b> {user.name}</p>
          <p className="small"><b>Email:</b> {user.email}</p>
          <p className="small"><b>University:</b> {user.university || '—'}</p>
          <p className="small"><b>Phone:</b> {user.phone || '—'}</p>
        </div>
      </div>

      <div style={{marginTop:14, display:'flex', gap:8}}>
        <Link className="btn" to="/profile/edit">Edit Profile</Link>
        <button className="btn secondary" onClick={logout}>Logout</button>
      </div>
    </div>
  )
}
