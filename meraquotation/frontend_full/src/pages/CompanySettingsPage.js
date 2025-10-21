import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../components/DataTable";
import { API_BASE } from "../api";
const API_URL = API_BASE + "/company_settings";

function CompanySettingsPage(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState({company_name:"",address:"",email:"",phone:"",website:"",gst_no:"",pan_no:""});
  const [editingId,setEditingId]=useState(null);
  const fetch=async()=>{try{const r=await axios.get(API_URL);setRows(r.data)}catch(e){console.error(e)}};
  useEffect(()=>{fetch()},[]);
  const submit=async(e)=>{e.preventDefault(); if(!form.company_name) return alert("Company name required"); try{ if(editingId) await axios.put(`${API_URL}/${editingId}`,form); else await axios.post(API_URL,form); setForm({company_name:"",address:"",email:"",phone:"",website:"",gst_no:"",pan_no:""}); setEditingId(null); fetch(); }catch(e){console.error(e);alert("Save failed")}};
  const edit=(r)=>{ setForm({company_name:r.company_name,address:r.address,email:r.email,phone:r.phone,website:r.website,gst_no:r.gst_no,pan_no:r.pan_no}); setEditingId(r.id);};
  const del=async(id)=>{ if(!window.confirm("Delete?")) return; try{ await axios.delete(`${API_URL}/${id}`); fetch(); }catch(e){alert("Delete failed")}};
  return (<div>
    <h3 className="fw-bold mb-3">🏢 Company Settings</h3>
    <form onSubmit={submit} className="d-flex gap-2 mb-3 flex-wrap">
      <input className="form-control" placeholder="Company Name" value={form.company_name} onChange={(e)=>setForm({...form,company_name:e.target.value})} required />
      <input className="form-control" placeholder="Email" value={form.email} onChange={(e)=>setForm({...form,email:e.target.value})} />
      <input className="form-control" placeholder="Phone" value={form.phone} onChange={(e)=>setForm({...form,phone:e.target.value})} />
      <input className="form-control" placeholder="Website" value={form.website} onChange={(e)=>setForm({...form,website:e.target.value})} />
      <input className="form-control" placeholder="GST No" value={form.gst_no} onChange={(e)=>setForm({...form,gst_no:e.target.value})} />
      <input className="form-control" placeholder="PAN No" value={form.pan_no} onChange={(e)=>setForm({...form,pan_no:e.target.value})} />
      <button className="btn btn-success" type="submit">{editingId? "Update":"Add"}</button>
    </form>
    <DataTable data={rows} columns={[{key:"id",label:"ID"},{key:"company_name",label:"Company"},{key:"email",label:"Email"},{key:"phone",label:"Phone"},{key:"website",label:"Website"}]} onEdit={edit} onDelete={del} />
  </div>);
}
export default CompanySettingsPage;
