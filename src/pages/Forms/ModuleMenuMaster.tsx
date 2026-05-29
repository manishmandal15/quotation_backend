
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Axios instance for module menus
const API = axios.create({
  baseURL: `${BASE_URL}/module-menu`,
  headers: { "Content-Type": "application/json" },
});

const ModuleMenuMaster: React.FC = () => {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState<any>(null);
  const [form] = Form.useForm();
   const [url, setUrl] = useState<string>("");

  // ✅ Fetch all module menus
  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await API.get("/");
      setMenus(res.data);
    } catch (err) {
      message.error("Failed to fetch menus");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUrl = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/url`);
      // Assuming your API returns something like { url: "https://example.com" }
       console.log("API response:", res.data); // ← ye line add karo
      setUrl(res.data[0].url);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch URL");
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchUrl();
  }, []);

  // Add
  const handleAdd = () => {
    setEditingMenu(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Edit
  const handleEdit = (record: any) => {
    setEditingMenu(record);
    form.setFieldsValue({
      module_menu_name: record.module_menu_name,
      url: record.url,
    });
    setIsModalVisible(true);
  };

  // Delete
  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/${id}`);
      message.success("Module deleted successfully");
      fetchMenus();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete module");
    }
  };

  // Save / Update
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        module_menu_name: values.module_menu_name.trim(),
        url: values.url.trim(),
      };

      if (editingMenu) {
        await API.put(`/${editingMenu.module_menu_id}`, payload);
        message.success("Menu updated successfully");
      } else {
        await API.post("/", payload);
        message.success("Menu added successfully");
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchMenus();
    } catch (err) {
      console.error(err);
      message.error("Failed to save menu");
    }
  };

  // Copy URL to clipboard
//   const handleCopy = async () => {
//   try {
//     await navigator.clipboard.writeText(url);
//     message.success("URL copied!");
//   } catch (err) {
//     console.error("Copy failed", err);
//     message.error("Failed to copy URL");
//   }
// };


  // Table columns
  const columns = [
    { title: "Sno", key: "sno", render: (_t:any, _r:any, index:any) => index + 1, width: 60 },
    { title: "Module Name", dataIndex: "module_menu_name", key: "module_menu_name" },
    { title: "URL", dataIndex: "url", key: "url" },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_: any, record: any) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="default"
            icon={<EditOutlined style={{ color: "#1677ff" }} />}
            onClick={() => handleEdit(record)}
            style={{ borderColor: "#1677ff", borderRadius: 4, padding: "4px 8px", minWidth: 36, height: 36 }}
          />
          <Popconfirm
            title="Are you sure to delete this menu?"
            onConfirm={() => handleDelete(record.module_menu_id)}
          >
            <Button
              type="default"
              icon={<DeleteOutlined style={{ color: "red" }} />}
              style={{ borderColor: "red", borderRadius: 4, padding: "4px 8px", minWidth: 36, height: 36 }}
            />
          </Popconfirm>

          {/* ✅ Copy URL Button */}
          {/* <Button type="primary" onClick={handleCopy}>
      Copy URL
    </Button> */}
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Module Master</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ borderRadius: 4 }}>
          Add Module
        </Button>
      </div>

      {/* Table */}
      <Table
        dataSource={menus}
        columns={columns}
        rowKey="module_menu_id"
        bordered
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      {/* Modal */}
      <Modal
        title={editingMenu ? "Edit Module" : "Add Module"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        okText="Save"
        destroyOnClose
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="module_menu_name"
            label="Module Name"
            rules={[{ required: true, message: "Please enter module name" }]}
          >
            <Input placeholder="Enter module name" />
          </Form.Item>

          <Form.Item
            name="url"
            label="URL"
            rules={[{ required: true, message: "Please enter URL" }]}
          >
            <Input placeholder="/dashboard, /reports..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ModuleMenuMaster;

