// import { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Modal,
//   Form,
//   Input,
//   DatePicker,
//   message,
//   Popconfirm,
//   Select,
//   Col,
//   Row
// } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import axios from "axios";
// import dayjs from "dayjs";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// interface RmIssue {
//   id?: number;
//   order_no?: string;
//   job_no?: string;
//   issue_date?: string;
//   issue_to?: string;
//   remark?: string;
//   issue_type?: string;
// }

// const RmIssueMaster = () => {
//   const [data, setData] = useState<RmIssue[]>([]);
//   const [open, setOpen] = useState(false);
//   const [editId, setEditId] = useState<number | null>(null);
//   const [form] = Form.useForm();

//   // ===============================
//   // FETCH ISSUES
//   // ===============================
//   const fetchIssues = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/rm-issues`);
//       setData(res.data || []);
//     } catch (err) {
//       message.error("Failed to load RM Issues");
//     }
//   };

//   useEffect(() => {
//     fetchIssues();
//   }, []);

//   // ===============================
//   // SAVE (ADD / UPDATE)
//   // ===============================
//   const handleSave = async (values: any) => {
//     try {
//       const payload = {
//         ...values,
//         issue_date: values.issue_date
//           ? values.issue_date.format("YYYY-MM-DD")
//           : null,
//       };

//       if (editId) {
//         await axios.put(`${BASE_URL}/rm-issues/${editId}`, payload);
//         message.success("RM Issue updated");
//       } else {
//         await axios.post(`${BASE_URL}/rm-issues`, payload);
//         message.success("RM Issue added");
//       }

//       fetchIssues();
//       setOpen(false);
//       setEditId(null);
//       form.resetFields();
//     } catch (err) {
//       message.error("Save failed");
//     }
//   };

//   // ===============================
//   // EDIT
//   // ===============================
//   const handleEdit = (record: RmIssue) => {
//     setEditId(record.id || null);
//     form.setFieldsValue({
//       ...record,
//       issue_date: record.issue_date ? dayjs(record.issue_date) : null,
//     });
//     setOpen(true);
//   };

//   // ===============================
//   // DELETE
//   // ===============================
//   const handleDelete = async (id?: number) => {
//     if (!id) return;
//     try {
//       await axios.delete(`${BASE_URL}/rm-issues/${id}`);
//       message.success("RM Issue deleted");
//       fetchIssues();
//     } catch (err) {
//       message.error("Delete failed");
//     }
//   };

//   // ===============================
//   // TABLE COLUMNS
//   // ===============================
//   const columns = [
//     {
//       title: "S.No",
//       render: (_: any, __: any, index: number) => index + 1,
//       width: 70,
//     },
//     { title: "Order No", dataIndex: "order_no" },
//     { title: "Job No", dataIndex: "job_no" },
//     { title: "Issue Date", dataIndex: "issue_date" },
//     { title: "Issue Type", dataIndex: "issue_type" },
//     { title: "Issue To", dataIndex: "issue_to" }, // ✅

