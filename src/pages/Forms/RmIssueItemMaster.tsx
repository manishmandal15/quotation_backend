import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Popconfirm,
  message,
  Col,
  Row
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface IssueItem {
  id?: number;
  material_id?: number;
  material_name?: string;
  batch_no?: string;
  available_qty?: number;
  issue_qty?: number;
  issue_date?: string;
  operator_id?: number;
  remark?: string;
  issue_type?: string;
}

interface Material {
  material_id: number;
  name: string;
}

const RmIssueItemMaster = () => {
  const [data, setData] = useState<IssueItem[]>([]);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form] = Form.useForm();

  // ===============================
  // FETCH DATA
  // ===============================
  const fetchItems = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/rm-issue-items`);
      setData(res.data);
    } catch {
      message.error("Failed to load issue items");
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/raw-materials`);
      setMaterials(res.data);
    } catch {
      message.error("Failed to load materials");
    }
  };

  useEffect(() => {
    fetchItems();
    fetchMaterials();
  }, []);

  // ===============================
  // SAVE
  // ===============================
  const handleSave = async (values: any) => {
    const payload = {
      ...values,
      issue_date: values.issue_date
        ? values.issue_date.format("YYYY-MM-DD")
        : null,
    };

    try {
      if (editId) {
        await axios.put(`${BASE_URL}/rm-issue-items/${editId}`, payload);
        message.success("Issue item updated");
      } else {
        await axios.post(`${BASE_URL}/rm-issue-items`, payload);
        message.success("Issue item added");
      }

      setOpen(false);
      form.resetFields();
      setEditId(null);
      fetchItems();
    } catch {
      message.error("Save failed");
    }
  };

  // ===============================
  // EDIT
  // ===============================
  const handleEdit = (record: IssueItem) => {
    setEditId(record.id || null);
    form.setFieldsValue({
      ...record,
      issue_date: record.issue_date ? dayjs(record.issue_date) : null,
    });
    setOpen(true);
  };

  // ===============================
  // DELETE
  // ===============================
  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await axios.delete(`${BASE_URL}/rm-issue-items/${id}`);
      message.success("Deleted successfully");
      fetchItems();
    } catch {
      message.error("Delete failed");
    }
  };

  // ===============================
  // TABLE COLUMNS
  // ===============================
  const columns = [
    {
      title: "S.No",
      render: (_: any, __: any, i: number) => i + 1,
      width: 60,
    },
    { title: "Material", dataIndex: "material_name" },
    { title: "Batch No", dataIndex: "batch_no" },
    { title: "Available Qty", dataIndex: "available_qty" },
    { title: "Issue Qty", dataIndex: "issue_qty" },
    { title: "Issue Date", dataIndex: "issue_date" },
    { title: "Issue Type", dataIndex: "issue_type" },
    {
      title: "Actions",
      render: (_: any, record: IssueItem) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Delete this item?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">RM Issue Item Master</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
          Add Issue Item
        </Button>
      </div>

      <Table rowKey="id" columns={columns} dataSource={data} bordered />

      {/* MODAL */}
      <Modal
  open={open}
  title={editId ? "Edit Issue Item" : "Add Issue Item"}
  onCancel={() => {
    setOpen(false);
    form.resetFields();
    setEditId(null);
  }}
  footer={null}
>
  <Form layout="vertical" form={form} onFinish={handleSave}>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          name="material_id"
          label="Material"
          rules={[{ required: true }]}
        >
          <Select placeholder="Select material">
            {materials.map((m) => (
              <Option key={m.material_id} value={m.material_id}>
                {m.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="batch_no" label="Batch No">
          <Input />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="available_qty" label="Available Qty">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item
          name="issue_qty"
          label="Issue Qty"
          rules={[{ required: true }]}
        >
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="issue_date" label="Issue Date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="issue_type" label="Issue Type">
          <Input />
        </Form.Item>
      </Col>

      <Col span={24}>
        <Form.Item name="remark" label="Remark">
          <Input.TextArea rows={2} />
        </Form.Item>
      </Col>
    </Row>

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

export default RmIssueItemMaster;
