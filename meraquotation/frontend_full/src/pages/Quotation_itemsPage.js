import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../components/DataTable";
import { API_BASE } from "../api";
const API_URL = API_BASE + "/quotation_items";

function Quotation_itemsPage(){
  const [rows,setRows]=useState([]);
  const [form,setForm]=useState({quotation_id:"",product_id:"",description:"",quantity:0,unit_price:0,discount:0,tax_rate:0,line_total:0});
  const [editingId,setEditingId]=useState(null);
  const fetch=async()=>{try{const r=await axios.get(API_URL);setRows(r.data)}catch(e){console.error(e)}};
  useEffect(()=>{fetch()},[]);
  const submit=async(e)=>{e.preventDefault(); if(!form.quotation_id||!form.product_id) return alert("Quotation ID and Product ID required"); try{ if(editingId) await axios.put(`${API_URL}/${editingId}`,form); else await axios.post(API_URL,form); setForm({quotation_id:"",product_id:"",description:"",quantity:0,unit_price:0,discount:0,tax_rate:0,line_total:0}); setEditingId(null); fetch(); }catch(e){console.error(e);alert("Save failed")}};
  const edit=(r)=>{ setForm({quotation_id:r.quotation_id,product_id:r.product_id,description:r.description,quantity:r.quantity,unit_price:r.unit_price,discount:r.discount,tax_rate:r.tax_rate,line_total:r.line_total}); setEditingId(r.id);};
  const del=async(id)=>{ if(!window.confirm("Delete?")) return; try{ await axios.delete(`${API_URL}/${id}`); fetch(); }catch(e){alert("Delete failed")}};
  return (<div>
    <h3 className="fw-bold mb-3">📦 Quotation Items</h3>
    <form onSubmit={submit} className="d-flex gap-2 mb-3 flex-wrap">
      <input className="form-control" placeholder="Quotation ID" value={form.quotation_id} onChange={(e)=>setForm({...form,quotation_id:e.target.value})} required />
      <input className="form-control" placeholder="Product ID" value={form.product_id} onChange={(e)=>setForm({...form,product_id:e.target.value})} required />
      <input className="form-control" placeholder="Description" value={form.description} onChange={(e)=>setForm({...form,description:e.target.value})} />
      <input type="number" className="form-control" placeholder="Quantity" value={form.quantity} onChange={(e)=>setForm({...form,quantity:Number(e.target.value)})} />
      <input type="number" className="form-control" placeholder="Unit Price" value={form.unit_price} onChange={(e)=>setForm({...form,unit_price:Number(e.target.value)})} />
      <input type="number" className="form-control" placeholder="Line Total" value={form.line_total} onChange={(e)=>setForm({...form,line_total:Number(e.target.value)})} />
      <button className="btn btn-success" type="submit">{editingId? "Update":"Add"}</button>
    </form>
    <DataTable data={rows} columns={[{key:"id",label:"ID"},{key:"quotation_id",label:"Quotation ID"},{key:"product_name",label:"Product"},{key:"quantity",label:"Qty"},{key:"unit_price",label:"Unit Price"},{key:"line_total",label:"Line Total"}]} onEdit={edit} onDelete={del} />
  </div>);
}
export default Quotation_itemsPage;