//     { title: "Remark", dataIndex: "remark" },
//     {
//       title: "Actions",
//       render: (_: any, record: RmIssue) => (
//         <>
//           <Button
//             icon={<EditOutlined />}
//             onClick={() => handleEdit(record)}
//             style={{ marginRight: 8 }}
//           />
//           <Popconfirm
//             title="Delete this issue?"
//             onConfirm={() => handleDelete(record.id)}
//           >
//             <Button danger icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6">
//       {/* HEADER */}
//       <div className="flex justify-between mb-4">
//         <h2 className="text-xl font-semibold">Raw Material Issue</h2>
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={() => {
//             form.resetFields();
//             setEditId(null);
//             setOpen(true);
//           }}
//         >
//           Add Issue
//         </Button>
//       </div>

//       {/* TABLE */}
//       <Table
//         dataSource={data}
//         columns={columns}
//         rowKey="id"
//         bordered
//         pagination={{ pageSize: 10 }}
//       />

//       {/* MODAL */}
//       <Modal
//   open={open}
//   title={editId ? "Edit RM Issue" : "Add RM Issue"}
//   onCancel={() => setOpen(false)}
//   footer={null}
//   destroyOnClose
// >
//   <Form layout="vertical" form={form} onFinish={handleSave}>
//     <Row gutter={16}>
//       <Col span={12}>
//         <Form.Item name="order_no" label="Order No">
//           <Input />
//         </Form.Item>
//       </Col>

//       <Col span={12}>
//         <Form.Item name="job_no" label="Job No">
//           <Input />
//         </Form.Item>
//       </Col>

//       <Col span={12}>
//         <Form.Item name="issue_date" label="Issue Date">
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>
//       </Col>

//       <Col span={12}>
//         <Form.Item name="issue_type" label="Issue Type">
//           <Select allowClear>
//             <Select.Option value="Production">Production</Select.Option>
//             <Select.Option value="Maintenance">Maintenance</Select.Option>
//             <Select.Option value="Sample">Sample</Select.Option>
//           </Select>
//         </Form.Item>
//       </Col>

//       <Col span={12}>
//         <Form.Item name=" issue_to" label="Issue To">
//           <Input />
//         </Form.Item>
//       </Col>

//       <Col span={12}></Col>

//       <Col span={24}>
//         <Form.Item name="remark" label="Remark">
//           <Input.TextArea rows={3} />
//         </Form.Item>
//       </Col>
//     </Row>

//     <div className="flex justify-end gap-2">
//       <Button onClick={() => setOpen(false)}>Cancel</Button>
//       <Button type="primary" htmlType="submit">
//         Save
//       </Button>
//     </div>
//   </Form>
// </Modal>

//     </div>
//   );
// };

// export default RmIssueMaster;





// import { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Modal,
//   Form,
//   Input,
//   DatePicker,
//   message,
//   Popconfirm,
//   Select,
//   Row,
//   Col,
// } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import axios from "axios";
// import dayjs from "dayjs";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// interface RmIssue {
//   id?: number;
//   order_no?: string;
//   job_no?: string;
//   issue_date?: string;
//   issue_to?: string;
//   remark?: string;
//   issue_type?: string;
// }

// const RmIssueMaster = () => {
//   const [data, setData] = useState<RmIssue[]>([]);
//   const [open, setOpen] = useState(false);
//   const [editId, setEditId] = useState<number | null>(null);
//   const [form] = Form.useForm();

//   // ===============================
//   // FETCH RM ISSUES
//   // ===============================
//   const fetchIssues = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/rm-issues`);
//       setData(res.data || []);
//     } catch (err) {
//       message.error("Failed to load RM Issues");
//     }
//   };

//   useEffect(() => {
//     fetchIssues();
//   }, []);

//   // ===============================
//   // SAVE (ADD / UPDATE)
//   // ===============================
//   const handleSave = async (values: any) => {
//     try {
//       const payload = {
//         ...values,
//         issue_date: values.issue_date
//           ? values.issue_date.format("YYYY-MM-DD")
//           : null,
//       };

//       if (editId) {
//         await axios.put(`${BASE_URL}/rm-issues/${editId}`, payload);
//         message.success("RM Issue updated successfully");
//       } else {
//         await axios.post(`${BASE_URL}/rm-issues`, payload);
//         message.success("RM Issue created successfully");
//       }

//       fetchIssues();
//       setOpen(false);
//       setEditId(null);
//       form.resetFields();
//     } catch (err) {
//       message.error("Save failed");
//     }
//   };

//   // ===============================
//   // EDIT
//   // ===============================
//   const handleEdit = (record: RmIssue) => {
//     setEditId(record.id || null);
//     form.setFieldsValue({
//       ...record,
//       issue_date: record.issue_date ? dayjs(record.issue_date) : null,
//     });
//     setOpen(true);
//   };

//   // ===============================
//   // DELETE
//   // ===============================
//   const handleDelete = async (id?: number) => {
//     if (!id) return;
//     try {
//       await axios.delete(`${BASE_URL}/rm-issues/${id}`);
//       message.success("RM Issue deleted successfully");
//       fetchIssues();
//     } catch (err) {
//       message.error("Delete failed");
//     }
//   };

//   // ===============================
//   // TABLE COLUMNS
//   // ===============================
//   const columns = [
//     {
//       title: "S.No",
//       render: (_: any, __: any, index: number) => index + 1,
//       width: 70,
//     },
//     { title: "Order No", dataIndex: "order_no" },
//     { title: "Job No", dataIndex: "job_no" },
//     {
//       title: "Issue Date",
//       dataIndex: "issue_date",
//       render: (val: string) =>
//         val ? dayjs(val).format("DD/MM/YYYY") : "-",
//     },
//     { title: "Issue Type", dataIndex: "issue_type" },
//     { title: "Issue To", dataIndex: "issue_to" },
//     { title: "Remark", dataIndex: "remark" },
//     {
//       title: "Action",
//       width: 120,
//       render: (_: any, record: RmIssue) => (
//         <>
//           <Button
//             icon={<EditOutlined />}
//             onClick={() => handleEdit(record)}
//             style={{ marginRight: 8 }}
//           />
//           <Popconfirm
//             title="Delete this RM Issue?"
//             onConfirm={() => handleDelete(record.id)}
//           >
//             <Button danger icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6 bg-white">
//       {/* HEADER */}
//       <div className="flex justify-between mb-4">
//         <h2 className="text-xl font-semibold">Raw Material Issue</h2>
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={() => {
//             form.resetFields();
//             setEditId(null);
//             setOpen(true);
//           }}
//         >
//           Add RM Issue
//         </Button>
//       </div>

//       {/* TABLE */}
//       <Table
//         dataSource={data}
//         columns={columns}
//         rowKey="id"
//         bordered
//         pagination={{ pageSize: 10 }}
//       />

//       {/* MODAL */}
//       <Modal
//         open={open}
//         title={editId ? "Edit RM Issue" : "Add RM Issue"}
//         onCancel={() => {
//           setOpen(false);
//           setEditId(null);
//           form.resetFields();
//         }}
//         footer={null}
//         destroyOnClose
//       >
//         <Form layout="vertical" form={form} onFinish={handleSave}>
//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item name="order_no" label="Order No">
//                 <Input />
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item name="job_no" label="Job No">
//                 <Input />
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item name="issue_date" label="Issue Date">
//                 <DatePicker style={{ width: "100%" }} />
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item name="issue_type" label="Issue Type">
//                 <Select allowClear>
//                   <Select.Option value="Production">Production</Select.Option>
//                   <Select.Option value="Maintenance">Maintenance</Select.Option>
//                   <Select.Option value="Sample">Sample</Select.Option>
//                 </Select>
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item name="issue_to" label="Issue To">
//                 <Input />
//               </Form.Item>
//             </Col>

//             <Col span={24}>
//               <Form.Item name="remark" label="Remark">
//                 <Input.TextArea rows={3} />
//               </Form.Item>
//             </Col>
//           </Row>

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

// export default RmIssueMaster;


// import { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Form,
//   Input,
//   DatePicker,
//   message,
//   Popconfirm,
//   Select,
//   Row,
//   Col,
//   Card,
//   Divider,
// } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import axios from "axios";
// import dayjs from "dayjs";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// interface RmIssue {
//   id?: number;
//   order_no?: string;
//   job_no?: string;
//   issue_date?: string;
//   issue_to?: string;
//   remark?: string;
//   issue_type?: string;
// }

// interface IssueItem {
//   item_id?: number;
//   qty?: number;
// }

// const RmIssueMaster = () => {
//   const [data, setData] = useState<RmIssue[]>([]);
//   const [rmItems, setRmItems] = useState<any[]>([]);
//   const [items, setItems] = useState<IssueItem[]>([]);
//   const [showForm, setShowForm] = useState(false);
//   const [editId, setEditId] = useState<number | null>(null);
//   const [form] = Form.useForm();

//   // ===============================
//   // FETCH RM ISSUES
//   // ===============================
//   const fetchIssues = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/rm-issues`);
//       setData(res.data || []);
//     } catch {
//       message.error("Failed to load RM Issues");
//     }
//   };

//   // ===============================
//   // FETCH RM ISSUE ITEMS
//   // ===============================
//   const fetchRmItems = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/rm-issue-items`);
//       setRmItems(res.data || []);
//     } catch {
//       message.error("Failed to load RM Items");
//     }
//   };

//   useEffect(() => {
//     fetchIssues();
//     fetchRmItems();
//   }, []);

//   // ===============================
//   // ADD / REMOVE ITEM ROW
//   // ===============================
//   const addItem = () => {
//     setItems([...items, { item_id: undefined, qty: 1 }]);
//   };

//   const removeItem = (index: number) => {
//     const copy = [...items];
//     copy.splice(index, 1);
//     setItems(copy);
//   };

//   // ===============================
//   // SAVE
//   // ===============================
//   const handleSave = async (values: any) => {
//     if (!items.length) {
//       return message.error("Please add at least one item");
//     }

//     try {
//       const payload = {
//         ...values,
//         issue_date: values.issue_date
//           ? values.issue_date.format("YYYY-MM-DD")
//           : null,
//         items,
//       };

//       if (editId) {
//         await axios.put(`${BASE_URL}/rm-issues/${editId}`, payload);
//         message.success("RM Issue updated successfully");
//       } else {
//         await axios.post(`${BASE_URL}/rm-issues`, payload);
//         message.success("RM Issue created successfully");
//       }

//       setShowForm(false);
//       setEditId(null);
//       setItems([]);
//       form.resetFields();
//       fetchIssues();
//     } catch {
//       message.error("Save failed");
//     }
//   };

//   // ===============================
//   // EDIT
//   // ===============================
//   const handleEdit = (record: RmIssue) => {
//     setEditId(record.id || null);
//     setShowForm(true);

//     form.setFieldsValue({
//       ...record,
//       issue_date: record.issue_date ? dayjs(record.issue_date) : null,
//     });

//     // NOTE: agar backend se items aate ho to yahan setItems karo
//     setItems([]);
//   };

//   // ===============================
//   // DELETE
//   // ===============================
//   const handleDelete = async (id?: number) => {
//     if (!id) return;
//     try {
//       await axios.delete(`${BASE_URL}/rm-issues/${id}`);
//       message.success("RM Issue deleted");
//       fetchIssues();
//     } catch {
//       message.error("Delete failed");
//     }
//   };

//   // ===============================
//   // TABLE COLUMNS
//   // ===============================
//   const columns = [
//     {
//       title: "S.No",
//       render: (_: any, __: any, index: number) => index + 1,
//       width: 70,
//     },
//     { title: "Order No", dataIndex: "order_no" },
//     { title: "Job No", dataIndex: "job_no" },
//     {
//       title: "Issue Date",
//       dataIndex: "issue_date",
//       render: (val: string) =>
//         val ? dayjs(val).format("DD/MM/YYYY") : "-",
//     },
//     { title: "Issue Type", dataIndex: "issue_type" },
//     { title: "Issue To", dataIndex: "issue_to" },
//     { title: "Remark", dataIndex: "remark" },
//     {
//       title: "Action",
//       width: 120,
//       render: (_: any, record: RmIssue) => (
//         <>
//           <Button
//             icon={<EditOutlined />}
//             onClick={() => handleEdit(record)}
//             style={{ marginRight: 8 }}
//           />
//           <Popconfirm
//             title="Delete this RM Issue?"
//             onConfirm={() => handleDelete(record.id)}
//           >
//             <Button danger icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6 bg-white">
//       {/* HEADER */}
//       <div className="flex justify-between mb-4">
//         <h2 className="text-xl font-semibold">Raw Material Issue</h2>

//         {!showForm && (
//           <Button
//             type="primary"
//             icon={<PlusOutlined />}
//             onClick={() => {
//               setShowForm(true);
//               setEditId(null);
//               setItems([]);
//               form.resetFields();
//             }}
//           >
//             Add RM Issue
//           </Button>
//         )}
//       </div>

//       {/* ================= TABLE ================= */}
//       {!showForm && (
//         <Table
//           dataSource={data}
//           columns={columns}
//           rowKey="id"
//           bordered
//           pagination={{ pageSize: 10 }}
//         />
//       )}

//       {/* ================= FORM ================= */}
//       {showForm && (
//         <Card bordered>
//           <Form layout="vertical" form={form} onFinish={handleSave}>
//             <Row gutter={16}>
//               <Col span={8}>
//                 <Form.Item name="order_no" label="Order No">
//                   <Input />
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item name="job_no" label="Job No">
//                   <Input />
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item name="issue_date" label="Issue Date">
//                   <DatePicker style={{ width: "100%" }} />
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item name="issue_type" label="Issue Type">
//                   <Select allowClear>
//                     <Select.Option value="Production">
//                       Production
//                     </Select.Option>
//                     <Select.Option value="Maintenance">
//                       Maintenance
//                     </Select.Option>
//                     <Select.Option value="Sample">Sample</Select.Option>
//                   </Select>
//                 </Form.Item>
//               </Col>

//               <Col span={8}>
//                 <Form.Item name="issue_to" label="Issue To">
//                   <Input />
//                 </Form.Item>
//               </Col>

//               <Col span={24}>
//                 <Form.Item name="remark" label="Remark">
//                   <Input.TextArea rows={3} />
//                 </Form.Item>
//               </Col>
//             </Row>

//             <Divider />

//             {/* ============ ITEMS ============ */}
//             <h3 className="font-semibold mb-2">RM Issue Items</h3>

//             {items.map((item, index) => (
//               <Row gutter={16} key={index} className="mb-2">
//                 <Col span={12}>
//                   <Select
//                     placeholder="Select Item"
//                     style={{ width: "100%" }}
//                     value={item.item_id}
//                     onChange={(val) => {
//                       const copy = [...items];
//                       copy[index].item_id = val;
//                       setItems(copy);
//                     }}
//                   >
//                     {rmItems.map((rm: any) => (
//                       <Select.Option key={rm.id} value={rm.id}>
//                         {rm.item_name}
//                       </Select.Option>
//                     ))}
//                   </Select>
//                 </Col>

//                 <Col span={6}>
//                   <Input
//                     type="number"
//                     placeholder="Qty"
//                     value={item.qty}
//                     onChange={(e) => {
//                       const copy = [...items];
//                       copy[index].qty = Number(e.target.value);
//                       setItems(copy);
//                     }}
//                   />
//                 </Col>

//                 <Col span={4}>
//                   <Button danger onClick={() => removeItem(index)}>
//                     Remove
//                   </Button>
//                 </Col>
//               </Row>
//             ))}

//             <Button onClick={addItem} className="mb-4">
//               + Add Item
//             </Button>

//             <div className="flex justify-end gap-2">
//               <Button onClick={() => setShowForm(false)}>Cancel</Button>
//               <Button type="primary" htmlType="submit">
//                 Save RM Issue
//               </Button>
//             </div>
//           </Form>
//         </Card>
//       )}
//     </div>
//   );
// };

// export default RmIssueMaster;







import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  DatePicker,
  message,
  Popconfirm,
  Select,
  Row,
  Col,
  Card,
  Divider,
  InputNumber,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ================= TYPES =================
interface RmIssue {
  id?: number;
  order_no?: string;
  job_no?: string;
  issue_date?: string;
  issue_to?: string;
  remark?: string;
  issue_type?: string;
}

interface RmItem {
  material_id: number;
  name: string;
  unit: string;
}

interface IssueItem {
  key: number;
  material_id?: number;
  name?: string;
  unit?: string;
  batch_no?: string;
  available_qty?: number;
  issue_qty?: number;
  remark?: string;
}

const RmIssueMaster = () => {
  const [data, setData] = useState<RmIssue[]>([]);
  const [rmItems, setRmItems] = useState<RmItem[]>([]);
  const [items, setItems] = useState<IssueItem[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form] = Form.useForm();

  // ================= FETCH =================
  const fetchIssues = async () => {
    const res = await axios.get(`${BASE_URL}/rm-issues`);
    setData(res.data || []);
  };

  const fetchRmItems = async () => {
    const res = await axios.get(`${BASE_URL}/raw-materials`);
    setRmItems(res.data || []);
  };

  useEffect(() => {
    fetchIssues();
    fetchRmItems();
  }, []);

  // ================= ITEM HANDLERS =================
  const addItem = () => {
    setItems([...items, { key: Date.now() }]);
  };

  const updateItem = (key: number, field: string, value: any) => {
    setItems((prev) =>
      prev.map((it) => (it.key === key ? { ...it, [field]: value } : it))
    );
  };

  const removeItem = (key: number) => {
    setItems(items.filter((i) => i.key !== key));
  };

  // ================= SAVE =================
 const handleSave = async (values: any) => {
  if (!items.length) {
    return message.error("Please add at least one item");
  }

  try {
    // =========================
    // 1️⃣ SAVE RM ISSUE (MASTER)
    // =========================
    const issuePayload = {
      order_no: values.order_no,
      job_no: values.job_no,
      issue_date: values.issue_date.format("YYYY-MM-DD"),
      issue_type: values.issue_type,
      issue_to: values.issue_to,
      remark: values.remark,
    };

    let issueId = editId;

    if (editId) {
      await axios.put(`${BASE_URL}/rm-issues/${editId}`, issuePayload);

      // (optional but recommended)
      // old items delete if API exists
      // await axios.delete(`${BASE_URL}/rm-issue-items/${editId}`);
    } else {
      const res = await axios.post(`${BASE_URL}/rm-issues`, issuePayload);
      issueId = res.data.id; // 👈 MUST come from backend
    }

    // =========================
    // 2️⃣ SAVE RM ISSUE ITEMS
    // =========================
    for (const item of items) {
      if (!item.material_id || !item.issue_qty) continue;

      await axios.post(`${BASE_URL}/rm-issue-items`, {
        issue_id: issueId,
        material_id: item.material_id,
        batch_no: item.batch_no || "",
        available_qty: item.available_qty || 0,
        issue_qty: item.issue_qty,
        remark: item.remark || "",
        issue_date: values.issue_date.format("YYYY-MM-DD"),
        issue_type: values.issue_type,
      });
    }

    message.success("RM Issue saved successfully");

    setShowForm(false);
    setItems([]);
    setEditId(null);
    form.resetFields();
    fetchIssues();

  } catch (err) {
    console.error(err);
    message.error("Save failed");
  }
};


  // ================= EDIT =================
  const handleEdit = (record: RmIssue) => {
    setEditId(record.id || null);
    setShowForm(true);
    form.setFieldsValue({
      ...record,
      issue_date: record.issue_date ? dayjs(record.issue_date) : null,
    });
    setItems([]);
  };

  // ================= DELETE =================
  const handleDelete = async (id?: number) => {
    await axios.delete(`${BASE_URL}/rm-issues/${id}`);
    message.success("Deleted");
    fetchIssues();
  };

  // ================= TABLE COLUMNS =================
  const columns = [
    { title: "S.No", render: (_: any, __: any, i: number) => i + 1 },
    { title: "Order No", dataIndex: "order_no" },
    { title: "Job No", dataIndex: "job_no" },
    {
      title: "Issue Date",
      dataIndex: "issue_date",
      render: (v: string) => dayjs(v).format("DD/MM/YYYY"),
    },
    { title: "Issue Type", dataIndex: "issue_type" },
    { title: "Issue To", dataIndex: "issue_to" },
    {
      title: "Action",
      render: (_: any, r: RmIssue) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(r)} />
          <Popconfirm
            title="Delete?"
            onConfirm={() => handleDelete(r.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  // ================= RENDER =================
  return (
    <div className="p-6 bg-white">
      {!showForm && (
        <>
          <div className="flex justify-between mb-4">
            <h2 className="text-xl font-semibold">Raw Material Issue</h2>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setShowForm(true)}
            >
              Add RM Issue
            </Button>
          </div>

          <Table columns={columns} dataSource={data} rowKey="id" bordered />
        </>
      )}

      {showForm && (
        <Card>
          <Form layout="vertical" form={form} onFinish={handleSave}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item name="order_no" label="Order No">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="job_no" label="Job No">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="issue_date" label="Issue Date">
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="issue_type" label="Issue Type">
                  <Select>
                    <Select.Option value="Production">Production</Select.Option>
                    <Select.Option value="Maintenance">Maintenance</Select.Option>
                    <Select.Option value="Sample">Sample</Select.Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name="issue_to" label="Issue To">
                  <Input />
                </Form.Item>
              </Col>
              <Col span={24}>
                <Form.Item name="remark" label="Remark">
                  <Input.TextArea rows={2} />
                </Form.Item>
              </Col>
            </Row>

            <Divider />

            {/* ================= ITEM TABLE (FIXED) ================= */}
            <Table
              dataSource={items}
              rowKey="key"
              pagination={false}
              bordered
              columns={[
                {
                  title: "Material",
                  render: (_: any, r: IssueItem) => (
                    <Select
                      style={{ width: 200 }}
                      value={r.material_id}
                      onChange={(val) => {
                        const mat = rmItems.find(
                          (m) => m.material_id === val
                        );
                        updateItem(r.key, "material_id", val);
                        updateItem(r.key, "name", mat?.name);
                        updateItem(r.key, "unit", mat?.unit);
                      }}
                    >
                      {rmItems.map((m) => (
                        <Select.Option
                          key={m.material_id}
                          value={m.material_id}
                        >
                          {m.name}
                        </Select.Option>
                      ))}
                    </Select>
                  ),
                },
                {
                  title: "Unit",
                  render: (_: any, r: IssueItem) => (
                    <Input value={r.unit} disabled />
                  ),
                },
                {
                  title: "Batch No",
                  render: (_: any, r: IssueItem) => (
                    <Input
                      onChange={(e) =>
                        updateItem(r.key, "batch_no", e.target.value)
                      }
                    />
                  ),
                },
                {
                  title: "Available Qty",
                  render: (_: any, r: IssueItem) => (
                    <InputNumber
                      min={0}
                      onChange={(v) =>
                        updateItem(r.key, "available_qty", v)
                      }
                    />
                  ),
                },
                {
                  title: "Issue Qty",
                  render: (_: any, r: IssueItem) => (
                    <InputNumber
                      min={0}
                      onChange={(v) =>
                        updateItem(r.key, "issue_qty", v)
                      }
                    />
                  ),
                },
                {
                  title: "Remark",
                  render: (_: any, r: IssueItem) => (
                    <Input
                      onChange={(e) =>
                        updateItem(r.key, "remark", e.target.value)
                      }
                    />
                  ),
                },
                {
                  title: "Action",
                  render: (_: any, r: IssueItem) => (
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => removeItem(r.key)}
                    />
                  ),
                },
              ]}
            />

            <Button
              className="mt-3"
              icon={<PlusOutlined />}
              onClick={addItem}
            >
              Add Item
            </Button>

            <div className="flex justify-end gap-2 mt-4">
              <Button onClick={() => setShowForm(false)}>Cancel</Button>
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

export default RmIssueMaster;








// import { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Form,
//   Input,
//   DatePicker,
//   message,
//   Select,
//   Row,
//   Col,
//   InputNumber,
//   Card,
// } from "antd";
// import { PlusOutlined, DeleteOutlined, ArrowLeftOutlined } from "@ant-design/icons";
// import axios from "axios";
// import dayjs from "dayjs";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // ================= TYPES =================
// interface RawMaterial {
//   material_id: number;
//   name: string;
//   unit: string;
// }

// interface IssueItem {
//   key: number;
//   material_id?: number;
//   name?: string;
//   unit?: string;
//   batch_no?: string;
//   available_qty?: number;
//   issue_qty?: number;
//   remark?: string;
// }

// const RmIssueMaster = () => {
//   const [listView, setListView] = useState(true);
//   const [items, setItems] = useState<IssueItem[]>([]);
//   const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
//   const [form] = Form.useForm();

//   // ================= LOAD RAW MATERIALS =================
//   const loadRawMaterials = async () => {
//     try {
//       const res = await axios.get(`${BASE_URL}/raw-materials`);
//       setRawMaterials(res.data || []);
//     } catch {
//       message.error("Failed to load raw materials");
//     }
//   };

//   useEffect(() => {
//     loadRawMaterials();
//   }, []);

//   // ================= ADD ITEM ROW =================
//   const addItemRow = () => {
//     setItems([...items, { key: Date.now() }]);
//   };

//   // ================= UPDATE ITEM =================
//   const updateItem = (key: number, field: string, value: any) => {
//     setItems((prev) =>
//       prev.map((it) => (it.key === key ? { ...it, [field]: value } : it))
//     );
//   };

//   // ================= REMOVE ITEM =================
//   const removeItem = (key: number) => {
//     setItems(items.filter((i) => i.key !== key));
//   };

//   // ================= SAVE =================
//   const handleSave = async (values: any) => {
//     if (!items.length) {
//       message.error("Please add at least one item");
//       return;
//     }

//     try {
//       for (const item of items) {
//         await axios.post(`${BASE_URL}/rm-issue-items`, {
//           material_id: item.material_id,
//           batch_no: item.batch_no,
//           available_qty: item.available_qty || 0,
//           issue_qty: item.issue_qty || 0,
//           issue_date: values.issue_date.format("YYYY-MM-DD"),
//           operator_id: null,
//           remark: item.remark || "",
//           issue_type: values.issue_type,
//         });
//       }

//       message.success("RM Issue saved successfully");
//       form.resetFields();
//       setItems([]);
//       setListView(true);
//     } catch {
//       message.error("Save failed");
//     }
//   };

//   // ================= ITEM COLUMNS =================
//   const itemColumns = [
//     {
//       title: "Material",
//       render: (_: any, record: IssueItem) => (
//         <Select
//           style={{ width: 200 }}
//           placeholder="Select"
//           value={record.material_id}
//           onChange={(val) => {
//             const mat = rawMaterials.find((m) => m.material_id === val);
//             updateItem(record.key, "material_id", val);
//             updateItem(record.key, "name", mat?.name);
//             updateItem(record.key, "unit", mat?.unit);
//           }}
//         >
//           {rawMaterials.map((m) => (
//             <Select.Option key={m.material_id} value={m.material_id}>
//               {m.name}
//             </Select.Option>
//           ))}
//         </Select>
//       ),
//     },
//     {
//       title: "Unit",
//       render: (_: any, record: IssueItem) => <Input value={record.unit} disabled />,
//     },
//     {
//       title: "Batch No",
//       render: (_: any, record: IssueItem) => (
//         <Input
//           onChange={(e) => updateItem(record.key, "batch_no", e.target.value)}
//         />
//       ),
//     },
//     {
//       title: "Available Qty",
//       render: (_: any, record: IssueItem) => (
//         <InputNumber
//           min={0}
//           onChange={(val) => updateItem(record.key, "available_qty", val)}
//         />
//       ),
//     },
//     {
//       title: "Issue Qty",
//       render: (_: any, record: IssueItem) => (
//         <InputNumber
//           min={0}
//           onChange={(val) => updateItem(record.key, "issue_qty", val)}
//         />
//       ),
//     },
//     {
//       title: "Remark",
//       render: (_: any, record: IssueItem) => (
//         <Input onChange={(e) => updateItem(record.key, "remark", e.target.value)} />
//       ),
//     },
//     {
//       title: "Action",
//       render: (_: any, record: IssueItem) => (
//         <Button danger icon={<DeleteOutlined />} onClick={() => removeItem(record.key)} />
//       ),
//     },
//   ];

//   // ================= RENDER =================
//   if (listView) {
//     return (
//       <div className="p-6 bg-white">
//         <Button type="primary" icon={<PlusOutlined />} onClick={() => setListView(false)}>
//           Add RM Issue
//         </Button>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6 bg-white">
//       <Button icon={<ArrowLeftOutlined />} onClick={() => setListView(true)}>
//         Back
//       </Button>

//       <Card title="RM Issue" className="mt-4">
//         <Form layout="vertical" form={form} onFinish={handleSave}>
//           <Row gutter={16}>
//             <Col span={8}>
//               <Form.Item name="issue_date" label="Issue Date" rules={[{ required: true }]}>
//                 <DatePicker style={{ width: "100%" }} defaultValue={dayjs()} />
//               </Form.Item>
//             </Col>
//             <Col span={8}>
//               <Form.Item name="issue_type" label="Issue Type" rules={[{ required: true }]}>
//                 <Select>
//                   <Select.Option value="normal">Normal</Select.Option>
//                   <Select.Option value="urgent">Urgent</Select.Option>
//                 </Select>
//               </Form.Item>
//             </Col>
//           </Row>

//           <Table
//             columns={itemColumns}
//             dataSource={items}
//             pagination={false}
//             rowKey="key"
//             bordered
//           />

//           <Button className="mt-3" onClick={addItemRow} icon={<PlusOutlined />}>
//             Add Item
//           </Button>

//           <div className="flex justify-end mt-4 gap-2">
//             <Button onClick={() => setListView(true)}>Cancel</Button>
//             <Button type="primary" htmlType="submit">
//               Save
//             </Button>
//           </div>
//         </Form>
//       </Card>
//     </div>
//   );
// };

// export default RmIssueMaster;




// import { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Form,
//   Input,
//   DatePicker,
//   message,
//   Select,
//   Row,
//   Col,
//   InputNumber,
//   Card,
//   Space,
// } from "antd";
// import {
//   PlusOutlined,
//   DeleteOutlined,
//   ArrowLeftOutlined,
// } from "@ant-design/icons";
// import axios from "axios";
// import dayjs from "dayjs";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // ================= TYPES =================
// interface RawMaterial {
//   material_id: number;
//   name: string;
//   unit: string;
// }

// interface IssueItem {
//   key: number;
//   material_id?: number;
//   name?: string;
//   unit?: string;
//   batch_no?: string;
//   available_qty?: number;
//   issue_qty?: number;
//   remark?: string;
// }

// const RmIssueMaster = () => {
//   const [listView, setListView] = useState(true);
//   const [items, setItems] = useState<IssueItem[]>([]);
//   const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
//   const [issueList, setIssueList] = useState<any[]>([]);
//   const [form] = Form.useForm();

//   // ================= LOAD DATA =================
//   const loadRawMaterials = async () => {
//     const res = await axios.get(`${BASE_URL}/raw-materials`);
//     setRawMaterials(res.data || []);
//   };

//   const loadIssueList = async () => {
//     const res = await axios.get(`${BASE_URL}/rm-issue-items`);
//     setIssueList(res.data || []);
//   };

//   useEffect(() => {
//     loadRawMaterials();
//     loadIssueList();
//   }, []);

//   // ================= ITEM HANDLERS =================
//   const addItemRow = () => {
//     setItems([...items, { key: Date.now() }]);
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
//       message.error("Please add at least one item");
//       return;
//     }

//     try {
//       for (const item of items) {
//         await axios.post(`${BASE_URL}/rm-issue-items`, {
//           material_id: item.material_id,
//           batch_no: item.batch_no,
//           available_qty: item.available_qty || 0,
//           issue_qty: item.issue_qty || 0,
//           issue_date: values.issue_date.format("YYYY-MM-DD"),
//           operator_id: null,
//           remark: item.remark || "",
//           issue_type: values.issue_type,
//         });
//       }

//       message.success("RM Issue saved successfully");
//       form.resetFields();
//       setItems([]);
//       setListView(true);
//       loadIssueList();
//     } catch {
//       message.error("Save failed");
//     }
//   };

//   // ================= LIST COLUMNS =================
//   const listColumns = [
//     { title: "S.No", render: (_: any, __: any, i: number) => i + 1 },
//     { title: "Material ID", dataIndex: "material_id" },
//     { title: "Batch No", dataIndex: "batch_no" },
//     { title: "Issue Qty", dataIndex: "issue_qty" },
//     {
//       title: "Issue Date",
//       dataIndex: "issue_date",
//       render: (v: string) => dayjs(v).format("DD-MM-YYYY"),
//     },
//     { title: "Issue Type", dataIndex: "issue_type" },
//   ];

//   // ================= ITEM TABLE =================
//   const itemColumns = [
//     {
//       title: "Material",
//       render: (_: any, record: IssueItem) => (
//         <Select
//           style={{ width: 200 }}
//           value={record.material_id}
//           onChange={(val) => {
//             const mat = rawMaterials.find((m) => m.material_id === val);
//             updateItem(record.key, "material_id", val);
//             updateItem(record.key, "name", mat?.name);
//             updateItem(record.key, "unit", mat?.unit);
//           }}
//         >
//           {rawMaterials.map((m) => (
//             <Select.Option key={m.material_id} value={m.material_id}>
//               {m.name}
//             </Select.Option>
//           ))}
//         </Select>
//       ),
//     },
//     {
//       title: "Unit",
//       render: (_: any, r: IssueItem) => <Input value={r.unit} disabled />,
//     },
//     {
//       title: "Batch No",
//       render: (_: any, r: IssueItem) => (
//         <Input onChange={(e) => updateItem(r.key, "batch_no", e.target.value)} />
//       ),
//     },
//     {
//       title: "Available Qty",
//       render: (_: any, r: IssueItem) => (
//         <InputNumber
//           min={0}
//           onChange={(v) => updateItem(r.key, "available_qty", v)}
//         />
//       ),
//     },
//     {
//       title: "Issue Qty",
//       render: (_: any, r: IssueItem) => (
//         <InputNumber
//           min={0}
//           onChange={(v) => updateItem(r.key, "issue_qty", v)}
//         />
//       ),
//     },
//     {
//       title: "Remark",
//       render: (_: any, r: IssueItem) => (
//         <Input onChange={(e) => updateItem(r.key, "remark", e.target.value)} />
//       ),
//     },
//     {
//       title: "Action",
//       render: (_: any, r: IssueItem) => (
//         <Button danger icon={<DeleteOutlined />} onClick={() => removeItem(r.key)} />
//       ),
//     },
//   ];

//   // ================= RENDER =================
//   return listView ? (
//     <div className="p-6 bg-white">
//       <div className="flex justify-between mb-4">
//         <h2 className="text-xl font-semibold">RM Issue List</h2>
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={() => setListView(false)}
//         >
//           Add RM Issue
//         </Button>
//       </div>

//       <Table
//         dataSource={issueList}
//         columns={listColumns}
//         rowKey="id"
//         bordered
//       />
//     </div>
//   ) : (
//     <div className="p-6 bg-white">
//       <Button icon={<ArrowLeftOutlined />} onClick={() => setListView(true)}>
//         Back
//       </Button>

//       <Card title="Add RM Issue" className="mt-4">
//         <Form layout="vertical" form={form} onFinish={handleSave}>
//           <Row gutter={16}>
//             <Col span={8}>
//                  <Form.Item name="order_no" label="Order No">
//                    <Input />
//                 </Form.Item>
//               </Col>

//                <Col span={8}>
//                  <Form.Item name="job_no" label="Job No">
//                    <Input />
//                  </Form.Item>
//                </Col>

//               <Col span={8}>
//                 <Form.Item name="issue_date" label="Issue Date">
//                    <DatePicker style={{ width: "100%" }} />
//                  </Form.Item>
//                </Col>

//                <Col span={8}>
//                  <Form.Item name="issue_type" label="Issue Type">
//                    <Select allowClear>
//                      <Select.Option value="Production">
//                        Production
//                     </Select.Option>
//                     <Select.Option value="Maintenance">
//                       Maintenance
//                     </Select.Option>
//                     <Select.Option value="Sample">Sample</Select.Option>
//                 </Select>
//                  </Form.Item>
//              </Col>

//               <Col span={8}>
//                 <Form.Item name="issue_to" label="Issue To">
//                  <Input />
//                  </Form.Item>
//               </Col>

//                <Col span={24}>
//                 <Form.Item name="remark" label="Remark">
//                    <Input.TextArea rows={3} />
//                  </Form.Item>
//               </Col>
//           </Row>

//           <Table
//             columns={itemColumns}
//             dataSource={items}
//             pagination={false}
//             rowKey="key"
//             bordered
//           />

//           <Button className="mt-3" onClick={addItemRow} icon={<PlusOutlined />}>
//             Add Item
//           </Button>

//           <div className="flex justify-end mt-4 gap-2">
//             <Button onClick={() => setListView(true)}>Cancel</Button>
//             <Button type="primary" htmlType="submit">
//               Save
//             </Button>
//           </div>
//         </Form>
//       </Card>
//     </div>
//   );
// };

// export default RmIssueMaster;



