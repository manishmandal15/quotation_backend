// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Modal,
//   Form,
//   Table,
//   Input,
//   InputNumber,
//   message,
//   Popconfirm,
// } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import axios from "axios";

// // 🔥 Load BASE URL from ENV
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // 🔥 API instance
// const StockEntryAPI = axios.create({
//   baseURL: `${BASE_URL}/product-stock-entry`,
//   headers: { "Content-Type": "application/json" },
// });

// // TS Interface
// interface StockEntryItem {
//   id: number;
//   product_id: number;
//   qty: number;
//   batch_no?: string;
//   challan_no?: string;
//   created_at?: string;
// }

// const ProductStockEntryMaster: React.FC = () => {
//   const [entries, setEntries] = useState<StockEntryItem[]>([]);
//   const [open, setOpen] = useState(false);
//   const [editId, setEditId] = useState<number | null>(null);
//   const [form] = Form.useForm();

//   // 🔥 Fetch All
//   const fetchEntries = async () => {
//     try {
//       const res = await StockEntryAPI.get("/");
//       setEntries(res.data);
//     } catch (err) {
//       console.error(err);
//       message.error("❌ Failed to fetch stock entries");
//     }
//   };

//   useEffect(() => {
//     fetchEntries();
//   }, []);

//   // 🔥 Save handler (Add / Edit)
//   const handleSave = async (values: any) => {
//     try {
//       if (editId) {
//         // Update
//         await StockEntryAPI.put(`/${editId}`, values);
//         message.success("✅ Entry updated successfully!");
//       } else {
//         // Add
//         await StockEntryAPI.post("/", values);
//         message.success("✅ Entry added successfully!");
//       }

//       fetchEntries();
//       setOpen(false);
//       form.resetFields();
//       setEditId(null);
//     } catch (err: any) {
//       message.error("❌ Unable to save entry");
//     }
//   };

//   // 🔥 Edit handler
//   const handleEdit = (record: StockEntryItem) => {
//     form.setFieldsValue(record);
//     setEditId(record.id);
//     setOpen(true);
//   };

//   // 🔥 Delete handler
//   const handleDelete = async (id: number) => {
//     try {
//       await StockEntryAPI.delete(`/${id}`);
//       message.success("🗑️ Deleted successfully!");
//       fetchEntries();
//     } catch (err) {
//       message.error("❌ Unable to delete entry");
//     }
//   };

//   // 🔥 Table columns
//  const columns = [
//   {
//     title: "Sno",
//     key: "sno",
//     render: (_: any, _rec: any, index: number) => index + 1,
//     width: 60,
//   },

//   { title: "Product ID", dataIndex: "product_id", key: "product_id" },

//   { title: "Quantity", dataIndex: "qty", key: "qty" },

//   { title: "Batch No", dataIndex: "batch_no", key: "batch_no" },

//   { title: "Challan No", dataIndex: "challan_no", key: "challan_no" },

//   {
//     title: "Created At",
//     dataIndex: "created_at",
//     key: "created_at",
//     render: (val: string | undefined) => {
//       if (!val) return "";
//       const d = new Date(val);
//       const yyyy = d.getFullYear();
//       const mm = String(d.getMonth() + 1).padStart(2, "0");
//       const dd = String(d.getDate()).padStart(2, "0");
//       return `${yyyy}/${mm}/${dd}`;
//     },
//   },

//   {
//     title: "Actions",
//     key: "actions",
//     render: (_: any, record: StockEntryItem) => (
//       <div style={{ display: "flex", gap: 8 }}>
//         <Button
//           icon={<EditOutlined style={{ color: "#1677ff" }} />}
//           onClick={() => handleEdit(record)}
//         />

//         <Popconfirm
//           title="Delete this entry?"
//           onConfirm={() => handleDelete(record.id)}
//         >
//           <Button icon={<DeleteOutlined style={{ color: "red" }} />} />
//         </Popconfirm>
//       </div>
//     ),
//   },
// ];

