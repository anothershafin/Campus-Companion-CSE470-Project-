import React from 'react'
import { api } from '../api.js'

export default function Profile() {
  const token = localStorage.getItem('token')
  const [user, setUser] = React.useState(null)
  React.useEffect(() => {
    api('/auth/me', { token }).then(out => setUser(out.user))
  }, [])
function logout() {
  localStorage.clear();
  window.dispatchEvent(new Event('auth-changed')); // <— add this
  window.location.href = '/';
}
  if (!user) return <div className="card">Loading...</div>
  return (
    <div className="card">
      <b>Profile</b>
      <p className="small">Name: {user.name}</p>
      <p className="small">Email: {user.email}</p>
      <button className="btn" onClick={logout}>Logout</button>
    </div>
  )
}
