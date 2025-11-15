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

// ✅ Create axios instance
const API = axios.create({
  baseURL: `${BASE_URL}/menus`,
  headers: { "Content-Type": "application/json" },
});

const MenuMaster: React.FC = () => {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState<any>(null);
  const [form] = Form.useForm();

  // ✅ Fetch all menus
  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await API.get("/");
      setMenus(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch menus");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenus();
  }, []);

  // ✅ Add new menu
  const handleAdd = () => {
    setEditingMenu(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // ✅ Edit menu
  const handleEdit = (record: any) => {
    setEditingMenu(record);
    form.setFieldsValue({
      menu_type: record.menu_type,
      menu_name: record.menu_name,
      url: record.url,
    });
    setIsModalVisible(true);
  };

  // ✅ Delete menu
  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/${id}`);
      message.success("Menu deleted successfully");
      fetchMenus();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete menu");
    }
  };

  // ✅ Save or Update menu
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        menu_type: Number(values.menu_type),
        menu_name: values.menu_name.trim(),
        url: values.url.trim(),
      };

      if (editingMenu) {
        await API.put(`/${editingMenu.menu_id}`, payload);
        message.success("Menu updated successfully");
      } else {
        await API.post("/", payload);
        message.success("Menu added successfully");
      }

      setIsModalVisible(false);
      form.resetFields();
      setEditingMenu(null);
      fetchMenus();
    } catch (err) {
      console.error(err);
      message.error("Failed to save menu");
    }
  };

  // ✅ Table columns
  const columns = [
    {
      title: "Sno",
      key: "sno",
      render: (_text: any, _record: any, index: number) => index + 1,
      width: 60,
    },
    {
      title: "Menu Type",
      dataIndex: "menu_type",
      key: "menu_type",
      render: (val: number) => (val === 1 ? "Main Menu" : `Type ${val}`),
    },
    { title: "Menu Name", dataIndex: "menu_name", key: "menu_name" },
    { title: "URL", dataIndex: "url", key: "url" },
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
            title="Are you sure to delete this menu?"
            onConfirm={() => handleDelete(record.menu_id)}
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
        <h2 style={{ margin: 0 }}>Menu Master</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          style={{ borderRadius: 4 }}
        >
          Add Menu
        </Button>
      </div>

      {/* Table */}
      <Table
        dataSource={menus}
        columns={columns}
        rowKey="menu_id"
        loading={loading}
        bordered
        pagination={{ pageSize: 6 }}
      />

      {/* Modal */}
      <Modal
        title={editingMenu ? "Edit Menu" : "Add Menu"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        destroyOnClose
        okText="Save"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="menu_type"
            label="Menu Type"
            rules={[{ required: true, message: "Please enter menu type" }]}
          >
            <Select placeholder="Select menu type">
              <Option value="1">Main Menu</Option>
              <Option value="2">Sub Menu</Option>
              <Option value="3">Other</Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="menu_name"
            label="Menu Name"
            rules={[{ required: true, message: "Please enter menu name" }]}
          >
            <Input placeholder="Enter menu name" />
          </Form.Item>

          <Form.Item
            name="url"
            label="Menu URL"
            rules={[{ required: true, message: "Please enter menu URL" }]}
          >
            <Input placeholder="/dashboard, /users, /settings..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MenuMaster;
