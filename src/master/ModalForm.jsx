import React, {useState, useEffect} from 'react'
import axios from 'axios'

export default function ModalForm({resource, apiBase, item, onClose}){
  const [form, setForm] = useState({})
  const [saving,setSaving] = useState(false)
  const isEdit = !!item

  useEffect(()=>{
    if(item){
      setForm(item)
    } else {
      setForm({})
    }
  },[item])

  function handleChange(e){
    const name = e.target.name
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm(f=> ({...f, [name]: value}))
  }

  async function submit(e){
    e.preventDefault()
    setSaving(true)
    try{
      const url = `${apiBase}/${resource}` + (isEdit ? '/' + (form.id || form.ID || '') : '')
      if(isEdit){
        await axios.put(url, form)
      } else {
        await axios.post(url, form)
      }
      alert('Saved')
      onClose && onClose()
    }catch(err){
      console.error(err)
      alert('Save failed: ' + (err.response && err.response.data ? JSON.stringify(err.response.data) : err.message))
    }finally{
      setSaving(false)
    }
  }

  const fields = Object.keys(form).length ? Object.keys(form) : ['name','email','phone']

  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.4)',display:'flex',alignItems:'center',justifyContent:'center'}} onClick={onClose}>
      <div style={{background:'#fff',padding:16,borderRadius:8,maxHeight:'80vh',overflow:'auto',minWidth:360}} onClick={e=>e.stopPropagation()}>
        <h3>{isEdit ? 'Edit' : 'Add'} {resource}</h3>
        <form onSubmit={submit}>
          <div style={{maxHeight:'60vh',overflow:'auto'}}>
            {fields.map(f=> (
              <div key={f} style={{marginBottom:10}}>
                <label style={{display:'block',fontSize:13,marginBottom:6}}>{f}</label>
                {f.startsWith('is_') || f==='is_active' ? (
                  <input type="checkbox" name={f} checked={!!form[f]} onChange={handleChange} />
                ) : (f.length>120 ? (
                  <textarea name={f} value={form[f]||''} onChange={handleChange} />
                ) : (
                  <input name={f} value={form[f]||''} onChange={handleChange} />
                ))}
              </div>
            ))}
          </div>
          <div style={{textAlign:'right'}}>
            <button type="button" onClick={onClose} style={{marginRight:8}}>Cancel</button>
            <button type="submit" disabled={saving}>{saving ? 'Saving...' : 'Save'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}
