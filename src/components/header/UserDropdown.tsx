// import { useState, useEffect } from "react";
// import { DropdownItem } from "../ui/dropdown/DropdownItem";
// import { Dropdown } from "../ui/dropdown/Dropdown";
// import { Link } from "react-router";

// export default function UserDropdown() {
//   const [isOpen, setIsOpen] = useState(false);
//   const [user, setUser] = useState<any>(null);

//   function toggleDropdown() {
//     setIsOpen(!isOpen);
//   }

//   function closeDropdown() {
//     setIsOpen(false);
//   }

//   // ✅ Load logged-in user from localStorage
//   useEffect(() => {
//     const savedUser = localStorage.getItem("user");
//     if (savedUser) {
//       setUser(JSON.parse(savedUser));
//     }
//   }, []);

//   return (
//     <div className="relative">
//       {/* ✅ Top button */}
//       <button
//         onClick={toggleDropdown}
//         className="flex items-center text-gray-700 dropdown-toggle dark:text-gray-400"
//       >
//         {/* <span className="mr-3 overflow-hidden rounded-full h-11 w-11">
//           <img src="/images/user/owner.jpg" alt="User" />
//         </span> */}

//         {/* ✅ Use logged-in user name */}
//         <span className="block mr-1 font-medium text-theme-sm">
//           {user?.name || "User"}
//         </span>

//         <svg
//           className={`stroke-gray-500 dark:stroke-gray-400 transition-transform duration-200 ${
//             isOpen ? "rotate-180" : ""
//           }`}
//           width="18"
//           height="20"
//           viewBox="0 0 18 20"
//         >
//           <path
//             d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
//             stroke="currentColor"
//             strokeWidth="1.5"
//             strokeLinecap="round"
//             strokeLinejoin="round"
//           />
//         </svg>
//       </button>

//       {/* ✅ Dropdown */}
//       <Dropdown
//         isOpen={isOpen}
//         onClose={closeDropdown}
//         className="absolute right-0 mt-[17px] flex w-[260px] flex-col rounded-2xl border border-gray-200 bg-white p-3 shadow-theme-lg dark:border-gray-800 dark:bg-gray-dark"
//       >
//         {/* ✅ User Info */}
//         <div>
//           <span className="block font-medium text-gray-700 text-theme-sm dark:text-gray-400">
//             {user?.name || "User Name"}
//           </span>
//           <span className="mt-0.5 block text-theme-xs text-gray-500 dark:text-gray-400">
//             {user?.email || "user@example.com"}
//           </span>
//         </div>

//         <ul className="flex flex-col gap-1 pt-4 pb-3 border-b border-gray-200 dark:border-gray-800">
//           {/* Profile */}
//           <li>
//             <DropdownItem
//               onItemClick={closeDropdown}
//               tag="a"
//               to="/profile"
//               className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
//             >
//               Edit Profile
//             </DropdownItem>
//           </li>

//           {/* Settings */}
//           {/* <li>
//             <DropdownItem
//               onItemClick={closeDropdown}
//               tag="a"
//               to="/settings"
//               className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
//             >
//               Account Settings
//             </DropdownItem>
//           </li> */}

//           {/* Support */}
//           {/* <li>
//             <DropdownItem
//               onItemClick={closeDropdown}
//               tag="a"
//               to="/support"
//               className="flex items-center gap-3 px-3 py-2 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
//             >
//               Support
//             </DropdownItem>
//           </li> */}
//         </ul>

//         {/* ✅ Logout */}
//         <Link
//           to="/signin"
//           onClick={() => {
//             localStorage.removeItem("user");
//           }}
//           className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg group text-theme-sm hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-white/5"
//         >
//           Sign Out
//         </Link>
//       </Dropdown>
//     </div>
//   );
// }


import { useState, useEffect } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { Link } from "react-router";


import { useNavigate } from "react-router";


export default function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");

    if (!savedUser) {
      alert("Please login first");
      navigate("/signin");
      return;
    }

    const parsedUser = JSON.parse(savedUser);

    if (!parsedUser?.name || parsedUser.name.trim() === "") {
      alert("Invalid user session, please login again");
      localStorage.removeItem("user");
      navigate("/signin");
      return;
    }

    setUser(parsedUser);
  }, []);


  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex items-center text-gray-700 dark:text-gray-400"
      >
        <span className="mr-3 rounded-full h-11 w-11 overflow-hidden">
          <img src="/images/user/owner.jpg" alt="User" />
        </span>

        <span className="mr-1 font-medium text-theme-sm">
          {user ? user.name : "Guest User"}
        </span>

        <svg
          className={`stroke-gray-500 dark:stroke-gray-400 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          width="18"
          height="20"
          viewBox="0 0 18 20"
        >
          <path
            d="M4.3125 8.65625L9 13.3437L13.6875 8.65625"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <Dropdown
        isOpen={isOpen}
        onClose={closeDropdown}
        className="absolute right-0 mt-4 w-[260px] rounded-2xl border p-3 shadow"
      >
        <div>
          <span className="block font-medium text-gray-700">
            {user ? user.name : "Guest User"}
          </span>
          <span className="text-gray-500 text-sm">
            {user ? user.email : "No email"}
          </span>
        </div>

        {/* Logout */}
        <Link
          to="/signin"
          onClick={() => {
            localStorage.removeItem("user");
            closeDropdown();
          }}
          className="flex items-center gap-3 px-3 py-2 mt-3 font-medium text-gray-700 rounded-lg hover:bg-gray-100"
        >
          Logout
        </Link>
      </Dropdown>
    </div>
  );
}

