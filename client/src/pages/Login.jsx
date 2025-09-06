import React from 'react'
import { api } from '../api.js'
import { Link, useNavigate } from 'react-router-dom'

export default function Login() {
  const [data, setData] = React.useState({ email:'', password:'' })
  const nav = useNavigate()
  async function submit(e) {
    e.preventDefault()
    const out = await api('/auth/login', { method:'POST', body:data })
    localStorage.setItem('token', out.token)
    localStorage.setItem('user', JSON.stringify(out.user))
    window.dispatchEvent(new Event('auth-changed'))
    nav('/dashboard')
  }
  return (
    <div className="grid cols-2">
      <div className="card">
        <form onSubmit={submit}>
          <div className="form-row"><label>Email</label><input type="email" required value={data.email} onChange={e=>setData({...data,email:e.target.value})}/></div>
          <div className="form-row"><label>Password</label><input type="password" required value={data.password} onChange={e=>setData({...data,password:e.target.value})}/></div>
          <button className="btn">Login</button>
          <p className="small">New here? <Link to="/register">Create account</Link></p>
        </form>
      </div>
      <div className="card"><b>Welcome back!</b><p className="small">Your dashboard awaits.</p></div>
    </div>
  )
}
