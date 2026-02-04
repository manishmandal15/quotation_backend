// import React, { useEffect, useRef, useState } from "react";
// import dayjs from "dayjs";
// import { getQuotationByNumber } from "./quotationApi";
// import logo from "/images/logo/dsonik.png";
// import { Button } from "antd";
// import { PrinterOutlined, CloseOutlined } from "@ant-design/icons";
// import { noop } from "antd/es/_util/warning";

// type Item = {
//   product_name?: string;
//   description?: string;
//   quantity?: number;
//   unit_price?: number;
//   discount?: number;
//   tax_rate?: number;
//   line_total?: number;
// };

// const th: React.CSSProperties = {
//   border: "1px solid #ddd",
//   padding: 6,
//   fontSize: 12,
//   textAlign: "left",
// };
// const td: React.CSSProperties = {
//   border: "1px solid #ddd",
//   padding: 6,
//   fontSize: 12,
// };

// export default function PrintPage() {
//   const printRef = useRef<HTMLDivElement | null>(null);

//   const [quotationNo, setQuotationNo] = useState("");
//   const [autoPrint, setAutoPrint] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState<any | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   // Load URL params
//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const q = params.get("quotationNo") || "";
//     const auto = params.get("autoPrint") === "true";

//     setQuotationNo(q);
//     setAutoPrint(auto);

//     if (q) loadQuotation(q, auto);
//   }, []);

//   const numberToWords = (num: number) => {
//     if (!num || isNaN(num)) return "";

//     const a = [
//       "",
//       "One",
//       "Two",
//       "Three",
//       "Four",
//       "Five",
//       "Six",
//       "Seven",
//       "Eight",
//       "Nine",
//       "Ten",
//       "Eleven",
//       "Twelve",
//       "Thirteen",
//       "Fourteen",
//       "Fifteen",
//       "Sixteen",
//       "Seventeen",
//       "Eighteen",
//       "Nineteen",
//     ];

//     const b = [
//       "",
//       "",
//       "Twenty",
//       "Thirty",
//       "Forty",
//       "Fifty",
//       "Sixty",
//       "Seventy",
//       "Eighty",
//       "Ninety",
//     ];

//     const convert = (n: number): string => {
//       if (n < 20) return a[n];
//       if (n < 100)
//         return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
//       if (n < 1000)
//         return (
//           a[Math.floor(n / 100)] +
//           " Hundred" +
//           (n % 100 ? " " + convert(n % 100) : "")
//         );
//       if (n < 100000)
//         return (
//           convert(Math.floor(n / 1000)) +
//           " Thousand" +
//           (n % 1000 ? " " + convert(n % 1000) : "")
//         );
//       if (n < 10000000)
//         return (
//           convert(Math.floor(n / 100000)) +
//           " Lakh" +
//           (n % 100000 ? " " + convert(n % 100000) : "")
//         );
//       return (
//         convert(Math.floor(n / 10000000)) +
//         " Crore" +
//         (n % 10000000 ? " " + convert(n % 10000000) : "")
//       );
//     };

//     const rupees = Math.floor(num);
//     const paise = Math.round((num - rupees) * 100);

//     let words = convert(rupees) + " Rupees";
//     if (paise > 0) {
//       words += " and " + convert(paise) + " Paise";
//     }

//     return words + " Only";
//   };

//   const loadQuotation = async (q: string, shouldAutoPrint?: boolean) => {
//     setLoading(true);
//     setError(null);

//     try {
//       const res = await getQuotationByNumber(q);
//       const payload = res?.data ?? res;
//       setData(payload);

//       if (shouldAutoPrint) {
//         setTimeout(() => handlePrint(), 500);
//       }
//     } catch (err) {
//       console.error(err);
//       setError("Failed to load quotation");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePrint = () => {
//   if (!printRef.current) return;

//   const printContents = printRef.current.innerHTML;
//   const newWin = window.open("", "_blank");
//   if (!newWin) return;

//   newWin.document.write(`
// <html>
//   <head>
//     <title>Quotation</title>
//     <style>
//       @page {
//         size: A4;
//         margin: 10mm;
//       }

//       body {
//         font-family: Arial, sans-serif;
//         font-size: 12px;
//       }

//       .print-container {
//         border: 10px solid black !important;
//         padding: 6px;
//         box-sizing: border-box;
//       }

//       table {
//         width: 100%;
//         border-collapse: collapse;
//         margin-top: 10px;
//       }

//       th, td {
//         border: 1px solid #000;
//         padding: 6px;
//       }

//       /* 🔥 VERY IMPORTANT */
//       * {
//         -webkit-print-color-adjust: exact !important;
//         print-color-adjust: exact !important;
//       }
//     </style>
//   </head>
//   <body>
//     ${printContents}
//   </body>
// </html>
// `);

//   newWin.document.close();
//   setTimeout(() => {
//     newWin.focus();
//     newWin.print();
//   }, 300);
// };

//   if (loading)
//     return <h2 style={{ textAlign: "center", marginTop: 40 }}>Loading...</h2>;
//   if (error)
//     return <h3 style={{ textAlign: "center", marginTop: 40 }}>{error}</h3>;
//   if (!data)
//     return <h3 style={{ textAlign: "center", marginTop: 40 }}>No Data</h3>;

//   // CUSTOMER DATA FIX (SAFE)
//   const cust = data?.customer || {};
//   console.log("Customer Object:", cust);
//   console.log("Contact person:", cust.contact_person);
//   console.log("Customer keys:", Object.keys(cust));

//   const customer = {
//     name: cust.name || "N/A",
//     phone: cust.phone || cust.mobile || "-",
//     email: cust.email || "",
//     gst_no: cust.gst_no || cust.gstNumber || "",
//     address: cust.address || cust.location || "Address not available",
//     contact_person: cust.contact_person ?? cust.contactPerson ?? "-",
//   };

//   const comp = data?.company || {};

//   const company = {
//     name: comp.company_name || "Company Name",
//     address: comp.address || "",
//     phone: comp.phone || "",
//     email: comp.email || "",
//     website: comp.website || "",
//     gst_no: comp.gst_no || "",
//     bank_name: comp.bank_name || "",
//     bank_address: comp.bank_address || "",
//     acc_no: comp.acc_no || "",
//     ifsc: comp.ifsc || "",
//   };