//   return (
//     <div className="p-6">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-semibold">Product Stock Entry</h2>
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={() => {
//             form.resetFields();
//             setEditId(null);
//             setOpen(true);
//           }}
//         >
//           Add Entry
//         </Button>
//       </div>

//       {/* Table */}
//       <Table
//         dataSource={entries}
//         columns={columns}
//         rowKey="id"
//         bordered
//         pagination={{ pageSize: 10 }}
//       />

//       {/* Modal */}
//       <Modal
//         title={editId ? "Edit Entry" : "Add New Entry"}
//         open={open}
//         onCancel={() => setOpen(false)}
//         destroyOnClose
//         footer={null}
//         width={600}
//       >
//         <Form layout="vertical" form={form} onFinish={handleSave}>
//           <Form.Item
//             name="product_id"
//             label="Product ID"
//             rules={[{ required: true, message: "Enter Product ID" }]}
//           >
//             <InputNumber style={{ width: "100%" }} />
//           </Form.Item>

//           <Form.Item
//             name="qty"
//             label="Quantity"
//             rules={[{ required: true, message: "Enter Quantity" }]}
//           >
//             <InputNumber style={{ width: "100%" }} />
//           </Form.Item>

//           <Form.Item name="batch_no" label="Batch Number">
//             <Input placeholder="Enter batch number" />
//           </Form.Item>

//           <Form.Item name="challan_no" label="Challan Number">
//             <Input placeholder="Enter challan number" />
//           </Form.Item>

//           <div className="flex justify-end mt-4">
//             <Button onClick={() => setOpen(false)} style={{ marginRight: 8 }}>
//               Close
//             </Button>
//             <Button type="primary" htmlType="submit">
//               Save
//             </Button>
//           </div>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default ProductStockEntryMaster;



import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Table,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Select,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const StockEntryAPI = axios.create({
  baseURL: `${BASE_URL}/product-stock-entry`,
  headers: { "Content-Type": "application/json" },
});

interface StockEntryItem {
  id: number;
  product_id: number;
  qty: number;
  batch_no?: string;
  challan_no?: string;
  created_at?: string;
  updated_at?: string;
}

const ProductStockEntryMaster: React.FC = () => {
  const [entries, setEntries] = useState<StockEntryItem[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form] = Form.useForm();

  // ✅ Fetch Stock Entries
  const fetchEntries = async () => {
    try {
      const res = await StockEntryAPI.get("/");
      setEntries(res.data);
    } catch (err) {
      console.error(err);
      message.error("❌ Failed to fetch stock entries");
    }
  };

  // ✅ Fetch Products
  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5001/api/products");
      setProducts(res.data);
    } catch (err) {
      console.error(err);
      message.error("❌ Failed to fetch products");
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchEntries();
  }, []);

  // ✅ Save / Update Entry
  const handleSave = async (values: any) => {
    try {
      if (editId) {
        await StockEntryAPI.put(`/${editId}`, values);
        message.success("✅ Entry updated successfully!");
      } else {
        await StockEntryAPI.post("/", values);
        message.success("✅ Entry added successfully!");
      }
      fetchEntries();
      setOpen(false);
      form.resetFields();
      setEditId(null);
    } catch {
      message.error("❌ Unable to save entry");
    }
  };

  // ✅ Edit Entry
  const handleEdit = (record: StockEntryItem) => {
    form.setFieldsValue(record);
    setEditId(record.id);
    setOpen(true);
  };

  // ✅ Delete Entry
  const handleDelete = async (id: number) => {
    try {
      await StockEntryAPI.delete(`/${id}`);
      message.success("🗑️ Deleted successfully!");
      fetchEntries();
    } catch {
      message.error("❌ Unable to delete entry");
    }
  };

  // ✅ Table Columns
  const columns = [
    {
      title: "Sno",
      key: "sno",
      render: (_: any, _rec: any, index: number) => index + 1,
      width: 60,
    },
    {
      title: "Product",
      dataIndex: "product_id",
      key: "product_id",
      render: (id: number) => {
        const product = products.find((p) => p.id === id);
        return product ? product.product_name : "Unknown";
      },
    },
    { title: "Quantity", dataIndex: "qty", key: "qty" },
    { title: "Batch No", dataIndex: "batch_no", key: "batch_no" },
    { title: "Challan No", dataIndex: "challan_no", key: "challan_no" },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (val: string) =>
        val ? dayjs(val).format("YYYY/MM/DD") : "-",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: StockEntryItem) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            icon={<EditOutlined style={{ color: "#1677ff" }} />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Delete this entry?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button icon={<DeleteOutlined style={{ color: "red" }} />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Product Stock Entry</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setEditId(null);
            setOpen(true);
          }}
        >
          Add Entry
        </Button>
      </div>

      <Table
        dataSource={entries}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />

      {/* ✅ Modal */}
      <Modal
        title={editId ? "Edit Entry" : "Add New Entry"}
        open={open}
        onCancel={() => setOpen(false)}
        destroyOnClose
        footer={null}
        width={600}
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          {/* ✅ Product Dropdown */}
         <Form.Item
  name="product_id"
  label="Product"
  rules={[{ required: true, message: "Select Product" }]}
>
  <Select placeholder="Select Product">
    {products.map((p) => (
      <Select.Option key={p.id} value={p.id}>
        {p.product_name}
      </Select.Option>
    ))}
  </Select>
</Form.Item>

          <Form.Item
            name="qty"
            label="Quantity"
            rules={[{ required: true, message: "Enter Quantity" }]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <Form.Item name="batch_no" label="Batch Number">
            <Input placeholder="Enter batch number" />
          </Form.Item>

          <Form.Item name="challan_no" label="Challan Number">
            <Input placeholder="Enter challan number" />
          </Form.Item>

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

export default ProductStockEntryMaster;
