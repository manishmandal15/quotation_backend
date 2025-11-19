// import { useCallback, useEffect, useRef, useState } from "react";
// import { Link, useLocation } from "react-router-dom"; // ✅ FIXED IMPORT
// import axios from "axios";

// // Assume these icons are imported from an icon library
// import {
 
//   CalenderIcon,
//   ChevronDownIcon,
//   GridIcon,
//   HorizontaLDots,
//   ListIcon,
 
//   PlugInIcon,
 
//   UserCircleIcon,
// } from "../icons";
// import { useSidebar } from "../context/SidebarContext";
// import SidebarWidget from "./SidebarWidget";




// import { useNavigate } from "react-router";




// type NavItem = {
//   name: string;
//   icon: React.ReactNode;
//   path?: string;
//   subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
// };

// const navItems: NavItem[] = [
//   // {
//   //   icon: <GridIcon />,
//   //   name: "Dashboard",
//   //   subItems: [{ name: "E-commerce", path: "/", pro: false }],
//   // },

//    {
//     icon: <GridIcon />,
//     name: "Dashboard",
//     path: "/home",
//   },

  
//     // {user ? user.name : "Guest User"}

// //    const res = await axios.get("http://localhost:5000/api/test-manish?value=1");
// // console.log(res.data[0].name);// "manish"


//  const [name, setName] = useState<any>(null);
    

//   useEffect(() => {
//     axios
//       .get("http://localhost:5000/api/test-manish?value=1")
//       .then((res) => {
//         if (res.data && res.data.length > 0) {
//           setName(res.data[0].name); 
//         }
//       })
//       .catch((err) => {
//         console.log("Axios Error:", err);
//       });
//   }, []);

//   return (
//     <div>
//       <h3>API Output</h3>
//       <input type="text" value={name} readOnly />
//     </div>
//   ),



//   {
//   name: "Quotation-Module",
//   icon: <ListIcon />,
//   subItems: [
//     { name: "New Quotation", path: "/forms/quotation-all", pro: false },
//     { name: " Quotation Desk", path: "/forms/new-quotation", pro: false },
//     { name: "Quotation Approval", path: "/forms/quotation-approval", pro: false },
//     { name: "Quotation Dispatch & Follow-up", path: "/quotation-tracking", pro: false },
//     { name: "Quotation Status Tracking", path: "/quotation-tracking-status", pro: false },
//     { name: "Quotation Follow-Up & Reminders", path: "/quotation-Followup-Reminder", pro: false },
//   ],
// },




//   {
//     name: "Masters",
//     icon: <ListIcon />,
//     subItems: [
//       { name: "Company_setting", path: "/forms/company-master", pro: false },
//       { name: "Roles", path: "/forms/role-master", pro: false },
//       { name: "State", path: "/forms/state-master", pro: false },
//       { name: "District", path: "/forms/district-master", pro: false },
//       { name: "Currency", path: "/forms/currency", pro: false },
//       { name: "User Master", path: "/forms/users", pro: false },
//       { name: "Customers", path: "/forms/customers", pro: false },
//       { name: "Product Master", path: "/forms/products", pro: false },
//       { name: "Menu Master", path: "/forms/menu-master", pro: false },
//       { name: "Role Menu Master", path: "/forms/Role-menu-master", pro: false },
//       { name: "module Menu Master", path: "/forms/module-menu-master", pro: false },
      
      
//     ],
//   },
// // {
// //     icon: <CalenderIcon />,
// //     name: "Calendar",
// //     path: "/calendar",
// //   },
//   // {
//   //   icon: <UserCircleIcon />,
//   //   name: "User Profile",
//   //   path: "/profile",
//   // },
// /*

//   {
//     icon: <CalenderIcon />,
//     name: "Quotations",
//     path: "/calendar",
//   },
//   {
//     icon: <CalenderIcon />,
//     name: "Quotation_items",
//     path: "/calendar",
//   },
//   {
//     icon: <CalenderIcon />,
//     name: "Quotation_approvals",
//     path: "/calendar",
//   },
//   {
//     icon: <CalenderIcon />,
//     name: "Quotation_attachments",
//     path: "/calendar",
//   },
//   {
//     icon: <CalenderIcon />,
//     name: "Quotation_comments",
//     path: "/calendar",
//   },
//   {
//     icon: <CalenderIcon />,
//     name: "Quotation_dispatches",
//     path: "/calendar",
//   },
//   {
//     icon: <CalenderIcon />,
//     name: "Quotation_feedbacks",
//     path: "/calendar",
//   },
//   {
//     icon: <CalenderIcon />,
//     name: "Quotation_feedback",
//     path: "/calendar",
//   },
//   {
//     icon: <CalenderIcon />,
//     name: "Quotation_followpus",
//     path: "/calendar",
//   },
//   {
//     icon: <CalenderIcon />,
//     name: "Quotation_reminders",
//     path: "/calendar",
//   },
//   {
//     icon: <CalenderIcon />,
//     name: "Quotation_status_log",
//     path: "/calendar",
//   },
//   {
//     name: "Tables",
//     icon: <TableIcon />,
//     subItems: [{ name: "Basic Tables", path: "/basic-tables", pro: false }],
//   },
//   {
//     name: "Pages",
//     icon: <PageIcon />,
//     subItems: [
//       { name: "Blank Page", path: "/blank", pro: false },
//       { name: "404 Error", path: "/error-404", pro: false },
//     ],
//   },


