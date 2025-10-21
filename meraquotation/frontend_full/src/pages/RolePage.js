import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../components/DataTable";
import { API_BASE } from "../api";
const API_URL = API_BASE + "/roles";

function RolePage(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState({name:"",description:"",is_active:1});
  const [editingId,setEditingId]=useState(null);
  const fetch=async()=>{try{const r=await axios.get(API_URL);setRows(r.data)}catch(e){console.error(e)}};
  useEffect(()=>{fetch()},[]);
  const submit=async(e)=>{e.preventDefault(); if(!form.name) return alert("Name required"); try{ if(editingId) await axios.put(`${API_URL}/${editingId}`,form); else await axios.post(API_URL,form); setForm({name:"",description:"",is_active:1}); setEditingId(null); fetch(); }catch(e){console.error(e);alert("Save failed")}};
  const edit=(r)=>{setForm({name:r.name,description:r.description,is_active:r.is_active}); setEditingId(r.id)};
  const del=async(id)=>{ if(!window.confirm("Delete?")) return; try{ await axios.delete(`${API_URL}/${id}`); fetch(); }catch(e){alert("Delete failed")}};
  return (<div>
    <h3 className="fw-bold mb-3">👤 Roles</h3>
    <form onSubmit={submit} className="d-flex gap-2 mb-3">
      <input className="form-control" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
      <input className="form-control" placeholder="Description" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} />
      <select className="form-select" value={form.is_active} onChange={(e)=>setForm({...form,is_active: Number(e.target.value)})}><option value={1}>Active</option><option value={0}>Inactive</option></select>
      <button className="btn btn-success" type="submit">{editingId? "Update":"Add"}</button>
    </form>
    <DataTable data={rows} columns={[{key:"id",label:"ID"},{key:"name",label:"Name"},{key:"description",label:"Description"},{key:"is_active",label:"Active"}]} onEdit={edit} onDelete={del} />
  </div>);
}
export default RolePage;