//   // PRODUCTS (SAFE NORMALIZED)
//   const rawItems = data.items || data.products || [];
//   const mappedItems: Item[] = Array.isArray(rawItems)
//     ? rawItems.map((item: any) => ({
//         product_name: item.product_name || item.name || "Unnamed Product",
//         description: item.description || item.item_description || "-",
//         quantity: Number(item.quantity || 0),
//         unit_price: Number(item.unit_price || 0),
//         discount: Number(item.discount || 0),
//         tax_rate: Number(item.tax_rate || 0),
//         line_total:
//           Number(item.line_total) ||
//           Number(item.quantity || 0) * Number(item.unit_price || 0),
//       }))
//     : [];

//   const subtotal = mappedItems.reduce((sum, i) => sum + (i.line_total || 0), 0);
//   const discount = Number(data.discount_amount || data.discount || 0);
//   const tax = Number(data.tax_amount || data.tax || 0);
//   const total = subtotal - discount + tax;

//   return (
//     <div
//       style={{
//         padding: 0,
//         fontFamily: "Arial, sans-serif",
//         border: "2px solid black",
//       }}
//     >
//       {/* Buttons */}
//       <div style={{ marginBottom: 12, textAlign: "right" }}>
//         <Button
//           type="primary"
//           icon={<PrinterOutlined />}
//           onClick={handlePrint}
//           style={{ marginRight: 6 }}
//         >
//           Print
//         </Button>
//         <Button
//           type="default"
//           icon={<CloseOutlined />}
//           onClick={() => window.close()}
//         >
//           Close
//         </Button>
//       </div>

//       <div
//         id="print-area"
//         ref={printRef}
//         className="print-container"
//         style={{
//           maxWidth: 1100,
//           margin: "0 auto",
//           background: "#fff",
//           padding: 0,
//           borderRadius: 6,
//           boxShadow: "0 6px 20px rgba(0,0,0,0.04)",
//           // border: "10px solid black",
//         }}
//       >
//         {/* Header */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             borderBottom: "2px solid #000",
//             paddingBottom: 0,
//             background: "gray",
//             border: "px solid black",
//           }}
//         >
//           <img
//             src={logo}
//             alt="logo"
//             style={{ height: 60, marginTop: "8px", marginLeft: "5px" }}
//           />
//           <h1
//             style={{
//               textAlign: "right",
//               fontSize: "50px",
//               marginRight: "8px",
//               marginTop: "8px",
//             }}
//           >
//             Quotation
//           </h1>
//         </div>

//         {/* Customer & Quotation Info */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginTop: 8,
//           }}
//         >
//           {/* CUSTOMER */}
//           <div style={{ width: "48%" }}>
//             {/* added */}
//             <div
//               style={{
//                 textAlign: "left",
//                 marginTop: "10px",
//                 marginLeft: "10px",
//                 lineHeight: "1.6",
//               }}
//             >
//               <h2>{company.name}</h2>
//               <div style={{ fontSize: 14, whiteSpace: "pre-line" }}>
//                 {company.address}
//               </div>
//               <div style={{ fontSize: 14 }}>Phone: {company.phone}</div>
//               <div style={{ fontSize: 14 }}>Email: {company.email}</div>
//               <div style={{ fontSize: 14 }}>Website: {company.website}</div>
//               <div style={{ fontSize: 14 }}>GSTIN: {company.gst_no}</div>
//             </div>

//             <h4
//               style={{
//                 margin: "0 0 2px 0",
//                 fontSize: 14,
//                 textAlign: "left",
//                 marginTop: "20px",
//                 padding: "5px",
//                 border: "2px solid black",
//                 background: "gray",
//                 width: "65%",
//               }}
//             >
//               BILL TO :
//             </h4>

//             <div
//               style={{
//                 marginTop: "10px",
//                 fontSize: 14,
//                 marginLeft: "10px",
//                 lineHeight: "1.6",
//               }}
//             >
//               <p style={{ margin: "1px 0", fontSize: 14 }}>
//                 Company Name:
//                 <b>{customer.name}</b>
//               </p>
//               <p style={{ margin: "1px 0", fontSize: 14 }}>
//                 {customer.address}
//               </p>
//               <p style={{ margin: "1px 0", fontSize: 14 }}>
//                 Contact person : {customer.contact_person}
//               </p>
//               <p style={{ margin: "1px 0", fontSize: 14 }}>
//                 Contact No : {customer.phone}
//               </p>

//               {customer.email && (
//                 <p style={{ margin: "1px 0", fontSize: 14 }}>
//                   Email: {customer.email}
//                 </p>
//               )}

//               {customer.gst_no && (
//                 <p style={{ margin: "1px 0", fontSize: 14 }}>
//                   GSTIN: {customer.gst_no}
//                 </p>
//               )}
//             </div>
//           </div>

//           {/* QUOTATION INFO */}
//           <div
//             style={{
//               width: "48%",
//               textAlign: "left",
//               paddingLeft: "140px",
//               lineHeight: "1",
//             }}
//           >
//             <h4 style={{ margin: "0 0 2px 0", fontSize: 14 }}>
//               Quotation Info
//             </h4>
//             <p>
//               <b>No:</b> {data.quotation_no || quotationNo}
//             </p>
//             <p>
//               <b>Date:</b>{" "}
//               {data.created_at
//                 ? dayjs(data.created_at).format("DD-MM-YYYY")
//                 : "-"}
//             </p>
//             <p>
//               <b>Validity:</b>{" "}
//               {data.validity_date
//                 ? dayjs(data.validity_date).format("DD-MM-YYYY")
//                 : "-"}
//             </p>
//             <p>
//               <b>Payment:</b> {data.payment_terms || "50% Advance"}
//             </p>
//             <p>
//               <b>Delivery:</b> {data.delivery_terms || "As discussed"}
//             </p>
//           </div>
//         </div>

