// src/pages/Forms/ProductMaster.tsx
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  Modal,
  message,
  Select,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

// ✅ Type for Product
interface Product {
  id?: number;
  product_code: string;
  name: string;
  description?: string;
  unit?: string;
  price: number;
  is_active: number | string;
  created_at?: string;
  updated_at?: string;
}

// ✅ Axios instance
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  headers: { "Content-Type": "application/json" },
});

const ProductMaster: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [form] = Form.useForm<Product>();

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await API.get<Product[]>("/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      message.error("Error fetching products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Save product
  const handleSave = async (values: Product) => {
    try {
      const payload = {
        ...values,
        is_active: values.is_active === "Active" ? 1 : 0,
      };
      if (editingProduct && editingProduct.id) {
        await API.put(`/products/${editingProduct.id}`, payload);
        message.success("Product updated successfully");
      } else {
        await API.post("/products", payload);
        message.success("Product added successfully");
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      console.error(err);
      message.error("Error saving product");
    }
  };

  // Delete product
  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/products/${id}`);
      message.success("Product deleted successfully");
      fetchProducts();
    } catch (err) {
      console.error(err);
      message.error("Error deleting product");
    }
  };

  // Table columns
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Code", dataIndex: "product_code", key: "product_code" },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
    { title: "Unit", dataIndex: "unit", key: "unit" },
    { title: "Price", dataIndex: "price", key: "price" },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (val: number | string) =>
        val === 1 || val === "Active" ? (
          <span style={{ color: "green" }}>Active</span>
        ) : (
          <span style={{ color: "red" }}>Inactive</span>
        ),
    },
    { title: "Created At", dataIndex: "created_at", key: "created_at" },
    { title: "Updated At", dataIndex: "updated_at", key: "updated_at" },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Product) => (
        <>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingProduct(record);
              form.setFieldsValue({
                ...record,
                is_active: record.is_active === 1 ? "Active" : "Inactive",
              });
              setIsModalOpen(true);
            }}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure to delete this product?"
            onConfirm={() => record.id && handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Product Master</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingProduct(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Add Product
        </Button>
      </div>

      <Table
        dataSource={products}
        columns={columns}
        rowKey="id"
        bordered
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingProduct ? "Edit Product" : "Add Product"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingProduct(null);
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="product_code"
              label="Product Code"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter product code" />
            </Form.Item>

            <Form.Item
              name="name"
              label="Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="Enter product name" />
            </Form.Item>

            <Form.Item name="description" label="Description">
              <Input placeholder="Enter description" />
            </Form.Item>

            <Form.Item name="unit" label="Unit">
              <Input placeholder="Enter unit" />
            </Form.Item>

            <Form.Item
              name="price"
              label="Price"
              rules={[{ required: true }]}
            >
              <Input type="number" placeholder="Enter price" />
            </Form.Item>

            <Form.Item name="is_active" label="Status">
              <Select
                options={[
                  { value: "Active", label: "Active" },
                  { value: "Inactive", label: "Inactive" },
                ]}
              />
            </Form.Item>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              onClick={() => {
                setIsModalOpen(false);
                form.resetFields();
                setEditingProduct(null);
              }}
              style={{ marginRight: 8 }}
            >
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
