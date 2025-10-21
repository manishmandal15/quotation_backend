import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../components/DataTable";
import { API_BASE } from "../api";
const API_URL = API_BASE + "/quotation_approvals";

function Quotation_approvalsPage(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState({quotation_id:"",approver_id:"",status:"pending",comments:""});
  const [editingId,setEditingId]=useState(null);
  const fetch=async()=>{try{const r=await axios.get(API_URL);setRows(r.data)}catch(e){console.error(e)}};
  useEffect(()=>{fetch()},[]);
  const submit=async(e)=>{e.preventDefault(); if(!form.quotation_id||!form.approver_id) return alert("Required"); try{ if(editingId) await axios.put(`${API_URL}/${editingId}`,form); else await axios.post(API_URL,form); setForm({quotation_id:"",approver_id:"",status:"pending",comments:""}); setEditingId(null); fetch(); }catch(e){console.error(e);alert("Save failed")}};
  const edit=(r)=>{ setForm({quotation_id:r.quotation_id,approver_id:r.approver_id,status:r.status,comments:r.comments}); setEditingId(r.id);};
  const del=async(id)=>{ if(!window.confirm("Delete?")) return; try{ await axios.delete(`${API_URL}/${id}`); fetch(); }catch(e){alert("Delete failed")}};
  return (<div>
    <h3 className="fw-bold mb-3">✅ Quotation Approvals</h3>
    <form onSubmit={submit} className="d-flex gap-2 mb-3">
      <input className="form-control" placeholder="Quotation ID" value={form.quotation_id} onChange={(e)=>setForm({...form,quotation_id:e.target.value})} required />
      <input className="form-control" placeholder="Approver ID" value={form.approver_id} onChange={(e)=>setForm({...form,approver_id:e.target.value})} required />
      <select className="form-select" value={form.status} onChange={(e)=>setForm({...form,status:e.target.value})}><option value="pending">pending</option><option value="approved">approved</option><option value="rejected">rejected</option></select>
      <input className="form-control" placeholder="Comments" value={form.comments} onChange={(e)=>setForm({...form,comments:e.target.value})} />
      <button className="btn btn-success" type="submit">{editingId? "Update":"Add"}</button>
    </form>
    <DataTable data={rows} columns={[{key:"id",label:"ID"},{key:"quotation_id",label:"Quotation ID"},{key:"approver_name",label:"Approver"},{key:"status",label:"Status"},{key:"approved_at",label:"Approved At"}]} onEdit={edit} onDelete={del} />
  </div>);
}
export default Quotation_approvalsPage;