//         {/* Items Table */}
//         <table
//           style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}
//         >
//           <thead>
//             <tr style={{ background: "#f3f3f3" }}>
//               <th style={th}>S.No</th>
//               <th style={th}>Product</th>
//               <th style={th}>Description</th>
//               <th style={th}>Qty</th>
//               <th style={th}>Price</th>
//               <th style={th}>Discount %</th>
//               <th style={th}>Tax %</th>
//               <th style={th}>Total</th>
//             </tr>
//           </thead>

//           <tbody>
//             {mappedItems.length ? (
//               mappedItems.map((item, i) => (
//                 <tr key={i}>
//                   <td style={td}>{i + 1}</td>
//                   <td style={td}>{item.product_name}</td>
//                   <td style={td}>{item.description}</td>
//                   <td style={td}>{item.quantity}</td>
//                   <td style={td}>{item.unit_price?.toFixed(2)}</td>
//                   <td style={td}>{item.discount}</td>
//                   <td style={td}>{item.tax_rate}</td>
//                   <td style={td}>{item.line_total?.toFixed(2)}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={8} style={{ textAlign: "center", padding: 10 }}>
//                   No products found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//         {/* Totals */}
//         <div style={{ display: "flex", justifyContent: "space-beetween" }}>
//           <div
//             style={{
//               width: "80%",
//               border: "2px solid black",
//               marginTop: 12,
//               marginRight: "20px",
//               padding: "6px",
//             }}
//           >
//             <h3 style={{ margin: "0 0 4px 0", fontWeight: "bold" }}>
//               Amount in Words :
//             </h3>
//             <p style={{ margin: 0, fontSize: 14 }}>{numberToWords(total)}</p>
//           </div>
//           <div
//             style={{
//               textAlign: "right",
//               marginTop: 12,
//               border: "2px solid black",
//               width: "230px",
//             }}
//           >
//             <div>Sub Total: ₹{subtotal.toFixed(2)}</div>
//             <div>Discount: ₹{discount.toFixed(2)}</div>
//             <div>Tax: ₹{tax.toFixed(2)}</div>
//             <h3>Grand Total: ₹{total.toFixed(2)}</h3>
//           </div>
//         </div>

//         {/* Terms */}
//         <div style={{ marginTop: 20 }}>
//           <h4
//             style={{
//               margin: "0 0 2px 0",
//               fontSize: 14,
//               textAlign: "left",
//               marginTop: "20px",
//               padding: "5px",
//               border: "2px solid black",
//               background: "gray",
//               width: "32%",
//               fontWeight: "bold",
//             }}
//           >
//             Terms & conditions :
//           </h4>
//           <p style={{ whiteSpace: "pre-line" }}>
//             {data.terms_conditions || "—"}
//           </p>
//         </div>

//         {/* Footer */}
//         <div
//           style={{
//             marginTop: 18,
//             display: "flex",
//             justifyContent: "space-between",
//           }}
//         >
//           <div>
//             <p>
//               <b>Devender Kumar</b>
//               <br />
//               Director
//               <br />
//               9810776728
//             </p>
//             <p>
//               <b>Sanjay</b>
//               <br />
//               Business Partner
//               <br />
//               9220480010
//             </p>
//           </div>

//           <div style={{ textAlign: "left" }}>
//             <h4 style={{ marginBottom: 4 }}>Bank Details</h4>
//             <p>Bank: {company.bank_name}</p>
//             <p>Account No: {company.acc_no}</p>
//             <p>IFSC: {company.ifsc}</p>
//           </div>
//         </div>

//         <p
//           style={{
//             textAlign: "right",
//             marginTop: 140,
//             border: "2px solid black",
//             marginBottom: 0,
//             borderTop: 0,
//             background: "gray",
//             height: "20px",
//           }}
//         >
//           <b>Thank You For Your Business!</b>
//         </p>
//       </div>
//     </div>
//   );
// }

// import React, { useEffect, useRef, useState } from "react";
// import dayjs from "dayjs";
// import { getQuotationByNumber } from "./quotationApi";
// import logo from "/images/logo/dsonik.png";
// import { Button } from "antd";
// import { PrinterOutlined, CloseOutlined } from "@ant-design/icons";

// type Item = {
//   product_name?: string;
//   description?: string;
//   quantity?: number;
//   unit_price?: number;
//   discount?: number;
//   tax_rate?: number;
//   line_total?: number;
// };

// const th: React.CSSProperties = {
//   border: "1px solid #000",
//   padding: 6,
//   fontSize: 12,
//   textAlign: "left",
// };
// const td: React.CSSProperties = {
//   border: "1px solid #000",
//   padding: 6,
//   fontSize: 12,
// };

// export default function PrintPage() {
//   const printRef = useRef<HTMLDivElement | null>(null);
//   const [quotationNo, setQuotationNo] = useState("");
//   const [autoPrint, setAutoPrint] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [data, setData] = useState<any | null>(null);
//   const [error, setError] = useState<string | null>(null);

//   useEffect(() => {
//     const params = new URLSearchParams(window.location.search);
//     const q = params.get("quotationNo") || "";
//     const auto = params.get("autoPrint") === "true";
//     setQuotationNo(q);
//     setAutoPrint(auto);
//     if (q) loadQuotation(q, auto);
//   }, []);

//   const numberToWords = (num: number) => {
//     if (!num || isNaN(num)) return "";
//     const a = [
//       "",
//       "One",
//       "Two",
//       "Three",
//       "Four",
//       "Five",
//       "Six",
//       "Seven",
//       "Eight",
//       "Nine",
//       "Ten",
//       "Eleven",
//       "Twelve",
//       "Thirteen",
//       "Fourteen",
//       "Fifteen",
//       "Sixteen",
//       "Seventeen",
//       "Eighteen",
//       "Nineteen",
//     ];
//     const b = [
//       "",
//       "",
//       "Twenty",
//       "Thirty",
//       "Forty",
//       "Fifty",
//       "Sixty",
//       "Seventy",
//       "Eighty",
//       "Ninety",
//     ];
//     const convert = (n: number): string => {
//       if (n < 20) return a[n];
//       if (n < 100)
//         return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
//       if (n < 1000)
//         return (
//           a[Math.floor(n / 100)] +
//           " Hundred" +
//           (n % 100 ? " " + convert(n % 100) : "")
//         );
//       if (n < 100000)
//         return (
//           convert(Math.floor(n / 1000)) +
//           " Thousand" +
//           (n % 1000 ? " " + convert(n % 1000) : "")
//         );
//       if (n < 10000000)
//         return (
//           convert(Math.floor(n / 100000)) +
//           " Lakh" +
//           (n % 100000 ? " " + convert(n % 100000) : "")
//         );
//       return (
//         convert(Math.floor(n / 10000000)) +
//         " Crore" +
//         (n % 10000000 ? " " + convert(n % 10000000) : "")
//       );
//     };
//     const rupees = Math.floor(num);
//     const paise = Math.round((num - rupees) * 100);
//     let words = convert(rupees) + " Rupees";
//     if (paise > 0) words += " and " + convert(paise) + " Paise";
//     return words + " Only";
//   };

