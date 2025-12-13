// import React, { useEffect, useState } from "react";
// import { Table, Button, Modal, Form, Input, InputNumber, DatePicker, message } from "antd";
// import axios from "axios";
// import dayjs from "dayjs";

// const API = axios.create({ baseURL: "http://localhost:5001/api/product-stock" });

// export default function ProductStock() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [form] = Form.useForm();

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get("/");
//       setData(res.data);
//     } catch (err) {
//       message.error("Failed to load data");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   const openAdd = () => {
//     setEditing(null);
//     form.resetFields();
//     setOpen(true);
//   };

//   const openEdit = (record) => {
//     setEditing(record.id);
//     form.setFieldsValue({ ...record, challan_date: record.challan_date ? dayjs(record.challan_date) : null });
//     setOpen(true);
//   };

//   const handleDelete = async (id) => {
//     try {
//       await API.delete(`/${id}`);
//       message.success("Deleted successfully");
//       fetchData();
//     } catch {
//       message.error("Delete failed");
//     }
//   };

//   const handleSave = async () => {
//     try {
//       const values = await form.validateFields();
//       const payload = {
//         ...values,
//         challan_date: values.challan_date ? values.challan_date.format("YYYY-MM-DD") : null,
//       };

//       if (editing) {
//         await API.put(`/${editing}`, payload);
//         message.success("Updated successfully");
//       } else {
//         await API.post("/", payload);
//         message.success("Added successfully");
//       }

//       setOpen(false);
//       fetchData();
//     } catch (e) {
//       console.error(e);
//     }
//   };

//   const columns = [
//     { title: "ID", dataIndex: "id" },
//     { title: "Product ID", dataIndex: "product_id" },
//     { title: "Batch/Lot No", dataIndex: "batch_lotno" },
//     { title: "Qty", dataIndex: "qty" },
//     { title: "Location ID", dataIndex: "location_id" },
//     { title: "Block Qty", dataIndex: "block_qty" },
//     { title: "Challan No", dataIndex: "challan_no" },
//     { title: "Challan Date", dataIndex: "challan_date" },
//     { title: "Remarks", dataIndex: "remarks" },
//     {
//       title: "Actions",
//       render: (_, record) => (
//         <>
//           <Button size="small" onClick={() => openEdit(record)} style={{ marginRight: 8 }}>Edit</Button>
//           <Button danger size="small" onClick={() => handleDelete(record.id)}>Delete</Button>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: 20 }}>
//       <h2>Product Stock Details</h2>
//       <Button type="primary" onClick={openAdd} style={{ marginBottom: 15 }}>Add Stock</Button>

//       <Table rowKey="id" columns={columns} dataSource={data} loading={loading} bordered />

//       <Modal
//         open={open}
//         onCancel={() => setOpen(false)}
//         onOk={handleSave}
//         title={editing ? "Edit Stock" : "Add Stock"}
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item label="Product ID" name="product_id" rules={[{ required: true }]}>
//             <InputNumber style={{ width: "100%" }} />
//           </Form.Item>

//           <Form.Item label="Batch Lot No" name="batch_lotno" rules={[{ required: true }]}>
//             <Input />
//           </Form.Item>

//           <Form.Item label="Qty" name="qty" rules={[{ required: true }]}>
//             <InputNumber style={{ width: "100%" }} />
//           </Form.Item>

//           <Form.Item label="Location ID" name="location_id">
//             <InputNumber style={{ width: "100%" }} />
//           </Form.Item>

//           <Form.Item label="Block Qty" name="block_qty">
//             <Input />
//           </Form.Item>

//           <Form.Item label="Challan No" name="challan_no">
//             <Input />
//           </Form.Item>

//           <Form.Item label="Challan Date" name="challan_date">
//             <DatePicker style={{ width: "100%" }} />
//           </Form.Item>

//           <Form.Item label="Remarks" name="remarks">
//             <Input.TextArea rows={3} />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// }

// Updated ProductStock.tsx with product and location dropdowns
import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  DatePicker,
  message,
  Select,
   Row, 
   Col
} from "antd";
import axios from "axios";
import dayjs from "dayjs";

const API = axios.create({
  baseURL: "http://localhost:5001/api/product-stock",
});
const PRODUCTS_API = "http://localhost:5001/api/products";
const LOCATIONS_API = "http://localhost:5001/api/warehouse-locations";

