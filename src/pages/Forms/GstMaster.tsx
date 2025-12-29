// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Modal,
//   Form,
//   Input,
//   DatePicker,
//   Select,
//   message,
//   InputNumber ,
//   Popconfirm,
//    Row, Col
// } from "antd";
// import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
// import axios from "axios";
// import dayjs from "dayjs";
// import { BASE_URL } from "../../quotation-module/quotationApi";

// const { Option } = Select;

// const API = axios.create({
//   baseURL: `${BASE_URL}/gst-master`,
// });

// const GstMasterCrud: React.FC = () => {
//   const [gstList, setGstList] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [editingGst, setEditingGst] = useState<any>(null);
//   const [form] = Form.useForm();

//   // Fetch all GST records
//   const fetchGst = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get("");
//       setGstList(res.data);
//     } catch (err) {
//       console.error("❌ GST Fetch Error:", err);
//       message.error("Failed to fetch GST records");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchGst();
//   }, []);

//   // Open modal to add new GST
//   const handleAdd = () => {
//     setEditingGst(null);
//     form.resetFields();
//      form.setFieldsValue({
//     gst: null,
//   });
//     setIsModalVisible(true);
//   };

//   // Open modal to edit existing GST
//   const handleEdit = (record: any) => {
//     setEditingGst(record);
//     form.setFieldsValue({
//       gst_name: record.gst_name,
//       gst: record.test,
//       cgst: record.cgst,
//       sgst: record.sgst,
//       igst: record.igst,
//       effective_from: dayjs(record.effective_from),
//       effective_to: record.effective_to ? dayjs(record.effective_to) : null,
//       status: record.status,
//     });
//     setIsModalVisible(true);
//   };

//   // Delete GST
//   const handleDelete = async (id: number) => {
//     try {
//       await API.delete(`/${id}`);
//       message.success("GST deleted successfully");
//       fetchGst();
//     } catch (err) {
//       console.error(err);
//       message.error("Failed to delete GST");
//     }
//   };

//   // Save GST (Add or Edit)
//   const handleSave = async () => {
//     try {
//       const values = await form.validateFields();
//        console.log(" FORM VALUES:", values);
//       const payload = {
//         gst_name: values.gst_name,
//         test: 15,
//         cgst: Number(values.cgst),
//         sgst: Number(values.sgst),
//         igst: Number(values.igst),
//         effective_from: values.effective_from.format("YYYY-MM-DD"),
//         effective_to: values.effective_to
//           ? values.effective_to.format("YYYY-MM-DD")
//           : null,
//         status: values.status || "Active",
//       };

//        console.log(" API PAYLOAD:", payload);

//       if (editingGst) {
//         await API.put(`/${editingGst.gst_id}`, payload);
//         message.success("GST updated successfully");
//       } else {
//         await API.post("", payload);
//         message.success("GST added successfully");
//       }

//       setIsModalVisible(false);
//       fetchGst();
//     } catch (err) {
//       console.error(err);
//       message.error("Failed to save GST");
//     }
//   };

//   // Table columns
//   const columns = [
//     { title: "Sno", render: (_: any, __: any, i: number) => i + 1 },
//     { title: "Name", dataIndex: "gst_name" },
//      { title: "test", dataIndex: "test" },

//     { title: "CGST %", dataIndex: "cgst" },
//     { title: "SGST %", dataIndex: "sgst" },
//     { title: "IGST %", dataIndex: "igst" },
//     {
//       title: "Effective From",
//       dataIndex: "effective_from",
//       render: (d: string) => dayjs(d).format("DD-MM-YYYY"),
//     },
//     {
//       title: "Effective To",
//       dataIndex: "effective_to",
//       render: (d: string) => (d ? dayjs(d).format("DD-MM-YYYY") : "-"),
//     },
//     { title: "Status", dataIndex: "status" },
//     {
//       title: "Actions",
//       render: (_: any, record: any) => (
//         <>
//           <Button
//             icon={<EditOutlined />}
//             onClick={() => handleEdit(record)}
//             style={{ marginRight: 8 }}
//           />
//           <Popconfirm
//             title="Delete?"
//             onConfirm={() => handleDelete(record.gst_id)}
//           >
//             <Button danger icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: 20 }}>
//   <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 15 }}>
//     <Button
//       type="primary"
//       icon={<PlusOutlined />}
//       onClick={handleAdd}
//     >
//       Add GST
//     </Button>
//   </div>

