// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Modal,
//   Form,
//   Input,
//   InputNumber,
//   Switch,
//   message,
//   Popconfirm,
// } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import axios from "axios";
// import dayjs from "dayjs";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const SupplierAPI = axios.create({
//   baseURL: `${BASE_URL}/suppliers`,
//   headers: { "Content-Type": "application/json" },
// });

// interface Supplier {
//   supplier_id: number;
//   name: string;
//   contact_name?: string;
//   contact_email?: string;
//   contact_phone?: string;
//   address?: string;
//   city?: number;
//   state?: number;
//   country?: number;
//   gst?: string;
//   postal_code?: string;
//   payment_terms?: string;
//   is_active: number;
//   lead_time_days?: number;
//   created_at?: string;
//   updated_at?: string;
// }

// const SupplierMaster: React.FC = () => {
//   const [data, setData] = useState<Supplier[]>([]);
//   const [open, setOpen] = useState(false);
//   const [editId, setEditId] = useState<number | null>(null);
//   const [form] = Form.useForm();

//   const fetchSuppliers = async () => {
//     try {
//       const res = await SupplierAPI.get("/");
//       setData(res.data);
//     } catch {
//       message.error("Failed to load suppliers");
//     }
//   };

//   useEffect(() => {
//     fetchSuppliers();
//   }, []);

//   const onSave = async (values: any) => {
//     try {
//       values.is_active = values.is_active ? 1 : 0;
//       if (editId) {
//         await SupplierAPI.put(`/${editId}`, values);
//         message.success("Supplier updated");
//       } else {
//         await SupplierAPI.post("/", values);
//         message.success("Supplier added");
//       }
//       fetchSuppliers();
//       setOpen(false);
//       form.resetFields();
//       setEditId(null);
//     } catch {
//       message.error("Save failed");
//     }
//   };

//   const onEdit = (record: Supplier) => {
//     form.setFieldsValue({ ...record, is_active: record.is_active === 1 });
//     setEditId(record.supplier_id);
//     setOpen(true);
//   };

//   const onDelete = async (id: number) => {
//     await SupplierAPI.delete(`/${id}`);
//     message.success("Deleted");
//     fetchSuppliers();
//   };

//   const columns = [
//     { title: "ID", dataIndex: "supplier_id" },
//     { title: "Name", dataIndex: "name" },
//     { title: "Contact Name", dataIndex: "contact_name" },
//     { title: "Email", dataIndex: "contact_email" },
//     { title: "Phone", dataIndex: "contact_phone" },
//     { title: "GST", dataIndex: "gst" },
//     { title: "Payment Terms", dataIndex: "payment_terms" },
//     { title: "Lead Time", dataIndex: "lead_time_days" },
//     { title: "Active", dataIndex: "is_active", render: (v: number) => (v ? "Yes" : "No") },
//     { title: "Created", dataIndex: "created_at", render: (v: string) => dayjs(v).format("YYYY/MM/DD") },
//     {
//       title: "Actions",
//       render: (_: any, r: Supplier) => (
//         <>
//           <Button icon={<EditOutlined />} onClick={() => onEdit(r)} />
//           <Popconfirm title="Delete?" onConfirm={() => onDelete(r.supplier_id)}>
//             <Button danger icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6">
//       <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
//         Add Supplier
//       </Button>

//       <Table rowKey="supplier_id" columns={columns} dataSource={data} className="mt-4" />

//       <Modal open={open} onCancel={() => setOpen(false)} footer={null} width={800}>
//         <Form layout="vertical" form={form} onFinish={onSave}>
//           <Form.Item name="name" label="Supplier Name" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>
//           <Form.Item name="contact_name" label="Contact Name"><Input /></Form.Item>
//           <Form.Item name="contact_email" label="Email"><Input /></Form.Item>
//           <Form.Item name="contact_phone" label="Phone"><Input /></Form.Item>
//           <Form.Item name="address" label="Address"><Input.TextArea /></Form.Item>
//           <Form.Item name="city" label="City"><InputNumber className="w-full" /></Form.Item>
//           <Form.Item name="state" label="State"><InputNumber className="w-full" /></Form.Item>
//           <Form.Item name="country" label="Country"><InputNumber className="w-full" /></Form.Item>
//           <Form.Item name="gst" label="GST"><Input /></Form.Item>
//           <Form.Item name="postal_code" label="Postal Code"><Input /></Form.Item>
//           <Form.Item name="payment_terms" label="Payment Terms"><Input /></Form.Item>
//           <Form.Item name="lead_time_days" label="Lead Time Days"><InputNumber className="w-full" /></Form.Item>
//           <Form.Item name="is_active" label="Active" valuePropName="checked"><Switch /></Form.Item>
//           <Button type="primary" htmlType="submit">Save</Button>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default SupplierMaster;




