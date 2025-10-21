import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../components/DataTable";
import { API_BASE } from "../api";
const API_URL = API_BASE + "/quotation_attachments";

function Quotation_attachmentsPage(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState({quotation_id:"",file_path:"",uploaded_by:""});
  const [editingId,setEditingId]=useState(null);
  const fetch=async()=>{try{const r=await axios.get(API_URL);setRows(r.data)}catch(e){console.error(e)}};
  useEffect(()=>{fetch()},[]);
  const submit=async(e)=>{e.preventDefault(); if(!form.quotation_id||!form.file_path||!form.uploaded_by) return alert("Required"); try{ if(editingId) await axios.put(`${API_URL}/${editingId}`,form); else await axios.post(API_URL,form); setForm({quotation_id:"",file_path:"",uploaded_by:""}); setEditingId(null); fetch(); }catch(e){console.error(e);alert("Save failed")}};
  const edit=(r)=>{ setForm({quotation_id:r.quotation_id,file_path:r.file_path,uploaded_by:r.uploaded_by}); setEditingId(r.id);};
  const del=async(id)=>{ if(!window.confirm("Delete?")) return; try{ await axios.delete(`${API_URL}/${id}`); fetch(); }catch(e){alert("Delete failed")}};
  return (<div>
    <h3 className="fw-bold mb-3">📎 Quotation Attachments</h3>
    <form onSubmit={submit} className="d-flex gap-2 mb-3">
      <input className="form-control" placeholder="Quotation ID" value={form.quotation_id} onChange={(e)=>setForm({...form,quotation_id:e.target.value})} required />
      <input className="form-control" placeholder="File Path" value={form.file_path} onChange={(e)=>setForm({...form,file_path:e.target.value})} required />
      <input className="form-control" placeholder="Uploaded By (User ID)" value={form.uploaded_by} onChange={(e)=>setForm({...form,uploaded_by:e.target.value})} required />
      <button className="btn btn-success" type="submit">{editingId? "Update":"Add"}</button>
    </form>
    <DataTable data={rows} columns={[{key:"id",label:"ID"},{key:"quotation_id",label:"Quotation ID"},{key:"file_path",label:"File Path"},{key:"uploaded_by_name",label:"Uploaded By"},{key:"uploaded_at",label:"Uploaded At"}]} onEdit={edit} onDelete={del} />
  </div>);
}
export default Quotation_attachmentsPage;
