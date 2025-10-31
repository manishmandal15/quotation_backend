import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignIn from "./pages/AuthPages/SignIn";
import SignUp from "./pages/AuthPages/SignUp";
import NotFound from "./pages/OtherPage/NotFound";
import UserProfiles from "./pages/UserProfiles";
import Videos from "./pages/UiElements/Videos";
import Images from "./pages/UiElements/Images";
import Alerts from "./pages/UiElements/Alerts";
import Badges from "./pages/UiElements/Badges";
import Avatars from "./pages/UiElements/Avatars";
import Buttons from "./pages/UiElements/Buttons";
import LineChart from "./pages/Charts/LineChart";
import BarChart from "./pages/Charts/BarChart";
import Calendar from "./pages/Calendar";
import BasicTables from "./pages/Tables/BasicTables";
import Blank from "./pages/Blank";
import AppLayout from "./layout/AppLayout";
import { ScrollToTop } from "./components/common/ScrollToTop";
import Home from "./pages/Dashboard/Home";
import CompanyMaster from "./pages/Forms/CompanyMaster";
import StateMaster from "./pages/Forms/StateMaster";
import RoleMaster from "./pages/Forms/roleMaster";
import CurrencyMaster from "./pages/Forms/CurrencyMaster";
import CustomerMaster from "./pages/Forms/CustomerMaster";
import UserMaster from "./pages/Forms/UserMaster";
import ProductMaster from "./pages/Forms/ProductMaster";
import DistrictMaster from "./pages/Forms/DistrictMaster";
import NewQuotation from "./quotation-module/NewQuotation";
import QuotationAll from "./quotation-module/quotationAll";
import QuotationTracking from "./pages/Forms/QuotationTracking";
import QuotationApproval from "./quotation-module/QuotationApproval";

export default function App() {
  return (
    <Router>
      <ScrollToTop />
      <Routes>
        {/* Dashboard Layout */}
        <Route element={<AppLayout />}>
          <Route index path="/" element={<Home />} />
          <Route path="/profile" element={<UserProfiles />} />
          <Route path="/calendar" element={<Calendar />} />

          {/* Forms */}
          <Route path="/forms/company-master" element={<CompanyMaster />} />
          <Route path="/forms/role-master" element={<RoleMaster />} />
          <Route path="/forms/currency" element={<CurrencyMaster />} />
          <Route path="/forms/state-master" element={<StateMaster />} />
          <Route path="/forms/district-master" element={<DistrictMaster />} />
          <Route path="/forms/products" element={<ProductMaster />} />
          <Route path="/forms/customers" element={<CustomerMaster />} />
          <Route path="/forms/users" element={<UserMaster />} />
          <Route path="/forms/quotation-all" element={<QuotationAll />} />
        <Route path="/forms/new-quotation" element={<NewQuotation />} />
        <Route path="/quotation-tracking" element={<QuotationTracking />} />
        <Route path="/forms/quotation-approval" element={<QuotationApproval />} />
          {/* Tables */}
          <Route path="/basic-tables" element={<BasicTables />} />

          {/* UI Elements */}
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/avatars" element={<Avatars />} />
          <Route path="/badge" element={<Badges />} />
          <Route path="/buttons" element={<Buttons />} />
          <Route path="/images" element={<Images />} />
          <Route path="/videos" element={<Videos />} />

          {/* Charts */}
          <Route path="/line-chart" element={<LineChart />} />
          <Route path="/bar-chart" element={<BarChart />} />

          {/* Other */}
          <Route path="/blank" element={<Blank />} />
        </Route>

        {/* Auth Pages */}
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}
