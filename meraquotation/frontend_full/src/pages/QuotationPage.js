import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../components/DataTable";
import { API_BASE } from "../api";
const API_URL = API_BASE + "/quotations";

function QuotationPage(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState({quotation_no:"",customer_id:"",currency_id:"",validity_date:"",payment_terms:"",delivery_terms:"",status:"draft",total_amount:0,discount_amount:0,tax_amount:0,net_amount:0,created_by:"",approved_by:null});
  const [editingId,setEditingId]=useState(null);
  const fetch=async()=>{try{const r=await axios.get(API_URL);setRows(r.data)}catch(e){console.error(e)}};
  useEffect(()=>{fetch()},[]);
  const submit=async(e)=>{e.preventDefault(); if(!form.quotation_no||!form.customer_id||!form.currency_id||!form.created_by) return alert("Required fields missing"); try{ if(editingId) await axios.put(`${API_URL}/${editingId}`,form); else await axios.post(API_URL,form); setForm({quotation_no:"",customer_id:"",currency_id:"",validity_date:"",payment_terms:"",delivery_terms:"",status:"draft",total_amount:0,discount_amount:0,tax_amount:0,net_amount:0,created_by:"",approved_by:null}); setEditingId(null); fetch(); }catch(e){console.error(e);alert("Save failed")}};
  const edit=(r)=>{ setForm({quotation_no:r.quotation_no,customer_id:r.customer_id,currency_id:r.currency_id,validity_date:r.validity_date,payment_terms:r.payment_terms,delivery_terms:r.delivery_terms,status:r.status,total_amount:r.total_amount,discount_amount:r.discount_amount,tax_amount:r.tax_amount,net_amount:r.net_amount,created_by:r.created_by,approved_by:r.approved_by}); setEditingId(r.id);};
  const del=async(id)=>{ if(!window.confirm("Delete?")) return; try{ await axios.delete(`${API_URL}/${id}`); fetch(); }catch(e){alert("Delete failed")}};
  return (<div>
    <h3 className="fw-bold mb-3">📄 Quotations</h3>
    <form onSubmit={submit} className="d-flex gap-2 mb-3 flex-wrap">
      <input className="form-control" placeholder="Quotation No" value={form.quotation_no} onChange={(e)=>setForm({...form,quotation_no:e.target.value})} required />
      <input className="form-control" placeholder="Customer ID" value={form.customer_id} onChange={(e)=>setForm({...form,customer_id:e.target.value})} required />
      <input className="form-control" placeholder="Currency ID" value={form.currency_id} onChange={(e)=>setForm({...form,currency_id:e.target.value})} required />
      <input className="form-control" placeholder="Validity Date (YYYY-MM-DD)" value={form.validity_date} onChange={(e)=>setForm({...form,validity_date:e.target.value})} />
      <input className="form-control" placeholder="Payment Terms" value={form.payment_terms} onChange={(e)=>setForm({...form,payment_terms:e.target.value})} />
      <input className="form-control" placeholder="Delivery Terms" value={form.delivery_terms} onChange={(e)=>setForm({...form,delivery_terms:e.target.value})} />
      <input className="form-control" placeholder="Created By (User ID)" value={form.created_by} onChange={(e)=>setForm({...form,created_by:e.target.value})} required />
      <button className="btn btn-success" type="submit">{editingId? "Update":"Add"}</button>
    </form>
    <DataTable data={rows} columns={[{key:"id",label:"ID"},{key:"quotation_no",label:"Quotation No"},{key:"customer_name",label:"Customer"},{key:"currency_name",label:"Currency"},{key:"status",label:"Status"},{key:"net_amount",label:"Net Amount"}]} onEdit={edit} onDelete={del} />
  </div>);
}
export default QuotationPage;