//   */
// ];

// const othersItems: NavItem[] = [
//   // {
//   //   icon: <PieChartIcon />,
//   //   name: "Charts",
//   //   subItems: [
//   //     { name: "Line Chart", path: "/line-chart", pro: false },
//   //     { name: "Bar Chart", path: "/bar-chart", pro: false },
//   //   ],
//   // },
//   // {
//   //   icon: <BoxCubeIcon />,
//   //   name: "UI Elements",
//   //   subItems: [
//   //     { name: "Alerts", path: "/alerts", pro: false },
//   //     { name: "Avatar", path: "/avatars", pro: false },
//   //     { name: "Badge", path: "/badge", pro: false },
//   //     { name: "Buttons", path: "/buttons", pro: false },
//   //     { name: "Images", path: "/images", pro: false },
//   //     { name: "Videos", path: "/videos", pro: false },
//   //   ],
//   // },
//   // {
//   //   icon: <PlugInIcon />,
//   //   name: "Authentication",
//   //   subItems: [
//   //     { name: "Sign In", path: "/signin", pro: false },
//   //     { name: "Sign Up", path: "/signup", pro: false },
//   //   ],
//   // },
// ]; 

// const AppSidebar: React.FC = () => {
//   const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
//   const location = useLocation();

//   const [openSubmenu, setOpenSubmenu] = useState<{
//     type: "main" | "others";
//     index: number;
//   } | null>(null);
//   const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
//   const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

//   const isActive = useCallback(
//     (path: string) => location.pathname === path,
//     [location.pathname]
//   );



//   const navigate = useNavigate();

//   const [user, setUser] = useState<any>(null);
//   const [isOpen, setIsOpen] = useState(false);

//   // ✅ USER LOGIN VALIDATION
//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");

//     if (!savedUser) {
//       alert("Please login first");
//       navigate("/signin");
//       return;
//     }

//     const parsed = JSON.parse(savedUser);

//     if (!parsed?.name || parsed.name.trim() === "") {
//       alert("Invalid session. Please login again.");
//       localStorage.removeItem("user");
//       navigate("/signin");
//       return;
//     }

//     setUser(parsed);
//   }, []);


//   useEffect(() => {
//     let submenuMatched = false;
//     ["main", "others"].forEach((menuType) => {
//       const items = menuType === "main" ? navItems : othersItems;
//       items.forEach((nav, index) => {
//         if (nav.subItems) {
//           nav.subItems.forEach((subItem) => {
//             if (isActive(subItem.path)) {
//               setOpenSubmenu({ type: menuType as "main" | "others", index });
//               submenuMatched = true;
//             }
//           });
//         }
//       });
//     });
//     if (!submenuMatched) setOpenSubmenu(null);
//   }, [location, isActive]);



//   useEffect(() => {
//     if (openSubmenu !== null) {
//       const key = `${openSubmenu.type}-${openSubmenu.index}`;
//       if (subMenuRefs.current[key]) {
//         setSubMenuHeight((prev) => ({
//           ...prev,
//           [key]: subMenuRefs.current[key]?.scrollHeight || 0,
//         }));
//       }
//     }
//   }, [openSubmenu]);

//   const handleSubmenuToggle = (index: number, menuType: "main" | "others") => {
//     setOpenSubmenu((prev) =>
//       prev && prev.type === menuType && prev.index === index ? null : { type: menuType, index }
//     );
//   };

