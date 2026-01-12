import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Table,
  Input,
  message,
  Popconfirm,
  Switch,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// API instance
const API = axios.create({
  baseURL: `${BASE_URL}/references`,
});

interface Reference {
  id: number;
  reference: string;
  is_active: number;
}

const ReferenceMaster: React.FC = () => {
  const [data, setData] = useState<Reference[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form] = Form.useForm();

  /* ================= FETCH ================= */
  const fetchReferences = async () => {
    try {
      const res = await API.get("/");
      setData(res.data);
    } catch {
      message.error("Failed to load references");
    }
  };

  useEffect(() => {
    fetchReferences();
  }, []);

  /* ================= SAVE ================= */
  const handleSave = async (values: any) => {
    try {
      if (editId) {
        await API.put(`/${editId}`, values);
        message.success("Reference updated");
      } else {
        await API.post("/", values);
        message.success("Reference added");
      }

      fetchReferences();
      setOpen(false);
      setEditId(null);
      form.resetFields();
    } catch (err: any) {
      message.error(err?.response?.data?.message || "Error saving reference");
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (record: Reference) => {
    setEditId(record.id);
    form.setFieldsValue({
      reference: record.reference,
      is_active: record.is_active === 1,
    });
    setOpen(true);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/${id}`);
      message.success("Reference deleted");
      fetchReferences();
    } catch {
      message.error("Delete failed");
    }
  };

  /* ================= COLUMNS ================= */
  const columns = [
    {
      title: "S.No",
      render: (_: any, __: any, index: number) => index + 1,
      width: 70,
    },
    {
      title: "Reference",
      dataIndex: "reference",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (val: number) =>
        val ? (
          <span style={{ color: "green" }}>Active</span>
        ) : (
          <span style={{ color: "red" }}>Inactive</span>
        ),
    },
    {
      title: "Actions",
      render: (_: any, record: Reference) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete this reference?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-2xl font-semibold">Reference Master</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setEditId(null);
            setOpen(true);
          }}
        >
          Add Reference
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        bordered
      />

      {/* MODAL */}
      <Modal
        title={editId ? "Edit Reference" : "Add Reference"}
        open={open}
        footer={null}
        onCancel={() => setOpen(false)}
        destroyOnClose
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <Form.Item
            name="reference"
            label="Reference Name"
            rules={[{ required: true, message: "Enter reference" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Active"
            valuePropName="checked"
            initialValue={true}
          >
            <Switch />
          </Form.Item>

          <div className="flex justify-end gap-2">
            <Button onClick={() => setOpen(false)}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default ReferenceMaster;
