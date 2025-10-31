import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Table,
  Input,
  Select,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

// Roles API Instance
const RolesAPI = axios.create({
  baseURL: "http://localhost:5000/api/roles",
  headers: { "Content-Type": "application/json" },
});

interface RoleItem {
  id: number;
  name: string;
  description?: string;
  is_active: number;
  created_at?: string;
  updated_at?: string;
}

const RolesMaster: React.FC = () => {
  const [roles, setRoles] = useState<RoleItem[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [editId, setEditId] = useState<number | null>(null);

  // Fetch all roles
  const fetchRoles = async () => {
    try {
      const res = await RolesAPI.get("/");
      setRoles(res.data);
    } catch (err) {
      console.error(err);
      message.error("❌ Failed to fetch roles");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // Add / Edit role
  const handleSave = async (values: any) => {
    try {
      if (editId) {
        await RolesAPI.put(`/${editId}`, values);
        message.success("✅ Role updated successfully!");
      } else {
        await RolesAPI.post("/", values);
        message.success("✅ Role added successfully!");
      }

      fetchRoles();
      setOpen(false);
      form.resetFields();
      setEditId(null);
    } catch (err) {
      console.error(err);
      // Attempt to surface backend validation error if available
      const errMsg = err?.response?.data?.message || "❌ Error saving role";
      message.error(errMsg);
    }
  };

  // Edit
  const handleEdit = (record: RoleItem) => {
    form.setFieldsValue(record);
    setEditId(record.id);
    setOpen(true);
  };

  // Delete
  const handleDelete = async (id: number) => {
    try {
      await RolesAPI.delete(`/${id}`);
      message.success("🗑️ Role deleted successfully!");
      fetchRoles();
    } catch (err) {
      console.error(err);
      message.error("❌ Error deleting role");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 80 },
    { title: "Role Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (val: number) =>
        val === 1 ? (
          <span style={{ color: "green", fontWeight: 500 }}>Active</span>
        ) : (
          <span style={{ color: "red", fontWeight: 500 }}>Inactive</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: RoleItem) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="default"
            icon={<EditOutlined style={{ color: "#1677ff" }} />}
            onClick={() => handleEdit(record)}
            style={{
              borderColor: "#1677ff",
              borderRadius: 4,
              padding: "4px 8px",
              minWidth: 36,
              height: 36,
            }}
          />
          <Popconfirm
            title="Are you sure to delete this role?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="default"
              icon={<DeleteOutlined style={{ color: "red" }} />}
              style={{
                borderColor: "red",
                borderRadius: 4,
                padding: "4px 8px",
                minWidth: 36,
                height: 36,
              }}
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
        <h2 className="text-2xl font-semibold">Roles Master</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setEditId(null);
            setOpen(true);
          }}
        >
          Add Role
        </Button>
      </div>

      {/* Table */}
      <Table dataSource={roles} columns={columns} rowKey="id" bordered pagination={{ pageSize: 8 }} />

      {/* Modal Form */}
      <Modal
        title={editId ? "Edit Role" : "Add New Role"}
        open={open}
        onCancel={() => setOpen(false)}
        destroyOnClose
        footer={null}
        width={700}
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <Form.Item name="name" label="Role Name" rules={[{ required: true, message: "Please enter role name" }]}>
            <Input placeholder="Enter role name" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea placeholder="Optional description" rows={3} />
          </Form.Item>

          <Form.Item name="is_active" label="Status" initialValue={1} rules={[{ required: true }]}>
            <Select options={[{ value: 1, label: "Active" }, { value: 0, label: "Inactive" }]} />
          </Form.Item>

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

export default RolesMaster;