//   const loadQuotation = async (q: string, shouldAutoPrint?: boolean) => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await getQuotationByNumber(q);
//       setData(res?.data ?? res);
//       if (shouldAutoPrint) setTimeout(() => handlePrint(), 500);
//     } catch (err) {
//       setError("Failed to load quotation");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handlePrint = () => {
//     if (!printRef.current) return;
//     const printContents = printRef.current.innerHTML;
//     const newWin = window.open("", "_blank");
//     if (!newWin) return;
//     newWin.document.write(`
//       <html>
//         <head>
//           <title>Quotation</title>
//           <style>
//             @page { size: A4; margin: 10mm; }
//             body { border: solid 2px; font-family: Arial, sans-serif; font-size: 12px; margin: 0; padding: 3; }
//             .print-container { padding: 12px; box-sizing: border-box; border: 3px solid black; width: 100%; }
//             table { width: 100%; border-collapse: collapse; margin-top: 10px; page-break-inside: auto; }
//             th, td { border: 1px solid #000; padding: 6px; font-size: 12px; }
//             thead { display: table-header-group; }
//             tfoot { display: table-footer-group; }
//             tr { page-break-inside: avoid; page-break-after: auto; }
//              .print-footer {
//             position: fixed;
//             bottom: 0mm;
//             left: 1mm;
//             right: 1mm;
//             border-top: 1px solid #000;
//             background: #ccc;
//             padding: 1px;
//             text-align: right;
//             font-weight: bold;
//           }
//             * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
//           </style>
//         </head>
//         <body>
//           ${printContents}
//         </body>
//       </html>
//     `);
//     newWin.document.close();
//     setTimeout(() => {
//       newWin.focus();
//       newWin.print();
//     }, 300);
//   };

//   if (loading)
//     return <h2 style={{ textAlign: "center", marginTop: 40 }}>Loading...</h2>;
//   if (error)
//     return <h3 style={{ textAlign: "center", marginTop: 40 }}>{error}</h3>;
//   if (!data)
//     return <h3 style={{ textAlign: "center", marginTop: 40 }}>No Data</h3>;

//   const cust = data?.customer || {};
//   const customer = {
//     name: cust.name || "N/A",
//     phone: cust.phone || cust.mobile || "-",
//     email: cust.email || "",
//     gst_no: cust.gst_no || cust.gstNumber || "",
//     address: cust.address || cust.location || "Address not available",
//     contact_person: cust.contact_person ?? cust.contactPerson ?? "-",
//   };
//   const comp = data?.company || {};
//   const company = {
//     name: comp.company_name || "Company Name",
//     address: comp.address || "",
//     phone: comp.phone || "",
//     email: comp.email || "",
//     website: comp.website || "",
//     gst_no: comp.gst_no || "",
//     bank_name: comp.bank_name || "",
//     bank_address: comp.bank_address || "",
//     acc_no: comp.acc_no || "",
//     ifsc: comp.ifsc || "",
//   };
//   const rawItems = data.items || data.products || [];
//   const mappedItems: Item[] = Array.isArray(rawItems)
//     ? rawItems.map((item: any) => ({
//         product_name: item.product_name || item.name || "Unnamed Product",
//         description: item.description || item.item_description || "-",
//         quantity: Number(item.quantity || 0),
//         unit_price: Number(item.unit_price || 0),
//         discount: Number(item.discount || 0),
//         tax_rate: Number(item.tax_rate || 0),
//         line_total:
//           Number(item.line_total) ||
//           Number(item.quantity || 0) * Number(item.unit_price || 0),
//       }))
//     : [];
//   const subtotal = mappedItems.reduce((sum, i) => sum + (i.line_total || 0), 0);
//   const discount = Number(data.discount_amount || data.discount || 0);
//   const tax = Number(data.tax_amount || data.tax || 0);
//   const total = subtotal - discount + tax;

//   return (
//     <div style={{ fontFamily: "Arial, sans-serif" }}>
//       <div style={{ marginBottom: 12, textAlign: "right" }}>
//         <Button
//           type="primary"
//           icon={<PrinterOutlined />}
//           onClick={handlePrint}
//           style={{ marginRight: 6 }}
//         >
//           Print
//         </Button>
//         <Button
//           type="default"
//           icon={<CloseOutlined />}
//           onClick={() => window.close()}
//         >
//           Close
//         </Button>
//       </div>

//       <div>
        
//       </div>
//       <div
//         ref={printRef}
//         style={{
//           minHeight: "calc(297mm - 20mm)",
//           // border: "3px solid black",
//           // padding: "12px",
//           boxSizing: "border-box",
//         }}
//       >
//         {/* Header */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             borderBottom: "2px solid #000",
//             paddingBottom: 4,
//             background: "#f0f0f0",
//           }}
//         >
//           <img src={logo} alt="logo" style={{ height: 60, margin: 4 }} />
//           <h1 style={{ fontSize: 48, margin: 0 }}>Quotation</h1>
//         </div>

