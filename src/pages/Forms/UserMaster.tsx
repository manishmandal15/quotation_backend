// src/pages/Forms/UserMaster.tsx
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

// ✅ Use environment variable for base URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// ✅ Axios instance
const API = axios.create({
  baseURL: `${BASE_URL}/users`,
  headers: { "Content-Type": "application/json" },
});

interface User {
  id: number;
  role_id: number;
  name: string;
  email: string;
  password?: string;
  phone?: string;
  is_active: number; // 1 = Active, 0 = Inactive
}

const UserMaster: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [editId, setEditId] = useState<number | null>(null);

  // ✅ Fetch all users
  const fetchUsers = async () => {
    try {
      const res = await API.get("/");
      setUsers(res.data);
    } catch (err) {
      message.error("❌ Failed to fetch users");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // ✅ Save or Update user
  const handleSave = async (values: any) => {
    try {
      const payload = { ...values, is_active: Number(values.is_active) };

      if (editId) {
        await API.put(`/${editId}`, payload);
        message.success("✅ User updated successfully!");
      } else {
        await API.post("/", payload);
        message.success("✅ User added successfully!");
      }

      fetchUsers();
      setOpen(false);
      form.resetFields();
      setEditId(null);
    } catch (err: any) {
      console.error(err);
      message.error(err.response?.data?.error || "❌ Error saving user");
    }
  };

  // ✅ Edit user
  const handleEdit = (record: User) => {
    setEditId(record.id);
    form.setFieldsValue(record);
    setOpen(true);
  };

  // ✅ Delete user
  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/${id}`);
      message.success("🗑️ User deleted successfully!");
      fetchUsers();
    } catch {
      message.error("❌ Error deleting user");
    }
  };

  // ✅ Table columns
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Role", dataIndex: "rolename", key: "rolename" },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (val: number) =>
        val === 1 ? "Active" : "Inactive",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: User) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="default"
            icon={<EditOutlined style={{ color: "#1677ff" }} />}
            onClick={() => handleEdit(record)}
            style={{ borderColor: "#1677ff", borderRadius: 4, minWidth: 36 }}
          />
          <Popconfirm
            title="Are you sure to delete this user?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              type="default"
              icon={<DeleteOutlined style={{ color: "red" }} />}
              style={{ borderColor: "red", borderRadius: 4, minWidth: 36 }}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">User Master</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setEditId(null);
            setOpen(true);
          }}
        >
          Add User
        </Button>
      </div>

      {/* Table */}
      <Table
        dataSource={users}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
      />

      {/* Modal Form */}
      <Modal
        title={editId ? "Edit User" : "Add New User"}
        open={open}
        destroyOnClose
        onCancel={() => setOpen(false)}
        footer={null}
        width={600}
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="role_id"
              label="Role"
              rules={[{ required: true, message: "Please select role" }]}
            >
              <Select placeholder="Select role">
                <Option value={1}>Admin</Option>
                <Option value={2}>User</Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input placeholder="Enter name" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, message: "Please enter email" }]}
            >
              <Input type="email" placeholder="Enter email" />
            </Form.Item>

            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: !editId, message: "Please enter password" }]}
            >
              <Input type="password" placeholder="Enter password" />
            </Form.Item>

            <Form.Item name="phone" label="Phone">
              <Input placeholder="Enter phone" />
            </Form.Item>

            <Form.Item
              name="is_active"
              label="Status"
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select>
                <Option value={1}>Active</Option>
                <Option value={0}>Inactive</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="flex justify-end mt-4">
            <Button onClick={() => setOpen(false)} style={{ marginRight: 8 }}>
              Close
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default UserMaster;