//   <Table
//     columns={columns}
//     dataSource={gstList}
//     loading={loading}
//     rowKey="gst_id"
//   />

// <Modal
//   title={editingGst ? "Edit GST" : "Add GST"}
//   open={isModalVisible}
//   onOk={handleSave}
//   onCancel={() => setIsModalVisible(false)}
// >
//   <Form form={form} layout="vertical">
//     <Row gutter={50}>
//       <Col span={12}>
//         <Form.Item
//           label="GST Name"
//           name="gst_name"
//           rules={[{ required: true }]}
//         >
//           <Input />
//         </Form.Item>
//       </Col>

// {/* <Col span={12}>
//        <Form.Item label="GST %" name="gst" rules={[{ required: true }]}>
//   <InputNumber
//     style={{ width: "100%" }}
//     min={0}
//   />
// </Form.Item>
//       </Col> */}

//       {/* <Col span={12}>
//         <Form.Item label="gst%" name="test" rules={[{ required: true }]}>
//           <Input type="number" />
//         </Form.Item>
//       </Col> */}

//       <Col span={12}>
//         <Form.Item label="CGST" name="cgst" rules={[{ required: true }]}>
//           <Input type="number" />
//         </Form.Item>
//       </Col>

//       <Col span={12}>
//         <Form.Item label="SGST" name="sgst" rules={[{ required: true }]}>
//           <Input type="number" />
//         </Form.Item>
//       </Col>

//       <Col span={12}>
//         <Form.Item label="IGST" name="igst" rules={[{ required: true }]}>
//           <Input type="number" />
//         </Form.Item>
//       </Col>

//       <Col span={12}>
//         <Form.Item
//           label="Effective From"
//           name="effective_from"
//           rules={[{ required: true }]}
//         >
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>
//       </Col>

//       <Col span={12}>
//         <Form.Item label="Effective To" name="effective_to">
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>
//       </Col>

//        <Col span={12}>
//         <Form.Item label="Status" name="status" rules={[{ required: true }]}>
//           <Select>
//             <Select.Option value="Active">Active</Select.Option>
//             <Select.Option value="Inactive">Inactive</Select.Option>
//           </Select>
//         </Form.Item>
//       </Col>
//     </Row>
//   </Form>
// </Modal>

// </div>

//   );
// };

// export default GstMasterCrud;

// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Modal,
//   Form,
//   Input,
//   DatePicker,
//   Select,
//   message,
//   InputNumber,
//   Popconfirm,
//   Row,
//   Col,
// } from "antd";
// import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
// import axios from "axios";
// import dayjs from "dayjs";
// import { BASE_URL } from "../../quotation-module/quotationApi";

// const API = axios.create({
//   baseURL: `${BASE_URL}/gst-master`,
// });

// interface Gst {
//   gst_id: number;
//   gst_name: string;
//   gst: number;
//   cgst: number;
//   sgst: number;
//   igst: number;
//   effective_from: string;
//   effective_to?: string | null;
//   status: string;
// }

// const GstMasterCrud: React.FC = () => {
//   const [gstList, setGstList] = useState<Gst[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [editingGst, setEditingGst] = useState<Gst | null>(null);
//   const [form] = Form.useForm();

//   /* ================= FETCH ================= */
//   const fetchGst = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get("/");
//       setGstList(res.data);
//     } catch (e) {
//       message.error("Failed to fetch GST");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchGst();
//   }, []);

//   /* ================= ADD ================= */
//  const handleAdd = () => {
//   setEditingGst(null);
//   form.setFieldsValue({
//     gst_name: "",
//     gst: 0,
//     cgst: 0,
//     sgst: 0,
//     igst: 0,
//     effective_from: null,
//     effective_to: null,
//     status: "Active",
//   });
//   setOpen(true);
// };

//   /* ================= EDIT ================= */
//   const handleEdit = (record: Gst) => {
//     setEditingGst(record);
//     form.setFieldsValue({
//       gst_name: record.gst_name,
//       gst: record.gst,
//       cgst: record.cgst,
//       sgst: record.sgst,
//       igst: record.igst,
//       effective_from: dayjs(record.effective_from),
//       effective_to: record.effective_to ? dayjs(record.effective_to) : null,
//       status: record.status,
//     });
//     setOpen(true);
//   };