//         {/* Customer & Quotation Info */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginTop: 8,
//           }}
//         >
//           <div style={{ width: "48%" }}>
//             <h2>{company.name}</h2>
//             <div style={{ fontSize: 12, whiteSpace: "pre-line" }}>
//               {company.address}
//             </div>
//             <div>Phone: {company.phone}</div>
//             <div>Email: {company.email}</div>
//             <div>Website: {company.website}</div>
//             <div>GSTIN: {company.gst_no}</div>
//             <h4
//               style={{
//                 marginTop: 16,
//                 padding: 4,
//                 border: "1px solid #000",
//                 background: "#ccc",
//               }}
//             >
//               BILL TO :
//             </h4>
//             <div style={{ fontSize: 12, marginTop: 4 }}>
//               <p style={{ margin: 0 }}>
//                 Customer Nmae: <b>{customer.name}</b>
//               </p>
//               <p style={{ margin: 0 }}>{customer.address}</p>
//               <p style={{ margin: 0 }}>
//                 Contact Person: {customer.contact_person}
//               </p>
//               <p style={{ margin: 0 }}>Phone: {customer.phone}</p>
//               {customer.email && (
//                 <p style={{ margin: 0 }}>Email: {customer.email}</p>
//               )}
//               {customer.gst_no && (
//                 <p style={{ margin: 0 }}>GSTIN: {customer.gst_no}</p>
//               )}
//             </div>
//           </div>
//           <div style={{ width: "48%", textAlign: "left", paddingLeft: 60 }}>
//             <h4>Quotation Info</h4>
//             <p>
//               <b>No:</b> {data.quotation_no || quotationNo}
//             </p>
//             <p>
//               <b>Date:</b>{" "}
//               {data.created_at
//                 ? dayjs(data.created_at).format("DD-MM-YYYY")
//                 : "-"}
//             </p>
//             <p>
//               <b>Validity:</b>{" "}
//               {data.validity_date
//                 ? dayjs(data.validity_date).format("DD-MM-YYYY")
//                 : "-"}
//             </p>
//             <p>
//               <b>Payment:</b> {data.payment_terms || "50% Advance"}
//             </p>
//             <p>
//               <b>Delivery:</b> {data.delivery_terms || "As discussed"}
//             </p>
//           </div>
//         </div>

//         {/* Items Table */}
//         <table
//           style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}
//         >
//           <thead>
//             <tr style={{ background: "#f3f3f3" }}>
//               <th style={th}>S.No</th>
//               <th style={th}>Product</th>
//               <th style={th}>Description</th>
//               <th style={th}>Qty</th>
//               <th style={th}>Price</th>
//               <th style={th}>Discount %</th>
//               <th style={th}>Tax %</th>
//               <th style={th}>Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {mappedItems.length ? (
//               mappedItems.map((item, i) => (
//                 <tr key={i}>
//                   <td style={td}>{i + 1}</td>
//                   <td style={td}>{item.product_name}</td>
//                   <td style={td}>{item.description}</td>
//                   <td style={td}>{item.quantity}</td>
//                   <td style={td}>{item.unit_price?.toFixed(2)}</td>
//                   <td style={td}>{item.discount}</td>
//                   <td style={td}>{item.tax_rate}</td>
//                   <td style={td}>{item.line_total?.toFixed(2)}</td>
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan={8} style={{ textAlign: "center", padding: 10 }}>
//                   No products found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>

//         {/* Totals */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginTop: 12,
//           }}
//         >
//           <div style={{ width: "70%", border: "1px solid #000", padding: 6 }}>
//             <h3 style={{ margin: 0 }}>Amount in Words :</h3>
//             <p style={{ margin: 0 }}>{numberToWords(total)}</p>
//           </div>
//           <div
//             style={{
//               width: "28%",
//               textAlign: "right",
//               border: "1px solid #000",
//               padding: 6,
//             }}
//           >
//             <div>Sub Total: ₹{subtotal.toFixed(2)}</div>
//             <div>Discount: ₹{discount.toFixed(2)}</div>
//             <div>Tax: ₹{tax.toFixed(2)}</div>
//             <h3>Grand Total: ₹{total.toFixed(2)}</h3>
//           </div>
//         </div>

//         {/* Terms */}
//         <div style={{ marginTop: 16 }}>
//           <h4
//             style={{
//               margin: 0,
//               padding: 4,
//               border: "1px solid #000",
//               background: "#ccc",
//             }}
//           >
//             Terms & conditions :
//           </h4>
//           <p style={{ whiteSpace: "pre-line" }}>
//             {data.terms_conditions || "—"}
//           </p>
//         </div>

//         {/* Footer */}
//         <div
//           style={{
//             display: "flex",
//             justifyContent: "space-between",
//             marginTop: 20,
//           }}
//         >
//           <div>
//             <p>
//               <b>Devender Kumar</b>
//               <br />
//               Director
//               <br />
//               9810776728
//             </p>
//             <p>
//               <b>Sanjay</b>
//               <br />
//               Business Partner
//               <br />
//               9220480010
//             </p>
//           </div>
//           <div style={{ textAlign: "left" }}>
//             <h4>Bank Details</h4>
//             <p>Bank: {company.bank_name}</p>
//             <p>Account No: {company.acc_no}</p>
//             <p>IFSC: {company.ifsc}</p>
//           </div>
//         </div>

//         <p className="print-footer"
//           style={{
//             textAlign: "right",
//             // marginTop: 40,
//             border: "1px solid #000",
//             background: "#ccc",
//             padding: 4,
//           }}
//         >
//           <b>Thank You For Your Business!</b>
//         </p>
//       </div>
//     </div>
//   );
// }






import React, { useEffect, useRef, useState } from "react";
import dayjs from "dayjs";
import { getQuotationByNumber } from "./quotationApi";
import logo from "/images/logo/dsonik.png";
import { Button } from "antd";
import { PrinterOutlined, CloseOutlined } from "@ant-design/icons";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const QUOTATION_API = axios.create({ baseURL: `${BASE_URL}/quotations` });
const CUSTOMER_API = axios.create({ baseURL: `${BASE_URL}/customers` });
const CURRENCY_API = axios.create({ baseURL: `${BASE_URL}/currencies` });
const PRODUCT_API = axios.create({ baseURL: `${BASE_URL}/products` });


type Item = {
  product_name?: string;
  description?: string;
  quantity?: number;
  unit_price?: number;
  discount?: number;
  tax_rate?: number;
  line_total?: number;
};

