// import { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Modal,
//   Form,
//   Input,
//   DatePicker,
//   Select,
//   message,
//   Popconfirm,
// } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import axios from "axios";
// import dayjs from "dayjs";

// const { Option } = Select;
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const issueAPI = axios.create({
//   baseURL: `${BASE_URL}/product-issue`,
// });

// const ProductIssue = () => {
//   const [data, setData] = useState<any[]>([]);
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [open, setOpen] = useState(false);
//   const [editId, setEditId] = useState<number | null>(null);
//   const [form] = Form.useForm();

//   const fetchIssues = async () => {
//     const res = await issueAPI.get("/");
//     setData(res.data);
//   };

//   const fetchCustomers = async () => {
//     const res = await axios.get(`${BASE_URL}/customers`);
//     setCustomers(res.data);
//   };

//   useEffect(() => {
//     fetchIssues();
//     fetchCustomers();
//   }, []);

//   const handleSave = async (values: any) => {
//     values.issue_date = values.issue_date?.format("YYYY-MM-DD");

//     if (editId) {
//       await issueAPI.put(`/${editId}`, values);
//       message.success("Issue updated");
//     } else {
//       await issueAPI.post("/", values);
//       message.success("Issue created");
//     }

//     fetchIssues();
//     setOpen(false);
//     form.resetFields();
//     setEditId(null);
//   };

//   const handleEdit = (record: any) => {
//     setEditId(record.issue_no);
//     form.setFieldsValue({
//       ...record,
//       issue_date: record.issue_date ? dayjs(record.issue_date) : null,
//     });
//     setOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     await issueAPI.delete(`/${id}`);
//     message.success("Issue deleted");
//     fetchIssues();
//   };

//   const columns = [
//     { title: "SNo", render: (_: any, __: any, i: number) => i + 1 },
//     { title: "Issue No", dataIndex: "issue_no" },
//     { title: "Order No", dataIndex: "order_no" },
//     { title: "Bill/Invoice No", dataIndex: "bill_no_invoice_no" },
//     { title: "Customer", dataIndex: "customer_name" },
//     {
//       title: "Issue Date",
//       dataIndex: "issue_date",
//       render: (v: string) => (v ? dayjs(v).format("YYYY/MM/DD") : "-"),
//     },
//     { title: "Issue Type", dataIndex: "issue_type" },
//     { title: "Issue By", dataIndex: "issue_by" },
//     {
//       title: "Actions",
//       render: (_: any, r: any) => (
//         <>
//           <Button icon={<EditOutlined />} onClick={() => handleEdit(r)} />
//           <Popconfirm
//             title="Delete?"
//             onConfirm={() => handleDelete(r.issue_no)}
//           >
//             <Button icon={<DeleteOutlined />} danger />
//           </Popconfirm>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6">
//       <div className="flex justify-between mb-4">
//         <h2 className="text-xl font-semibold">Product Issue</h2>
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={() => setOpen(true)}
//         >
//           Add Issue
//         </Button>
//       </div>

//       <Table rowKey="issue_no" bordered dataSource={data} columns={columns} />

//       <Modal
//         open={open}
//         title={editId ? "Edit Issue" : "Add Issue"}
//         onCancel={() => setOpen(false)}
//         footer={null}
//         width={800}
//       >
//         <Form layout="vertical" form={form} onFinish={handleSave}>
//           <Form.Item name="order_no" label="Order No">
//             <Input />
//           </Form.Item>

//           <Form.Item name="bill_no_invoice_no" label="Bill / Invoice No">
//             <Input />
//           </Form.Item>

//          <Form.Item
//   name="customer_id"
//   label="Customer"
//   rules={[{ required: true, message: "Select customer" }]}
// >
//   <Select
//     showSearch
//     placeholder="Select customer"
//     optionFilterProp="children"
//     filterOption={(input, option) =>
//       option?.children
//         ?.toLowerCase()
//         .includes(input.toLowerCase())
//     }
//   >
//     {customers.map((c) => (
//       <Option key={c.customer_id} value={c.customer_id}>
//         {c.name}
//       </Option>
//     ))}
//   </Select>
// </Form.Item>

//           <Form.Item name="issue_date" label="Issue Date">
//             <DatePicker format="YYYY/MM/DD" className="w-full" />
//           </Form.Item>

//           <Form.Item name="issue_type" label="Issue Type">
//             <Input />
//           </Form.Item>

//           <Form.Item name="issue_by" label="Issue By">
//             <Input />
//           </Form.Item>

//           <Form.Item name="remarks" label="Remarks">
//             <Input.TextArea rows={2} />
//           </Form.Item>

//           <div className="flex justify-end gap-2">
//             <Button onClick={() => setOpen(false)}>Cancel</Button>
//             <Button type="primary" htmlType="submit">
//               Save
//             </Button>
//           </div>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default ProductIssue;

// import { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Modal,
//   Form,
//   Input,
//   DatePicker,
//   Select,
//   message,
//   Popconfirm,
// } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import axios from "axios";
// import dayjs from "dayjs";

// const { Option } = Select;
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const issueAPI = axios.create({
//   baseURL: `${BASE_URL}/product-issue`,
// });

// const ProductIssue = () => {
//   const [data, setData] = useState([]);
//   const [customers, setCustomers] = useState([]);
//   const [open, setOpen] = useState(false);
//   const [editId, setEditId] = useState(null);
//   const [form] = Form.useForm();

//   const fetchIssues = async () => {
//     const res = await issueAPI.get("/");
//     setData(res.data);
//   };

//   const fetchCustomers = async () => {
//     const res = await axios.get(`${BASE_URL}/customers`);
//     setCustomers(res.data);
//   };

//   useEffect(() => {
//     fetchIssues();
//     fetchCustomers();
//   }, []);

//   const handleSave = async (values) => {
//     values.issue_date = values.issue_date?.format("YYYY-MM-DD");

//     if (editId) {
//       await issueAPI.put(`/${editId}`, values);
//       message.success("Issue updated");
//     } else {
//       await issueAPI.post("/", values);
//       message.success("Issue created");
//     }

//     setOpen(false);
//     form.resetFields();
//     setEditId(null);
//     fetchIssues();
//   };

//   const handleEdit = (record) => {
//     setEditId(record.issue_no);
//     form.setFieldsValue({
//       ...record,
//       issue_date: record.issue_date ? dayjs(record.issue_date) : null,
//     });
//     setOpen(true);
//   };

//   const columns = [
//     { title: "SNo", render: (_, __, i) => i + 1 },
//     { title: "Issue No", dataIndex: "issue_no" },
//     { title: "Order No", dataIndex: "order_no" },
//     { title: "Invoice No", dataIndex: "bill_no_invoice_no" },
//     { title: "Customer", dataIndex: "customer_name" },
//     {
//       title: "Issue Date",
//       dataIndex: "issue_date",
//       render: (v) => (v ? dayjs(v).format("YYYY/MM/DD") : "-"),
//     },
//     { title: "Issue Type", dataIndex: "issue_type" },
//     { title: "Issue By", dataIndex: "issue_by" },
//     {
//       title: "Actions",
//       render: (_, r) => (
//         <>
//           <Button icon={<EditOutlined />} onClick={() => handleEdit(r)} />
//           <Popconfirm
//             title="Delete?"
//             onConfirm={() => issueAPI.delete(`/${r.issue_no}`).then(fetchIssues)}
//           >
//             <Button icon={<DeleteOutlined />} danger />
//           </Popconfirm>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6">
//       <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
//         Add Issue
//       </Button>

//       <Table rowKey="issue_no" columns={columns} dataSource={data} bordered />

//       <Modal
//         open={open}
//         title={editId ? "Edit Issue" : "Add Issue"}
//         footer={null}
//         onCancel={() => setOpen(false)}
//       >
//         <Form layout="vertical" form={form} onFinish={handleSave}>
//           <Form.Item name="order_no" label="Order No">
//             <Input />
//           </Form.Item>

//           <Form.Item name="bill_no_invoice_no" label="Invoice No">
//             <Input />
//           </Form.Item>

//           <Form.Item
//             name="customer_id"
//             label="Customer"
//             rules={[{ required: true }]}
//           >
//             <Select showSearch placeholder="Select customer">
//               {customers.map((c) => (
//                 <Option key={c.id} value={c.id}>
//                   {c.name}
//                 </Option>
//               ))}
//             </Select>
//           </Form.Item>

//           <Form.Item name="issue_date" label="Issue Date">
//             <DatePicker className="w-full" format="YYYY/MM/DD" />
//           </Form.Item>

//           <Form.Item name="issue_type" label="Issue Type">
//             <Input />
//           </Form.Item>

//           <Form.Item name="issue_by" label="Issue By">
//             <Input />
//           </Form.Item>

//           <Form.Item name="remarks" label="Remarks">
//             <Input.TextArea />
//           </Form.Item>

//           <Button type="primary" htmlType="submit">
//             Save
//           </Button>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default ProductIssue;

// import { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Form,
//   Input,
//   DatePicker,
//   Select,
//   message,
//   Popconfirm,
//   Card,
//   Row,
//   Col,
// } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import axios from "axios";
// import dayjs from "dayjs";

// const { Option } = Select;
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const issueAPI = axios.create({
//   baseURL: `${BASE_URL}/product-issue`,
// });

// const ProductIssue = () => {
//   const [data, setData] = useState<any[]>([]);
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState<number | null>(null);
//   const [form] = Form.useForm();

//   // ================= FETCH =================
//   const fetchIssues = async () => {
//     const res = await issueAPI.get("/");
//     setData(res.data || []);
//   };

//   const fetchCustomers = async () => {
//     const res = await axios.get(`${BASE_URL}/customers`);
//     setCustomers(res.data || []);
//   };

//   useEffect(() => {
//     fetchIssues();
//     fetchCustomers();
//   }, []);

//   // ================= SAVE =================
//   const handleSave = async (values: any) => {
//     try {
//       const payload = {
//         ...values,
//         issue_date: values.issue_date
//           ? values.issue_date.format("YYYY-MM-DD")
//           : null,
//       };

//       if (editId) {
//         await issueAPI.put(`/${editId}`, payload);
//         message.success("Issue updated");
//       } else {
//         await issueAPI.post("/", payload);
//         message.success("Issue created");
//       }

//       setShowForm(false);
//       setEditId(null);
//       form.resetFields();
//       fetchIssues();
//     } catch (err) {
//       console.error(err);
//       message.error("Save failed");
//     }
//   };

//   // ================= EDIT =================
//   const handleEdit = (record: any) => {
//     setEditId(record.issue_no);
//     setShowForm(true);

//     form.setFieldsValue({
//       ...record,
//       issue_date: record.issue_date ? dayjs(record.issue_date) : null,
//     });
//   };

//   // ================= DELETE =================
//   const handleDelete = async (id: number) => {
//     await issueAPI.delete(`/${id}`);
//     message.success("Deleted");
//     fetchIssues();
//   };

//   // ================= TABLE =================
//   const columns = [
//     { title: "S.No", render: (_: any, __: any, i: number) => i + 1 },
//     { title: "Issue No", dataIndex: "issue_no" },
//     { title: "Order No", dataIndex: "order_no" },
//     { title: "Invoice No", dataIndex: "bill_no_invoice_no" },
//     { title: "Customer", dataIndex: "customer_name" },
//     {
//       title: "Issue Date",
//       dataIndex: "issue_date",
//       render: (v: string) => (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
//     },
//     { title: "Issue Type", dataIndex: "issue_type" },
//     { title: "Issue By", dataIndex: "issue_by" },
//     {
//       title: "Action",
//       render: (_: any, r: any) => (
//         <>
//           <Button icon={<EditOutlined />} onClick={() => handleEdit(r)} />
//           <Popconfirm
//             title="Delete?"
//             onConfirm={() => handleDelete(r.issue_no)}
//           >
//             <Button danger icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </>
//       ),
//     },
//   ];

//   // ================= RENDER =================
//   return (
//     <div className="p-6 bg-white">
//       {!showForm && (
//         <>
//           <div className="flex justify-between mb-4">
//             <h2 className="text-xl font-semibold">Product Issue</h2>
//             <Button
//               type="primary"
//               icon={<PlusOutlined />}
//               onClick={() => {
//                 setShowForm(true);
//                 setEditId(null);
//                 form.resetFields();
//               }}
//             >
//               Add Issue
//             </Button>
//           </div>

//           <Table
//             rowKey="issue_no"
//             columns={columns}
//             dataSource={data}
//             bordered
//           />
//         </>
//       )}

//       {showForm && (
//         <Card>
//           <Form layout="vertical" form={form} onFinish={handleSave}>
//             <Row gutter={16}>
//               <Col span={8}>
//                 <Form.Item name="order_no" label="Order No">
//                   <Input />
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item
//                   name="bill_no_invoice_no"
//                   label="Invoice No"
//                 >
//                   <Input />
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item
//                   name="customer_id"
//                   label="Customer"
//                   rules={[{ required: true }]}
//                 >
//                   <Select showSearch placeholder="Select customer">
//                     {customers.map((c) => (
//                       <Option key={c.id} value={c.id}>
//                         {c.name}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item name="issue_date" label="Issue Date">
//                   <DatePicker style={{ width: "100%" }} />
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item name="issue_type" label="Issue Type">
//                   <Input />
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item name="issue_by" label="Issue By">
//                   <Input />
//                 </Form.Item>
//               </Col>

//               <Col span={24}>
//                 <Form.Item name="remarks" label="Remarks">
//                   <Input.TextArea rows={2} />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <div className="flex justify-end gap-2">
//               <Button
//                 onClick={() => {
//                   setShowForm(false);
//                   setEditId(null);
//                   form.resetFields();
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button type="primary" htmlType="submit">
//                 Save
//               </Button>
//             </div>
//           </Form>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default ProductIssue;

// import { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Form,
//   Input,
//   DatePicker,
//   Select,
//   message,
//   Popconfirm,
//   Card,
//   Row,
//   Col,
//   InputNumber,
//   Divider,
// } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import axios from "axios";
// import dayjs from "dayjs";

// const { Option } = Select;
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const issueAPI = axios.create({
//   baseURL: `${BASE_URL}/product-issue`,
// });

// const ProductIssue = () => {
//   const [data, setData] = useState<any[]>([]);
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [stocks, setStocks] = useState<any[]>([]);
//   const [items, setItems] = useState<any[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState<number | null>(null);
//   const [form] = Form.useForm();

//   // ================= FETCH =================
//   const fetchIssues = async () => {
//     const res = await issueAPI.get("/");
//     setData(res.data || []);
//   };

//   const fetchCustomers = async () => {
//     const res = await axios.get(`${BASE_URL}/customers`);
//     setCustomers(res.data || []);
//   };

//   const fetchStocks = async () => {
//     const res = await axios.get(`${BASE_URL}/product-stock`);
//     setStocks(res.data || []);
//   };

//   useEffect(() => {
//     fetchIssues();
//     fetchCustomers();
//     fetchStocks();
//   }, []);

//   // ================= ITEM HANDLERS =================
//   const addItem = () => {
//     setItems([
//       ...items,
//       {
//         key: Date.now(),
//         product_id: null,
//         batch_no_lot_no: "",
//         issue_qty: null,
//         remarks: "",
//       },
//     ]);
//   };

//   const updateItem = (key: number, field: string, value: any) => {
//     setItems((prev) =>
//       prev.map((it) => (it.key === key ? { ...it, [field]: value } : it))
//     );
//   };

//   const removeItem = (key: number) => {
//     setItems(items.filter((i) => i.key !== key));
//   };

//   // ================= SAVE =================
//   const handleSave = async (values: any) => {
//     if (!items.length) {
//       return message.error("Please add at least one product item");
//     }

//     try {
//       const payload = {
//         ...values,
//         issue_date: values.issue_date
//           ? values.issue_date.format("YYYY-MM-DD")
//           : null,
//       };

//       let issueNo = editId;

//       if (editId) {
//         await issueAPI.put(`/${editId}`, payload);
//       } else {
//         const res = await issueAPI.post("/", payload);
//         issueNo = res.data.issue_no;
//       }

//       // 🔥 save product_issue_item_dtl
//       for (const it of items) {
//         if (!it.product_id || !it.issue_qty) continue;

//         await axios.post(`${BASE_URL}/product-issue-items`, {
//           issue_no: issueNo,
//           customer_id: values.customer_id,
//           product_id: it.product_id,
//           issue_qty: it.issue_qty,
//           issue_date: payload.issue_date,
//           batch_no_lot_no: it.batch_no_lot_no,
//           issue_type: values.issue_type,
//           remarks: it.remarks,
//         });
//       }

//       message.success("Product Issue saved successfully");

//       setShowForm(false);
//       setEditId(null);
//       setItems([]);
//       form.resetFields();
//       fetchIssues();
//     } catch (err) {
//       console.error(err);
//       message.error("Save failed");
//     }
//   };

//   // ================= EDIT =================
//   const handleEdit = async (record: any) => {
//     setEditId(record.issue_no);
//     setShowForm(true);

//     form.setFieldsValue({
//       ...record,
//       issue_date: record.issue_date ? dayjs(record.issue_date) : null,
//     });

//     // 🔥 fetch issue items
//     const res = await axios.get(
//       `${BASE_URL}/product-issue-items/${record.issue_no}`
//     );

//     const mapped = (res.data || []).map((it: any) => ({
//       key: Date.now() + Math.random(),
//       product_id: it.product_id,
//       batch_no_lot_no: it.batch_no_lot_no,
//       issue_qty: it.issue_qty,
//       remarks: it.remarks,
//     }));

//     setItems(mapped);
//   };

//   // ================= DELETE =================
//   const handleDelete = async (id: number) => {
//     await issueAPI.delete(`/${id}`);
//     message.success("Deleted");
//     fetchIssues();
//   };

//   // ================= TABLE =================
//   const columns = [
//     { title: "S.No", render: (_: any, __: any, i: number) => i + 1 },
//     { title: "Issue No", dataIndex: "issue_no" },
//     { title: "Order No", dataIndex: "order_no" },
//     { title: "Invoice No", dataIndex: "bill_no_invoice_no" },
//     { title: "Customer", dataIndex: "customer_name" },
//     {
//       title: "Issue Date",
//       dataIndex: "issue_date",
//       render: (v: string) => (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
//     },
//     { title: "Issue Type", dataIndex: "issue_type" },
//     { title: "Issue By", dataIndex: "issue_by" },
//     {
//       title: "Action",
//       render: (_: any, r: any) => (
//         <>
//           <Button icon={<EditOutlined />} onClick={() => handleEdit(r)} />
//           <Popconfirm
//             title="Delete?"
//             onConfirm={() => handleDelete(r.issue_no)}
//           >
//             <Button danger icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </>
//       ),
//     },
//   ];

//   // ================= RENDER =================
//   return (
//     <div className="p-6 bg-white">
//       {!showForm && (
//         <>
//           <div className="flex justify-between mb-4">
//             <h2 className="text-xl font-semibold">Product Issue</h2>
//             <Button
//               type="primary"
//               icon={<PlusOutlined />}
//               onClick={() => {
//                 setShowForm(true);
//                 setEditId(null);
//                 setItems([]);
//                 form.resetFields();
//               }}
//             >
//               Add Issue
//             </Button>
//           </div>

//           <Table
//             rowKey="issue_no"
//             columns={columns}
//             dataSource={data}
//             bordered
//           />
//         </>
//       )}

//       {showForm && (
//         <Card>
//           <Form layout="vertical" form={form} onFinish={handleSave}>
//             {/* ================= MASTER ================= */}
// <Row gutter={16}>
//   <Col span={8}>
//     <Form.Item name="order_no" label="Order No">
//       <Input />
//     </Form.Item>
//   </Col>

//   <Col span={8}>
//     <Form.Item name="bill_no_invoice_no" label="Invoice No">
//       <Input />
//     </Form.Item>
//   </Col>

//   <Col span={8}>
//     <Form.Item
//       name="customer_id"
//       label="Customer"
//       rules={[{ required: true }]}
//     >
//       <Select showSearch>
//         {customers.map((c) => (
//           <Option key={c.id} value={c.id}>
//             {c.name}
//           </Option>
//         ))}
//       </Select>
//     </Form.Item>
//   </Col>

//   <Col span={8}>
//     <Form.Item name="issue_date" label="Issue Date">
//       <DatePicker style={{ width: "100%" }} />
//     </Form.Item>
//   </Col>

//   <Col span={8}>
//     <Form.Item name="issue_type" label="Issue Type">
//       <Input />
//     </Form.Item>
//   </Col>

//   <Col span={8}>
//     <Form.Item name="issue_by" label="Issue By">
//       <Input />
//     </Form.Item>
//   </Col>

//   <Col span={24}>
//     <Form.Item name="remarks" label="Remarks">
//       <Input.TextArea rows={2} />
//     </Form.Item>
//   </Col>
// </Row>

//             <Divider />

//             {/* ================= ITEMS ================= */}
//             <Table
//               dataSource={items}
//               rowKey="key"
//               pagination={false}
//               bordered
//               columns={[
//                 {
//                   title: "Product (Stock)",
//                   render: (_: any, r: any) => (
//                     <Select
//                       style={{ width: 220 }}
//                       value={r.product_id}
//                       onChange={(val) => {
//                         const stock = stocks.find(
//                           (s) => s.product_id === val
//                         );
//                         updateItem(r.key, "product_id", val);
//                         updateItem(
//                           r.key,
//                           "batch_no_lot_no",
//                           stock?.batch_lotno || ""
//                         );
//                       }}
//                     >
//                       {stocks.map((s) => (
//                         <Option key={s.id} value={s.product_id}>
//                           {s.product_name} ({s.batch_lotno})
//                         </Option>
//                       ))}
//                     </Select>
//                   ),
//                 },
//                 {
//                   title: "Batch / Lot No",
//                   render: (_: any, r: any) => (
//                     <Input value={r.batch_no_lot_no} disabled />
//                   ),
//                 },
//                 {
//                   title: "Issue Qty",
//                   render: (_: any, r: any) => (
//                     <InputNumber
//                       min={1}
//                       value={r.issue_qty}
//                       onChange={(v) =>
//                         updateItem(r.key, "issue_qty", v)
//                       }
//                     />
//                   ),
//                 },
//                 {
//                   title: "Remarks",
//                   render: (_: any, r: any) => (
//                     <Input
//                       value={r.remarks}
//                       onChange={(e) =>
//                         updateItem(r.key, "remarks", e.target.value)
//                       }
//                     />
//                   ),
//                 },
//                 {
//                   title: "Action",
//                   render: (_: any, r: any) => (
//                     <Button danger onClick={() => removeItem(r.key)}>
//                       Remove
//                     </Button>
//                   ),
//                 },
//               ]}
//             />

//             <Button
//               icon={<PlusOutlined />}
//               className="mt-3"
//               onClick={addItem}
//             >
//               Add Item
//             </Button>

//             <div className="flex justify-end gap-2 mt-4">
//               <Button
//                 onClick={() => {
//                   setShowForm(false);
//                   setEditId(null);
//                   setItems([]);
//                   form.resetFields();
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button type="primary" htmlType="submit">
//                 Save
//               </Button>
//             </div>
//           </Form>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default ProductIssue;

// import { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Form,
//   Input,
//   DatePicker,
//   Select,
//   message,
//   Popconfirm,
//   Card,
//   Row,
//   Col,
//   InputNumber,
// } from "antd";
// import {
//   PlusOutlined,
//   EditOutlined,
//   DeleteOutlined,
// } from "@ant-design/icons";
// import axios from "axios";
// import dayjs from "dayjs";

// const { Option } = Select;
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const issueAPI = axios.create({
//   baseURL: `${BASE_URL}/product-issue`,
// });

// const ProductIssue = () => {
//   const [data, setData] = useState<any[]>([]);
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [products, setProducts] = useState<any[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState<number | null>(null);
//   const [form] = Form.useForm();

//   /* ================= FETCH ================= */
//   const fetchIssues = async () => {
//     const res = await issueAPI.get("/");
//     setData(res.data || []);
//   };

//   const fetchCustomers = async () => {
//     const res = await axios.get(`${BASE_URL}/customers`);
//     setCustomers(res.data || []);
//   };

//   const fetchProducts = async () => {
//     const res = await axios.get(`${BASE_URL}/products`);
//     setProducts(res.data || []);
//   };

//   useEffect(() => {
//     fetchIssues();
//     fetchCustomers();
//     fetchProducts();
//   }, []);

//   /* ================= SAVE ================= */
//   const handleSave = async (values: any) => {
//     try {
//       const payload = {
//         ...values,
//         issue_date: values.issue_date
//           ? values.issue_date.format("YYYY-MM-DD")
//           : null,
//         items: values.items.map((i: any) => ({
//           ...i,
//           issue_date: i.issue_date
//             ? i.issue_date.format("YYYY-MM-DD")
//             : null,
//         })),
//       };

//       if (editId) {
//         await issueAPI.put(`/${editId}`, payload);
//         message.success("Issue updated");
//       } else {
//         await issueAPI.post("/", payload);
//         message.success("Issue created");
//       }

//       setShowForm(false);
//       setEditId(null);
//       form.resetFields();
//       fetchIssues();
//     } catch (err) {
//       console.error(err);
//       message.error("Save failed");
//     }
//   };

//   /* ================= EDIT ================= */
//   const handleEdit = (record: any) => {
//     setEditId(record.issue_no);
//     setShowForm(true);

//     form.setFieldsValue({
//       ...record,
//       issue_date: record.issue_date ? dayjs(record.issue_date) : null,
//       items:
//         record.items?.map((i: any) => ({
//           ...i,
//           issue_date: i.issue_date ? dayjs(i.issue_date) : null,
//         })) || [],
//     });
//   };

//   /* ================= DELETE ================= */
//   const handleDelete = async (id: number) => {
//     await issueAPI.delete(`/${id}`);
//     message.success("Deleted");
//     fetchIssues();
//   };

//   /* ================= TABLE ================= */
//   const columns = [
//     { title: "S.No", render: (_: any, __: any, i: number) => i + 1 },
//     { title: "Issue No", dataIndex: "issue_no" },
//     { title: "Customer", dataIndex: "customer_name" },
//     {
//       title: "Issue Date",
//       dataIndex: "issue_date",
//       render: (v: string) => (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
//     },
//     { title: "Issue Type", dataIndex: "issue_type" },
//     {
//       title: "Action",
//       render: (_: any, r: any) => (
//         <>
//           <Button icon={<EditOutlined />} onClick={() => handleEdit(r)} />
//           <Popconfirm title="Delete?" onConfirm={() => handleDelete(r.issue_no)}>
//             <Button danger icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </>
//       ),
//     },
//   ];

//   /* ================= RENDER ================= */
//   return (
//     <div className="p-6 bg-white">
//       {!showForm && (
//         <>
//           <div className="flex justify-between mb-4">
//             <h2 className="text-xl font-semibold">Product Issue</h2>
//             <Button
//               type="primary"
//               icon={<PlusOutlined />}
//               onClick={() => {
//                 setShowForm(true);
//                 setEditId(null);
//                 form.resetFields();
//               }}
//             >
//               Add Issue
//             </Button>
//           </div>

//           <Table rowKey="issue_no" columns={columns} dataSource={data} bordered />
//         </>
//       )}

//       {showForm && (
//         <Card>
//           <Form layout="vertical" form={form} onFinish={handleSave}>
//             {/* ================= HEADER ================= */}
//  <Row gutter={16}>
//     <Col span={8}>
//       <Form.Item name="order_no" label="Order No">
//         <Input />
//       </Form.Item>
//     </Col>

//     <Col span={8}>
//       <Form.Item name="bill_no_invoice_no" label="Invoice No">
//         <Input />
//       </Form.Item>
//     </Col>

//     <Col span={8}>
//       <Form.Item
//         name="customer_id"
//         label="Customer"
//         rules={[{ required: true }]}
//       >
//         <Select showSearch>
//           {customers.map((c) => (
//             <Option key={c.id} value={c.id}>
//               {c.name}
//             </Option>
//           ))}
//         </Select>
//       </Form.Item>
//     </Col>

//     <Col span={8}>
//       <Form.Item name="issue_date" label="Issue Date">
//         <DatePicker style={{ width: "100%" }} />
//       </Form.Item>
//     </Col>

//     <Col span={8}>
//       <Form.Item name="issue_type" label="Issue Type">
//         <Input />
//       </Form.Item>
//     </Col>

//     <Col span={8}>
//       <Form.Item name="issue_by" label="Issue By">
//         <Input />
//       </Form.Item>
//     </Col>

//     <Col span={24}>
//       <Form.Item name="remarks" label="Remarks">
//         <Input.TextArea rows={2} />
//       </Form.Item>
//     </Col>
//   </Row>

//             {/* ================= PRODUCT ISSUE ITEMS ================= */}
//             <Card title="Issue Items" className="mt-4">
//               <Form.List
//                 name="items"
//                 rules={[
//                   {
//                     validator: async (_, items) => {
//                       if (!items || items.length < 1) {
//                         return Promise.reject("At least one item required");
//                       }
//                     },
//                   },
//                 ]}
//               >
//                 {(fields, { add, remove }) => (
//                   <>
//                     {fields.map(({ key, name }) => (
//                       <Row gutter={16} key={key}>
//                         <Col span={6}>
//                           <Form.Item
//                             name={[name, "product_id"]}
//                             label="Product"
//                             rules={[{ required: true }]}
//                           >
//                             <Select>
//                               {products.map((p) => (
//                                 <Option key={p.id} value={p.id}>
//                                   {p.name}
//                                 </Option>
//                               ))}
//                             </Select>
//                           </Form.Item>
//                         </Col>

//                         <Col span={4}>
//                           <Form.Item
//                             name={[name, "issue_qty"]}
//                             label="Qty"
//                             rules={[{ required: true }]}
//                           >
//                             <InputNumber style={{ width: "100%" }} />
//                           </Form.Item>
//                         </Col>

//                         <Col span={5}>
//                           <Form.Item name={[name, "batch_no_lot_no"]} label="Batch/Lot">
//                             <Input />
//                           </Form.Item>
//                         </Col>

//                         <Col span={5}>
//                           <Form.Item name={[name, "issue_date"]} label="Issue Date">
//                             <DatePicker style={{ width: "100%" }} />
//                           </Form.Item>
//                         </Col>

//                         <Col span={4}>
//                           <Form.Item name={[name, "remarks"]} label="Remarks">
//                             <Input />
//                           </Form.Item>
//                         </Col>

//                         <Col span={24}>
//                           <Button danger onClick={() => remove(name)}>
//                             Remove
//                           </Button>
//                         </Col>
//                       </Row>
//                     ))}

//                     <Button type="dashed" onClick={() => add()} block>
//                       + Add Item
//                     </Button>
//                   </>
//                 )}
//               </Form.List>
//             </Card>

//             {/* ================= ACTION ================= */}
//             <div className="flex justify-end gap-2 mt-4">
//               <Button
//                 onClick={() => {
//                   setShowForm(false);
//                   setEditId(null);
//                   form.resetFields();
//                 }}
//               >
//                 Cancel
//               </Button>
//               <Button type="primary" htmlType="submit">
//                 Save
//               </Button>
//             </div>
//           </Form>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default ProductIssue;

// import { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Form,
//   Input,
//   DatePicker,
//   Select,
//   message,
//   Popconfirm,
//   Card,
//   Row,
//   Col,
//   InputNumber,
// } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import axios from "axios";
// import dayjs from "dayjs";

// const { Option } = Select;
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const issueAPI = axios.create({
//   baseURL: `${BASE_URL}/product-issue`,
// });

// const ProductIssue = () => {
//   const [data, setData] = useState<any[]>([]);
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [stocks, setStocks] = useState<any[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState<number | null>(null);
//   const [form] = Form.useForm();

//   /* ================= FETCH ================= */
//   const fetchIssues = async () => {
//     const res = await issueAPI.get("/");
//     setData(res.data || []);
//   };

//   const fetchCustomers = async () => {
//     const res = await axios.get(`${BASE_URL}/customers`);
//     setCustomers(res.data || []);
//   };

//   const fetchStocks = async () => {
//     const res = await axios.get(`${BASE_URL}/product-stock`);
//     setStocks(res.data || []);
//   };

//   useEffect(() => {
//     fetchIssues();
//     fetchCustomers();
//     fetchStocks();
//   }, []);

//   const getAvailableQty = (stock: any) =>
//     Number(stock.qty || 0) - Number(stock.block_qty || 0);

//   /* ================= SAVE ================= */
//   const handleSave = async (values: any) => {
//     try {
//       const payload = {
//         ...values,
//         issue_date: values.issue_date
//           ? values.issue_date.format("YYYY-MM-DD")
//           : null,
//         items: values.items.map((i: any) => ({
//           product_id: i.product_id,
//           issue_qty: i.issue_qty,
//           batch_no_lot_no: i.batch_no_lot_no,
//           issue_date: i.issue_date
//             ? i.issue_date.format("YYYY-MM-DD")
//             : null,
//           remarks: i.remarks,
//         })),
//       };

//       if (editId) {
//         await issueAPI.put(`/${editId}`, payload);
//         message.success("Issue updated");
//       } else {
//         await issueAPI.post("/", payload);
//         message.success("Issue created");
//       }

//       setShowForm(false);
//       setEditId(null);
//       form.resetFields();
//       fetchIssues();
//     } catch (err) {
//       console.error(err);
//       message.error("Save failed");
//     }
//   };

//   /* ================= DELETE ================= */
//   const handleDelete = async (id: number) => {
//     await issueAPI.delete(`/${id}`);
//     message.success("Deleted");
//     fetchIssues();
//   };

//   /* ================= TABLE ================= */
//   const columns = [
//     { title: "S.No", render: (_: any, __: any, i: number) => i + 1 },
//     { title: "Issue No", dataIndex: "issue_no" },
//     { title: "Customer", dataIndex: "customer_name" },
//     {
//       title: "Issue Date",
//       dataIndex: "issue_date",
//       render: (v: string) => (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
//     },
//     { title: "Issue Type", dataIndex: "issue_type" },
//     {
//       title: "Action",
//       render: (_: any, r: any) => (
//         <>
//           <Button icon={<EditOutlined />} />
//           <Popconfirm title="Delete?" onConfirm={() => handleDelete(r.issue_no)}>
//             <Button danger icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </>
//       ),
//     },
//   ];

//   /* ================= RENDER ================= */
//   return (
//     <div className="p-6 bg-white">
//       {!showForm && (
//         <>
//           <div className="flex justify-between mb-4">
//             <h2 className="text-xl font-semibold">Product Issue</h2>
//             <Button
//               type="primary"
//               icon={<PlusOutlined />}
//               onClick={() => {
//                 setShowForm(true);
//                 setEditId(null);
//                 form.resetFields();
//               }}
//             >
//               Add Issue
//             </Button>
//           </div>

//           <Table rowKey="issue_no" columns={columns} dataSource={data} bordered />
//         </>
//       )}

//       {showForm && (
//         <Card>
//           <Form layout="vertical" form={form} onFinish={handleSave}>
//             {/* ================= HEADER ================= */}

//              <Row gutter={16}>
//               <Col span={8}>
//                 <Form.Item name="order_no" label="Order No">
//                   <Input />
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item name="bill_no_invoice_no" label="Invoice No">
//                   <Input />
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item
//                   name="customer_id"
//                   label="Customer"
//                   rules={[{ required: true }]}
//                 >
//                   <Select showSearch>
//                     {customers.map((c) => (
//                       <Option key={c.id} value={c.id}>
//                         {c.name}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item name="issue_date" label="Issue Date">
//                   <DatePicker style={{ width: "100%" }} />
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item name="issue_type" label="Issue Type">
//                   <Input />
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item name="issue_by" label="Issue By">
//                   <Input />
//                 </Form.Item>
//               </Col>

//               <Col span={24}>
//                 <Form.Item name="remarks" label="Remarks">
//                   <Input.TextArea rows={2} />
//                 </Form.Item>
//               </Col>
//             </Row>

//             {/* ================= ITEMS ================= */}
//             <Card title="Issue Items" className="mt-4">
//               <Form.List name="items">
//                 {(fields, { add, remove }) => (
//                   <>
//                     {fields.map(({ key, name }) => (
//                       <Row gutter={16} key={key}>
//                         <Col span={6}>
//                           <Form.Item
//                             name={[name, "stock_id"]}
//                             label="Product Stock"
//                             rules={[{ required: true }]}
//                           >
//                             <Select
//                               onChange={(stockId) => {
//                                 const stock = stocks.find(
//                                   (s) => s.id === stockId
//                                 );
//                                 if (!stock) return;

//                                 form.setFieldsValue({
//                                   items: {
//                                     [name]: {
//                                       product_id: stock.product_id,
//                                       batch_no_lot_no: stock.batch_lotno,
//                                       available_qty: getAvailableQty(stock),
//                                     },
//                                   },
//                                 });
//                               }}
//                             >
//                               {stocks.map((s) => (
//                                 <Option key={s.id} value={s.id}>
//                                   {`Product#${s.product_id} | Batch ${s.batch_lotno} | Avl ${getAvailableQty(
//                                     s
//                                   )}`}
//                                 </Option>
//                               ))}
//                             </Select>
//                           </Form.Item>
//                         </Col>

//                         <Col span={4}>
//                           <Form.Item name={[name, "available_qty"]} label="Available">
//                             <InputNumber disabled style={{ width: "100%" }} />
//                           </Form.Item>
//                         </Col>

//                         <Col span={4}>
//                           <Form.Item
//                             name={[name, "issue_qty"]}
//                             label="Issue Qty"
//                             rules={[
//                               { required: true },
//                               ({ getFieldValue }) => ({
//                                 validator(_, value) {
//                                   const avl = getFieldValue([
//                                     "items",
//                                     name,
//                                     "available_qty",
//                                   ]);
//                                   if (!value || value <= avl)
//                                     return Promise.resolve();
//                                   return Promise.reject(
//                                     "Issue qty cannot exceed available qty"
//                                   );
//                                 },
//                               }),
//                             ]}
//                           >
//                             <InputNumber style={{ width: "100%" }} />
//                           </Form.Item>
//                         </Col>

//                         <Col span={6}>
//                           <Form.Item
//                             name={[name, "batch_no_lot_no"]}
//                             label="Batch/Lot"
//                           >
//                             <Input disabled />
//                           </Form.Item>
//                         </Col>

//                         <Col span={4}>
//                           <Form.Item name={[name, "remarks"]} label="Remarks">
//                             <Input />
//                           </Form.Item>
//                         </Col>

//                         <Col span={24}>
//                           <Button danger onClick={() => remove(name)}>
//                             Remove
//                           </Button>
//                         </Col>
//                       </Row>
//                     ))}

//                     <Button type="dashed" onClick={() => add()} block>
//                       + Add Item
//                     </Button>
//                   </>
//                 )}
//               </Form.List>
//             </Card>

//             <div className="flex justify-end mt-4">
//               <Button type="primary" htmlType="submit">
//                 Save
//               </Button>
//             </div>
//           </Form>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default ProductIssue;

// import { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Form,
//   Input,
//   DatePicker,
//   Select,
//   message,
//   Popconfirm,
//   Card,
//   Row,
//   Col,
//   InputNumber,
// } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import axios from "axios";
// import dayjs from "dayjs";

// const { Option } = Select;
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const issueAPI = axios.create({
//   baseURL: `${BASE_URL}/product-issue`,
// });

// const ProductIssue = () => {
//   const [data, setData] = useState<any[]>([]);
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [stocks, setStocks] = useState<any[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState<number | null>(null);
//   const [form] = Form.useForm();

//   /* ================= FETCH ================= */
//   const fetchIssues = async () => {
//     const res = await issueAPI.get("/");
//     setData(res.data || []);
//   };

//   const fetchCustomers = async () => {
//     const res = await axios.get(`${BASE_URL}/customers`);
//     setCustomers(res.data || []);
//   };

//  const fetchStocks = async () => {
//   const res = await axios.get(
//     `${BASE_URL}/product-stock/issue-dropdown`
//   );
//   setStocks(res.data || []);
// };

//   useEffect(() => {
//     fetchIssues();
//     fetchCustomers();
//     fetchStocks();
//      console.log("STOCKS =>", stocks);
//   }, []);

//   const getAvailableQty = (stock: any) =>
//     Number(stock.qty || 0) - Number(stock.block_qty || 0);

//   /* ================= SAVE ================= */
//   const handleSave = async (values: any) => {
//     try {
//       const payload = {
//         ...values,
//         issue_date: values.issue_date
//           ? values.issue_date.format("YYYY-MM-DD")
//           : null,
//         items: values.items.map((i: any) => ({
//           product_id: i.product_id,
//           issue_qty: i.issue_qty,
//           batch_no_lot_no: i.batch_no_lot_no,
//           issue_date: i.issue_date
//             ? i.issue_date.format("YYYY-MM-DD")
//             : null,
//           remarks: i.remarks,
//         })),
//       };

//       if (editId) {
//         await issueAPI.put(`/${editId}`, payload);
//         message.success("Issue updated");
//       } else {
//         await issueAPI.post("/", payload);
//         message.success("Issue created");
//       }

//       setShowForm(false);
//       setEditId(null);
//       form.resetFields();
//       fetchIssues();
//     } catch (err) {
//       console.error(err);
//       message.error("Save failed");
//     }
//   };

//   /* ================= DELETE ================= */
//   const handleDelete = async (id: number) => {
//     await issueAPI.delete(`/${id}`);
//     message.success("Deleted");
//     fetchIssues();
//   };

//   /* ================= TABLE ================= */
//   const columns = [
//     { title: "S.No", render: (_: any, __: any, i: number) => i + 1 },
//     { title: "Issue No", dataIndex: "issue_no" },
//     { title: "Customer", dataIndex: "customer_name" },
//     {
//       title: "Issue Date",
//       dataIndex: "issue_date",
//       render: (v: string) => (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
//     },
//     { title: "Issue Type", dataIndex: "issue_type" },
//     {
//       title: "Action",
//       render: (_: any, r: any) => (
//         <>
//           <Button icon={<EditOutlined />} />
//           <Popconfirm title="Delete?" onConfirm={() => handleDelete(r.issue_no)}>
//             <Button danger icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </>
//       ),
//     },
//   ];

//   /* ================= RENDER ================= */
//   return (
//     <div className="p-6 bg-white">
//       {!showForm && (
//         <>
//           <div className="flex justify-between mb-4">
//             <h2 className="text-xl font-semibold">Product Issue</h2>
//             <Button
//               type="primary"
//               icon={<PlusOutlined />}
//               onClick={() => {
//                 setShowForm(true);
//                 setEditId(null);
//                 form.resetFields();
//               }}
//             >
//               Add Issue
//             </Button>
//           </div>

//           <Table rowKey="issue_no" columns={columns} dataSource={data} bordered />
//         </>
//       )}

//       {showForm && (
//         <Card>
//           <Form layout="vertical" form={form} onFinish={handleSave}>
//             {/* ================= HEADER ================= */}

//              <Row gutter={16}>
//               <Col span={8}>
//                 <Form.Item name="order_no" label="Order No">
//                   <Input />
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item name="bill_no_invoice_no" label="Invoice No">
//                   <Input />
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item
//                   name="customer_id"
//                   label="Customer"
//                   rules={[{ required: true }]}
//                 >
//                   <Select showSearch>
//                     {customers.map((c) => (
//                       <Option key={c.id} value={c.id}>
//                         {c.name}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item name="issue_date" label="Issue Date">
//                   <DatePicker style={{ width: "100%" }} />
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item name="issue_type" label="Issue Type">
//                   <Input />
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item name="issue_by" label="Issue By">
//                   <Input />
//                 </Form.Item>
//               </Col>

//               <Col span={24}>
//                 <Form.Item name="remarks" label="Remarks">
//                   <Input.TextArea rows={2} />
//                 </Form.Item>
//               </Col>
//             </Row>

//             {/* ================= ITEMS ================= */}
//             <Card title="Issue Items" className="mt-4">
//              <Form.List name="items" initialValue={[{}]}>

//                 {(fields, { add, remove }) => (
//                   <>
//                     {fields.map(({ key, name }) => (
//                       <Row gutter={16} key={key}>
//                         <Col span={6}>
//                           <Form.Item
//                             name={[name, "stock_id"]}
//                             label="Product Stock"
//                             rules={[{ required: true }]}
//                           >
//                             <Select
//                               onChange={(stockId) => {
//                                 const stock = stocks.find((s) => s.stock_id === stockId);

//                                 if (!stock) return;

//                                 form.setFieldsValue({
//                                   items: {
//                                     [name]: {
//                                       product_id: stock.product_id,
//                                       batch_no_lot_no: stock.batch_lotno,
//                                       available_qty: getAvailableQty(stock),
//                                     },
//                                   },
//                                 });
//                               }}
//                             >
//                               {stocks.map((s) => (
//                                <Option key={s.stock_id} value={s.stock_id}>
//   {`${s.product_name} | Batch ${s.batch_lotno} | Avl ${getAvailableQty(s)}`}
// </Option>

//                               ))}
//                             </Select>
//                           </Form.Item>
//                         </Col>

//                         <Col span={4}>
//                           <Form.Item name={[name, "available_qty"]} label="Available">
//                             <InputNumber disabled style={{ width: "100%" }} />
//                           </Form.Item>
//                         </Col>

//                         <Col span={4}>
//                           <Form.Item
//                             name={[name, "issue_qty"]}
//                             label="Issue Qty"
//                             rules={[
//                               { required: true },
//                               ({ getFieldValue }) => ({
//                                 validator(_, value) {
//                                   const avl = getFieldValue([
//                                     "items",
//                                     name,
//                                     "available_qty",
//                                   ]);
//                                   if (!value || value <= avl)
//                                     return Promise.resolve();
//                                   return Promise.reject(
//                                     "Issue qty cannot exceed available qty"
//                                   );
//                                 },
//                               }),
//                             ]}
//                           >
//                             <InputNumber style={{ width: "100%" }} />
//                           </Form.Item>
//                         </Col>

//                         <Col span={6}>
//                           <Form.Item
//                             name={[name, "batch_no_lot_no"]}
//                             label="Batch/Lot"
//                           >
//                             <Input disabled />
//                           </Form.Item>
//                         </Col>

//                         <Col span={4}>
//                           <Form.Item name={[name, "remarks"]} label="Remarks">
//                             <Input />
//                           </Form.Item>
//                         </Col>

//                         <Col span={24}>
//                           <Button danger onClick={() => remove(name)}>
//                             Remove
//                           </Button>
//                         </Col>
//                       </Row>
//                     ))}

//                     <Button type="dashed" onClick={() => add()} block>
//                       + Add Item
//                     </Button>
//                   </>
//                 )}
//               </Form.List>
//             </Card>

//             <div className="flex justify-end mt-4">
//               <Button type="primary" htmlType="submit">
//                 Save
//               </Button>
//             </div>
//           </Form>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default ProductIssue;

// import { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Form,
//   Input,
//   DatePicker,
//   Select,
//   message,
//   Popconfirm,
//   Card,
//   Row,
//   Col,
//   InputNumber,
// } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined,ArrowLeftOutlined } from "@ant-design/icons";
// import axios from "axios";
// import dayjs from "dayjs";

// const { Option } = Select;
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const issueAPI = axios.create({
//   baseURL: `${BASE_URL}/product-issue`,
// });

// const ProductIssue = () => {
//   const [data, setData] = useState<any[]>([]);
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [stocks, setStocks] = useState<any[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState<number | null>(null);
//   const [form] = Form.useForm();

//   /* ================= FETCH ================= */
//   const fetchIssues = async () => {
//     const res = await issueAPI.get("/");
//     setData(res.data || []);
//   };

//   const fetchCustomers = async () => {
//     const res = await axios.get(`${BASE_URL}/customers`);
//     setCustomers(res.data || []);
//   };

//   const fetchStocks = async () => {
//     const res = await axios.get(`${BASE_URL}/product-stock/issue-dropdown`);
//     setStocks(res.data || []);
//   };

//   useEffect(() => {
//     fetchIssues();
//     fetchCustomers();
//     fetchStocks();
//   }, []);

//   const getAvailableQty = (stock: any) =>
//     Number(stock.qty || 0) - Number(stock.block_qty || 0);

//   /* ================= SAVE ================= */
//   const handleSave = async (values: any) => {
//     try {
//       const payload = {
//         ...values,
//         issue_date: values.issue_date
//           ? values.issue_date.format("YYYY-MM-DD")
//           : null,
//         items: values.items.map((i: any) => ({
//           product_id: i.product_id,
//           issue_qty: i.issue_qty,
//           batch_no_lot_no: i.batch_no_lot_no,
//           issue_date: i.issue_date
//             ? i.issue_date.format("YYYY-MM-DD")
//             : null,
//           remarks: i.remarks,
//         })),
//       };

//       if (editId) {
//         await issueAPI.put(`/${editId}`, payload);
//         message.success("Issue updated");
//       } else {
//         await issueAPI.post("/", payload);
//         message.success("Issue created");
//       }

//       setShowForm(false);
//       setEditId(null);
//       form.resetFields();
//       fetchIssues();
//     } catch (err) {
//       console.error(err);
//       message.error("Save failed");
//     }
//   };

//   /* ================= DELETE ================= */
//   const handleDelete = async (id: number) => {
//     await issueAPI.delete(`/${id}`);
//     message.success("Deleted");
//     fetchIssues();
//   };

//   /* ================= TABLE ================= */
//   const columns = [
//     { title: "S.No", render: (_: any, __: any, i: number) => i + 1 },
//     { title: "Issue No", dataIndex: "issue_no" },
//     { title: "Customer", dataIndex: "customer_name" },
//     {
//       title: "Issue Date",
//       dataIndex: "issue_date",
//       render: (v: string) => (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
//     },
//     { title: "Issue Type", dataIndex: "issue_type" },
//     {
//       title: "Action",
//       render: (_: any, r: any) => (
//         <>
//           <Button icon={<EditOutlined />} onClick={() => handleEdit(r)} />
//           <Popconfirm title="Delete?" onConfirm={() => handleDelete(r.issue_no)}>
//             <Button danger icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </>
//       ),
//     },
//   ];

//   /* ================= EDIT ================= */
//   const handleEdit = (record: any) => {
//     setEditId(record.issue_no);
//     setShowForm(true);

//     form.setFieldsValue({
//       ...record,
//       issue_date: record.issue_date ? dayjs(record.issue_date) : null,
//       items:
//         record.items?.map((i: any) => ({
//           ...i,
//           issue_date: i.issue_date ? dayjs(i.issue_date) : null,
//         })) || [],
//     });
//   };

//   /* ================= RENDER ================= */
//   return (
//     <div className="p-6 bg-white">
//       {!showForm && (
//         <>
//           <div className="flex justify-between mb-4">
//             <h2 className="text-xl font-semibold">Product Issue</h2>
//             <Button
//               type="primary"
//               icon={<PlusOutlined />}
//               onClick={() => {
//                 setShowForm(true);
//                 setEditId(null);
//                 form.resetFields();
//               }}
//             >
//               Add Issue
//             </Button>
//           </div>

//           <Table rowKey="issue_no" columns={columns} dataSource={data} bordered />
//         </>
//       )}

//       {showForm && (
//         <Card  title={
//             <Button icon={<ArrowLeftOutlined />} onClick={() => setShowForm(false)}>
//               Back
//             </Button>
//           }>
//           <Form layout="vertical" form={form} onFinish={handleSave} initialValues={{ items: [{}] }}>
//             <Row gutter={16}>
//               <Col span={8}>
//                 <Form.Item name="order_no" label="Order No">
//                   <Input />
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item name="bill_no_invoice_no" label="Invoice No">
//                   <Input />
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item
//                   name="customer_id"
//                   label="Customer"
//                   rules={[{ required: true }]}
//                 >
//                   <Select showSearch placeholder="Select Customer">
//                     {customers.map((c) => (
//                       <Option key={c.id} value={c.id}>
//                         {c.name}
//                       </Option>
//                     ))}
//                   </Select>
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item name="issue_date" label="Issue Date">
//                   <DatePicker style={{ width: "100%" }} />
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item name="issue_type" label="Issue Type">
//                   <Input />
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item name="issue_by" label="Issue By">
//                   <Input />
//                 </Form.Item>
//               </Col>

//               <Col span={24}>
//                 <Form.Item name="remarks" label="Remarks">
//                   <Input.TextArea rows={2} />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Card title="Issue Items" className="mt-4">
//               <Form.List name="items">
//                 {(fields, { add, remove }) => (
//                   <>
//                     {fields.map(({ key, name }) => (
//                       <Row gutter={16} key={key}>
//                         <Col span={6}>
//                           <Form.Item
//                             name={[name, "stock_id"]}
//                             label="Product Stock"
//                             rules={[{ required: true }]}
//                           >
//                             <Select
//                               placeholder="Select Product"
//                               onChange={(stockId) => {
//                                 const stock = stocks.find((s) => s.stock_id === stockId);
//                                 if (!stock) return;

//                                 form.setFieldsValue({
//                                   items: {
//                                     [name]: {
//                                       product_id: stock.product_id,
//                                       batch_no_lot_no: stock.batch_lotno,
//                                       available_qty: getAvailableQty(stock),
//                                     },
//                                   },
//                                 });
//                               }}
//                             >
//                               {stocks.map((s) => (
//                                 <Option key={s.stock_id} value={s.stock_id}>
//                                   {`${s.product_name} | Batch ${s.batch_lotno} | Avl ${getAvailableQty(s)}`}
//                                 </Option>
//                               ))}
//                             </Select>
//                           </Form.Item>
//                         </Col>

//                         <Col span={4}>
//                           <Form.Item name={[name, "available_qty"]} label="Available">
//                             <InputNumber disabled style={{ width: "100%" }} />
//                           </Form.Item>
//                         </Col>

//                         <Col span={4}>
//                           <Form.Item
//                             name={[name, "issue_qty"]}
//                             label="Issue Qty"
//                             rules={[
//                               { required: true },
//                               ({ getFieldValue }) => ({
//                                 validator(_, value) {
//                                   const avl = getFieldValue([
//                                     "items",
//                                     name,
//                                     "available_qty",
//                                   ]);
//                                   if (!value || value <= avl)
//                                     return Promise.resolve();
//                                   return Promise.reject(
//                                     "Issue qty cannot exceed available qty"
//                                   );
//                                 },
//                               }),
//                             ]}
//                           >
//                             <InputNumber style={{ width: "100%" }} />
//                           </Form.Item>
//                         </Col>

//                         <Col span={6}>
//                           <Form.Item
//                             name={[name, "batch_no_lot_no"]}
//                             label="Batch/Lot"
//                           >
//                             <Input disabled />
//                           </Form.Item>
//                         </Col>

//                         <Col span={4}>
//                           <Form.Item name={[name, "remarks"]} label="Remarks">
//                             <Input />
//                           </Form.Item>
//                         </Col>

//                         <Col span={24}>
//                           <Button danger onClick={() => remove(name)}>
//                             Remove
//                           </Button>
//                         </Col>
//                       </Row>
//                     ))}

//                     <Button type="dashed" onClick={() => add()} block>
//                       + Add Item
//                     </Button>
//                   </>
//                 )}
//               </Form.List>
//             </Card>

//             <div className="flex justify-end mt-4">
//               <Button type="primary" htmlType="submit">
//                 Save
//               </Button>
//             </div>
//           </Form>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default ProductIssue;

import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Popconfirm,
  Card,
  Row,
  Col,
  InputNumber,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const issueAPI = axios.create({
  baseURL: `${BASE_URL}/product-issue`,
});

const ProductIssue = () => {
  const [data, setData] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [stocks, setStocks] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form] = Form.useForm();

  /* ================= FETCH ================= */
  const fetchIssues = async () => {
    const res = await issueAPI.get("/");
    setData(res.data || []);
  };

  const fetchCustomers = async () => {
    const res = await axios.get(`${BASE_URL}/customers`);
    setCustomers(res.data || []);
  };

  const fetchStocks = async () => {
    const res = await axios.get(`${BASE_URL}/product-stock/issue-dropdown`);
    setStocks(res.data || []);
  };

  useEffect(() => {
    fetchIssues();
    fetchCustomers();
    fetchStocks();
  }, []);

  const getAvailableQty = (stock: any) =>
    Number(stock.qty || 0) - Number(stock.block_qty || 0);

  /* ================= SAVE ================= */
  const handleSave = async (values: any) => {
    try {
      const payload = {
        ...values,
        issue_date: values.issue_date
          ? values.issue_date.format("YYYY-MM-DD")
          : null,
        items: values.items.map((i: any) => ({
          product_id: i.product_id,
          issue_qty: i.issue_qty,
          batch_no_lot_no: i.batch_no_lot_no,
          issue_date: i.issue_date ? i.issue_date.format("YYYY-MM-DD") : null,
          remarks: i.remarks,
        })),
      };

      if (editId) {
        await issueAPI.put(`/${editId}`, payload);
        message.success("Issue updated");
      } else {
        await issueAPI.post("/", payload);
        message.success("Issue created");
      }

      setShowForm(false);
      setEditId(null);
      form.resetFields();
      fetchIssues();
    } catch (err) {
      console.error(err);
      message.error("Save failed");
    }
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    await issueAPI.delete(`/${id}`);
    message.success("Deleted");
    fetchIssues();
  };

  /* ================= TABLE ================= */
  const columns = [
    { title: "S.No", render: (_: any, __: any, i: number) => i + 1 },
    { title: "Issue No", dataIndex: "issue_no" },
    { title: "Customer", dataIndex: "customer_name" },
    {
      title: "Issue Date",
      dataIndex: "issue_date",
      render: (v: string) => (v ? dayjs(v).format("DD/MM/YYYY") : "-"),
    },
    { title: "Issue Type", dataIndex: "issue_type" },
    {
      title: "Action",
      render: (_: any, r: any) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(r.issue_no)}
          />
          <Popconfirm
            title="Delete?"
            onConfirm={() => handleDelete(r.issue_no)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  /* ================= EDIT ================= */
  // const handleEdit = (record: any) => {
  //   setEditId(record.issue_no);
  //   setShowForm(true);

  //   form.setFieldsValue({
  //     ...record,
  //     issue_date: record.issue_date ? dayjs(record.issue_date) : null,
  //     items:
  //       record.items?.map((i: any) => ({
  //         ...i,
  //         issue_date: i.issue_date ? dayjs(i.issue_date) : null,
  //       })) || [],
  //   });
  // };

  const handleEdit = async (issueNo: number) => {
    try {
      const res = await issueAPI.get(`/${issueNo}`); // 👈 GET ISSUE BY ID
      const record = res.data;

      setEditId(issueNo);
      setShowForm(true);

      form.setFieldsValue({
        ...record,
        issue_date: record.issue_date ? dayjs(record.issue_date) : null,

        items:
          record.items?.map((i: any) => {
            const stock = stocks.find(
              (s) =>
                s.product_id === i.product_id &&
                s.batch_lotno === i.batch_no_lot_no
            );

            return {
              stock_id: stock?.stock_id, // ⭐ MOST IMPORTANT
              product_id: i.product_id,
              batch_no_lot_no: i.batch_no_lot_no,
              issue_qty: i.issue_qty,
              remarks: i.remarks,
              available_qty: stock ? getAvailableQty(stock) : 0,
            };
          }) || [],
      });
    } catch (err) {
      console.error(err);
      message.error("Failed to load issue details");
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="p-6 bg-white">
      {!showForm && (
        <>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Product Issue</h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                setShowForm(true);
                setEditId(null);
                form.resetFields();
              }}
            >
              Add Issue
            </Button>
          </div>

          <Table
            rowKey="issue_no"
            columns={columns}
            dataSource={data}
            bordered
          />
        </>
      )}

      {showForm && (
        <Card
          title={
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => setShowForm(false)}
            >
              Back
            </Button>
          }
        >
          <Form
            layout="vertical"
            form={form}
            onFinish={handleSave}
            initialValues={{ items: [{}] }}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="order_no" label="Order No">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="bill_no_invoice_no" label="Invoice No">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="customer_id"
                  label="Customer"
                  rules={[{ required: true }]}
                >
                  <Select showSearch placeholder="Select Customer">
                    {customers.map((c) => (
                      <Option key={c.id} value={c.id}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="issue_date" label="Issue Date">
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="issue_type" label="Issue Type">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item name="issue_by" label="Issue By">
                  <Input />
                </Form.Item>
              </Col>

              <Col span={24}>
                <Form.Item name="remarks" label="Remarks">
                  <Input.TextArea rows={2} />
                </Form.Item>
              </Col>
            </Row>

            <Card title="Issue Items" className="mt-4">
              <Form.List name="items">
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name }) => (
                      <Row gutter={16} key={key}>
                        <Col span={6}>
                          <Form.Item
                            name={[name, "stock_id"]}
                            label="Product Stock"
                            rules={[{ required: true }]}
                          >
                            <Select
                              placeholder="Select Product"
                              onChange={(stockId) => {
                                const stock = stocks.find(
                                  (s) => s.stock_id === stockId
                                );
                                if (!stock) return;

                                const items = form.getFieldValue("items") || [];
                                items[name] = {
                                  ...items[name],
                                  product_id: stock.product_id,
                                  batch_no_lot_no: stock.batch_lotno,
                                  available_qty: getAvailableQty(stock),
                                };
                                form.setFieldsValue({ items });
                              }}
                            >
                              {stocks.map((s) => (
                                <Option key={s.stock_id} value={s.stock_id}>
                                  {`${s.product_name} | Batch ${
                                    s.batch_lotno
                                  } | Avl ${getAvailableQty(s)}`}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Col>

                        <Col span={4}>
                          <Form.Item
                            name={[name, "available_qty"]}
                            label="Available"
                          >
                            <InputNumber disabled style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>

                        <Col span={4}>
                          <Form.Item
                            name={[name, "issue_qty"]}
                            label="Issue Qty"
                            rules={[
                              { required: true },
                              ({ getFieldValue }) => ({
                                validator(_, value) {
                                  const avl = getFieldValue([
                                    "items",
                                    name,
                                    "available_qty",
                                  ]);
                                  if (!value || value <= avl)
                                    return Promise.resolve();
                                  return Promise.reject(
                                    "Issue qty cannot exceed available qty"
                                  );
                                },
                              }),
                            ]}
                          >
                            <InputNumber style={{ width: "100%" }} />
                          </Form.Item>
                        </Col>

                        <Col span={6}>
                          <Form.Item
                            name={[name, "batch_no_lot_no"]}
                            label="Batch/Lot"
                          >
                            <Input disabled />
                          </Form.Item>
                        </Col>

                        <Col span={4}>
                          <Form.Item name={[name, "remarks"]} label="Remarks">
                            <Input />
                          </Form.Item>
                        </Col>

                        <Col span={24}>
                          <Button danger onClick={() => remove(name)}>
                            Remove
                          </Button>
                        </Col>
                      </Row>
                    ))}

                    <Button type="dashed" onClick={() => add()} block>
                      + Add Item
                    </Button>
                  </>
                )}
              </Form.List>
            </Card>

            <div className="flex justify-end mt-4">
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </div>
          </Form>
        </Card>
      )}
    </div>
  );
};

export default ProductIssue;