//   /* ================= DELETE ================= */
//   const handleDelete = async (id: number) => {
//     try {
//       await API.delete(`/${id}`);
//       message.success("GST deleted");
//       fetchGst();
//     } catch {
//       message.error("Delete failed");
//     }
//   };

//   /* ================= SAVE ================= */
//   const handleSave = async () => {
//     try {
//       const values = await form.validateFields();

//       const payload = {
//         gst_name: values.gst_name,
//         gst: values.gst,     // InputNumber => number
//         cgst: values.gst,
//         sgst: values.sgst,
//         igst: values.igst,
//         effective_from: values.effective_from.format("YYYY-MM-DD"),
//         effective_to: values.effective_to
//           ? values.effective_to.format("YYYY-MM-DD")
//           : null,
//         status: values.status || "Active",
//       };

//       if (editingGst) {
//         await API.put(`/${editingGst.gst_id}`, payload);
//         message.success("GST updated successfully");
//       } else {
//         await API.post("/", payload);
//         message.success("GST added successfully");
//       }

//       setOpen(false);
//       form.resetFields();
//       fetchGst();
//     } catch (err: any) {
//       console.error("SAVE ERROR:", err);
//       message.error(err?.response?.data?.error || "Save failed");
//     }
//   };

//   /* ================= TABLE ================= */
//   const columns = [
//     { title: "S.No", render: (_: any, __: any, i: number) => i + 1 },
//     { title: "GST Name", dataIndex: "gst_name" },
//     { title: "GST %", dataIndex: "gst" },
//     { title: "CGST %", dataIndex: "cgst" },
//     { title: "SGST %", dataIndex: "sgst" },
//     { title: "IGST %", dataIndex: "igst" },
//     {
//       title: "Effective From",
//       dataIndex: "effective_from",
//       render: (d: string) => dayjs(d).format("DD-MM-YYYY"),
//     },
//     {
//       title: "Effective To",
//       dataIndex: "effective_to",
//       render: (d: string) => (d ? dayjs(d).format("DD-MM-YYYY") : "-"),
//     },
//     { title: "Status", dataIndex: "status" },
//     {
//       title: "Action",
//       render: (_: any, record: Gst) => (
//         <>
//           <Button
//             icon={<EditOutlined />}
//             size="small"
//             onClick={() => handleEdit(record)}
//             style={{ marginRight: 8 }}
//           />
//           <Popconfirm title="Delete?" onConfirm={() => handleDelete(record.gst_id)}>
//             <Button danger icon={<DeleteOutlined />} size="small" />
//           </Popconfirm>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: 20 }}>
//       <div style={{ textAlign: "right", marginBottom: 12 }}>
//         <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
//           Add GST
//         </Button>
//       </div>

//       <Table
//         rowKey="gst_id"
//         columns={columns}
//         dataSource={gstList}
//         loading={loading}
//       />

//       {/* ================= MODAL ================= */}
//       <Modal
//         title={editingGst ? "Edit GST" : "Add GST"}
//         open={open}
//         onCancel={() => setOpen(false)}
//         onOk={handleSave}
//         destroyOnClose
//       >
//         <Form form={form} layout="vertical">
//           <Row gutter={16}>
//             <Col span={12}>
//               <Form.Item
//                 label="GST Name"
//                 name="gst_name"
//                 rules={[{ required: true }]}
//               >
//                 <Input />
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item label="GST %" name="gst" rules={[{ required: true }]}>
//                 <InputNumber style={{ width: "100%" }} min={0}
//   precision={2} step={0.01} />
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item label="CGST %" name="cgst" rules={[{ required: true }]}>
//                 <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item label="SGST %" name="sgst" rules={[{ required: true }]}>
//                 <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item label="IGST %" name="igst" rules={[{ required: true }]}>
//                 <InputNumber style={{ width: "100%" }} min={0} step={0.01} />
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item
//                 label="Effective From"
//                 name="effective_from"
//                 rules={[{ required: true }]}
//               >
//                 <DatePicker style={{ width: "100%" }} />
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item label="Effective To" name="effective_to">
//                 <DatePicker style={{ width: "100%" }} />
//               </Form.Item>
//             </Col>

