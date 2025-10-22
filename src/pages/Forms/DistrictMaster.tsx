// src/pages/Forms/StateMaster.tsx
import React, { useEffect, useState } from "react";
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

const StateMaster: React.FC = () => {
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingState, setEditingState] = useState<any>(null);
  const [form] = Form.useForm();

  const API = axios.create({
    baseURL: "http://localhost:5000/api/states",
  });

  // Fetch all states
  const fetchStates = async () => {
    setLoading(true);
    try {
      const res = await API.get("/");
      setStates(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch states");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
  }, []);

  // Add new state
  const handleAdd = () => {
    setEditingState(null);
    form.resetFields();
    setOpen(true);
  };

  // Edit state
  const handleEdit = (record: any) => {
    setEditingState(record);
    form.setFieldsValue({
      name: record.name,
      is_active: String(record.is_active),
    });
    setOpen(true);
  };

  // Delete state
  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/${id}`);
      message.success("State deleted successfully!");
      fetchStates();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete state");
    }
  };

  // Save state (Add/Edit)
  const handleSave = async (values: any) => {
    try {
      const payload = {
        name: values.name.trim(),
        is_active: Number(values.is_active),
      };

      if (editingState) {
        await API.put(`/${editingState.id}`, payload);
        message.success("State updated successfully!");
      } else {
        await API.post("/", payload);
        message.success("State added successfully!");
      }

      setOpen(false);
      fetchStates();
      form.resetFields();
      setEditingState(null);
    } catch (err) {
      console.error(err);
      message.error("Failed to save state");
    }
  };

  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "State Name", dataIndex: "name", key: "name" },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (val: number) => (val === 1 ? "Active" : "Inactive"),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: any) => (
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
              }}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">State Master</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add State
        </Button>
      </div>

      <Table
        dataSource={states}
        columns={columns}
        rowKey="id"
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingState ? "Edit State" : "Add New State"}
        open={open}
        destroyOnClose
        onCancel={() => setOpen(false)}
        footer={null}
        width={600}
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <div className="grid grid-cols-1 gap-4">
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
              rules={[{ required: true, message: "Please select status" }]}
            >
              <Select>
                <Option value="1">Active</Option>
                <Option value="0">Inactive</Option>
              </Select>
            </Form.Item>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setOpen(false)}
              style={{ marginRight: 8 }}
            >
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
