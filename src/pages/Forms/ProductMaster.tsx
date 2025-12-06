// src/pages/Forms/ProductMaster.tsx
import { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  InputNumber,
  Modal,
  Select,
  message,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

interface Product {
  id?: number;
  product_code: string;
  name: string;
  description?: string;
  unit?: string;
  price?: number;
  sale_price?: number;
  hsn_no?: string;
  specification?: string;
  min_level?: number;
  max_level?: number;
  product_service_type?: number;
  is_active?: 0 | 1;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Axios instance for products API
export const productAPI = axios.create({
  baseURL: `${BASE_URL}/products`,
  headers: { "Content-Type": "application/json" },
});

const ProductMaster = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [editId, setEditId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");

  // Fetch all products
  const fetchProducts = async () => {
    try {
      const res = await productAPI.get("/");
      setProducts(res.data);
      setFilteredProducts(res.data);
    } catch (err: any) {
      console.error("Fetch products error:", err.response?.data || err.message);
      message.error("Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Search products by name or code
  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = products.filter(
      (p) =>
        p.name?.toLowerCase().includes(text.toLowerCase()) ||
        p.product_code?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // Save (Add or Update) product
  const handleSave = async (values: any) => {
  try {
    // Remove 'image' key if it exists
    const payload = { ...values };
    if ("image" in payload) delete payload.image;

    if (editId) {
      await productAPI.put(`/${editId}`, payload);
      message.success("Product updated successfully!");
    } else {
      await productAPI.post("/", payload);
      message.success("Product added successfully!");
    }

    fetchProducts();
    setOpen(false);
    form.resetFields();
    setEditId(null);
  } catch (err: any) {
    console.error("Save product error:", err.response?.data || err.message);
    message.error("Failed to save product");
  }
};


  // Edit product
  const handleEdit = (record: Product) => {
    setEditId(record.id || null);
    form.setFieldsValue(record);
    setOpen(true);
  };

  // Delete product
  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await productAPI.delete(`/${id}`);
      message.success("Product deleted successfully!");
      fetchProducts();
    } catch (err: any) {
      console.error("Delete product error:", err.response?.data || err.message);
      message.error("Failed to delete product");
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Product Master</h2>
        <div className="flex items-center gap-4">
          <Input.Search
            placeholder="Search by name or code"
            allowClear
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
          />
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setEditId(null);
              setOpen(true);
            }}
          >
            Add Product
          </Button>
        </div>
      </div>

      {/* Products Table */}
      <Table
        dataSource={filteredProducts}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
        columns={[
          { title: "Sno", key: "sno", render: (_t, _r, index) => index + 1, width: 60 },
          { title: "Code", dataIndex: "product_code" },
          { title: "Name", dataIndex: "name" },
          { title: "Unit", dataIndex: "unit" },
          { title: "Price", dataIndex: "price" },
          { title: "Sale Price", dataIndex: "sale_price" },
          { title: "HSN No", dataIndex: "hsn_no" },
          {
            title: "Status",
            dataIndex: "is_active",
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
            fixed: "right",
            render: (_: any, record: Product) => (
              <div style={{ display: "flex", gap: 8 }}>
                <Button
                  icon={<EditOutlined style={{ color: "#1677ff" }} />}
                  onClick={() => handleEdit(record)}
                />
                <Popconfirm
                  title="Are you sure to delete this product?"
                  onConfirm={() => handleDelete(record.id)}
                >
                  <Button icon={<DeleteOutlined style={{ color: "red" }} />} />
                </Popconfirm>
              </div>
            ),
          },
        ]}
      />

      {/* Add/Edit Modal */}
      <Modal
        title={editId ? "Edit Product" : "Add New Product"}
        open={open}
        destroyOnClose
        onCancel={() => setOpen(false)}
        footer={null}
        width={800}
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="product_code" label="Product Code" rules={[{ required: true }]}>
              <Input placeholder="Enter product code" />
            </Form.Item>

            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input placeholder="Enter product name" />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <Input placeholder="Enter description" />
            </Form.Item>

            <Form.Item name="unit" label="Unit">
              <Input placeholder="Enter unit" />
            </Form.Item>

            <Form.Item name="price" label="Price">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="sale_price" label="Sale Price">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="hsn_no" label="HSN No">
              <Input placeholder="Enter HSN number" />
            </Form.Item>

            <Form.Item name="specification" label="Specification">
              <Input placeholder="Enter specification" />
            </Form.Item>

            <Form.Item name="min_level" label="Min Level">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="max_level" label="Max Level">
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>

            <Form.Item name="product_service_type" label="Product/Service Type">
              <Select placeholder="Select type" allowClear>
                <Option value={1}>Product</Option>
                <Option value={2}>Service</Option>
                <Option value={2}>warrenty</Option>
              </Select>
            </Form.Item>

            <Form.Item name="is_active" label="Status">
              <Select>
                <Option value={1}>Active</Option>
                <Option value={0}>Inactive</Option>
              </Select>
            </Form.Item>
          </div>

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

export default ProductMaster;
