// // // import {
// // //   ArrowDownIcon,
// // //   ArrowUpIcon,
// // //   BoxIconLine,
// // //   GroupIcon,
// // // } from "../../icons";
// // // import Badge from "../ui/badge/Badge";

// // // export default function EcommerceMetrics() {
// // //   return (
// // //     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
// // //       {/* <!-- Metric Item Start --> */}
// // //       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
// // //         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
// // //           <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
// // //         </div>

// // //         <div className="flex items-end justify-between mt-5">
// // //           <div>
// // //             <span className="text-sm text-gray-500 dark:text-gray-400">
// // //               Customers
// // //             </span>
// // //             <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
// // //               3,782
// // //             </h4>
// // //           </div>
// // //           <Badge color="success">
// // //             <ArrowUpIcon />
// // //             11.01%
// // //           </Badge>
// // //         </div>
// // //       </div>
// // //       {/* <!-- Metric Item End --> */}

// // //       {/* <!-- Metric Item Start --> */}
// // //       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
// // //         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
// // //           <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
// // //         </div>
// // //         <div className="flex items-end justify-between mt-5">
// // //           <div>
// // //             <span className="text-sm text-gray-500 dark:text-gray-400">
// // //               Orders
// // //             </span>
// // //             <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
// // //               5,359
// // //             </h4>
// // //           </div>

// // //           <Badge color="error">
// // //             <ArrowDownIcon />
// // //             9.05%
// // //           </Badge>
// // //         </div>
// // //       </div>
// // //       {/* <!-- Metric Item End --> */}
// // //     </div>
// // //   );
// // // }


// // // import { useEffect, useState } from "react";
// // // import axios from "axios";
// // // import {
// // //   ArrowDownIcon,
// // //   ArrowUpIcon,
// // //   BoxIconLine,
// // //   GroupIcon,
// // // } from "../../icons";
// // // import Badge from "../ui/badge/Badge";

// // // const API = axios.create({
// // //   baseURL: "http://localhost:5000/api",
// // // });

// // // export default function EcommerceMetrics() {
// // //   const [customerCount, setCustomerCount] = useState<number>(0);
// // //   const [quotationCount, setQuotationCount] = useState<number>(0);
// // //   const [loading, setLoading] = useState<boolean>(true);

// // //   useEffect(() => {
// // //     const fetchData = async () => {
// // //       try {
// // //         const [customerRes, quotationRes] = await Promise.all([
// // //           API.get("/customers"),
// // //           API.get("/quotations"),
// // //         ]);

// // //         setCustomerCount(customerRes.data.length || 0);
// // //         setQuotationCount(quotationRes.data.length || 0);
// // //       } catch (err) {
// // //         console.error("Error fetching metrics:", err);
// // //       } finally {
// // //         setLoading(false);
// // //       }
// // //     };

// // //     fetchData();
// // //   }, []);

// // //   return (
// // //     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6">
// // //       {/* <!-- Customers Card --> */}
// // //       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
// // //         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
// // //           <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
// // //         </div>

// // //         <div className="flex items-end justify-between mt-5">
// // //           <div>
// // //             <span className="text-sm text-gray-500 dark:text-gray-400">
// // //               Customers
// // //             </span>
// // //             <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
// // //               {loading ? "Loading..." : customerCount}
// // //             </h4>
// // //           </div>
// // //           <Badge color="success">
// // //             <ArrowUpIcon />
// // //             +{Math.floor(Math.random() * 10 + 1)}%
// // //           </Badge>
// // //         </div>
// // //       </div>

// // //       {/* <!-- Quotations Card --> */}
// // //       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
// // //         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
// // //           <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
// // //         </div>
// // //         <div className="flex items-end justify-between mt-5">
// // //           <div>
// // //             <span className="text-sm text-gray-500 dark:text-gray-400">
// // //               Quotations
// // //             </span>
// // //             <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
// // //               {loading ? "Loading..." : quotationCount}
// // //             </h4>
// // //           </div>

