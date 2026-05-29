// import React, { useEffect, useState } from "react";
// import { Table, Button, Modal, Form, Select, message, Space, Input } from "antd";
// import axios from "axios";
// import dayjs from "dayjs";
// import QuotationPreview from "./QuotationPreview";
// import { EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";

// const { Option } = Select;
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const QuotationsApproval: React.FC = () => {
//   const [quotations, setQuotations] = useState<any[]>([]);
//   const [filteredQuotations, setFilteredQuotations] = useState<any[]>([]); // for search
//   const [approvals, setApprovals] = useState<any[]>([]);
//   const [users, setUsers] = useState<any[]>([]);
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [previewVisible, setPreviewVisible] = useState(false);
//   const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
//   const [form] = Form.useForm();
//   const [actionType, setActionType] = useState<"approved" | "rejected">("approved");
//   const [searchText, setSearchText] = useState("");

//   // Fetch all data
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [qRes, aRes, uRes, cRes, pRes] = await Promise.all([
//         axios.get(`${BASE_URL}/quotations`),
//         axios.get(`${BASE_URL}/quotation-approvals`),
//         axios.get(`${BASE_URL}/users`),
//         axios.get(`${BASE_URL}/customers`),
//         axios.get(`${BASE_URL}/products`),
//       ]);

//       const qData = Array.isArray(qRes.data) ? qRes.data : [];
//       setQuotations(qData);
//       setFilteredQuotations(qData); // initially show all
//       setApprovals(Array.isArray(aRes.data) ? aRes.data : []);
//       setUsers(Array.isArray(uRes.data) ? uRes.data : []);
//       setCustomers(Array.isArray(cRes.data) ? cRes.data : []);
//       setProducts(Array.isArray(pRes.data) ? pRes.data : []);
//     } catch (err) {
//       console.error(err);
//       message.error("Failed to fetch data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const getApproval = (quotationId: number) => {
//     return approvals.find(a => a.quotation_id === quotationId) || {};
//   };

//   const openModal = (quotation: any, type: "approved" | "rejected") => {
//     setSelectedQuotation(quotation);
//     setActionType(type);
//     const existingApproval = approvals.find(a => a.quotation_id === quotation.id);
//     form.setFieldsValue({
//       approver_id: existingApproval?.approver_id || undefined,
//       comments: existingApproval?.comments || "",
//     });
//     setIsModalVisible(true);
//   };

//   const handleSave = async () => {
//     try {
//       const values = await form.validateFields();
//       const payload = {
//         quotation_id: selectedQuotation.id,
//         approver_id: values.approver_id,
//         status: actionType,
//         comments: values.comments || null,
//       };

//       const existingApproval = approvals.find(a => a.quotation_id === selectedQuotation.id);
//       if (existingApproval) {
//         await axios.put(`${BASE_URL}/quotation-approvals/${existingApproval.id}`, payload);
//       } else {
//         await axios.post(`${BASE_URL}/quotation-approvals`, payload);
//       }

//       message.success(`Quotation ${actionType} successfully!`);
//       setIsModalVisible(false);
//       fetchData();
//     } catch (err) {
//       console.error(err);
//       message.error("Failed to save approval");
//     }
//   };

//   const handlePreview = async (quotation: any) => {
//     try {
//       const { data } = await axios.get(`${BASE_URL}/quotations/${quotation.id}`);
//       const productsMapped = (data.products ?? []).map((item: any) => {
//         const product = products.find(p => p.id === item.product_id);
//         return {
//           ...item,
//           product_name: product?.name || "Unnamed Product",
//           description: item.description || product?.description || "",
//           unit_price: item.unit_price || product?.price || 0,
//         };
//       });
//       const customer = customers.find(c => c.id === data.customer_id) || {};

//       setSelectedQuotation({
//         ...data,
//         products: productsMapped,
//         customer,
//         terms_conditions: data.terms_conditions || "",
//       });
//       setPreviewVisible(true);
//     } catch (err) {
//       console.error("Failed to load quotation preview:", err);
//       message.error("Unable to load quotation preview");
//     }
//   };

//   // --- Search handler ---
//   const handleSearch = (value: string) => {
//     setSearchText(value);
//     const filtered = quotations.filter(
//       (q) =>
//         q.quotation_no?.toLowerCase().includes(value.toLowerCase()) ||
//         (customers.find(c => c.id === q.customer_id)?.name || "").toLowerCase().includes(value.toLowerCase())
//     );
//     setFilteredQuotations(filtered);
//   };

//   const columns = [
//     { title: "S.No", render: (_: any, __: any, i: number) => i + 1, width: 60 },
//     { title: "Quotation No", dataIndex: "quotation_no", key: "quotation_no" },
//     {
//       title: "Customer Name",
//       key: "customer_name",
//       render: (_: any, record: any) => customers.find(c => c.id === record.customer_id)?.name || "-"
//     },
//     { title: "Created At", dataIndex: "created_at", key: "created_at",
//       render: (v: string) => v ? dayjs(v).format("DD-MM-YYYY") : "-" },
//     { title: "Net Amount (₹)", dataIndex: "net_amount", key: "net_amount",
//       align: "right" as const,
//       render: (v: number) => v.toLocaleString("en-IN", { minimumFractionDigits: 2 }) },
//     { title: "Approver Name", key: "approver_name",
//       render: (_: any, record: any) => getApproval(record.id).approver_name || "-" },
//     { title: "Status", key: "status",
//       render: (_: any, record: any) => {
//         const status = getApproval(record.id).status || "pending";
//         return <span style={{ color: status==="approved"?"green":status==="rejected"?"red":"orange", fontWeight: 500, textTransform:"capitalize" }}>{status}</span>;
//       }
//     },
//     { title: "Approved Date", key: "approved_at",
//       render: (_: any, record: any) => {
//         const date = getApproval(record.id).approved_at;
//         return date ? dayjs(date).format("DD-MM-YYYY") : "-";
//       }
//     },
//     { title: "Actions", key: "actions",
//       render: (_: any, record: any) => {
//         const status = getApproval(record.id).status || "pending";
//         return (
//           <Space>
//             <Button icon={<EyeOutlined />} type="default" onClick={() => handlePreview(record)} />
//             <Button icon={<CheckOutlined />} type="primary" disabled={status === "approved"} onClick={() => openModal(record, "approved")} />
//             <Button icon={<CloseOutlined />} type="default" danger disabled={status === "rejected"} onClick={() => openModal(record, "rejected")} />
//           </Space>
//         );
//       }
//     }
//   ];

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Quotations Approval</h2>

//       <div className="flex justify-end mb-4">
//   <Input.Search
//     placeholder="Search by quotation no or customer name"
//     allowClear
//     value={searchText}
//     onChange={(e) => handleSearch(e.target.value)}
//     style={{ width: 300 }}
//   />
// </div>


//       <Table
//         dataSource={filteredQuotations}
//         columns={columns}
//         rowKey="id"
//         loading={loading}
//         bordered
//         pagination={{ pageSize: 10 }}
//       />

//       {/* Approve / Reject Modal */}
//       <Modal
//         title={actionType === "approved" ? "Approve Quotation" : "Reject Quotation"}
//         open={isModalVisible}
//         onCancel={()=>setIsModalVisible(false)}
//         onOk={handleSave}
//         okText="Save"
//         destroyOnClose
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item name="approver_id" label="Select Approver" rules={[{ required: true, message: "Select an approver" }]}>
//             <Select placeholder="Select Approver">
//               {users.map(u => <Option key={u.id} value={u.id}>{u.name}</Option>)}
//             </Select>
//           </Form.Item>
//           <Form.Item name="comments" label="Comments">
//             <Input placeholder="Enter comments (optional)" />
//           </Form.Item>
//         </Form>
//       </Modal>

//       {/* Preview Quotation Modal */}
//       {previewVisible && selectedQuotation && (
//         <QuotationPreview
//           visible={previewVisible}
//           onClose={() => setPreviewVisible(false)}
//           previewData={selectedQuotation}
//         />
//       )}
//     </div>
//   );
// };

// export default QuotationsApproval;





// import React, { useEffect, useState } from "react";
// import { Table, Button, Modal, Form, Select, message, Space, Input } from "antd";
// import axios from "axios";
// import dayjs from "dayjs";
// import QuotationPreview from "./QuotationPreview";
// import { EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";

// const { Option } = Select;
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

// const QuotationsApproval: React.FC = () => {
//   const [quotations, setQuotations] = useState<any[]>([]);
//   const [filteredQuotations, setFilteredQuotations] = useState<any[]>([]); // for search
//   const [approvals, setApprovals] = useState<any[]>([]);
//   const [users, setUsers] = useState<any[]>([]);
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [products, setProducts] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [previewVisible, setPreviewVisible] = useState(false);
//   const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
//   const [form] = Form.useForm();
//   const [actionType, setActionType] = useState<"approved" | "rejected">("approved");
//   const [searchText, setSearchText] = useState("");

//   // Fetch all data
//   const fetchData = async () => {
//     try {
//       setLoading(true);
//       const [qRes, aRes, uRes, cRes, pRes] = await Promise.all([
//         axios.get(`${BASE_URL}/quotations`),
//         axios.get(`${BASE_URL}/quotation-approvals`),
//         axios.get(`${BASE_URL}/users`),
//         axios.get(`${BASE_URL}/customers`),
//         axios.get(`${BASE_URL}/products`),
//       ]);

//       const qData = Array.isArray(qRes.data) ? qRes.data : [];
//       setQuotations(qData);
//       setFilteredQuotations(qData); // initially show all
//       setApprovals(Array.isArray(aRes.data) ? aRes.data : []);
//       setUsers(Array.isArray(uRes.data) ? uRes.data : []);
//       setCustomers(Array.isArray(cRes.data) ? cRes.data : []);
//       setProducts(Array.isArray(pRes.data) ? pRes.data : []);
//     } catch (err) {
//       console.error(err);
//       message.error("Failed to fetch data");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const getApproval = (quotationId: number) => {
//     return approvals.find(a => a.quotation_id === quotationId) || {};
//   };

//   const openModal = (quotation: any, type: "approved" | "rejected") => {
//     setSelectedQuotation(quotation);
//     setActionType(type);
//     const existingApproval = approvals.find(a => a.quotation_id === quotation.id);
//    form.setFieldsValue({
//   approver_id:
//     existingApproval?.approver_id || loggedInUser.id,
//   comments: existingApproval?.comments || "",
// });

//     setIsModalVisible(true);
//   };

//   const handleSave = async () => {
//     try {
//       const values = await form.validateFields();
//       const payload = {
//         quotation_id: selectedQuotation.id,
//         approver_id: values.approver_id,
//         status: actionType,
//         comments: values.comments || null,
//       };

//       const existingApproval = approvals.find(a => a.quotation_id === selectedQuotation.id);
//       if (existingApproval) {
//         await axios.put(`${BASE_URL}/quotation-approvals/${existingApproval.id}`, payload);
//       } else {
//         await axios.post(`${BASE_URL}/quotation-approvals`, payload);
//       }

//       message.success(`Quotation ${actionType} successfully!`);
//       setIsModalVisible(false);
//       fetchData();
//     } catch (err) {
//       console.error(err);
//       message.error("Failed to save approval");
//     }
//   };

//   const handlePreview = async (quotation: any) => {
//     try {
//       const { data } = await axios.get(`${BASE_URL}/quotations/${quotation.id}`);
//       const productsMapped = (data.products ?? []).map((item: any) => {
//         const product = products.find(p => p.id === item.product_id);
//         return {
//           ...item,
//           product_name: product?.name || "Unnamed Product",
//           description: item.description || product?.description || "",
//           unit_price: item.unit_price || product?.price || 0,
//         };
//       });
//       const customer = customers.find(c => c.id === data.customer_id) || {};

//       setSelectedQuotation({
//         ...data,
//         products: productsMapped,
//         customer,
//         terms_conditions: data.terms_conditions || "",
//       });
//       setPreviewVisible(true);
//     } catch (err) {
//       console.error("Failed to load quotation preview:", err);
//       message.error("Unable to load quotation preview");
//     }
//   };

//   // --- Search handler ---
//   const handleSearch = (value: string) => {
//     setSearchText(value);
//     const filtered = quotations.filter(
//       (q) =>
//         q.quotation_no?.toLowerCase().includes(value.toLowerCase()) ||
//         (customers.find(c => c.id === q.customer_id)?.name || "").toLowerCase().includes(value.toLowerCase())
//     );
//     setFilteredQuotations(filtered);
//   };

//   const columns = [
//     { title: "S.No", render: (_: any, __: any, i: number) => i + 1, width: 60 },
//     { title: "Quotation No", dataIndex: "quotation_no", key: "quotation_no" },
//     {
//       title: "Customer Name",
//       key: "customer_name",
//       render: (_: any, record: any) => customers.find(c => c.id === record.customer_id)?.name || "-"
//     },
//     { title: "Created At", dataIndex: "created_at", key: "created_at",
//       render: (v: string) => v ? dayjs(v).format("DD-MM-YYYY") : "-" },
//     { title: "Net Amount (₹)", dataIndex: "net_amount", key: "net_amount",
//       align: "right" as const,
//       render: (v: number) => v.toLocaleString("en-IN", { minimumFractionDigits: 2 }) },
//     { title: "Approver Name", key: "approver_name",
//       render: (_: any, record: any) => getApproval(record.id).approver_name || "-" },
//     { title: "Status", key: "status",
//       render: (_: any, record: any) => {
//         const status = getApproval(record.id).status || "pending";
//         return <span style={{ color: status==="approved"?"green":status==="rejected"?"red":"orange", fontWeight: 500, textTransform:"capitalize" }}>{status}</span>;
//       }
//     },
//     { title: "Approved Date", key: "approved_at",
//       render: (_: any, record: any) => {
//         const date = getApproval(record.id).approved_at;
//         return date ? dayjs(date).format("DD-MM-YYYY") : "-";
//       }
//     },
//     { title: "Actions", key: "actions",
//       render: (_: any, record: any) => {
//         const status = getApproval(record.id).status || "pending";
//         return (
//           <Space>
//             <Button icon={<EyeOutlined />} type="default" onClick={() => handlePreview(record)} />
//             <Button icon={<CheckOutlined />} type="primary" disabled={status === "approved"} onClick={() => openModal(record, "approved")} />
//             <Button icon={<CloseOutlined />} type="default" danger disabled={status === "rejected"} onClick={() => openModal(record, "rejected")} />
//           </Space>
//         );
//       }
//     }
//   ];

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Quotations Approval</h2>

//       <div className="flex justify-end mb-4">
//   <Input.Search
//     placeholder="Search by quotation no or customer name"
//     allowClear
//     value={searchText}
//     onChange={(e) => handleSearch(e.target.value)}
//     style={{ width: 300 }}
//   />
// </div>


//       <Table
//         dataSource={filteredQuotations}
//         columns={columns}
//         rowKey="id"
//         loading={loading}
//         bordered
//         pagination={{ pageSize: 10 }}
//       />

//       {/* Approve / Reject Modal */}
//       <Modal
//         title={actionType === "approved" ? "Approve Quotation" : "Reject Quotation"}
//         open={isModalVisible}
//         onCancel={()=>setIsModalVisible(false)}
//         onOk={handleSave}
//         okText="Save"
//         destroyOnClose
//       >
//        {/* <Form form={form} layout="vertical">
//   <Form.Item
//     name="approver_id"
//     label="Select Approver"
//     rules={[{ required: true, message: "Select an approver" }]}
//   >
//     <Select placeholder="Select Approver">
//       {users.map((u) => (
//         <Option key={u.id} value={u.id}>
//           {u.name}
//         </Option>
//       ))}
//     </Select>
//   </Form.Item>

//   <Form.Item name="comments" label="Comments">
//     <Input placeholder="Enter comments (optional)" />
//   </Form.Item>
// </Form> */}

// <Form form={form} layout="vertical">
//   <Form.Item
//     name="approver_id"
//     label="Approver"
//     rules={[{ required: true }]}
//   >
//     <Select disabled>
//       <Select.Option value={loggedInUser.id}>
//         {loggedInUser.name}
//       </Select.Option>
//     </Select>
//   </Form.Item>

//   <Form.Item name="comments" label="Comments">
//     <Input placeholder="Enter comments (optional)" />
//   </Form.Item>
// </Form>



//       </Modal>

//       {/* Preview Quotation Modal */}
//       {previewVisible && selectedQuotation && (
//         <QuotationPreview
//           visible={previewVisible}
//           onClose={() => setPreviewVisible(false)}
//           previewData={selectedQuotation}
//         />
//       )}
//     </div>
//   );
// };

// export default QuotationsApproval;


import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Select, message, Space, Input } from "antd";
import axios from "axios";
import dayjs from "dayjs";
import QuotationPreview from "./QuotationPreview";
import { EyeOutlined, CheckOutlined, CloseOutlined } from "@ant-design/icons";

// const { Option } = Select;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const loggedInUser = JSON.parse(localStorage.getItem("user") || "{}");

const QuotationsApproval: React.FC = () => {
  const [quotations, setQuotations] = useState<any[]>([]);
  const [filteredQuotations, setFilteredQuotations] = useState<any[]>([]); // for search
  const [approvals, setApprovals] = useState<any[]>([]);
  const [_users, setUsers] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);
  const [form] = Form.useForm();
  const [actionType, setActionType] = useState<"approved" | "rejected">("approved");
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);


  // Fetch all data
  const fetchData = async () => {
    try {
      setLoading(true);
      const [qRes, aRes, uRes, cRes, pRes] = await Promise.all([
        axios.get(`${BASE_URL}/quotations`),
        axios.get(`${BASE_URL}/quotation-approvals`),
        axios.get(`${BASE_URL}/users`),
        axios.get(`${BASE_URL}/customers`),
        axios.get(`${BASE_URL}/products`),
      ]);

      const qData = Array.isArray(qRes.data) ? qRes.data : [];
      setQuotations(qData);
      setFilteredQuotations(qData); // initially show all
      setApprovals(Array.isArray(aRes.data) ? aRes.data : []);
      setUsers(Array.isArray(uRes.data) ? uRes.data : []);
      setCustomers(Array.isArray(cRes.data) ? cRes.data : []);
      setProducts(Array.isArray(pRes.data) ? pRes.data : []);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getApproval = (quotationId: number) => {
    return approvals.find(a => a.quotation_id === quotationId) || {};
  };

  const openModal = (quotation: any, type: "approved" | "rejected") => {
    setSelectedQuotation(quotation);
    setActionType(type);
    const existingApproval = approvals.find(a => a.quotation_id === quotation.id);
   form.setFieldsValue({
  approver_id:
    existingApproval?.approver_id || loggedInUser.id,
  comments: existingApproval?.comments || "",
});

    setIsModalVisible(true);
  };

  // const handleSave = async () => {
  //   try {
  //     const values = await form.validateFields();
  //     const payload = {
  //       quotation_id: selectedQuotation.id,
  //       approver_id: values.approver_id,
  //       status: actionType,
  //       comments: values.comments || null,
  //     };

  //     const existingApproval = approvals.find(a => a.quotation_id === selectedQuotation.id);
  //     if (existingApproval) {
  //       await axios.put(`${BASE_URL}/quotation-approvals/${existingApproval.id}`, payload);
  //     } else {
  //       await axios.post(`${BASE_URL}/quotation-approvals`, payload);
  //     }

  //     message.success(`Quotation ${actionType} successfully!`);
  //     setIsModalVisible(false);
  //     fetchData();
  //   } catch (err) {
  //     console.error(err);
  //     message.error("Failed to save approval");
  //   }
  // };

  // --- inside handleSave ---
const handleSave = async () => {
  try {
    const values = await form.validateFields();
    const payload = {
      quotation_id: selectedQuotation.id,
      approver_id: values.approver_id,
      status: actionType,
      comments: values.comments || null,
    };

    const existingApproval = approvals.find(a => a.quotation_id === selectedQuotation.id);
    if (existingApproval) {
      await axios.put(`${BASE_URL}/quotation-approvals/${existingApproval.id}`, payload);
    } else {
      await axios.post(`${BASE_URL}/quotation-approvals`, payload);
    }

    message.success(`Quotation ${actionType} successfully!`);
    setIsModalVisible(false);

    // ✅ Refresh current approval list
    await fetchData();

    // ✅ Trigger refresh in NewQuotation list
    // Assuming you have a global event emitter or simple window-level trigger
    // If not, we can use a custom hook or state in parent
    const event = new CustomEvent("quotationUpdated");
    window.dispatchEvent(event);

  } catch (err) {
    console.error(err);
    message.error("Failed to save approval");
  }
};


  // const handlePreview = async (quotation: any) => {
  //   try {
  //     const { data } = await axios.get(`${BASE_URL}/quotations/${quotation.id}`);
  //     const productsMapped = (data.products ?? []).map((item: any) => {
  //       const product = products.find(p => p.id === item.product_id);
  //       return {
  //         ...item,
  //         product_name: product?.name || "Unnamed Product",
  //         description: item.description || product?.description || "",
  //         unit_price: item.unit_price || product?.price || 0,
  //       };
  //     });
  //     const customer = customers.find(c => c.id === data.customer_id) || {};

  //     setSelectedQuotation({
  //       ...data,
  //       products: productsMapped,
  //       customer,
  //       terms_conditions: data.terms_conditions || "",
  //     });
  //     setPreviewVisible(true);
  //   } catch (err) {
  //     console.error("Failed to load quotation preview:", err);
  //     message.error("Unable to load quotation preview");
  //   }
  // };

  // --- Search handler ---
  const handleSearch = (value: string) => {
    setSearchText(value);
    setCurrentPage(1);
    const filtered = quotations.filter(
      (q) =>
        q.quotation_no?.toLowerCase().includes(value.toLowerCase()) ||
        (customers.find(c => c.id === q.customer_id)?.name || "").toLowerCase().includes(value.toLowerCase())
    );
    setFilteredQuotations(filtered);
  };

  const columns = [
    {
  title: "S.No",
  width: 60,
  render: (_: any, __: any, index: number) =>
    (currentPage - 1) * pageSize + index + 1,
},

    { title: "Quotation No", dataIndex: "quotation_no", key: "quotation_no" },
    {
      title: "Customer Name",
      key: "customer_name",
      render: (_: any, record: any) => customers.find(c => c.id === record.customer_id)?.name || "-"
    },
    {
  title: "Deal Handled By",
  dataIndex: "deal_handled_by_name",
  render: (val: any) => val || "-"
},
    { title: "Created At", dataIndex: "created_at", key: "created_at",
      render: (v: string) => v ? dayjs(v).format("DD-MM-YYYY") : "-" },
    { title: "Net Amount (₹)", dataIndex: "net_amount", key: "net_amount",
      align: "right" as const,
      render: (v: number) => v.toLocaleString("en-IN", { minimumFractionDigits: 2 }) },
    { title: "Approver Name", key: "approver_name",
      render: (_: any, record: any) => getApproval(record.id).approver_name || "-" },
    { title: "Status", key: "status",
      render: (_: any, record: any) => {
        const status = getApproval(record.id).status || "pending";
        return <span style={{ color: status==="approved"?"green":status==="rejected"?"red":"orange", fontWeight: 500, textTransform:"capitalize" }}>{status}</span>;
      }
    },
    { title: "Approved Date", key: "approved_at",
      render: (_: any, record: any) => {
        const date = getApproval(record.id).approved_at;
        return date ? dayjs(date).format("DD-MM-YYYY") : "-";
      }
    },
    { title: "Actions", key: "actions",
      render: (_: any, record: any) => {
        const status = getApproval(record.id).status || "pending";
          const link = `${window.location.origin}/printpage?id=${record.id}&autoPrint=true`;
        return (
          <Space>
            <Button icon={<EyeOutlined />} type="default" onClick={() => window.open(link, "_blank")} />
            <Button icon={<CheckOutlined />} type="primary" disabled={status === "approved"} onClick={() => openModal(record, "approved")} />
            <Button icon={<CloseOutlined />} type="default" danger disabled={status === "rejected"} onClick={() => openModal(record, "rejected")} />
          </Space>
        );
      }
    }
  ];


  return (
    <div style={{ padding: 20 }}>
      <h2>Quotations Approval</h2>

      <div className="flex justify-end mb-4">
  <Input.Search
    placeholder="Search by quotation no or customer name"
    allowClear
    value={searchText}
    onChange={(e) => handleSearch(e.target.value)}
    style={{ width: 300 }}
  />
</div>


      <Table
  dataSource={filteredQuotations}
  columns={columns}
  rowKey="id"
  loading={loading}
  bordered
  pagination={{
    current: currentPage,
    pageSize: pageSize,
    onChange: (page, size) => {
      setCurrentPage(page);
      setPageSize(size);
    },
  }}
/>


      {/* Approve / Reject Modal */}
      <Modal
        title={actionType === "approved" ? "Approve Quotation" : "Reject Quotation"}
        open={isModalVisible}
        onCancel={()=>setIsModalVisible(false)}
        onOk={handleSave}
        okText="Save"
        destroyOnClose
      >
       {/* <Form form={form} layout="vertical">
  <Form.Item
    name="approver_id"
    label="Select Approver"
    rules={[{ required: true, message: "Select an approver" }]}
  >
    <Select placeholder="Select Approver">
      {users.map((u) => (
        <Option key={u.id} value={u.id}>
          {u.name}
        </Option>
      ))}
    </Select>
  </Form.Item>

  <Form.Item name="comments" label="Comments">
    <Input placeholder="Enter comments (optional)" />
  </Form.Item>
</Form> */}

<Form form={form} layout="vertical">
  <Form.Item
    name="approver_id"
    label="Approver"
    rules={[{ required: true }]}
  >
    <Select disabled>
      <Select.Option value={loggedInUser.id}>
        {loggedInUser.name}
      </Select.Option>
    </Select>
  </Form.Item>

  <Form.Item name="comments" label="Comments">
    <Input placeholder="Enter comments (optional)" />
  </Form.Item>
</Form>



      </Modal>

      {/* Preview Quotation Modal */}
      {previewVisible && selectedQuotation && (
        <QuotationPreview
          visible={previewVisible}
          onClose={() => setPreviewVisible(false)}
          previewData={selectedQuotation}
        />
      )}
    </div>
  );
};

export default QuotationsApproval;

