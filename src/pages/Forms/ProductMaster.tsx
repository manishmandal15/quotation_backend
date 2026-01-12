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
  Upload,
} from "antd";
import { UploadOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

// 👇 ye dusre pages ko modal open karne dega
export let openProductMasterModal: (() => void) | null = null;


const { Option } = Select;

interface Product {
  id?: number;
  product_code?: string;
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
  gst?: number;
  model?: string;
  frequency?: string;
  watt?: string;
  image?: string;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Axios instance
export const productAPI = axios.create({
  baseURL: `${BASE_URL}/products`,
});

const ProductMaster = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [editId, setEditId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [fileList, setFileList] = useState<any[]>([]);
  const [gstList, setGstList] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
const [pageSize, setPageSize] = useState(10);


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

  // Fetch GST options
  const fetchGst = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/gst-master`);
      setGstList(res.data);
    } catch (err) {
      console.error("Fetch GST error:", err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchGst();

    // 🔥 expose modal opener for other pages
  openProductMasterModal = () => {
    form.resetFields();
    setEditId(null);
    setFileList([]);
    setOpen(true);
  };

  return () => {
    openProductMasterModal = null;
  };
  }, []);

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = products.filter(
      (p) =>
        p.name?.toLowerCase().includes(text.toLowerCase()) ||
        p.product_code?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // Save product (Add/Update)
  const handleSave = async (values: any) => {
    try {
      const formData = new FormData();

      Object.keys(values).forEach((key) => {
        if (values[key] !== undefined && values[key] !== null) {
          formData.append(key, values[key]);
        }
      });

      if (fileList.length > 0) {
        formData.append("image", fileList[0].originFileObj);
      }

      if (editId) {
        await productAPI.put(`/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Product updated successfully!");
      } else {
        await productAPI.post("/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Product added successfully!");
      }

      fetchProducts();
      setOpen(false);
      form.resetFields();
      setFileList([]);
      setEditId(null);
    } catch (err: any) {
      console.error("Save product error:", err.response?.data || err.message);
      message.error("Failed to save product");
    }
  };

  const handleEdit = (record: Product) => {
    setEditId(record.id || null);
    form.setFieldsValue(record);
    setOpen(true);

    if (record.image) {
  setFileList([
    {
      uid: "-1",
      name: record.image,
      status: "done",
      url: `${BASE_URL.replace('/api', '')}/uploads/${record.image}`,
    },
  ]);

    } else {
      setFileList([]);
    }
  };

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

  const columns = [
    {
  title: "S.No",
  key: "sno",
  width: 60,
  render: (_t: any, _r: any, index: number) =>
    (currentPage - 1) * pageSize + index + 1,
},
    { title: "Code", dataIndex: "product_code" },
    { title: "Name", dataIndex: "name" },
    { title: "Unit", dataIndex: "unit" },
    { title: "Price", dataIndex: "price" },
    { title: "Sale Price", dataIndex: "sale_price" },
    { title: "HSN No", dataIndex: "hsn_no" },
    {
      title: "GST",
      dataIndex: "gst",
      render: (val: number) => {
        const gst = gstList.find((g) => g.gst_id === val);
        return gst ? gst.gst : "-";
      },
    },
    {
      title: "Status",
      dataIndex: "is_active",
      render: (val: number) =>
        val === 1 ? <span style={{ color: "green" }}>Active</span> : <span style={{ color: "red" }}>Inactive</span>,
    },
    {
      title: "Image",
      dataIndex: "image",
      render: (url: string) =>
        url ? <img src={`${BASE_URL.replace('/api', '')}/uploads/${url}`} width={50} style={{ borderRadius: 4 }} /> : "No Image",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Product) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button icon={<EditOutlined style={{ color: "#1677ff" }} />} onClick={() => handleEdit(record)} />
          <Popconfirm title="Are you sure to delete this product?" onConfirm={() => handleDelete(record.id)}>
            <Button icon={<DeleteOutlined style={{ color: "red" }} />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

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
              setFileList([]);
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
  columns={columns}
  pagination={{
    current: currentPage,
    pageSize: pageSize,
    onChange: (page, size) => {
      setCurrentPage(page);
      setPageSize(size || 5);
    },
  }}
/>


      {/* Add/Edit Modal */}
      <Modal title={editId ? "Edit Product" : "Add New Product"} open={open} destroyOnClose onCancel={() => setOpen(false)} footer={null} width={1000}>
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <div className="grid grid-cols-3 gap-4">
            <Form.Item name="product_code" label="Product Code" rules={[{ required: true }]}>
              <Input placeholder="Enter product code" />
            </Form.Item>
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input placeholder="Enter product name" />
            </Form.Item>
            <Form.Item name="unit" label="Unit" rules={[{ required: true }]}>
              <Input placeholder="Enter unit" />
            </Form.Item>
            <Form.Item name="price" label="Price" >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="sale_price" label="Sale Price" >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="hsn_no" label="HSN No" rules={[{ required: true }]}>
              <Input placeholder="Enter HSN number" />
            </Form.Item>
            
            <Form.Item name="min_level" label="Min Level" >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="max_level" label="Max Level" >
              <InputNumber style={{ width: "100%" }} />
            </Form.Item>
            <Form.Item name="product_service_type" label="Product/Service Type" rules={[{ required: true }]}>
              <Select placeholder="Select type" allowClear>
                <Option value={1}>Product</Option>
                <Option value={2}>Service</Option>
                <Option value={3}>Warranty</Option>
              </Select>
            </Form.Item>
            <Form.Item name="gst" label="GST" >
              <Select placeholder="Select GST" allowClear>
                {gstList.map((g) => ( 
                  <Option key={g.gst_id} value={g.gst_id}>
                    {g.gst_name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="model" label="Model" >
              <Input placeholder="Enter model" />
            </Form.Item>
            <Form.Item name="frequency" label="Frequency" >
              <Input placeholder="Enter frequency" />
            </Form.Item>
            <Form.Item name="watt" label="Watt" >
              <Input placeholder="Enter watt" />
            </Form.Item>
            <Form.Item name="is_active" label="Status" initialValue={1} rules={[{ required: true }]}>
              <Select>
                <Option value={1}>Active</Option>
                <Option value={0}>Inactive</Option>
              </Select>
            </Form.Item>
           <Form.Item label="Image" rules={[{ required: true }]}>
              <Upload fileList={fileList} beforeUpload={() => false} onChange={({ fileList }) => setFileList(fileList)}>
                <Button icon={<UploadOutlined />}>Select Image</Button>
              </Upload>
            </Form.Item>
            <Form.Item
  name="description"
  label="Description"
  
>
  <Input.TextArea
    placeholder="Enter description"
    rows={2}   // jitni height chahiye
  />
</Form.Item>
            <Form.Item name="specification" label="Specification">
              <Input.TextArea placeholder="Enter specification" rows={2} />
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
