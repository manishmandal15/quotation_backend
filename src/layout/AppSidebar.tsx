import { useCallback, useEffect, useRef, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

// Icons
import {
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PlugInIcon,
  UserCircleIcon,
} from "../icons";

import { useSidebar } from "../context/SidebarContext";
import SidebarWidget from "./SidebarWidget";

// ---------------------------
// NAV ITEM TYPE
// ---------------------------
type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string }[];
};

// ------------------------------------------------
// MAIN SIDEBAR COMPONENT
// ------------------------------------------------
const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  // ---------------------------
  // USER DATA
  // ---------------------------
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      alert("Please login first");
      navigate("/signin");
      return;
    }

    const parsed = JSON.parse(savedUser);

    if (!parsed?.name) {
      alert("Invalid session. Please login again.");
      localStorage.removeItem("user");
      navigate("/signin");
      return;
    }

    setUser(parsed);
  }, [navigate]);

  // ---------------------------
  // API BASE URL
  // ---------------------------
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  // ---------------------------
  // API MENU STATE
  // ---------------------------
  const [apiMenuItems, setApiMenuItems] = useState<
    { name: string; path: string }[]
  >([]);

  // ---------------------------
  // API CALL FOR MENUS
  // ---------------------------
  useEffect(() => {
    axios
      .get(`${BASE_URL}/test-manish?value=1`)
      .then((res) => {
        if (res.data && res.data.length > 0) {
          const formatted = res.data.map((item: any) => ({
            name: item.name,
            path: item.path || "#",
          }));
          setApiMenuItems(formatted);
        }
      })
      .catch((err) => console.log("Axios Error:", err));
  }, [BASE_URL]);

  // ---------------------------
  // NAV ITEMS (STATIC + DYNAMIC)
  // ---------------------------
  let navItems: NavItem[] = [];

  if (user?.role_id === 1) {
    // ========== ADMIN STATIC MENU ==========
    navItems = [
      {
        icon: <GridIcon />,
        name: "Dashboard",
        path: "/home",
      },

      {
        name: "Quotation-Module",
        icon: <ListIcon />,
        subItems: [
          { name: "New Quotation", path: "/forms/quotation-all" },
          { name: "Quotation Desk", path: "/forms/new-quotation" },
          { name: "Quotation Approval", path: "/forms/quotation-approval" },
          { name: "Quotation Dispatch & Follow-up", path: "/quotation-tracking" },
          { name: "Quotation Status Tracking", path: "/quotation-tracking-status" },
          { name: "Quotation Follow-Up & Reminders", path: "/quotation-Followup-Reminder" },
        ],
      },

      {
        name: "Inventory Mgmt.",
        icon: <ListIcon />,
        subItems: [
         
          { name: "Prouct stock", path: "/product-stock" },
          { name: "Product Issue List", path: "product-issue " },  
          { name: "Row Material Stock", path: "/rmStockmaster" },
          { name: "Row Material Issue Stock", path: "/rmIssue " },
          { name: "Row Material Issue Item Stock", path: "/rmIssueItem " },   
          
         
        ],
      },

      {
        name: "Masters",
        icon: <ListIcon />,
        subItems: [
          { name: "Company_setting", path: "/forms/company-master" },
          { name: "Roles", path: "/forms/role-master" },
          { name: "State", path: "/forms/state-master" },
          { name: "District", path: "/forms/district-master" }, 
          { name: "Currency", path: "/forms/currency" },
          { name: "User Master", path: "/forms/users" },
          { name: "Menu Master", path: "/forms/menu-master" },
          { name: "Role Menu Master", path: "/forms/Role-menu-master" },
          { name: "Module Menu Master", path: "/forms/module-menu-master" },  
        ],
      },

      

      {
        name: "Inventory Master",
        icon: <ListIcon />,
        subItems: [
          { name: "Supplier master", path: "/suppliers" },
          { name: "RawMaterial Master", path: "/raw-material" },
          { name: "Customers", path: "/forms/customers" },
          { name: "Product Master", path: "/forms/products" },
          { name: "GST Master", path: "/forms/gst-master" },  
          { name: "Location/Warehouse", path: "/warehouse-locations" }, 
          // { name: "Prouct stock Entry", path: "/product-stock-entry" },  
         
        ],
      },
    ];
  } else {
    // ========== DYNAMIC MENU (API BASED) ==========
    navItems = [
      {
        name: "Processes",
        icon: <ListIcon />,
        subItems: apiMenuItems,
      },
    ];
  }

  // ---------------------------
  // SIDEBAR ACTIVE LOGIC
  // ---------------------------
  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);

  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const handleSubmenuToggle = (index: number, type: "main" | "others") => {
    setOpenSubmenu((prev) =>
      prev?.index === index && prev?.type === type ? null : { type, index }
    );
  };

  // ---------------------------
  // RENDER MENU ITEMS
  // ---------------------------
  const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index, menuType)}
              className="menu-item group cursor-pointer"
            >
              <span className="menu-item-icon-size">{nav.icon}</span>
              {(isExpanded || isHovered || isMobileOpen) && (
                <span className="menu-item-text">{nav.name}</span>
              )}
              <ChevronDownIcon
                className={`ml-auto w-5 h-5 transition-transform ${
                  openSubmenu?.index === index &&
                  openSubmenu?.type === menuType
                    ? "rotate-180 text-brand-500"
                    : ""
                }`}
              />
            </button>
          ) : (
            <Link
              to={nav.path!}
              className={`menu-item group ${
                isActive(nav.path!) ? "menu-item-active" : ""
              }`}
            >
              <span className="menu-item-icon-size">{nav.icon}</span>
              <span className="menu-item-text">{nav.name}</span>
            </Link>
          )}

          {/* Dropdown */}
          {nav.subItems && (
            <div
              ref={(el) => (subMenuRefs.current[`${menuType}-${index}`] = el)}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.index === index &&
                  openSubmenu?.type === menuType
                    ? `${subMenuRefs.current[`${menuType}-${index}`]?.scrollHeight}px`
                    : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((sub) => (
                  <li key={sub.name}>
                    <Link
                      to={sub.path}
                      className={`menu-dropdown-item ${
                        isActive(sub.path)
                          ? "menu-dropdown-item-active"
                          : ""
                      }`}
                    >
                      {sub.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    /**
     * 
     * <aside
      className={`fixed mt-16 flex flex-col top-0 px-5 bg-white h-screen border-r transition-all z-50 
      ${isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"}`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
     */
    <aside
      className={`fixed flex flex-col top-0 px-5 bg-white h-screen border-r transition-all z-50 
      ${isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"}`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="py-8">
        <Link to="/">
          <img src="/images/logo/dsonik.png" width={150} />
        </Link>
      </div>

      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="mb-6">
          {renderMenuItems(navItems, "main")}
          {renderMenuItems([], "others")}
        </nav>

        {(isExpanded || isHovered || isMobileOpen) && <SidebarWidget />}
      </div>
    </aside>
  );
};

export default AppSidebar;
