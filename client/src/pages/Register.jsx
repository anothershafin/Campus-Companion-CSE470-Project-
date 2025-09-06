import React from 'react'
import { api } from '../api.js'
import { Link, useNavigate } from 'react-router-dom'

export default function Register() {
  const [data, setData] = React.useState({ name:'', email:'', password:'' })
  const [phase, setPhase] = React.useState('form')
  const [otp, setOtp] = React.useState('')
  const nav = useNavigate()

  async function submit(e) {
    e.preventDefault()
    await api('/auth/register', { method:'POST', body: data })
    setPhase('otp')
  }
  async function verify(e) {
    e.preventDefault()
    await api('/auth/verify', { method:'POST', body: { email: data.email, otp } })
    alert('Verified. Please login.')
    nav('/login')
  }
  return (
    <div className="grid cols-2">
      <div className="card">
        {phase==='form' && (
          <form onSubmit={submit}>
            <div className="form-row"><label>Name</label><input required value={data.name} onChange={e=>setData({...data,name:e.target.value})}/></div>
            <div className="form-row"><label>Email</label><input type="email" required value={data.email} onChange={e=>setData({...data,email:e.target.value})}/></div>
            <div className="form-row"><label>Password</label><input type="password" required value={data.password} onChange={e=>setData({...data,password:e.target.value})}/></div>
            <button className="btn">Register</button>
            <p className="small">Have an account? <Link to="/login">Login</Link></p>
          </form>
        )}
        {phase==='otp' && (
          <form onSubmit={verify}>
            <div className="form-row"><label>Enter OTP (sent to email)</label><input required value={otp} onChange={e=>setOtp(e.target.value)}/></div>
            <button className="btn">Verify</button>
          </form>
        )}
      </div>
      <div className="card">
        <b>Tips</b>
        <p className="small">Use Mailtrap for dev emails. Configure SMTP in server/.env.</p>
      </div>
    </div>
  )
}