//   const renderMenuItems = (items: NavItem[], menuType: "main" | "others") => (
//     <ul className="flex flex-col gap-4">
//       {items.map((nav, index) => (
//         <li key={nav.name}>
//           {nav.subItems ? (
//             <button
//               onClick={() => handleSubmenuToggle(index, menuType)}
//               className={`menu-item group ${
//                 openSubmenu?.type === menuType && openSubmenu?.index === index
//                   ? "menu-item-active"
//                   : "menu-item-inactive"
//               } cursor-pointer ${
//                 !isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"
//               }`}
//             >
//               <span
//                 className={`menu-item-icon-size ${
//                   openSubmenu?.type === menuType && openSubmenu?.index === index
//                     ? "menu-item-icon-active"
//                     : "menu-item-icon-inactive"
//                 }`}
//               >
//                 {nav.icon}
//               </span>
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <span className="menu-item-text">{nav.name}</span>
//               )}
//               {(isExpanded || isHovered || isMobileOpen) && (
//                 <ChevronDownIcon
//                   className={`ml-auto w-5 h-5 transition-transform duration-200 ${
//                     openSubmenu?.type === menuType && openSubmenu?.index === index
//                       ? "rotate-180 text-brand-500"
//                       : ""
//                   }`}
//                 />
//               )}
//             </button>
//           ) : (
//             nav.path && (
//               <Link
//                 to={nav.path}
//                 className={`menu-item group ${
//                   isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"
//                 }`}
//               >
//                 <span
//                   className={`menu-item-icon-size ${
//                     isActive(nav.path)
//                       ? "menu-item-icon-active"
//                       : "menu-item-icon-inactive"
//                   }`}
//                 >
//                   {nav.icon}
//                 </span>
//                 {(isExpanded || isHovered || isMobileOpen) && (
//                   <span className="menu-item-text">{nav.name}</span>
//                 )}
//               </Link>
//             )
//           )}
//           {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
//             <div
//               ref={(el) => {
//                 subMenuRefs.current[`${menuType}-${index}`] = el;
//               }}
//               className="overflow-hidden transition-all duration-300"
//               style={{
//                 height:
//                   openSubmenu?.type === menuType && openSubmenu?.index === index
//                     ? `${subMenuHeight[`${menuType}-${index}`]}px`
//                     : "0px",
//               }}
//             >
//               <ul className="mt-2 space-y-1 ml-9">
//                 {nav.subItems.map((subItem) => (
//                   <li key={subItem.name}>
//                     <Link
//                       to={subItem.path}
//                       className={`menu-dropdown-item ${
//                         isActive(subItem.path)
//                           ? "menu-dropdown-item-active"
//                           : "menu-dropdown-item-inactive"
//                       }`}
//                     >
//                       {subItem.name}
//                       <span className="flex items-center gap-1 ml-auto">
//                         {subItem.new && (
//                           <span
//                             className={`ml-auto ${
//                               isActive(subItem.path)
//                                 ? "menu-dropdown-badge-active"
//                                 : "menu-dropdown-badge-inactive"
//                             } menu-dropdown-badge`}
//                           >
//                             new
//                           </span>
//                         )}
//                         {subItem.pro && (
//                           <span
//                             className={`ml-auto ${
//                               isActive(subItem.path)
//                                 ? "menu-dropdown-badge-active"
//                                 : "menu-dropdown-badge-inactive"
//                             } menu-dropdown-badge`}
//                           >
//                             pro
//                           </span>
//                         )}
//                       </span>
//                     </Link>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </li>
//       ))}
//     </ul>
//   );

//   return (
//     <aside
//       className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
//         ${
//           isExpanded || isMobileOpen
//             ? "w-[290px]"
//             : isHovered
//             ? "w-[290px]"
//             : "w-[90px]"
//         }
//         ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
//         lg:translate-x-0`}
//       onMouseEnter={() => !isExpanded && setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <div
//         className={`py-8 flex ${
//           !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
//         }`}
//       >
//         <Link to="/">
//           {isExpanded || isHovered || isMobileOpen ? (
//             <>
//               <img
//                 className="dark:hidden"
//                 src="/images/logo/dsonik.png"
//                 alt="Logo"
//                 width={150}
//                 height={40}
//               />
//               <img
//                 className="hidden dark:block"
//                 src="/images/logo/dsonik.png"
//                 alt="Logo"
//                 width={150}
//                 height={40}
//               />
//             </>
//           ) : (
//             <img
//               src="/images/logo/dsonik.png"
//               alt="Logo"
//               width={32}
//               height={32}
//             />
//           )}
//         </Link>
//       </div>
//       <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
//         <nav className="mb-6">
//           <div className="flex flex-col gap-4">
//             <div>
//               <h2
//                 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//                   !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
//                 }`}
//               >
//                 {isExpanded || isHovered || isMobileOpen ? (
//                   "Menu"
//                 ) : (
//                   <HorizontaLDots className="size-6" />
//                 )}
//               </h2>
//               {renderMenuItems(navItems, "main")}
//             </div>
//             <div>
//               <h2
//                 className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
//                   !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
//                 }`}
//               >
//                 {isExpanded || isHovered || isMobileOpen ? (
//                   "Others"
//                 ) : (
//                   <HorizontaLDots />
//                 )}
//               </h2>
//               {renderMenuItems(othersItems, "others")}
//             </div>
//           </div>
//         </nav>
//         {(isExpanded || isHovered || isMobileOpen) && <SidebarWidget />}
//       </div>
//     </aside>
//   );
// };