export default function ProductStock() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [products, setProducts] = useState([]);
  const [locations, setLocations] = useState([]);
  const [form] = Form.useForm();

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await API.get("/");
      setData(res.data);
    } catch {
      message.error("Failed to load data");
    }
    setLoading(false);
  };

  const fetchProducts = async () => {
    try {
      const res = await axios.get(PRODUCTS_API);
      setProducts(res.data);
    } catch {
      message.error("Failed to load products");
    }
  };

  const fetchLocations = async () => {
    try {
      const res = await axios.get(LOCATIONS_API);
      setLocations(res.data);
    } catch {
      message.error("Failed to load locations");
    }
  };

  useEffect(() => {
    fetchData();
    fetchProducts();
    fetchLocations();
  }, []);

  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (record) => {
    setEditing(record.id);
    form.setFieldsValue({
      ...record,
      challan_date: record.challan_date ? dayjs(record.challan_date) : null,
    });
    setOpen(true);
  };

  const handleDelete = async (id) => {
    try {
      await API.delete(`/${id}`);
      message.success("Deleted successfully");
      fetchData();
    } catch {
      message.error("Delete failed");
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        ...values,
        challan_date: values.challan_date
          ? values.challan_date.startOf("day").format("YYYY-MM-DD")
          : null,
      };

      if (editing) {
        await API.put(`/${editing}`, payload);
        message.success("Updated successfully");
      } else {
        await API.post("/", payload);
        message.success("Added successfully");
      }

      setOpen(false);
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const columns = [
    {
      title: "Sno",
      key: "sno",
      render: (_: any, _r: any, index: number) => index + 1,
      width: 60,
    },

    {
      title: "Product",
      dataIndex: "product_id",
      render: (id) => products.find((p) => p.id === id)?.name || id,
    },

    { title: "Batch/Lot No", dataIndex: "batch_lotno" },
    { title: "Qty", dataIndex: "qty" },

    {
      title: "Location",
      dataIndex: "location_id",
      render: (id) =>
        locations.find((l) => l.location_id === id)?.location_name || id,
    },

    { title: "Block Qty", dataIndex: "block_qty" },
    { title: "Challan No", dataIndex: "challan_no" },
    { title: "Challan Date", dataIndex: "challan_date" },
    { title: "Remarks", dataIndex: "remarks" },

    {
      title: "Actions",
      render: (_, record) => (
        <>
          <Button
            size="small"
            onClick={() => openEdit(record)}
            style={{ marginRight: 8 }}
          >
            Edit
          </Button>
          <Button danger size="small" onClick={() => handleDelete(record.id)}>
            Delete
          </Button>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "20px" }}>
        Product stock
      </h2>
      <div
        style={{
          display: "flex",
          marginRight: 5,
          justifyContent: "flex-end",
          marginBottom: 15,
        }}
      >
        {/* LEFT SIDE SEARCH BAR */}
        <Input
          placeholder="Search..."
          style={{ maxWidth: 250 }}
          onChange={(e) => {
            const text = e.target.value.toLowerCase();
            const filtered = data.filter((item) =>
              JSON.stringify(item).toLowerCase().includes(text)
            );
            setData(filtered);
            if (text === "") fetchData();
          }}
        />

        {/* RIGHT SIDE ADD BUTTON */}
        <Button type="primary" onClick={openAdd}>
          Add Stock
        </Button>
      </div>

      <Table
        rowKey="id"
        columns={columns}
        dataSource={data}
        loading={loading}
        bordered
      />

      <Modal
  open={open}
  onCancel={() => setOpen(false)}
  onOk={handleSave}
  title={editing ? "Edit Stock" : "Add Stock"}
  width={800}   // thoda wide for 2 columns
>
  <Form form={form} layout="vertical">
    <Row gutter={16}>
      {/* Location */}
      <Col span={12}>
        <Form.Item
          label="Location"
          name="location_id"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Select location"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as string)
                ?.toLowerCase()
                .includes(input.toLowerCase()) ?? false
            }
          >
            {locations.map((l) => (
              <Select.Option key={l.location_id} value={l.location_id}>
                {l.location_name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      {/* Product */}
      <Col span={12}>
        <Form.Item
          label="Product"
          name="product_id"
          rules={[{ required: true }]}
        >
          <Select
            placeholder="Select product"
            showSearch
            optionFilterProp="children"
            filterOption={(input, option) =>
              (option?.children as string)
                ?.toLowerCase()
                .includes(input.toLowerCase()) ?? false
            }
          >
            {products.map((p) => (
              <Select.Option key={p.id} value={p.id}>
                {p.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
      </Col>

      {/* Batch Lot No */}
      <Col span={12}>
        <Form.Item
          label="Batch Lot No"
          name="batch_lotno"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Col>

      {/* Qty */}
      <Col span={12}>
        <Form.Item label="Qty" name="qty" rules={[{ required: true }]}>
          <InputNumber style={{ width: "100%" }} />
        </Form.Item>
      </Col>

      {/* Block Qty */}
      <Col span={12}>
        <Form.Item label="Block Qty" name="block_qty">
          <Input />
        </Form.Item>
      </Col>

      {/* Challan No */}
      <Col span={12}>
        <Form.Item label="Challan / Invoice No" name="challan_no">
          <Input />
        </Form.Item>
      </Col>

      {/* Challan Date */}
      <Col span={12}>
        <Form.Item label="Challan / Invoice Date" name="challan_date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Col>

      {/* Remarks (Full Width) */}
      <Col span={24}>
        <Form.Item label="Remarks" name="remarks">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Col>
    </Row>
  </Form>
</Modal>

    </div>
  );
}
