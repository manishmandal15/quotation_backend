import { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "../components/DataTable";
import { API_BASE } from "../api";

const API_URL = API_BASE + "/states";

function StatePage() {
  const [states, setStates] = useState([]);
  const [form, setForm] = useState({ name: "", is_active: 1 });
  const [editingId, setEditingId] = useState(null);

  const fetchStates = async () => {
    try {
      const res = await axios.get(API_URL);
      setStates(res.data);
    } catch (err) {
      console.error("Error fetching states:", err);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name) return alert("Name required");
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${editingId}`, form);
      } else {
        await axios.post(API_URL, form);
      }
      setForm({ name: "", is_active: 1 });
      setEditingId(null);
      fetchStates();
    } catch (err) {
      console.error("Error saving state:", err);
      alert("Error saving state");
    }
  };

  const handleEdit = (row) => {
    setForm({ name: row.name, is_active: row.is_active });
    setEditingId(row.id);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this record?")) return;
    try {
      await axios.delete(`${API_URL}/${id}`);
      fetchStates();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Delete failed");
    }
  };

  return (
    <div>
      <h3 className="fw-bold text-success mb-3">🌍 State Management</h3>

      <form onSubmit={handleSubmit} className="d-flex gap-2 mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="State Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <select
          className="form-select"
          value={form.is_active}
          onChange={(e) => setForm({ ...form, is_active: Number(e.target.value) })}
        >
          <option value={1}>Active</option>
          <option value={0}>Inactive</option>
        </select>
        <button className="btn btn-success" type="submit">
          {editingId ? "Update" : "Add"}
        </button>
      </form>

      <DataTable
        data={states}
        columns={[
          { key: "id", label: "ID" },
          { key: "name", label: "State Name" },
          { key: "is_active", label: "Active" },
        ]}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}

export default StatePage;
