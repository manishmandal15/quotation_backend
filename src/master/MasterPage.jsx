import React, {useEffect, useState} from 'react'
import axios from 'axios'
import ModalForm from './ModalForm'

export default function MasterPage({resource, apiBase}){
  const [items,setItems] = useState([])
  const [loading,setLoading] = useState(false)
  const [showForm,setShowForm] = useState(false)
  const [editItem,setEditItem] = useState(null)
  const [viewItem,setViewItem] = useState(null)

  useEffect(()=>{ fetchAll() },[resource])

  function fetchAll(){
    setLoading(true)
    axios.get(`${apiBase}/${resource}`)
      .then(r=> setItems(Array.isArray(r.data)?r.data:[]))
      .catch(e=> { console.error(e); alert('Fetch failed') })
      .finally(()=> setLoading(false))
  }

  function handleAdd(){
    setEditItem(null)
    setShowForm(true)
  }
  function handleEdit(item){
    setEditItem(item)
    setShowForm(true)
  }
  function handleView(item){
    setViewItem(item)
  }
  function handleDelete(item){
    if(!confirm('Delete this record?')) return;
    const id = item.id || item.ID || item.uuid || item.id_customer || ''
    axios.delete(`${apiBase}/${resource}/${id}`)
      .then(()=>{ alert('Deleted'); fetchAll() })
      .catch(e=>{ console.error(e); alert('Delete failed') })
  }

  const columns = items.length ? Object.keys(items[0]) : ['id']

  return (
    <div>
      <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:12}}>
        <div>
          <h3 style={{margin:0}}>{resource} <span style={{display:'inline-block',padding:'4px 8px',background:'#eef2ff',color:'#3730a3',borderRadius:999,fontSize:12}}>{items.length}</span></h3>
          <div style={{fontSize:12,color:'#6b7280'}}>Manage {resource} — add, edit, view or delete records</div>
        </div>
        <div>
          <button onClick={handleAdd}>Add</button>
          <button onClick={fetchAll} style={{marginLeft:8}}>Refresh</button>
        </div>
      </div>

      <div style={{background:'#fff',padding:16,borderRadius:8,boxShadow:'0 1px 3px rgba(0,0,0,0.06)'}}>
        {loading ? <div>Loading...</div> : (
          <table style={{width:'100%',borderCollapse:'collapse'}}>
            <thead><tr>
              <th style={{width:120,border:'1px solid #e5e7eb',padding:8}}>Actions</th>
              {columns.map(c=> <th key={c} style={{border:'1px solid #e5e7eb',padding:8}}>{c}</th>)}
            </tr></thead>
            <tbody>
              {items.map(it=> (
                <tr key={it.id || JSON.stringify(it)}>
                  <td style={{whiteSpace:'nowrap',border:'1px solid #e5e7eb',padding:8}}>
                    <button onClick={()=>handleView(it)}>View</button>
                    <button onClick={()=>handleEdit(it)} style={{marginLeft:6}}>Edit</button>
                    <button onClick={()=>handleDelete(it)} style={{marginLeft:6,color:'#b91c1c'}}>Delete</button>
                  </td>
                  {columns.map(col=> <td key={col} style={{border:'1px solid #e5e7eb',padding:8}}>{renderCell(it[col])}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showForm && <ModalForm resource={resource} apiBase={apiBase} item={editItem} onClose={()=>{setShowForm(false); fetchAll()}} />}
      {viewItem && <ViewModal item={viewItem} onClose={()=>setViewItem(null)} />}
    </div>
  )
}

function renderCell(value){
  if(value===null || typeof value==='undefined') return <span style={{fontSize:12,color:'#6b7280'}}>-</span>
  if(typeof value === 'object') return <pre style={{whiteSpace:'pre-wrap',margin:0}}>{JSON.stringify(value)}</pre>
  return <span>{String(value)}</span>
}

function ViewModal({item,onClose}){
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center'}} onClick={onClose}>
      <div style={{background:'#fff',padding:16,borderRadius:8,maxHeight:'80vh',overflow:'auto',minWidth:360}} onClick={e=>e.stopPropagation()}>
        <h3>View Record</h3>
        <div style={{maxHeight: '60vh', overflow:'auto'}}>
          {Object.keys(item).map(k=> (
            <div key={k} style={{marginBottom:8}}>
              <div style={{fontSize:12,color:'#6b7280'}}>{k}</div>
              <div>{String(item[k])}</div>
            </div>
          ))}
        </div>
        <div style={{textAlign:'right',marginTop:12}}>
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  )
}
