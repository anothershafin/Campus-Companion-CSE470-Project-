import React from 'react'
import { api } from '../api.js'
import { Link, useNavigate } from 'react-router-dom'

export default function ProfileEdit() {
  const token = localStorage.getItem('token')
  const nav = useNavigate()
  const [form, setForm] = React.useState({ name:'', university:'', phone:'', avatar:null })
  const [loading, setLoading] = React.useState(true)
  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:5000'

  React.useEffect(() => {
    (async () => {
      const { user } = await api('/auth/me', { token })
      setForm({
        name: user.name || '',
        university: user.university || '',
        phone: user.phone || '',
        avatar: null
      })
      setLoading(false)
    })()
  }, [])

  async function submit(e) {
    e.preventDefault()
    const fd = new FormData()
    fd.append('name', form.name)
    fd.append('university', form.university)
    fd.append('phone', form.phone)
    if (form.avatar) fd.append('avatar', form.avatar)
    await api('/auth/me', { method:'PUT', token, isForm:true, body: fd })
    alert('Profile updated!')
    nav('/profile')
  }

  if (loading) return <div className="card">Loading…</div>

  return (
    <div className="card">
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <b>Edit Profile</b>
        <Link to="/profile" className="btn secondary">← Back</Link>
      </div>

      <form onSubmit={submit} style={{marginTop:12}}>
        <div className="form-row"><label>Name</label>
          <input value={form.name} onChange={e=>setForm({...form, name:e.target.value})} required/>
        </div>

        <div className="form-row"><label>University Name</label>
          <input value={form.university} onChange={e=>setForm({...form, university:e.target.value})}/>
        </div>

        <div className="form-row"><label>Phone Number</label>
          <input value={form.phone} onChange={e=>setForm({...form, phone:e.target.value})}/>
        </div>

        <div className="form-row"><label>Profile Picture</label>
          <input type="file" accept="image/*" onChange={e=>setForm({...form, avatar: e.target.files[0]})}/>
        </div>

        <button className="btn">Save Changes</button>
      </form>
    </div>
  )
}