const th: React.CSSProperties = {
  border: "1px solid #000",
  padding: 6,
  fontSize: 12,
  textAlign: "left",
};
const td: React.CSSProperties = {
  border: "1px solid #000",
  padding: 6,
  fontSize: 12,
};

export default function PrintPage() {
  const printRef = useRef<HTMLDivElement | null>(null);
  const [quotationNo, setQuotationNo] = useState("");
  const [autoPrint, setAutoPrint] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);
const COMPANY_STATE = "uttar pradesh";


  // useEffect(() => {
  //   const params = new URLSearchParams(window.location.search);
  //   const q = params.get("quotationNo") || "";
  //   const auto = params.get("autoPrint") === "true";
  //   setQuotationNo(q);
  //   setAutoPrint(auto);
  //   if (q) loadQuotation(q, auto);
  // }, []);

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  const id = params.get("id");              // 👈 NEW
  const auto = params.get("autoPrint") === "true";

  setAutoPrint(auto);

  if (id) {
    loadQuotationById(id, auto);             // 👈 NEW
  }
}, []);


  

  const numberToWords = (num: number) => {
    if (!num || isNaN(num)) return "";
    const a = [
      "",
      "One",
      "Two",
      "Three",
      "Four",
      "Five",
      "Six",
      "Seven",
      "Eight",
      "Nine",
      "Ten",
      "Eleven",
      "Twelve",
      "Thirteen",
      "Fourteen",
      "Fifteen",
      "Sixteen",
      "Seventeen",
      "Eighteen",
      "Nineteen",
    ];
    const b = [
      "",
      "",
      "Twenty",
      "Thirty",
      "Forty",
      "Fifty",
      "Sixty",
      "Seventy",
      "Eighty",
      "Ninety",
    ];
    const convert = (n: number): string => {
      if (n < 20) return a[n];
      if (n < 100)
        return b[Math.floor(n / 10)] + (n % 10 ? " " + a[n % 10] : "");
      if (n < 1000)
        return (
          a[Math.floor(n / 100)] +
          " Hundred" +
          (n % 100 ? " " + convert(n % 100) : "")
        );
      if (n < 100000)
        return (
          convert(Math.floor(n / 1000)) +
          " Thousand" +
          (n % 1000 ? " " + convert(n % 1000) : "")
        );
      if (n < 10000000)
        return (
          convert(Math.floor(n / 100000)) +
          " Lakh" +
          (n % 100000 ? " " + convert(n % 100000) : "")
        );
      return (
        convert(Math.floor(n / 10000000)) +
        " Crore" +
        (n % 10000000 ? " " + convert(n % 10000000) : "")
      );
    };
    const rupees = Math.floor(num);
    const paise = Math.round((num - rupees) * 100);
    let words = convert(rupees) + " Rupees";
    if (paise > 0) words += " and " + convert(paise) + " Paise";
    return words + " Only";
  };

  // const loadQuotation = async (q: string, shouldAutoPrint?: boolean) => {
  //   setLoading(true);
  //   setError(null);
  //   try {
  //     const res = await getQuotationByNumber(q);
  //     setData(res?.data ?? res);
  //     if (shouldAutoPrint) setTimeout(() => handlePrint(), 500);
  //   } catch (err) {
  //     setError("Failed to load quotation");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const loadQuotationById = async (id: string, shouldAutoPrint?: boolean) => {
  setLoading(true);
  setError(null);
  try {
    const res = await QUOTATION_API.get(`/${id}`); // 👈 ID based API
    setData(res.data);

    if (shouldAutoPrint) {
      setTimeout(() => handlePrint(), 500);
    }
  } catch (err) {
    setError("Failed to load quotation");
  } finally {
    setLoading(false);
  }
};


  const handlePrint = () => {
    if (!printRef.current) return;
    const printContents = printRef.current.innerHTML;
    const newWin = window.open("", "_blank");
    if (!newWin) return;
    newWin.document.write(`
      <html>
        <head>
          <title>Quotation</title>
          <style>
            @page { size: A4; margin: 10mm; }
            body { border: solid 2px; font-family: Arial, sans-serif; font-size: 12px; margin: 0; padding: 3; }
            .print-container { padding: 12px; box-sizing: border-box; border: 3px solid black; width: 100%; }
            table { width: 100%; border-collapse: collapse; margin-top: 10px; page-break-inside: auto; }
            th, td { border: 1px solid #000; padding: 6px; font-size: 12px; }
            thead { display: table-header-group; }
            tfoot { display: table-footer-group; }
            tr { page-break-inside: avoid; page-break-after: auto; }
             .print-footer {
            position: fixed;
            bottom: 0mm;
            left: 1mm;
            right: 1mm;
            border-top: 1px solid #000;
            background: #ccc;
            padding: 1px;
            text-align: right;
            font-weight: bold;
          }
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          </style>
        </head>
        <body>
          ${printContents}
        </body>
      </html>
    `);
    newWin.document.close();
    setTimeout(() => {
      newWin.focus();
      newWin.print();
    }, 300);
  };

  if (loading)
    return <h2 style={{ textAlign: "center", marginTop: 40 }}>Loading...</h2>;
  if (error)
    return <h3 style={{ textAlign: "center", marginTop: 40 }}>{error}</h3>;
  if (!data)
    return <h3 style={{ textAlign: "center", marginTop: 40 }}>No Data</h3>;

  const cust = data?.customer || {};
  // const customerState: string = cust.state_name || "";
  const customer = {
    name: cust.name || "N/A",
    phone: cust.phone || cust.mobile || "-",
    email: cust.email || "",
    gst_no: cust.gst_no || cust.gstNumber || "",
    address: cust.address || cust.location || "Address not available",
    contact_person: cust.contact_person ?? cust.contactPerson ?? "-",
    // state: cust.state_name || "",
    state: cust.state_name || "",
  };


   const isSameState =
    customer.state.trim().toLowerCase() ===
    COMPANY_STATE.trim().toLowerCase();

  console.log("Customer Statessssssssssssssss:", cust.state_name);
  console.log("Same Statessssssssssssssssssss:", isSameState);

  
  
  const comp = data?.company || {};
  const company = {
    name: comp.company_name || "Company Name",
    address: comp.address || "",
    phone: comp.phone || "",
    email: comp.email || "",
    website: comp.website || "",
    gst_no: comp.gst_no || "",
    bank_name: comp.bank_name || "",
    bank_address: comp.bank_address || "",
    acc_no: comp.acc_no || "",
    ifsc: comp.ifsc || "",
  };
  const rawItems = data.items || data.products || [];
  const mappedItems: Item[] = Array.isArray(rawItems)
    ? rawItems.map((item: any) => ({
        product_name: item.product_name || item.name || "Unnamed Product",
        description: item.description || item.item_description || "-",
        quantity: Number(item.quantity || 0),
        unit_price: Number(item.unit_price || 0),
        discount: Number(item.discount || 0),
        tax_rate: Number(item.tax_rate || 0),
        line_total:
          Number(item.line_total) ||
          Number(item.quantity || 0) * Number(item.unit_price || 0),
      }))
    : [];