// export default AppSidebar;





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
// NAV ITEMS
// ---------------------------

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
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
    name: "Masters",
    icon: <ListIcon />,
    subItems: [
      { name: "Company_setting", path: "/forms/company-master" },
      { name: "Roles", path: "/forms/role-master" },
      { name: "State", path: "/forms/state-master" },
      { name: "District", path: "/forms/district-master" },
      { name: "Currency", path: "/forms/currency" },
      { name: "User Master", path: "/forms/users" },
      { name: "Customers", path: "/forms/customers" },
      { name: "Product Master", path: "/forms/products" },
      { name: "Menu Master", path: "/forms/menu-master" },
      { name: "Role Menu Master", path: "/forms/Role-menu-master" },
      { name: "module Menu Master", path: "/forms/module-menu-master" },
    ],
  },
];

const othersItems: NavItem[] = [];


// ------------------------------------------------
// MAIN SIDEBAR COMPONENT
// ------------------------------------------------
const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const location = useLocation();
  const navigate = useNavigate();

  // ---------------------------
  // USER LOGIN VALIDATION
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
  }, []);


  // ---------------------------
  // API CALL (Name Fetch)
  // ---------------------------

  const [name, setName] = useState("");

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/test-manish?value=1")
      .then((res) => {
        if (res.data && res.data.length > 0) {
          setName(res.data[0].name);
        }
      })
      .catch((err) => {
        console.log("Axios Error:", err);
      });
  }, []);


  // ---------------------------
  // Menu Active Logic
  // ---------------------------

  const isActive = useCallback(
    (path: string) => location.pathname === path,
    [location.pathname]
  );

  const [openSubmenu, setOpenSubmenu] = useState<{
    type: "main" | "others";
    index: number;
  } | null>(null);

  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    let found = false;

    ["main", "others"].forEach((menuType) => {
      const items = menuType === "main" ? navItems : othersItems;

      items.forEach((nav, index) => {
        nav.subItems?.forEach((sub) => {
          if (isActive(sub.path)) {
            setOpenSubmenu({ type: menuType as any, index });
            found = true;
          }
        });
      });
    });

    if (!found) setOpenSubmenu(null);
  }, [location.pathname]);


  const handleSubmenuToggle = (index: number, type: "main" | "others") => {
    setOpenSubmenu((prev) =>
      prev?.index === index && prev?.type === type ? null : { type, index }
    );
  };


  // ---------------------------
  // Render menu items
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

              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform ${
                    openSubmenu?.index === index && openSubmenu?.type === menuType
                      ? "rotate-180 text-brand-500"
                      : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                to={nav.path}
                className={`menu-item group ${
                  isActive(nav.path) ? "menu-item-active" : ""
                }`}
              >
                <span className="menu-item-icon-size">{nav.icon}</span>
                {(isExpanded || isHovered || isMobileOpen) && (
                  <span className="menu-item-text">{nav.name}</span>
                )}
              </Link>
            )
          )}

          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => (subMenuRefs.current[`${menuType}-${index}`] = el)}
              className="overflow-hidden transition-all duration-300"
              style={{
                height:
                  openSubmenu?.index === index && openSubmenu?.type === menuType
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
                        isActive(sub.path) ? "menu-dropdown-item-active" : ""
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
    <aside
      className={`fixed mt-16 flex flex-col top-0 px-5 bg-white h-screen border-r transition-all z-50 
      ${isExpanded || isMobileOpen || isHovered ? "w-[290px]" : "w-[90px]"}`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* LOGO */}
      <div className="py-8">
        <Link to="/">
          {isExpanded || isHovered || isMobileOpen ? (
            <img src="/images/logo/dsonik.png" width={150} />
          ) : (
            <img src="/images/logo/dsonik.png" width={32} />
          )}
        </Link>
      </div>

      {/* MENU */}
      <div className="flex flex-col overflow-y-auto no-scrollbar">
        <nav className="mb-6">
          <h2 className="text-xs uppercase text-gray-400 mb-3">Menu</h2>
          {renderMenuItems(navItems, "main")}

          <h2 className="text-xs uppercase text-gray-400 my-4">Others</h2>
          {renderMenuItems(othersItems, "others")}
        </nav>

        {/* Widget */}
        {(isExpanded || isHovered || isMobileOpen) && <SidebarWidget />}

        {/* API OUTPUT */}
        <div className="p-4">
          <h3 className="text-sm font-semibold">API Output {name}</h3>
          <input
            type="text"
            value={name}
            readOnly
            className="border w-full p-1 mt-1 rounded"
          />
        </div>
      </div>
    </aside>
  );
};

export default AppSidebar;
