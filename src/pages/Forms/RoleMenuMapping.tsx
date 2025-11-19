import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Select,
  message,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: `${BASE_URL}/role-menus`,
  headers: { "Content-Type": "application/json" },
});

const RoleMenuMapping: React.FC = () => {
  const [mappings, setMappings] = useState<any[]>([]);
  const [roles, setRoles] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingRecord, setEditingRecord] = useState<any>(null);
  const [form] = Form.useForm();

  // ✅ Fetch all mappings
  const fetchMappings = async () => {
    setLoading(true);
    try {
      const res = await API.get("/");
      setMappings(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch mappings");
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch roles and menus for dropdowns
  const fetchRolesAndMenus = async () => {
    try {
      const [rolesRes, menusRes] = await Promise.all([
        axios.get(`${BASE_URL}/roles`),
        axios.get(`${BASE_URL}/menus`),
      ]);
      setRoles(rolesRes.data);
      setMenus(menusRes.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load roles or menus");
    }
  };

  useEffect(() => {
    fetchMappings();
    fetchRolesAndMenus();
  }, []);

  // ✅ Add new
  const handleAdd = () => {
    setEditingRecord(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // ✅ Edit existing
  const handleEdit = (record: any) => {
    setEditingRecord(record);
    form.setFieldsValue({
      role_id: record.role_id,
      menu_id: record.menu_id,
    });
    setIsModalVisible(true);
  };

  // ✅ Delete
  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/${id}`);
      message.success("Mapping deleted successfully");
      fetchMappings();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete mapping");
    }
  };

  // ✅ Save or Update
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        role_id: Number(values.role_id),
        menu_id: Number(values.menu_id),
      };

      if (editingRecord) {
        await API.put(`/${editingRecord.role_menu_id}`, payload);
        message.success("Mapping updated successfully");
      } else {
        await API.post("/", payload);
        message.success("Mapping added successfully");
      }

      setIsModalVisible(false);
      fetchMappings();
    } catch (err) {
      console.error(err);
      message.error("Failed to save mapping");
    }
  };

  // ✅ Columns
  const columns = [
    {
      title: "Sno",
      key: "sno",
      render: (_text, _record, index) => index + 1,
      width: 60,
    },
    { title: "Role", dataIndex: "role_name", key: "role_name" },
    { title: "Menu", dataIndex: "menu_name", key: "menu_name" },
    { title: "URL", dataIndex: "url", key: "url" },
    {
      title: "Actions",
      key: "actions",
      width: 120,
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
            title="Are you sure to delete this mapping?"
            onConfirm={() => handleDelete(record.role_menu_id)}
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
        <h2 style={{ margin: 0 }}>Role Menu Mapping</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          style={{ borderRadius: 4 }}
        >
          Add Mapping
        </Button>
      </div>

      {/* Table */}
      <Table
        dataSource={mappings}
        columns={columns}
        rowKey="role_menu_id"
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }}
      />

      {/* Modal */}
      <Modal
        title={editingRecord ? "Edit Mapping" : "Add Mapping"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        destroyOnClose
        okText="Save"
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="role_id"
            label="Select Role"
            rules={[{ required: true, message: "Please select a role" }]}
          >
            <Select placeholder="Select Role">
              {roles.map((r) => (
                <Option key={r.id} value={r.id}>
                  {r.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="menu_id"
            label="Select Menu"
            rules={[{ required: true, message: "Please select a menu" }]}
          >
            <Select placeholder="Select Menu">
              {menus.map((m) => (
                <Option key={m.menu_id} value={m.menu_id}>
                  {m.menu_name}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default RoleMenuMapping;