let subTotal = 0;        // qty * price
let totalDiscount = 0;  // discount amount
let totalCGST = 0;
let totalSGST = 0;
let totalIGST = 0;
let totalTax = 0;

mappedItems.forEach((item) => {
  const qty = item.quantity || 0;
  const price = item.unit_price || 0;
  const discountPercent = item.discount || 0;
  const gstPercent = item.tax_rate || 0;

  const lineAmount = qty * price;
  const discountAmount = (lineAmount * discountPercent) / 100;
  const taxableValue = lineAmount - discountAmount;
  const gstAmount = (taxableValue * gstPercent) / 100;

  subTotal += lineAmount;
  totalDiscount += discountAmount;

  if (isSameState) {
    totalCGST += gstAmount / 2;
    totalSGST += gstAmount / 2;
  } else {
    totalIGST += gstAmount;
  }

  totalTax += gstAmount;
});

const grandTotal = subTotal - totalDiscount + totalTax;

  


// const total = subtotal + taxAmount;

//   const total = subtotal - discount + tax;

//   const customerState: string = cust.state_name || "";
//   console.log(customerState);
//   const isSameState =
//   customerState &&
//   customerState.toLowerCase() === COMPANY_STATE.toLowerCase();


  return (
    <div style={{ fontFamily: "Arial, sans-serif" }}>
      <div style={{ marginBottom: 12, textAlign: "right" }}>
        <Button
          type="primary"
          icon={<PrinterOutlined />}
          onClick={handlePrint}
          style={{ marginRight: 6 }}
        >
          Print
        </Button>
        <Button
          type="default"
          icon={<CloseOutlined />}
          onClick={() => window.close()}
        >
          Close
        </Button>
      </div>

      <div>
        
      </div>
      <div
        ref={printRef}
        style={{
          minHeight: "calc(297mm - 20mm)",
          // border: "3px solid black",
          // padding: "12px",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            borderBottom: "2px solid #000",
            paddingBottom: 4,
            background: "#f0f0f0",
          }}
        >
          <img src={logo} alt="logo" style={{ height: 60, margin: 4 }} />
          <h1 style={{ fontSize: 48, margin: 0 }}>Quotation</h1>
        </div>

        {/* Customer & Quotation Info */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 8,
          }}
        >
          <div style={{ width: "48%" }}>
            <h2>{company.name}</h2>

<div style={{ fontSize: 12, whiteSpace: "pre-line" }}>
  {company.address}
</div>

<div style={{ fontSize: 12, marginTop: 6 }}>
  <div style={{ display: "flex" }}>
    <span style={{ width: 50 }}>Phone</span>
    <span>: {company.phone}</span>
  </div>

  <div style={{ display: "flex" }}>
    <span style={{ width: 50 }}>Email</span>
    <span>: {company.email}</span>
  </div>

  <div style={{ display: "flex" }}>
    <span style={{ width: 50 }}>Website</span>
    <span>: {company.website}</span>
  </div>

  <div style={{ display: "flex" }}>
    <span style={{ width: 50 }}>GSTIN</span>
    <span>: {company.gst_no}</span>
  </div>
</div>

            <h4
              style={{
                marginTop: 16,
                padding: 4,
                border: "1px solid #000",
                background: "#ccc",
              }}
            >
              BILL TO :
            </h4>
            <div style={{ fontSize: 12, marginTop: 4 }}>
             <p style={{ margin: 0, display: "flex" }}>
  <span style={{ width: 90 }}>Customer Name</span>
  <span>: {customer.name}</span>
</p>

<p style={{ margin: 0, display: "flex" }}>
  <span style={{ width: 90 }}>Phone</span>
  <span>: {customer.phone}</span>
</p>

<p style={{ margin: 0, display: "flex" }}>
  <span style={{ width: 90 }}>Email</span>
  <span>: {customer.email}</span>
</p>

<p style={{ margin: 0, display: "flex" }}>
  <span style={{ width: 90 }}>GSTIN</span>
  <span>: {customer.gst_no}</span>
</p>

            </div>
          </div>
         <div style={{ width: "48%", textAlign: "left", paddingLeft: 60 }}>
  <h4>Quotation Info</h4>

  <div style={{ fontSize: 12 }}>
    <div style={{ display: "flex" }}>
      <span style={{ width: 70, fontWeight: 200 }}>No.</span>
      <span>: {data.quotation_no || quotationNo}</span>
    </div>

    <div style={{ display: "flex" }}>
      <span style={{ width: 70, fontWeight: 200 }}>Date</span>
      <span>
        :{" "}
        {data.created_at
          ? dayjs(data.created_at).format("DD-MM-YYYY")
          : "-"}
      </span>
    </div>

    <div style={{ display: "flex" }}>
      <span style={{ width: 70, fontWeight: 200 }}>Validity</span>
      <span>
        :{" "}
        {data.validity_date
          ? dayjs(data.validity_date).format("DD-MM-YYYY")
          : "-"}
      </span>
    </div>

    <div style={{ display: "flex" }}>
      <span style={{ width: 70, fontWeight: 200 }}>Payment</span>
      <span>: {data.payment_terms || "50% Advance"}</span>
    </div>

    <div style={{ display: "flex" }}>
      <span style={{ width: 70, fontWeight: 200 }}>Delivery</span>
      <span>: {data.delivery_terms || "As discussed"}</span>
    </div>
  </div>
