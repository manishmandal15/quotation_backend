import { useState } from "react";
import Sidebar from "./components/Sidebar";
import StatePage from "./pages/StatePage";
import DistrictPage from "./pages/DistrictPage";
import CurrencyPage from "./pages/CurrencyPage";
import RolePage from "./pages/RolePage";
import QuotationPage from "./pages/QuotationPage";
import CompanySettingsPage from "./pages/CompanySettingsPage";
import QuotationItemsPage from "./pages/Quotation_itemsPage";
import QuotationApprovalsPage from "./pages/Quotation_approvalsPage";
import QuotationAttachmentsPage from "./pages/Quotation_attachmentsPage";
import QuotationCommentsPage from "./pages/Quotation_commentsPage";

function App() {
  const [selectedPage, setSelectedPage] = useState("states");

  const renderPage = () => {
    switch (selectedPage) {
      case "states": return <StatePage />;
      case "districts": return <DistrictPage />;
      case "currencies": return <CurrencyPage />;
      case "roles": return <RolePage />;
      case "quotations": return <QuotationPage />;
      case "company_settings": return <CompanySettingsPage />;
      case "quotation_items": return <QuotationItemsPage />;
      case "quotation_approvals": return <QuotationApprovalsPage />;
      case "quotation_attachments": return <QuotationAttachmentsPage />;
      case "quotation_comments": return <QuotationCommentsPage />;
      default: return <h4 className="text-center mt-5">Select a module from sidebar</h4>;
    }
  };

  return (
    <div className="d-flex">
      <Sidebar selectedPage={selectedPage} setSelectedPage={setSelectedPage} />
      <div className="flex-grow-1 p-4" style={{ marginLeft: "250px" }}>
        {renderPage()}
      </div>
    </div>
  );
}

export default App;
