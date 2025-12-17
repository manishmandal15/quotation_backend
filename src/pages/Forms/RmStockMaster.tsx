import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  InputNumber,
  Modal,
  Select,
  message,
  Popconfirm,
  DatePicker,
  Col,
  Row
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const rmStockAPI = axios.create({
  baseURL: `${BASE_URL}/rm-stock`,
});

const rawMaterialAPI = axios.create({
  baseURL: `${BASE_URL}/raw-materials`,
});

interface Stock {
  stock_id?: number;
  material_id?: number;
  material_name?: string;
  quantity_on_hand?: number;
  batchno?: string;
  quantity_on_order?: number;
  min_quantity?: number;
  max_quantity?: number;
  warehouse_location?: number;
  last_inventory_check?: string;
  is_active?: number;
}

const RmStockMaster = () => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [materials, setMaterials] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form] = Form.useForm();

  // ================= FETCH =================
  const fetchStock = async () => {
    try {
      const res = await rmStockAPI.get("/");
      setStocks(res.data || []);
    } catch {
      message.error("Failed to load RM stock");
    }
  };

  const fetchMaterials = async () => {
    try {
      const res = await rawMaterialAPI.get("/");
      setMaterials(res.data || []);
    } catch {
      message.error("Failed to load materials");
    }
  };

  useEffect(() => {
    fetchStock();
    fetchMaterials();
  }, []);

  // ================= SAVE =================
  const handleSave = async (values: any) => {
    try {
      const payload = {
        ...values,
        last_inventory_check: values.last_inventory_check
          ? dayjs(values.last_inventory_check).format("YYYY-MM-DD HH:mm:ss")
          : null,
      };

      if (editId) {
        await rmStockAPI.put(`/${editId}`, payload);
        message.success("Stock updated successfully");
      } else {
        await rmStockAPI.post("/", payload);
        message.success("Stock added successfully");
      }

      setOpen(false);
      setEditId(null);
      form.resetFields();
      fetchStock();
    } catch {
      message.error("Failed to save stock");
    }
  };

  // ================= EDIT =================
  const handleEdit = (record: Stock) => {
    setEditId(record.stock_id || null);
    setOpen(true);
    form.setFieldsValue({
      ...record,
      last_inventory_check: record.last_inventory_check
        ? dayjs(record.last_inventory_check)
        : null,
    });
  };

  // ================= DELETE =================
  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await rmStockAPI.delete(`/${id}`);
      message.success("Stock deleted");
      fetchStock();
    } catch {
      message.error("Delete failed");
    }
  };

  // ================= TABLE =================
  const columns = [
    { title: "S.No", render: (_: any, __: any, i: number) => i + 1 },
    { title: "Material", dataIndex: "material_name" },
    { title: "Batch No", dataIndex: "batchno" },
    { title: "Qty On Hand", dataIndex: "quantity_on_hand" },
    { title: "Qty On Order", dataIndex: "quantity_on_order" },
    { title: "Min", dataIndex: "min_quantity" },
    { title: "Max", dataIndex: "max_quantity" },
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
      render: (_: any, record: Stock) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 6 }}
          />
          <Popconfirm
            title="Delete this stock?"
            onConfirm={() => handleDelete(record.stock_id)}
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
        <h2 className="text-xl font-semibold">Raw Material Stock</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setOpen(true);
            setEditId(null);
            form.resetFields();
          }}
        >
          Add Stock
        </Button>
      </div>

      <Table
        dataSource={stocks}
        columns={columns}
        rowKey="stock_id"
        bordered
      />

      {/* MODAL */}
      <Modal
  title={editId ? "Edit RM Stock" : "Add RM Stock"}
  open={open}
  onCancel={() => setOpen(false)}
  footer={null}
  width={800}
  destroyOnClose
>
  <Form layout="vertical" form={form} onFinish={handleSave}>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item
          name="material_id"
          label="Raw Material"
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
        <Form.Item name="batchno" label="Batch No">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="quantity_on_hand" label="Quantity On Hand">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="quantity_on_order" label="Quantity On Order">
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
        <Form.Item name="warehouse_location" label="Warehouse Location">
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="last_inventory_check" label="Last Inventory Check">
          <DatePicker showTime style={{ width: "100%" }} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="is_active" label="Status" initialValue={1}>
          <Select>
            <Option value={1}>Active</Option>
            <Option value={0}>Inactive</Option>
          </Select>
        </Form.Item>
      </Col>
    </Row>

    <div className="flex justify-end gap-2 mt-4">
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

export default RmStockMaster;
