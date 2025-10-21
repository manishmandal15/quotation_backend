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

const API = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

interface Currency {
  id: number;
  code: string;
  name: string;
  symbol: string;
  is_active: number;
}

const CurrencyMaster: React.FC = () => {
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [editId, setEditId] = useState<number | null>(null);

  // ✅ Fetch all currencies
  const fetchCurrencies = async () => {
    try {
      const res = await API.get("/currencies");
      setCurrencies(res.data);
    } catch {
      message.error("Failed to fetch currencies");
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  // ✅ Save (Add / Edit)
  const handleSave = async (values: any) => {
    try {
      if (editId) {
        await API.put(`/currencies/${editId}`, values);
        message.success("✅ Currency updated successfully!");
      } else {
        await API.post("/currencies", values);
        message.success("✅ Currency added successfully!");
      }

      fetchCurrencies();
      setOpen(false);
      form.resetFields();
      setEditId(null);
    } catch (err: any) {
      if (err.response?.status === 409) {
        message.error("❌ Currency code already exists!");
      } else {
        message.error("❌ Error saving currency");
      }
    }
  };

  // ✅ Edit
  const handleEdit = (record: Currency) => {
    form.setFieldsValue(record);
    setEditId(record.id);
    setOpen(true);
  };

  // ✅ Delete
  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/currencies/${id}`);
      message.success("🗑️ Currency deleted successfully!");
      fetchCurrencies();
    } catch {
      message.error("❌ Error deleting currency");
    }
  };

  // ✅ Table Columns
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Code", dataIndex: "code", key: "code" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Symbol", dataIndex: "symbol", key: "symbol" },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (val: number) =>
        val === 1 ? (
          <span style={{ color: "green" }}>Active</span>
        ) : (
          <span style={{ color: "red" }}>Inactive</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Currency) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 4 }}
          />
          <Popconfirm
            title="Are you sure to delete this currency?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Currency Master</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditId(null);
            form.resetFields();
            setOpen(true);
          }}
        >
          Add Currency
        </Button>
      </div>

      {/* Table */}
      <Table
        dataSource={currencies}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
      />

      {/* Modal Form */}
      <Modal
        title={editId ? "Edit Currency" : "Add New Currency"}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={600}
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <Form.Item
            name="code"
            label="Currency Code"
            rules={[{ required: true, message: "Please enter currency code" }]}
          >
            <Input placeholder="e.g. USD, INR, EUR" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Currency Name"
            rules={[{ required: true, message: "Please enter currency name" }]}
          >
            <Input placeholder="e.g. US Dollar, Indian Rupee" />
          </Form.Item>

          <Form.Item name="symbol" label="Symbol">
            <Input placeholder="e.g. $, ₹, €" />
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

export default CurrencyMaster;
