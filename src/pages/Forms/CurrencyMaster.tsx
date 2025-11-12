// src/pages/Forms/CurrencyMaster.tsx
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

// ✅ Load base URL from .env file
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ Create axios instance (clean + reusable)
const API = axios.create({
  baseURL: `${BASE_URL}/currencies`,
  headers: { "Content-Type": "application/json" },
});

const CurrencyMaster: React.FC = () => {
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCurrency, setEditingCurrency] = useState<any>(null);
  const [form] = Form.useForm();

  // ✅ Fetch all currencies
  const fetchCurrencies = async () => {
    setLoading(true);
    try {
      const res = await API.get("/");
      setCurrencies(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch currencies");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCurrencies();
  }, []);

  // ✅ Add currency
  const handleAdd = () => {
    setEditingCurrency(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // ✅ Edit currency
  const handleEdit = (record: any) => {
    setEditingCurrency(record);
    form.setFieldsValue({
      code: record.code,
      name: record.name,
      symbol: record.symbol,
      is_active: record.is_active ? "1" : "0",
    });
    setIsModalVisible(true);
  };

  // ✅ Delete currency
  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/${id}`);
      message.success("Currency deleted successfully");
      fetchCurrencies();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete currency");
    }
  };

  // ✅ Save or Update currency
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        code: values.code.trim(),
        name: values.name.trim(),
        symbol: values.symbol?.trim() || "",
        is_active: Number(values.is_active),
      };

      if (editingCurrency) {
        await API.put(`/${editingCurrency.id}`, payload);
        message.success("Currency updated successfully");
      } else {
        await API.post("/", payload);
        message.success("Currency added successfully");
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingCurrency(null);
      fetchCurrencies();
    } catch (err: any) {
      console.error(err);
      if (err.response?.status === 400) {
        message.error("Currency code already exists!");
      } else {
        message.error("Failed to save currency");
      }
    }
  };

  // ✅ Table columns
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: "10%" },
    { title: "Code", dataIndex: "code", key: "code" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Symbol", dataIndex: "symbol", key: "symbol" },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (val: number) => (val === 1 ? "Active" : "Inactive"),
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
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
            title="Are you sure to delete this currency?"
            onConfirm={() => handleDelete(record.id)}
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
    <div style={{ padding: 20 }}>
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>Currency Master</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          style={{ borderRadius: 4 }}
        >
          Add Currency
        </Button>
      </div>

      {/* Table */}
      <Table
        dataSource={currencies}
        columns={columns}
        rowKey="id"
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }}
      />

      {/* Modal */}
      <Modal
        title={editingCurrency ? "Edit Currency" : "Add Currency"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        destroyOnClose
        okText="Save"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="code"
            label="Currency Code"
            rules={[{ required: true, message: "Please enter currency code" }]}
          >
            <Input placeholder="USD, INR, EUR..." />
          </Form.Item>

          <Form.Item
            name="name"
            label="Currency Name"
            rules={[{ required: true, message: "Please enter currency name" }]}
          >
            <Input placeholder="US Dollar, Indian Rupee..." />
          </Form.Item>

          <Form.Item name="symbol" label="Symbol">
            <Input placeholder="$, ₹, €..." />
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
        </Form>
      </Modal>
    </div>
  );
};

export default CurrencyMaster;
