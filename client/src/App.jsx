import React from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import Landing from './pages/Landing.jsx'
import Register from './pages/Register.jsx'
import Login from './pages/Login.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Resources from './pages/Resources.jsx'
import Explore from './pages/Explore.jsx'
import Deadlines from './pages/Deadlines.jsx'
import Kanban from './pages/Kanban.jsx'
import Todo from './pages/Todo.jsx'
import Profile from './pages/Profile.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import ResourceDetail from './pages/ResourceDetail.jsx'
import ResourcesManage from './pages/ResourcesManage.jsx'
import ProfileEdit from './pages/ProfileEdit.jsx'

function Navbar() {
  const [authed, setAuthed] = React.useState(!!localStorage.getItem('token'))

  React.useEffect(() => {
    const onAuthChanged = () => setAuthed(!!localStorage.getItem('token'))
    window.addEventListener('auth-changed', onAuthChanged)
    window.addEventListener('storage', onAuthChanged)
    return () => {
      window.removeEventListener('auth-changed', onAuthChanged)
      window.removeEventListener('storage', onAuthChanged)
    }
  }, [])

  function logout() {
    localStorage.clear()
    window.dispatchEvent(new Event('auth-changed'))
    window.location.href = '/'
  }

  return (
    <div className="nav">
      <div className="inner">
        <Link to="/" className="brand">Campus Companion</Link>
        <Link to="/explore">Explore</Link>
        {authed && <Link to="/resources">My Folders</Link>}
        {authed && <Link to="/deadlines">Deadlines</Link>}
        {authed && <Link to="/kanban">Kanban</Link>}
        {authed && <Link to="/todo">To-Do</Link>}
        <div style={{ marginLeft: 'auto' }} />
        {!authed && <Link to="/login" className="btn">Login</Link>}
        {!authed && <Link to="/register" className="btn secondary">Register</Link>}
        {authed && <Link to="/profile" className="btn secondary" style={{ marginRight: 8 }}>Profile</Link>}
        {authed && <button className="btn" onClick={logout}>Logout</button>}
      </div>
    </div>
  )
}



export default function App() {
  return (
    <div>
      <Navbar/>
      <div className="container">
        <Routes>
          <Route path="/" element={<Landing/>} />
          <Route path="/register" element={<Register/>} />
          <Route path="/login" element={<Login/>} />
          <Route path="/explore" element={<Explore/>} />
          <Route element={<ProtectedRoute/>}>
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/resources" element={<Resources/>} />
            <Route path="/deadlines" element={<Deadlines/>} />
            <Route path="/kanban" element={<Kanban/>} />
            <Route path="/todo" element={<Todo/>} />
            <Route path="/profile" element={<Profile/>} />
            <Route path="/profile/edit" element={<ProfileEdit/>} />
            <Route path="/resources/:id" element={<ResourceDetail/>} />
            <Route path="/resources/manage" element={<ResourcesManage/>} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </div>
      <footer>© {new Date().getFullYear()} Campus Companion | Shafin Ahmed [22201469]</footer>
    </div>
  )
}
