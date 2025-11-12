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

// ✅ Load base URL from .env
const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// ✅ Axios API instance
const API = axios.create({
  baseURL: `${BASE_URL}/states`,
  headers: { "Content-Type": "application/json" },
});

interface StateItem {
  id: number;
  name: string;
  is_active: number;
}

const StateMaster: React.FC = () => {
  const [states, setStates] = useState<StateItem[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [editId, setEditId] = useState<number | null>(null);

  // ✅ Fetch all states
  const fetchStates = async () => {
    try {
      const res = await API.get("/");
      setStates(res.data);
    } catch {
      message.error("❌ Failed to fetch states");
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  // ✅ Add / Edit state
  const handleSave = async (values: any) => {
    try {
      if (editId) {
        await API.put(`/${editId}`, values);
        message.success("✅ State updated successfully!");
      } else {
        await API.post("/", values);
        message.success("✅ State added successfully!");
      }

      fetchStates();
      setOpen(false);
      form.resetFields();
      setEditId(null);
    } catch (err: any) {
      console.error(err);
      message.error("❌ Error saving state");
    }
  };

  // ✅ Edit handler
  const handleEdit = (record: StateItem) => {
    form.setFieldsValue(record);
    setEditId(record.id);
    setOpen(true);
  };

  // ✅ Delete handler
  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/${id}`);
      message.success("🗑️ State deleted successfully!");
      fetchStates();
    } catch {
      message.error("❌ Error deleting state");
    }
  };

  // ✅ Table columns
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "State Name", dataIndex: "name", key: "name" },
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
      render: (_: any, record: StateItem) => (
        <div style={{ display: "flex", gap: 8 }}>
          {/* Edit Button */}
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
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          />

          {/* Delete Button */}
          <Popconfirm
            title="Are you sure to delete this state?"
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
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
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
        <h2 className="text-2xl font-semibold">State Master</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setEditId(null);
            setOpen(true);
          }}
        >
          Add State
        </Button>
      </div>

      {/* Table */}
      <Table
        dataSource={states}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
      />

      {/* Modal Form */}
      <Modal
        title={editId ? "Edit State" : "Add New State"}
        open={open}
        destroyOnClose
        onCancel={() => setOpen(false)}
        footer={null}
        width={600}
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <Form.Item
            name="name"
            label="State Name"
            rules={[{ required: true, message: "Please enter state name" }]}
          >
            <Input placeholder="Enter state name" />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Status"
            initialValue={1}
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: 1, label: "Active" },
                { value: 0, label: "Inactive" },
              ]}
            />
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

export default StateMaster;
