import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../components/DataTable";
import { API_BASE } from "../api";
const API_URL = API_BASE + "/currencies";

function CurrencyPage(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState({code:"",name:"",symbol:"",is_active:1});
  const [editingId,setEditingId]=useState(null);
  const fetch=async()=>{try{const r=await axios.get(API_URL);setRows(r.data)}catch(e){console.error(e)}};
  useEffect(()=>{fetch()},[]);
  const submit=async(e)=>{e.preventDefault(); if(!form.code||!form.name) return alert("Code and name required"); try{ if(editingId) await axios.put(`${API_URL}/${editingId}`,form); else await axios.post(API_URL,form); setForm({code:"",name:"",symbol:"",is_active:1}); setEditingId(null); fetch(); }catch(e){console.error(e);alert("Save failed")}};
  const edit=(r)=>{setForm({code:r.code,name:r.name,symbol:r.symbol,is_active:r.is_active}); setEditingId(r.id)};
  const del=async(id)=>{ if(!window.confirm("Delete?")) return; try{ await axios.delete(`${API_URL}/${id}`); fetch(); }catch(e){alert("Delete failed")}};
  return (<div>
    <h3 className="fw-bold mb-3">💱 Currencies</h3>
    <form onSubmit={submit} className="d-flex gap-2 mb-3">
      <input className="form-control" placeholder="Code" value={form.code} onChange={(e)=>setForm({...form,code:e.target.value})} required />
      <input className="form-control" placeholder="Name" value={form.name} onChange={(e)=>setForm({...form,name:e.target.value})} required />
      <input className="form-control" placeholder="Symbol" value={form.symbol} onChange={(e)=>setForm({...form,symbol:e.target.value})} />
      <select className="form-select" value={form.is_active} onChange={(e)=>setForm({...form,is_active: Number(e.target.value)})}><option value={1}>Active</option><option value={0}>Inactive</option></select>
      <button className="btn btn-success" type="submit">{editingId? "Update":"Add"}</button>
    </form>
    <DataTable data={rows} columns={[{key:"id",label:"ID"},{key:"code",label:"Code"},{key:"name",label:"Name"},{key:"symbol",label:"Symbol"},{key:"is_active",label:"Active"}]} onEdit={edit} onDelete={del} />
  </div>);
}
export default CurrencyPage;