import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  Switch,
  message,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;

interface Supplier {
  supplier_id?: number;
  name: string;
  contact_name?: string;
  contact_email?: string;
  contact_phone?: string;
  address?: string;
  city?: number;
  state?: number;
  country?: number;
  gst?: string;
  postal_code?: string;
  payment_terms?: string;
  is_active?: 0 | 1;
  lead_time_days?: number;
  created_at?: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const supplierAPI = axios.create({
  baseURL: `${BASE_URL}/suppliers`,
});

const SupplierMaster = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [filteredSuppliers, setFilteredSuppliers] = useState<Supplier[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [editId, setEditId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");

  const fetchSuppliers = async () => {
    try {
      const res = await supplierAPI.get("/");
      setSuppliers(res.data);
      setFilteredSuppliers(res.data);
    } catch {
      message.error("Failed to fetch suppliers");
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = suppliers.filter((s) =>
      s.name.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredSuppliers(filtered);
  };

  const handleSave = async (values: any) => {
    try {
      values.is_active = values.is_active ? 1 : 0;
      if (editId) {
        await supplierAPI.put(`/${editId}`, values);
        message.success("Supplier updated successfully");
      } else {
        await supplierAPI.post("/", values);
        message.success("Supplier added successfully");
      }
      fetchSuppliers();
      setOpen(false);
      form.resetFields();
      setEditId(null);
    } catch {
      message.error("Save failed");
    }
  };

  const handleEdit = (record: Supplier) => {
    setEditId(record.supplier_id || null);
    form.setFieldsValue({ ...record, is_active: record.is_active === 1 });
    setOpen(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    await supplierAPI.delete(`/${id}`);
    message.success("Supplier deleted successfully");
    fetchSuppliers();
  };

  const columns = [
    { title: "SNo", key: "sno", render: (_: any, _r: any, i: number) => i + 1 },
    { title: "Name", dataIndex: "name" },
    { title: "Contact Name", dataIndex: "contact_name" },
    { title: "Phone", dataIndex: "contact_phone" },
    { title: "GST", dataIndex: "gst" },
    { title: "Payment Terms", dataIndex: "payment_terms" },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (v: number) =>
        v === 1 ? <span style={{ color: "green" }}>Active</span> : <span style={{ color: "red" }}>Inactive</span>,
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      render: (v: string) => (v ? dayjs(v).format("YYYY/MM/DD") : "-"),
    },
    {
      title: "Actions",
      render: (_: any, r: Supplier) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(r)} />
          <Popconfirm title="Delete supplier?" onConfirm={() => handleDelete(r.supplier_id)}>
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Supplier Master</h2>
        <div className="flex gap-4">
          <Input.Search
            placeholder="Search supplier"
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setEditId(null);
              setOpen(true);
            }}
          >
            Add Supplier
          </Button>
        </div>
      </div>

      <Table rowKey="supplier_id" bordered dataSource={filteredSuppliers} columns={columns} />

      <Modal
        title={editId ? "Edit Supplier" : "Add Supplier"}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={900}
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <div className="grid grid-cols-3 gap-4">
            <Form.Item name="name" label="Supplier Name" rules={[{ required: true }]}>
              <Input />
            </Form.Item>
            <Form.Item name="contact_name" label="Contact Name"><Input /></Form.Item>
            <Form.Item name="contact_email" label="Email"><Input /></Form.Item>
            <Form.Item name="contact_phone" label="Phone"><Input /></Form.Item>
            <Form.Item name="gst" label="GST"><Input /></Form.Item>
            <Form.Item name="payment_terms" label="Payment Terms"><Input /></Form.Item>
            <Form.Item name="lead_time_days" label="Lead Time Days"><InputNumber className="w-full" /></Form.Item>
            <Form.Item name="city" label="City"><InputNumber className="w-full" /></Form.Item>
            <Form.Item name="state" label="State"><InputNumber className="w-full" /></Form.Item>
            <Form.Item name="country" label="Country"><InputNumber className="w-full" /></Form.Item>
            <Form.Item name="postal_code" label="Postal Code"><Input /></Form.Item>
            <Form.Item name="address" label="Address"><Input /></Form.Item>
            <Form.Item name="is_active" label="Status" valuePropName="checked">
              <Switch />
            </Form.Item>
          </div>
          <div className="flex justify-end mt-4">
            <Button onClick={() => setOpen(false)} style={{ marginRight: 8 }}>Close</Button>
            <Button type="primary" htmlType="submit">Save</Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SupplierMaster;

