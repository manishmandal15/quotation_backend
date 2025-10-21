function Sidebar({ selectedPage, setSelectedPage }) {
  const menu = [
    { key: "company_settings", icon: "🏢", label: "Company Settings" },
    { key: "states", icon: "🌍", label: "States" },
    { key: "districts", icon: "🏙️", label: "Districts" },
    { key: "currencies", icon: "💱", label: "Currencies" },
    { key: "roles", icon: "👤", label: "Roles" },
    { key: "quotations", icon: "📄", label: "Quotations" },
    { key: "quotation_items", icon: "📦", label: "Quotation Items" },
    { key: "quotation_approvals", icon: "✅", label: "Approvals" },
    { key: "quotation_attachments", icon: "📎", label: "Attachments" },
    { key: "quotation_comments", icon: "💬", label: "Comments" }
  ];

  return (
    <div
      className="bg-dark text-white p-3 vh-100 position-fixed"
      style={{ width: "250px" }}
    >
      <h4 className="text-center mb-4 fw-bold">📊 Admin Dashboard</h4>
      <ul className="list-unstyled">
        {menu.map((item) => (
          <li key={item.key}>
            <button
              className={`btn w-100 text-start mb-2 ${
                selectedPage === item.key ? "btn-primary" : "btn-outline-light"
              }`}
              onClick={() => setSelectedPage(item.key)}
            >
              {item.icon} {item.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Sidebar;
