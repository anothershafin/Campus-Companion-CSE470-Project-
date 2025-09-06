import React from 'react'
import { api } from '../api.js'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'

export default function Kanban() {
  const token = localStorage.getItem('token')
  const [title, setTitle] = React.useState('')
  const [course, setCourse] = React.useState('')
  const [items, setItems] = React.useState([])

  const cols = ['to-read','reading','read']

  async function load() {
    const data = await api('/topics', { token })
    setItems(data)
  }
  React.useEffect(()=>{ load() }, [])

  async function add(e) {
    e.preventDefault()
    await api('/topics', { method:'POST', token, body:{ title, course } })
    setTitle(''); setCourse(''); load()
  }
  async function move(id, status) {
    await api(`/topics/${id}/status`, { method:'PATCH', token, body:{ status } })
    load()
  }
  async function remove(id) {
    await api(`/topics/${id}`, { method:'DELETE', token })
    load()
  }

  function onDragEnd(result) {
    if (!result.destination) return
    const { draggableId, destination, source } = result
    if (destination.droppableId !== source.droppableId) {
      move(draggableId, destination.droppableId)
    }
  }

  return (
    <div>
      <div className="card">
        <form onSubmit={add} className="grid cols-3">
          <div className="form-row"><label>Topic</label><input required value={title} onChange={e=>setTitle(e.target.value)}/></div>
          <div className="form-row"><label>Course</label><input value={course} onChange={e=>setCourse(e.target.value)}/></div>
          <div style={{alignSelf:'end'}}><button className="btn">Add</button></div>
        </form>
      </div>

      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kb" style={{marginTop:16}}>
          {cols.map(c => (
            <Droppable droppableId={c} key={c}>
              {(provided) => (
                <div className="kcol" ref={provided.innerRef} {...provided.droppableProps}>
                  <b style={{textTransform:'uppercase'}}>{c}</b>
                  {items.filter(i=>i.status===c).map((i, index) => (
                    <Draggable key={i._id} draggableId={i._id} index={index}>
                      {(prov) => (
                        <div className="kitem" ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps}>
                          <div><b>{i.title}</b> <span className="small">{i.course||''}</span></div>
                          <div style={{display:'flex', gap:6, marginTop:6}}>
                            <button className="btn" onClick={()=>remove(i._id)}>Delete</button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
        </div>
      </DragDropContext>
    </div>
  )
}