// // //           <Badge color="error">
// // //             <ArrowDownIcon />
// // //             -{Math.floor(Math.random() * 10 + 1)}%
// // //           </Badge>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }




// // import { useEffect, useState } from "react";
// // import axios from "axios";
// // import {
// //   ArrowDownIcon,
// //   ArrowUpIcon,
// //   BoxIconLine,
// //   GroupIcon,
// // } from "../../icons";
// // import Badge from "../ui/badge/Badge";

// // export default function EcommerceMetrics() {
// //   const [customerCount, setCustomerCount] = useState(0);
// //   const [quotationCount, setQuotationCount] = useState(0);

// //   // ✅ Base URL
// //   const BASE_URL = "http://localhost:5000/api";

// //   // ✅ Fetch Customers and Quotations Count
// //   useEffect(() => {
// //     const fetchData = async () => {
// //       try {
// //         const [custRes, quoteRes] = await Promise.all([
// //           axios.get(`${BASE_URL}/customers`),
// //           axios.get(`${BASE_URL}/quotations`),
// //         ]);

// //         // Agar API array return karti hai
// //         setCustomerCount(custRes.data?.length || 0);
// //         setQuotationCount(quoteRes.data?.length || 0);
// //       } catch (error) {
// //         console.error("Error fetching metrics:", error);
// //       }
// //     };

// //     fetchData();
// //   }, []);

// //   return (
// //     <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6" style={{width : 1000, border: "2px solid black"}}>
// //       {/* Customers */}
// //       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
// //         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
// //           <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
// //         </div>

// //         <div className="flex items-end justify-between mt-5">
// //           <div>
// //             <span className="text-sm text-gray-500 dark:text-gray-400">
// //               Customers
// //             </span>
// //             <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
// //               {customerCount}
// //             </h4>
// //           </div>
// //           <Badge color="success">
// //             <ArrowUpIcon />
// //             +11.01%
// //           </Badge>
// //         </div>
// //       </div>

// //       {/* Quotations */}
// //       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
// //         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
// //           <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
// //         </div>
// //         <div className="flex items-end justify-between mt-5">
// //           <div>
// //             <span className="text-sm text-gray-500 dark:text-gray-400">
// //               Quotations
// //             </span>
// //             <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90">
// //               {quotationCount}
// //             </h4>
// //           </div>

// //           <Badge color="error">
// //             <ArrowDownIcon />
// //             -9.05%
// //           </Badge>
// //         </div>
// //       </div>
      
// //     </div>
// //   );
// // }



// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   ArrowDownIcon,
//   ArrowUpIcon,
//   BoxIconLine,
//   GroupIcon,
// } from "../../icons";
// import Badge from "../ui/badge/Badge";

// export default function EcommerceMetrics() {
//   const [customerCount, setCustomerCount] = useState(0);
//   const [quotationCount, setQuotationCount] = useState(0);
//   const [productCount, setProductCount] = useState(0);
//   const [orderCount, setOrderCount] = useState(0);

//   const BASE_URL = "http://localhost:5000/api";

