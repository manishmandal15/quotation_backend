

// // Updated ProductStock.tsx with product and location dropdowns
// import { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Modal,
//   Form,
//   Input,
//   InputNumber,
//   DatePicker,
//   message,
//   Select,
//    Row, 
//    Col
// } from "antd";
// import axios from "axios";
// import dayjs from "dayjs";


// const BASE_URL = import.meta.env.VITE_API_BASE_URL;
// const API = axios.create({
//   baseURL: `${BASE_URL}/product-stock`,
// });
// const PRODUCTS_API = `${BASE_URL}/products`;
// const LOCATIONS_API = `${BASE_URL}/warehouse-locations`;

// export default function ProductStock() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [open, setOpen] = useState(false);
//   const [editing, setEditing] = useState(null);
//   const [products, setProducts] = useState([]);
//   const [locations, setLocations] = useState([]);
//   const [form] = Form.useForm();

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get("/");
//       setData(res.data);
//     } catch {
//       message.error("Failed to load data");
//     }
//     setLoading(false);
//   };

//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get(PRODUCTS_API);
//       setProducts(res.data);
//     } catch {
//       message.error("Failed to load products");
//     }
//   };

//   const fetchLocations = async () => {
//     try {
//       const res = await axios.get(LOCATIONS_API);
//       setLocations(res.data);
//     } catch {
//       message.error("Failed to load locations");
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     fetchProducts();
//     fetchLocations();
//   }, []);

//   const openAdd = () => {
//     setEditing(null);
//     form.resetFields();
//     setOpen(true);
//   };

//   const openEdit = (record:any) => {
//     setEditing(record.id);
//     form.setFieldsValue({
//       ...record,
//       challan_date: record.challan_date ? dayjs(record.challan_date) : null,
//     });
//     setOpen(true);
//   };

//   const handleDelete = async (id:any) => {
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
//         challan_date: values.challan_date
//           ? values.challan_date.startOf("day").format("YYYY-MM-DD")
//           : null,
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
//     {
//       title: "Sno",
//       key: "sno",
//       render: (_: any, _r: any, index: number) => index + 1,
//       width: 60,
//     },

//     {
//       title: "Product",
//       dataIndex: "product_id",
//       render: (id:any) => products.find((p) => p.id === id)?.name || id,
//     },

//     { title: "Batch/Lot No", dataIndex: "batch_lotno" },
//     { title: "Qty", dataIndex: "qty" },

//     {
//       title: "Location",
//       dataIndex: "location_id",
//       render: (id:any) =>
//         locations.find((l) => l.location_id === id)?.location_name || id,
//     },

//     { title: "Block Qty", dataIndex: "block_qty" },
//     { title: "Challan No", dataIndex: "challan_no" },
//     { title: "Challan Date", dataIndex: "challan_date" },
//     { title: "Remarks", dataIndex: "remarks" },

//     {
//       title: "Actions",
//       render: (_:any, record:any) => (
//         <>
//           <Button
//             size="small"
//             onClick={() => openEdit(record)}
//             style={{ marginRight: 8 }}
//           >
//             Edit
//           </Button>
//           <Button danger size="small" onClick={() => handleDelete(record.id)}>
//             Delete
//           </Button>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: 20 }}>
//       <h2 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "20px" }}>
//         Product stock
//       </h2>
//       <div
//         style={{
//           display: "flex",
//           marginRight: 5,
//           justifyContent: "flex-end",
//           marginBottom: 15,
//         }}
//       >
//         {/* LEFT SIDE SEARCH BAR */}
//         <Input
//           placeholder="Search..."
//           style={{ maxWidth: 250 }}
//           onChange={(e) => {
//             const text = e.target.value.toLowerCase();
//             const filtered = data.filter((item) =>
//               JSON.stringify(item).toLowerCase().includes(text)
//             );
//             setData(filtered);
//             if (text === "") fetchData();
//           }}
//         />

//         {/* RIGHT SIDE ADD BUTTON */}
//         <Button type="primary" onClick={openAdd}>
//           Add Stock
//         </Button>
//       </div>

//       <Table
//         rowKey="id"
//         columns={columns}
//         dataSource={data}
//         loading={loading}
//         bordered
//       />

//       <Modal
//   open={open}
//   onCancel={() => setOpen(false)}
//   onOk={handleSave}
//   title={editing ? "Edit Stock" : "Add Stock"}
//   width={800}   // thoda wide for 2 columns
// >
//   <Form form={form} layout="vertical">
//     <Row gutter={16}>
//       {/* Location */}
//       <Col span={12}>
//         <Form.Item
//           label="Location"
//           name="location_id"
//           rules={[{ required: true }]}
//         >
//           <Select
//             placeholder="Select location"
//             showSearch
//             optionFilterProp="children"
//             filterOption={(input, option) =>
//               (option?.children as string)
//                 ?.toLowerCase()
//                 .includes(input.toLowerCase()) ?? false
//             }
//           >
//             {locations.map((l) => (
//               <Select.Option key={l.location_id} value={l.location_id}>
//                 {l.location_name}
//               </Select.Option>
//             ))}
//           </Select>
//         </Form.Item>
//       </Col>

//       {/* Product */}
//       <Col span={12}>
//         <Form.Item
//           label="Product"
//           name="product_id"
//           rules={[{ required: true }]}
//         >
//           <Select
//             placeholder="Select product"
//             showSearch
//             optionFilterProp="children"
//             filterOption={(input, option) =>
//               (option?.children as string)
//                 ?.toLowerCase()
//                 .includes(input.toLowerCase()) ?? false
//             }
//           >
//             {products.map((p) => (
//               <Select.Option key={p.id} value={p.id}>
//                 {p.name}
//               </Select.Option>
//             ))}
//           </Select>
//         </Form.Item>
//       </Col>