</div>

        </div>

        {/* Items Table */}
        <table
          style={{ width: "100%", borderCollapse: "collapse", marginTop: 12 }}
        >
          <thead>
            <tr style={{ background: "#f3f3f3" }}>
              <th style={th}>S.No</th>
              <th style={th}>Product</th>
              <th style={th}>Description</th>
              <th style={th}>Qty</th>
              <th style={th}>Price</th>
              <th style={th}>Disc. %</th>
              <th style={th}>Tax %</th>
              <th style={th}>Total</th>
              <th style={th}>Total(inc. tax)</th>
            </tr>
          </thead>
          <tbody>
  {mappedItems.length ? (
    mappedItems.map((item, i) => {
      const qty = Number(item.quantity || 0);
      const price = Number(item.unit_price || 0);
      const discount = Number(item.discount || 0);
      const taxRate = Number(item.tax_rate || 0);

      const baseAmount = qty * price;
      const discountAmt = (baseAmount * discount) / 100;
      const taxableAmount = baseAmount - discountAmt;
      const taxAmt = (taxableAmount * taxRate) / 100;
      const total = taxableAmount + taxAmt;

      return (
        <tr key={i}>
          <td style={td}>{i + 1}</td>
          <td style={td}>{item.product_name}</td>

          <td style={{ ...td, whiteSpace: "pre-line" }}>
            {item.description}
          </td>

          <td style={td}>{qty}</td>
          <td style={td}>₹ {price.toFixed(0)}</td>
          <td style={td}>{discount}</td>
          <td style={td}>{taxRate}</td>

          {/* 🔥 Amount Before Tax */}
          <td style={td}>₹ {taxableAmount.toFixed(0)}</td>

          {/* 🔥 Final Total */}
          <td style={td}>₹ {total.toFixed(2)}</td>
        </tr>
      );
    })
  ) : (
    <tr>
      <td colSpan={9} style={{ textAlign: "center", padding: 10 }}>
        No products found
      </td>
    </tr>
  )}
</tbody>

        </table>

        {/* Totals */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 12,
          }}
        >
          <div style={{ width: "70%", border: "1px solid #000", padding: 6 }}>
            <h3 style={{ margin: 0 }}>Amount in Words :</h3>
            <p style={{ margin: 0 }}>{numberToWords(grandTotal)}</p>
          </div>
         <div
  style={{
    width: "28%",
    textAlign: "right",
    border: "1px solid #000",
    padding: 6,
  }}
>
  {/* <div>Sub Total: ₹{subTotal.toFixed(2)}</div>
<div>Discount: ₹{totalDiscount.toFixed(2)}</div>

{isSameState ? (
  <>
    <div>CGST: ₹{totalCGST.toFixed(2)}</div>
    <div>SGST: ₹{totalSGST.toFixed(2)}</div>
     <div>IGST: ₹{totalIGST.toFixed(2)}</div>
  </>
) : (
  <div>IGST: ₹{totalIGST.toFixed(2)}</div>
)}

<div>Tax Total: ₹{totalTax.toFixed(2)}</div>

<h3>Grand Total: ₹{grandTotal.toFixed(2)}</h3> */}



 <div>Total Amount: ₹{subTotal.toFixed(2)}</div>
  
  <div>CGST: ₹{isSameState ? totalCGST.toFixed(2) : (0).toFixed(2)}</div>
  <div>SGST: ₹{isSameState ? totalSGST.toFixed(2) : (0).toFixed(2)}</div>
  <div>IGST: ₹{!isSameState ? totalIGST.toFixed(2) : (0).toFixed(2)}</div>
  <div>Tax Total: ₹{totalTax.toFixed(2)}</div>
  <div>Discount: ₹{totalDiscount.toFixed(2)}</div>
  {/* <div>Tax Total: ₹{totalTax.toFixed(2)}</div> */}
  <h4>Grand Total: ₹{grandTotal.toFixed(2)}</h4>

</div>
</div>



        {/* Terms */}
        <div style={{ marginTop: 8 }}>
          <h4
            style={{
              margin: 0,
              padding: 4,
              border: "1px solid #000",
              background: "#ccc",
            }}
          >
            Terms & conditions :
          </h4>
          <div style={{ padding: "6px 8px" }}>
    {(data.terms_conditions || "")
      .split("\n")
      .map((line, index) => {
        const parts = line.split(":");
        return (
          <div
            key={index}
            style={{
              display: "flex",
              lineHeight: "17px",
            }}
          >
            {/* Number */}
            {/* <span style={{ width: 18 }}>{index + 1}.</span> */}

            {/* Label */}
            <span style={{ width: 135 }}>{parts[0]}</span>

            {/* Colon + Value */}
            <span>: {parts.slice(1).join(":")}</span>
          </div>
        );
      })}
  </div> 
        </div>
        {/* Footer */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 2,
          }}
        >
         <div>
  {/* <h4>Member Details</h4> */}
  <br />
  <div
    style={{
      whiteSpace: "pre-line",
      fontSize: 12,
      lineHeight: 1.5,
    }}
  >
    {data.member_details || "—"}
  </div>
</div>
         <div style={{ textAlign: "left" }}>
  <h4>Bank Details</h4>

  <div style={{ fontSize: 12 }}>
    <div style={{ display: "flex" }}>
      <span style={{ width: 90, fontWeight: 200 }}>Bank</span>
      <span>: {company.bank_name || "-"}</span>
    </div>

    <div style={{ display: "flex" }}>
      <span style={{ width: 90, fontWeight: 200 }}>Account No</span>
      <span>: {company.acc_no || "-"}</span>
    </div>

    <div style={{ display: "flex" }}>
      <span style={{ width: 90, fontWeight: 200 }}>IFSC</span>
      <span>: {company.ifsc || "-"}</span>
    </div>
  </div>
</div>

        </div>

        <p className="print-footer"
          style={{
            textAlign: "right",
            // marginTop: 40,
            border: "1px solid #000",
            background: "#ccc",
            padding: 4,
          }}
        >
          <b>Thank You For Your Business!</b>
        </p>
      </div>
    </div>
  );
}