//             <Col span={12}>
//               <Form.Item label="Status" name="status" initialValue="Active">
//                 <Select>
//                   <Select.Option value="Active">Active</Select.Option>
//                   <Select.Option value="Inactive">Inactive</Select.Option>
//                 </Select>
//               </Form.Item>
//             </Col>
//           </Row>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default GstMasterCrud;

import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  Select,
  message,
  Popconfirm,
  Col,
  Row,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;

// ✅ Base URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Axios instance
const API = axios.create({
  baseURL: `${BASE_URL}/gst-master`,
  headers: { "Content-Type": "application/json" },
});

const GSTMaster: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form] = Form.useForm();

  /* ================= FETCH ================= */
  const fetchGST = async () => {
    setLoading(true);
    try {
      const res = await API.get("/");
      setData(res.data);
    } catch (err) {
      message.error("Failed to fetch GST data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGST();
  }, []);

  /* ================= ADD ================= */
  const handleAdd = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  /* ================= EDIT ================= */
  const handleEdit = (record: any) => {
    setEditing(record);
    form.setFieldsValue({
      gst_name: record.gst_name,
      gst: record.gst,
      cgst: record.cgst,
      sgst: record.sgst,
      igst: record.igst,
      effective_from: dayjs(record.effective_from),
      effective_to: record.effective_to ? dayjs(record.effective_to) : null,
      status: record.status,
    });
    setOpen(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/${id}`);
      message.success("GST deleted successfully");
      fetchGST();
    } catch {
      message.error("Delete failed");
    }
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        gst_name: values.gst_name,
        gst: values.gst,
        cgst: values.cgst,
        sgst: values.sgst,
        igst: values.igst,
        effective_from: values.effective_from.format("YYYY-MM-DD"),
        effective_to: values.effective_to
          ? values.effective_to.format("YYYY-MM-DD")
          : null,
        status: values.status,
      };

      if (editing) {
        await API.put(`/${editing.gst_id}`, payload);
        message.success("GST updated successfully");
      } else {
        await API.post("/", payload);
        message.success("GST added successfully");
      }

      setOpen(false);
      form.resetFields();
      setEditing(null);
      fetchGST();
    } catch (err) {
      console.error(err);
      message.error("Save failed");
    }
  };

  /* ================= COLUMNS ================= */
  const columns = [
    {
      title: "S.No",
      render: (_: any, __: any, i: number) => i + 1,
      width: 60,
    },
    { title: "GST Name", dataIndex: "gst_name" },
    { title: "GST %", dataIndex: "gst" },
    { title: "CGST", dataIndex: "cgst" },
    { title: "SGST", dataIndex: "sgst" },
    { title: "IGST", dataIndex: "igst" },
    {
      title: "Effective From",
      dataIndex: "effective_from",
      render: (value: string) =>
        value ? dayjs(value).format("YYYY-MM-DD") : "-",
    },

    {
      title: "Effective To",
      dataIndex: "effective_to",
      render: (value: string) =>
        value ? dayjs(value).format("YYYY-MM-DD") : "-",
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (v: string) => (v === "Active" ? "Active" : "Inactive"),
    },
    {
      title: "Actions",
      width: 120,
      render: (_: any, record: any) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Delete this GST?"
            onConfirm={() => handleDelete(record.gst_id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* HEADER */}
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <h2>GST Master</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd}>
          Add GST
        </Button>
      </div>

      {/* TABLE */}
      <Table
        dataSource={data}
        columns={columns}
        rowKey="gst_id"
        loading={loading}
        bordered
        style={{ marginTop: 16 }}
      />

      {/* MODAL */}
      <Modal
        title={editing ? "Edit GST" : "Add GST"}
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSave}
        okText="Save"
        width={800}
        destroyOnClose
      >
        <Form
          layout="vertical"
          form={form}
          initialValues={{ status: "Active" }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="gst_name"
                label="GST Name"
                rules={[{ required: true }]}
              >
                <Input />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="gst" label="GST %" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="status"
                label="Status"
                rules={[{ required: true }]}
              >
                <Select>
                  <Select.Option value="Active">Active</Select.Option>
                  <Select.Option value="Inactive">Inactive</Select.Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="cgst" label="CGST" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="sgst" label="SGST" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="igst" label="IGST" rules={[{ required: true }]}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="effective_from"
                label="Effective From"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item name="effective_to" label="Effective To">
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

export default GSTMaster;