//   // Fetch All Counts
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [custRes, quoteRes, productRes, orderRes] = await Promise.all([
//           axios.get(`${BASE_URL}/customers`),
//           axios.get(`${BASE_URL}/quotations`),
//           axios.get(`${BASE_URL}/products`),
//           axios.get(`${BASE_URL}/orders`),
//         ]);

//         setCustomerCount(custRes.data?.length || 0);
//         setQuotationCount(quoteRes.data?.length || 0);
//         setProductCount(productRes.data?.length || 0);
//         setOrderCount(orderRes.data?.length || 0);
//       } catch (error) {
//         console.error("Error fetching metrics:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div
//       className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6"
//       style={{ width: 1000, border: "2px solid black", padding: 20 }}
//     >
//       {/* -------------------- Customers -------------------- */}
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
//         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
//           <GroupIcon className="text-gray-800 size-6 dark:text-white/90" />
//         </div>

//         <div className="flex items-end justify-between mt-5">
//           <div>
//             <span className="text-sm text-gray-500">Customers</span>
//             <h4 className="mt-2 font-bold text-gray-800 text-title-sm">
//               {customerCount}
//             </h4>
//           </div>
//           <Badge color="success">
//             <ArrowUpIcon /> +11.01%
//           </Badge>
//         </div>
//       </div>

//       {/* -------------------- Quotations -------------------- */}
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
//         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
//           <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
//         </div>
//         <div className="flex items-end justify-between mt-5">
//           <div>
//             <span className="text-sm text-gray-500">Quotations</span>
//             <h4 className="mt-2 font-bold text-gray-800 text-title-sm">
//               {quotationCount}
//             </h4>
//           </div>

//           <Badge color="error">
//             <ArrowDownIcon /> -3.12%
//           </Badge>
//         </div>
//       </div>

//       {/* -------------------- Products -------------------- */}
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
//         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
//           <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
//         </div>
//         <div className="flex items-end justify-between mt-5">
//           <div>
//             <span className="text-sm text-gray-500">Products</span>
//             <h4 className="mt-2 font-bold text-gray-800 text-title-sm">
//               {productCount}
//             </h4>
//           </div>

//           <Badge color="success">
//             <ArrowUpIcon /> +5.34%
//           </Badge>
//         </div>
//       </div>

//       {/* -------------------- Orders -------------------- */}
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] md:p-6">
//         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
//           <BoxIconLine className="text-gray-800 size-6 dark:text-white/90" />
//         </div>
//         <div className="flex items-end justify-between mt-5">
//           <div>
//             <span className="text-sm text-gray-500">Orders</span>
//             <h4 className="mt-2 font-bold text-gray-800 text-title-sm">
//               {orderCount}
//             </h4>
//           </div>

//           <Badge color="error">
//             <ArrowDownIcon /> -1.88%
//           </Badge>
//         </div>
//       </div>
//     </div>
//   );
// }



// import { useEffect, useState } from "react";
// import axios from "axios";
// import {
//   ArrowDownIcon,
//   ArrowUpIcon,
//   BoxIconLine,
//   GroupIcon,
// } from "../../icons";
// import Badge from "../ui/badge/Badge";

// export default function EcommerceMetrics() {
//   const [customerCount, setCustomerCount] = useState(0);
//   const [quotationCount, setQuotationCount] = useState(0);

//   const BASE_URL = "http://localhost:5000/api";

//   // Fetch Only Customers + Quotations
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const custRes = await axios.get(`${BASE_URL}/customers`);
//         setCustomerCount(custRes.data?.length || 0);
//       } catch (error) {
//         console.log("Customer API Error:", error);
//       }

//       try {
//         const quoteRes = await axios.get(`${BASE_URL}/quotations`);
//         setQuotationCount(quoteRes.data?.length || 0);
//       } catch (error) {
//         console.log("Quotation API Error:", error);
//       }
//     };

//     fetchData();
//   }, []);

//   return (
//     <div
//       className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:gap-6"
//       style={{ width: 1000, border: "2px solid black", padding: 20 }}
//     >

//       {/* -------------------- Customers -------------------- */}
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
//         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
//           <GroupIcon className="text-gray-800 size-6" />
//         </div>

//         <div className="flex items-end justify-between mt-5">
//           <div>
//             <span className="text-sm text-gray-500">Customers</span>
//             <h4 className="mt-2 font-bold text-gray-800 text-title-sm">
//               {customerCount}
//             </h4>
//           </div>
//           <Badge color="success">
//             <ArrowUpIcon /> +11.01%
//           </Badge>
//         </div>
//       </div>

//       {/* -------------------- Quotations -------------------- */}
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
//         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
//           <BoxIconLine className="text-gray-800 size-6" />
//         </div>

//         <div className="flex items-end justify-between mt-5">
//           <div>
//             <span className="text-sm text-gray-500">Quotations</span>
//             <h4 className="mt-2 font-bold text-gray-800 text-title-sm">
//               {quotationCount}
//             </h4>
//           </div>
//           <Badge color="error">
//             <ArrowDownIcon /> -3.12%
//           </Badge>
//         </div>
//       </div>

//       {/* -------------------- Dummy Box 1 -------------------- */}
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
//         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
//           <BoxIconLine className="text-gray-800 size-6" />
//         </div>

//         <div className="flex items-end justify-between mt-5">
//           <div>
//             <span className="text-sm text-gray-500">Deal Finished</span>
//             <h4 className="mt-2 font-bold text-gray-800 text-title-sm">0</h4>
//           </div>
//           <Badge color="success">
//             <ArrowUpIcon /> +5.2%
//           </Badge>
//         </div>
//       </div>

//       {/* -------------------- Dummy Box 2 -------------------- */}
//       <div className="rounded-2xl border border-gray-200 bg-white p-5 md:p-6">
//         <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
//           <BoxIconLine className="text-gray-800 size-6" />
//         </div>

//         <div className="flex items-end justify-between mt-5">
//           <div>
//             <span className="text-sm text-gray-500">Deal Pending</span>
//             <h4 className="mt-2 font-bold text-gray-800 text-title-sm">0</h4>
//           </div>
//           <Badge color="error">
//             <ArrowDownIcon /> -1.8%
//           </Badge>
//         </div>
//       </div>

//     </div>
//   );
// }



import { useEffect, useState } from "react";
import axios from "axios";

import {
  ArrowDownIcon,
  ArrowUpIcon,
  CheckCircleIcon,
  BoxIconLine,
  CloseIcon,
  GroupIcon,
} from "../../icons";

import Badge from "../ui/badge/Badge";

export default function EcommerceMetrics() {
  const [customerCount, setCustomerCount] = useState(0);
  const [quotationCount, setQuotationCount] = useState(0);
  const [dealYes, setDealYes] = useState(0);
  const [dealNo, setDealNo] = useState(0);

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const custRes = await axios.get(`${BASE_URL}/customers`);
        setCustomerCount(custRes.data?.length || 0);

        const quoteRes = await axios.get(`${BASE_URL}/quotation-tracking`);
        setQuotationCount(quoteRes.data?.length || 0);

        const data = quoteRes.data || [];

        setDealYes(data.filter((q) => q.is_deal_finalised === "Yes").length);
        setDealNo(data.filter((q) => q.is_deal_finalised === "No").length);
      } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
      }
    };

    fetchData();
  }, []);

  // ⭐ Cards Data
  const cards = [
    {
      title: "Customers",
      count: customerCount,
      icon: <GroupIcon className="text-gray-800 size-6" />,
      badge: (
        <Badge color="success">
          <ArrowUpIcon /> +11%
        </Badge>
      ),
    },
    {
      title: "Quotations",
      count: quotationCount,
      icon: <BoxIconLine className="text-gray-800 size-6" />,
      badge: (
        <Badge color="error">
          <ArrowDownIcon /> -9%
        </Badge>
      ),
    },
    {
      title: "Deal Finalised",
      count: dealYes,
      icon: <CheckCircleIcon className="text-black size-7" />,
    },
    {
      title: "Deal Not Finalised",
      count: dealNo,
      icon: <CloseIcon className="text-black size-7" />,
    },
  ];

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "20px",
        width: "100%",
        justifyContent: "center",
      }}
    >
      {cards.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl border bg-white p-5"
          style={{
            width: "45%", // ⭐ 2 cards per row
            minWidth: "300px",
            height: "140px", // ⭐ fixed height
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          {/* ICON */}
          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl">
            {item.icon}
          </div>

          {/* TEXT + BADGE */}
          <div className="flex justify-between items-end">
            <div>
              <span className="text-sm text-gray-500">{item.title}</span>
              <h4 className="mt-2 font-bold text-xl">{item.count}</h4>
            </div>

            {item.badge ? item.badge : null}
          </div>
        </div>
      ))}
    </div>
  );
}





