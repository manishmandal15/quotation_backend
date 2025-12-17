import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Popconfirm,
  message,
  Col,
  Row
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface RawMaterial {
  material_id?: number;
  name: string;
  description?: string;
  material_type?: string;
  unit?: string;
  purchase_price?: number;
  min_quantity?: number;
  max_quantity?: number;
  batch_size?: number;
  storage_condition?: string;
  quality_grade?: string;
  is_active?: number;
}

const RawMaterialMaster = () => {
  const [data, setData] = useState<RawMaterial[]>([]);
  const [filteredData, setFilteredData] = useState<RawMaterial[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [form] = Form.useForm();

  // ===============================
  // FETCH MATERIALS
  // ===============================
  const fetchMaterials = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/raw-materials`);
      setData(res.data);
      setFilteredData(res.data);
    } catch {
      message.error("Failed to fetch raw materials");
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  // ===============================
  // SEARCH
  // ===============================
  const handleSearch = (value: string) => {
    setSearchText(value);
    const filtered = data.filter(
      (m) =>
        m.name?.toLowerCase().includes(value.toLowerCase()) ||
        m.material_type?.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredData(filtered);
  };

  // ===============================
  // SAVE (ADD / UPDATE)
  // ===============================
  const handleSave = async (values: RawMaterial) => {
    try {
      if (editId) {
        await axios.put(`${BASE_URL}/raw-materials/${editId}`, values);
        message.success("Raw material updated successfully");
      } else {
        await axios.post(`${BASE_URL}/raw-materials`, values);
        message.success("Raw material added successfully");
      }
      fetchMaterials();
      setOpen(false);
      setEditId(null);
      form.resetFields();
    } catch {
      message.error("Failed to save raw material");
    }
  };

  // ===============================
  // EDIT
  // ===============================
  const handleEdit = (record: RawMaterial) => {
    setEditId(record.material_id || null);
    form.setFieldsValue(record);
    setOpen(true);
  };

  // ===============================
  // DELETE
  // ===============================
  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await axios.delete(`${BASE_URL}/raw-materials/${id}`);
      message.success("Raw material deleted");
      fetchMaterials();
    } catch {
      message.error("Failed to delete raw material");
    }
  };

  // ===============================
  // TABLE COLUMNS
  // ===============================
  const columns = [
    {
      title: "S.No",
      render: (_: any, __: any, index: number) => index + 1,
      width: 60,
    },
    { title: "Name", dataIndex: "name" },
    { title: "Type", dataIndex: "material_type" },
    { title: "Unit", dataIndex: "unit" },
    { title: "Purchase Price", dataIndex: "purchase_price" },
    { title: "Min Qty", dataIndex: "min_quantity" },
    { title: "Max Qty", dataIndex: "max_quantity" },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (v: number) =>
        v === 1 ? (
          <span style={{ color: "green" }}>Active</span>
        ) : (
          <span style={{ color: "red" }}>Inactive</span>
        ),
    },
    {
      title: "Actions",
      render: (_: any, record: RawMaterial) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(record)} />
          <Popconfirm
            title="Are you sure to delete this material?"
            onConfirm={() => handleDelete(record.material_id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Raw Material Master</h2>
        <div className="flex gap-3">
          <Input.Search
            placeholder="Search material"
            allowClear
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 250 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditId(null);
              form.resetFields();
              setOpen(true);
            }}
          >
            Add Material
          </Button>
        </div>
      </div>

      {/* TABLE */}
      <Table
        bordered
        rowKey="material_id"
        columns={columns}
        dataSource={filteredData}
        pagination={{ pageSize: 5 }}
      />

      {/* MODAL */}
      <Modal
  open={open}
  title={editId ? "Edit Raw Material" : "Add Raw Material"}
  onCancel={() => setOpen(false)}
  onOk={() => form.submit()}
  width={900}
  destroyOnClose
>
  <Form layout="vertical" form={form} onFinish={handleSave}>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          name="name"
          label="Material Name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="material_type" label="Material Type">
          <Input />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="unit" label="Unit">
          <Input />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="purchase_price" label="Purchase Price">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="min_quantity" label="Min Quantity">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="max_quantity" label="Max Quantity">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="batch_size" label="Batch Size">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="storage_condition" label="Storage Condition">
          <Input />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="quality_grade" label="Quality Grade">
          <Input />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="is_active" label="Status">
          <Select>
            <Option value={1}>Active</Option>
            <Option value={0}>Inactive</Option>
          </Select>
        </Form.Item>
      </Col>

      <Col span={24}>
        <Form.Item name="description" label="Description">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Col>
    </Row>
  </Form>
</Modal>

    </div>
  );
};

export default RawMaterialMaster;
