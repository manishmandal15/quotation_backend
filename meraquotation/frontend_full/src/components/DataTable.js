function DataTable({ data, columns, onEdit, onDelete }) {
  return (
    <>
    <button
          className="btn btn-primary"
          onClick={() => {
            setEditingDistrict(null);
            setShowForm(true);
          }}
        >
          ➕ Add District
        </button>   <table className="table table-bordered table-hover">
      <thead className="table-dark">
        <tr>
          {columns.map((col) => (
            <th key={col.key}>{col.label}</th>
          ))}
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.length>0 ? data.map((row) => (
          <tr key={row.id}>
            {columns.map((col) => (
              <td key={col.key}>
                {col.format ? col.format(row[col.key], row) : (row[col.key] !== undefined ? row[col.key] : "")}
              </td>
            ))}
            <td>
              <button
                className="btn btn-sm btn-warning me-2"
                onClick={() => onEdit(row)}
              >
                ✏️
              </button>
              <button
                className="btn btn-sm btn-danger"
                onClick={() => onDelete(row.id)}
              >
                🗑️
              </button>
            </td>
          </tr>
        )) : (
          <tr><td colSpan={columns.length+1} className="text-center">No records found</td></tr>
        )}
      </tbody>
    </table>
    </>
  );
}

export default DataTable;