//       {/* Batch Lot No */}
//       <Col span={12}>
//         <Form.Item
//           label="Batch Lot No"
//           name="batch_lotno"
//           rules={[{ required: true }]}
//         >
//           <Input />
//         </Form.Item>
//       </Col>

//       {/* Qty */}
//       <Col span={12}>
//         <Form.Item label="Qty" name="qty" rules={[{ required: true }]}>
//           <InputNumber style={{ width: "100%" }} />
//         </Form.Item>
//       </Col>

//       {/* Block Qty */}
//       <Col span={12}>
//         <Form.Item label="Block Qty" name="block_qty">
//           <Input />
//         </Form.Item>
//       </Col>

//       {/* Challan No */}
//       <Col span={12}>
//         <Form.Item label="Challan / Invoice No" name="challan_no">
//           <Input />
//         </Form.Item>
//       </Col>

//       {/* Challan Date */}
//       <Col span={12}>
//         <Form.Item label="Challan / Invoice Date" name="challan_date">
//           <DatePicker style={{ width: "100%" }} />
//         </Form.Item>
//       </Col>

//       {/* Remarks (Full Width) */}
//       <Col span={24}>
//         <Form.Item label="Remarks" name="remarks">
//           <Input.TextArea rows={3} />
//         </Form.Item>
//       </Col>
//     </Row>
//   </Form>
// </Modal>

//     </div>
//   );
// }





// ProductStock.tsx (FIXED + TYPE SAFE)
import { useEffect, useState } from "react";
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
  Col,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const API = axios.create({
  baseURL: `${BASE_URL}/product-stock`,
});

const PRODUCTS_API = `${BASE_URL}/products`;
const LOCATIONS_API = `${BASE_URL}/warehouse-locations`;

// ================= TYPES =================
type Product = {
  id: number;
  name: string;
};

type Location = {
  location_id: number;
  location_name: string;
};

type Stock = {
  id: number;
  product_id: number;
  location_id: number;
  batch_lotno: string;
  qty: number;
  block_qty?: number;
  challan_no?: string;
  challan_date?: string;
  remarks?: string;
};

export default function ProductStock() {
  const [data, setData] = useState<Stock[]>([]);
  const [originalData, setOriginalData] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(false);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);

  const [products, setProducts] = useState<Product[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);

  const [form] = Form.useForm();

  // ================= FETCH DATA =================
  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await API.get("/");
      setData(res.data);
      setOriginalData(res.data);
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

  // ================= OPEN =================
  const openAdd = () => {
    setEditing(null);
    form.resetFields();
    setOpen(true);
  };

  const openEdit = (record: Stock) => {
    setEditing(record.id);
    form.setFieldsValue({
      ...record,
      challan_date: record.challan_date ? dayjs(record.challan_date) : null,
    });
    setOpen(true);
  };

  // ================= DELETE =================
  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/${id}`);
      message.success("Deleted successfully");
      fetchData();
    } catch {
      message.error("Delete failed");
    }
  };

  // ================= SAVE =================
  const handleSave = async () => {
    try {
      const values = await form.validateFields();

      const payload = {
        ...values,
        challan_date: values.challan_date
          ? values.challan_date.format("YYYY-MM-DD")
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

  // ================= TABLE =================
  const columns = [
    {
      title: "Sno",
      key: "sno",
      render: (_: any, __: any, index: number) => index + 1,
      width: 60,
    },

    {
      title: "Product",
      dataIndex: "product_id",
      render: (id: number) =>
        products.find((p) => p.id === id)?.name || id,
    },

    { title: "Batch/Lot No", dataIndex: "batch_lotno" },
    { title: "Qty", dataIndex: "qty" },

    {
      title: "Location",
      dataIndex: "location_id",
      render: (id: number) =>
        locations.find((l) => l.location_id === id)?.location_name || id,
    },

    { title: "Block Qty", dataIndex: "block_qty" },
    { title: "Challan No", dataIndex: "challan_no" },
    { title: "Challan Date", dataIndex: "challan_date" },
    { title: "Remarks", dataIndex: "remarks" },

    {
      title: "Actions",
      render: (_: any, record: Stock) => (
        <>
          <Button size="small" onClick={() => openEdit(record)}>
            Edit
          </Button>
          <Button
            danger
            size="small"
            onClick={() => handleDelete(record.id)}
            style={{ marginLeft: 8 }}
          >
            Delete
          </Button>
        </>
      ),
    },
  ];

  // ================= SEARCH =================
  const handleSearch = (text: string) => {
    const value = text.toLowerCase();

    if (!value) {
      setData(originalData);
      return;
    }

    const filtered = originalData.filter((item) =>
      JSON.stringify(item).toLowerCase().includes(value)
    );

    setData(filtered);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Product Stock</h2>

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Input
          placeholder="Search..."
          style={{ maxWidth: 250 }}
          onChange={(e) => handleSearch(e.target.value)}
        />

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

      {/* ================= MODAL ================= */}
      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSave}
        title={editing ? "Edit Stock" : "Add Stock"}
        width={800}
      >
        <Form form={form} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Location"
                name="location_id"
                rules={[{ required: true }]}
              >
                <Select
                  options={locations.map((l) => ({
                    label: l.location_name,
                    value: l.location_id,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                label="Product"
                name="product_id"
                rules={[{ required: true }]}
              >
                <Select
                  options={products.map((p) => ({
                    label: p.name,
                    value: p.id,
                  }))}
                />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Batch Lot No" name="batch_lotno">
                <Input />
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item label="Qty" name="qty">
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

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