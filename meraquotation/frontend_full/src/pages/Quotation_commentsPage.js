import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../components/DataTable";
import { API_BASE } from "../api";
const API_URL = API_BASE + "/quotation_comments";

function Quotation_commentsPage(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState({quotation_id:"",user_id:"",comment:""});
  const [editingId,setEditingId]=useState(null);
  const fetch=async()=>{try{const r=await axios.get(API_URL);setRows(r.data)}catch(e){console.error(e)}};
  useEffect(()=>{fetch()},[]);
  const submit=async(e)=>{e.preventDefault(); if(!form.quotation_id||!form.user_id||!form.comment) return alert("Required"); try{ if(editingId) await axios.put(`${API_URL}/${editingId}`,form); else await axios.post(API_URL,form); setForm({quotation_id:"",user_id:"",comment:""}); setEditingId(null); fetch(); }catch(e){console.error(e);alert("Save failed")}};
  const edit=(r)=>{ setForm({quotation_id:r.quotation_id,user_id:r.user_id,comment:r.comment}); setEditingId(r.id);};
  const del=async(id)=>{ if(!window.confirm("Delete?")) return; try{ await axios.delete(`${API_URL}/${id}`); fetch(); }catch(e){alert("Delete failed")}};
  return (<div>
    <h3 className="fw-bold mb-3">💬 Quotation Comments</h3>
    <form onSubmit={submit} className="d-flex gap-2 mb-3">
      <input className="form-control" placeholder="Quotation ID" value={form.quotation_id} onChange={(e)=>setForm({...form,quotation_id:e.target.value})} required />
      <input className="form-control" placeholder="User ID" value={form.user_id} onChange={(e)=>setForm({...form,user_id:e.target.value})} required />
      <input className="form-control" placeholder="Comment" value={form.comment} onChange={(e)=>setForm({...form,comment:e.target.value})} required />
      <button className="btn btn-success" type="submit">{editingId? "Update":"Add"}</button>
    </form>
    <DataTable data={rows} columns={[{key:"id",label:"ID"},{key:"quotation_id",label:"Quotation ID"},{key:"user_name",label:"User"},{key:"comment",label:"Comment"},{key:"created_at",label:"Created At"}]} onEdit={edit} onDelete={del} />
  </div>);
}
export default Quotation_commentsPage;
