import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../components/DataTable";
import { API_BASE } from "../api";

const API_URL = API_BASE + "/districts";

function DistrictPage() {
  const [rows, setRows] = useState([]);
  const [form, setForm] = useState({ state_id: "", name: "", is_active: 1 });
  const [editingId, setEditingId] = useState(null);

  const fetch = async () => {
    try {
      const res = await axios.get(API_URL);
      setRows(res.data);
    } catch (err) { console.error(err); }
  };
  useEffect(()=>{ fetch(); },[]);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.state_id || !form.name) return alert("State ID and name required");
    try {
      if (editingId) await axios.put(`${API_URL}/${editingId}`, form);
      else await axios.post(API_URL, form);
      setForm({ state_id: "", name: "", is_active: 1 });
      setEditingId(null);
      fetch();
    } catch(err){ console.error(err); alert("Save failed"); }
  };

  const edit = (r) => { setForm({ state_id: r.state_id, name: r.name, is_active: r.is_active }); setEditingId(r.id); };
  const del = async (id)=>{ if(!window.confirm("Delete?")) return; try{ await axios.delete(`${API_URL}/${id}`); fetch(); }catch(e){alert("Delete failed");} };

  return (
    <div>
      <h3 className="fw-bold text-primary mb-3">🏙️ Districts</h3>

      <form onSubmit={submit} className="d-flex gap-2 mb-3">
        <input className="form-control" placeholder="State ID" value={form.state_id} onChange={(e)=>setForm({...form, state_id: e.target.value})} required />
        <input className="form-control" placeholder="District Name" value={form.name} onChange={(e)=>setForm({...form, name: e.target.value})} required />
        <select className="form-select" value={form.is_active} onChange={(e)=>setForm({...form, is_active: Number(e.target.value)})}>
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
        </select>
        <button className="btn btn-primary" type="submit">{editingId? "Update":"Add"}</button>
      </form>

      <DataTable data={rows} columns={[{key:"id",label:"ID"},{key:"name",label:"District Name"},{key:"state_name",label:"State"},{key:"is_active",label:"Active"}]} onEdit={edit} onDelete={del} />
    </div>
  );
}

export default DistrictPage;
