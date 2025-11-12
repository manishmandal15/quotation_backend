// // src/pages/Forms/CustomerMaster.tsx
// import React, { useState, useEffect } from "react";
// import {
//   Table,
//   Button,
//   Form,
//   Input,
//   Modal,
//   message,
//   Select,
//   Popconfirm,
//   Upload,
// } from "antd";
// import { UploadOutlined, EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
// import axios from "axios";

// const { Option } = Select;

// interface Customer {
//   id?: number;
//   name: string;
//   email?: string;
//   phone?: string;
//   gst_no?: string;
//   pan_no?: string;
//   address?: string;
//   city?: string;
//   district_id?: number;
//   state_id?: number;
//   country?: string;
//   is_active?: 1 | 0;
// }

// // Axios instance
// const API = axios.create({
//   baseURL: "http://localhost:5000/api/customers",
// });

// const CustomerMaster: React.FC = () => {
//   const [customers, setCustomers] = useState<Customer[]>([]);
//   const [open, setOpen] = useState(false);
//   const [form] = Form.useForm();
//   const [editId, setEditId] = useState<number | null>(null);

//   // Fetch all customers
//   const fetchCustomers = async () => {
//     try {
//       const res = await API.get("/");
//       setCustomers(res.data);
//     } catch (err) {
//       console.error(err);
//       message.error("Failed to fetch customers");
//     }
//   };

//   useEffect(() => {
//     fetchCustomers();
//   }, []);

//   // Save / Update customer
//   const handleSave = async (values: Customer) => {
//     try {
//       const payload = { ...values, is_active: values.is_active ?? 1 };
//       if (editId) {
//         await API.put(`/${editId}`, payload);
//         message.success("Customer updated successfully!");
//       } else {
//         await API.post("/", payload);
//         message.success("Customer added successfully!");
//       }
//       fetchCustomers();
//       setOpen(false);
//       form.resetFields();
//       setEditId(null);
//     } catch (err) {
//       console.error(err);
//       message.error("Failed to save customer");
//     }
//   };

//   // Edit customer
//   const handleEdit = (record: Customer) => {
//     setEditId(record.id || null);
//     form.setFieldsValue({
//       ...record,
//       is_active: record.is_active ?? 1,
//     });
//     setOpen(true);
//   };

//   // Delete customer
//   const handleDelete = async (id?: number) => {
//     if (!id) return;
//     try {
//       await API.delete(`/${id}`);
//       message.success("Customer deleted successfully!");
//       fetchCustomers();
//     } catch {
//       message.error("Failed to delete customer");
//     }
//   };

//   // Table columns
//   const columns = [
//     { title: "ID", dataIndex: "id", key: "id", width: 60 },
//     { title: "Name", dataIndex: "name", key: "name" },
//     { title: "Email", dataIndex: "email", key: "email" },
//     { title: "Phone", dataIndex: "phone", key: "phone" },
//     { title: "GST No", dataIndex: "gst_no", key: "gst_no" },
//     { title: "PAN No", dataIndex: "pan_no", key: "pan_no" },
//     { title: "Address", dataIndex: "address", key: "address" },
//     { title: "City", dataIndex: "city", key: "city" },
//     { title: "District ID", dataIndex: "district_id", key: "district_id" },
//     { title: "State ID", dataIndex: "state_id", key: "state_id" },
//     { title: "Country", dataIndex: "country", key: "country" },
//     {
//       title: "Status",
//       dataIndex: "is_active",
//       key: "is_active",
//       render: (val: number) =>
//         val === 1 ? <span style={{ color: "green" }}>Active</span> : <span style={{ color: "red" }}>Inactive</span>,
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_: any, record: Customer) => (
//         <div style={{ display: "flex", gap: 8 }}>
//           <Button
//             type="default"
//             icon={<EditOutlined style={{ color: "#1677ff" }} />}
//             onClick={() => handleEdit(record)}
//             style={{
//               borderColor: "#1677ff",
//               borderRadius: 4,
//               padding: "4px 8px",
//               minWidth: 36,
//               height: 36,
//             }}
//           />
//           <Popconfirm
//             title="Are you sure to delete this customer?"
//             onConfirm={() => handleDelete(record.id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button
//               type="default"
//               icon={<DeleteOutlined style={{ color: "red" }} />}
//               style={{
//                 borderColor: "red",
//                 borderRadius: 4,
//                 padding: "4px 8px",
//                 minWidth: 36,
//                 height: 36,
//               }}
//             />
//           </Popconfirm>
//         </div>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-semibold">Customer Master</h2>
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={() => {
//             form.resetFields();
//             setEditId(null);
//             setOpen(true);
//           }}
//         >
//           Add Customer
//         </Button>
//       </div>

//       <Table dataSource={customers} columns={columns} rowKey="id" bordered pagination={{ pageSize: 5 }} />

//       {/* Modal Form */}
//       <Modal
//         title={editId ? "Edit Customer" : "Add New Customer"}
//         open={open}
//         destroyOnClose
//         onCancel={() => setOpen(false)}
//         footer={null}
//         width={700}
//       >
//         <Form layout="vertical" form={form} onFinish={handleSave}>
//           <div className="grid grid-cols-2 gap-4">
//             <Form.Item name="name" label="Name" rules={[{ required: true }]}>
//               <Input placeholder="Enter customer name" />
//             </Form.Item>
//             <Form.Item name="email" label="Email">
//               <Input placeholder="Enter email" />
//             </Form.Item>
//             <Form.Item name="phone" label="Phone">
//               <Input placeholder="Enter phone number" />
//             </Form.Item>
//             <Form.Item name="gst_no" label="GST Number">
//               <Input placeholder="Enter GST number" />
//             </Form.Item>
//             <Form.Item name="pan_no" label="PAN Number">
//               <Input placeholder="Enter PAN number" />
//             </Form.Item>
//             <Form.Item name="address" label="Address">
//               <Input placeholder="Enter address" />
//             </Form.Item>
//             <Form.Item name="city" label="City">
//               <Input placeholder="Enter city" />
//             </Form.Item>
//             <Form.Item name="district_id" label="District ID">
//               <Input placeholder="Enter district ID" />
//             </Form.Item>
//             <Form.Item name="state_id" label="State ID">
//               <Input placeholder="Enter state ID" />
//             </Form.Item>
//             <Form.Item name="country" label="Country">
//               <Input placeholder="Enter country" />
//             </Form.Item>
//             <Form.Item name="is_active" label="Status">
//               <Select>
//                 <Option value={1}>Active</Option>
//                 <Option value={0}>Inactive</Option>
//               </Select>
//             </Form.Item>
//           </div>

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

// export default CustomerMaster;


// src/pages/Forms/CustomerMaster.tsx
import React, { useState, useEffect } from "react";
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
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

interface Customer {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  gst_no?: string;
  pan_no?: string;
  address?: string;
  city?: string;
  district_id?: number;
  state_id?: number;
  pincode?: string;
  country?: string;
  contact_person?: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_district?: number;
  shipping_state?: number;
  shipping_pinocde?: string;
  shipping_country?: string;
  is_active?: 1 | 0;
}

// API instances
const customerAPI = axios.create({ baseURL: "http://localhost:5000/api/customers" });
const stateAPI = axios.create({ baseURL: "http://localhost:5000/api/states" });
const districtAPI = axios.create({ baseURL: "http://localhost:5000/api/districts" });

const CustomerMaster: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [editId, setEditId] = useState<number | null>(null);

  // Fetch customers
  const fetchCustomers = async () => {
    try {
      const res = await customerAPI.get("/");
      setCustomers(res.data);
    } catch {
      message.error("Failed to fetch customers");
    }
  };

  // Fetch states and districts
  const fetchStates = async () => {
    try {
      const res = await stateAPI.get("/");
      setStates(res.data);
    } catch {
      message.error("Failed to fetch states");
    }
  };

  const fetchDistricts = async () => {
    try {
      const res = await districtAPI.get("/");
      setDistricts(res.data);
    } catch {
      message.error("Failed to fetch districts");
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchStates();
    fetchDistricts();
  }, []);

  // Save or update customer
  const handleSave = async (values: Customer) => {
    try {
      const payload = { ...values, is_active: values.is_active ?? 1 };
      if (editId) {
        await customerAPI.put(`/${editId}`, payload);
        message.success("Customer updated successfully!");
      } else {
        await customerAPI.post("/", payload);
        message.success("Customer added successfully!");
      }
      fetchCustomers();
      setOpen(false);
      form.resetFields();
      setEditId(null);
    } catch (err) {
      console.error(err);
      message.error("Failed to save customer");
    }
  };

  // Edit customer
  const handleEdit = (record: Customer) => {
    setEditId(record.id || null);
    form.setFieldsValue(record);
    setOpen(true);
  };

  // Delete customer
  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await customerAPI.delete(`/${id}`);
      message.success("Customer deleted successfully!");
      fetchCustomers();
    } catch {
      message.error("Failed to delete customer");
    }
  };

  // Table columns
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "GST", dataIndex: "gst_no", key: "gst_no" },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "State", dataIndex: "state_id", key: "state_id" },
    { title: "Country", dataIndex: "country", key: "country" },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
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
      render: (_: any, record: Customer) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="default"
            icon={<EditOutlined style={{ color: "#1677ff" }} />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure to delete this customer?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              type="default"
              icon={<DeleteOutlined style={{ color: "red" }} />}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Customer Master</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setEditId(null);
            setOpen(true);
          }}
        >
          Add Customer
        </Button>
      </div>

      <Table
  dataSource={customers}
  rowKey="id"
  bordered
  pagination={{ pageSize: 5 }}
  columns={[
    {
      title: "Sno",
      key: "sno",
      render: (_text, _record, index) => index + 1,
      width: 60,
    },
    // {
    //   title: "ID",
    //   dataIndex: "id",
    //   width: 60,
    //   fixed: "left",
    // },
    {
      title: "Customer Name",
      dataIndex: "name",
    },
    {
      title: "Contact Person",
      dataIndex: "contact_person",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "GST No",
      dataIndex: "gst_no",
    },
    {
      title: "PAN No",
      dataIndex: "pan_no",
    },
    // {
    //   title: "Billing City",
    //   dataIndex: "city",
    // },
    {
      title: "Billing State",
      dataIndex: "state_id",
      render: (id: number) =>
        states.find((s) => s.id === id)?.name || "-",
    },
    {
      title: "Billing District",
      dataIndex: "district_id",
      render: (id: number) =>
        districts.find((d) => d.id === id)?.name || "-",
    },
    // {
    //   title: "Shipping City",
    //   dataIndex: "shipping_city",
    // },
    {
      title: "Shipping State",
      dataIndex: "shipping_state",
      render: (id: number) =>
        states.find((s) => s.id === id)?.name || "-",
    },
    {
      title: "Shipping District",
      dataIndex: "shipping_district",
      render: (id: number) =>
        districts.find((d) => d.id === id)?.name || "-",
    },
    {
      title: "Country",
      dataIndex: "country",
    },
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
      render: (_: any, record: Customer) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="default"
            icon={<EditOutlined style={{ color: "#1677ff" }} />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure to delete this customer?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button
              type="default"
              icon={<DeleteOutlined style={{ color: "red" }} />}
            />
          </Popconfirm>
        </div>
      ),
    },
  ]}
/>


      {/* Modal Form */}
      <Modal
        title={editId ? "Edit Customer" : "Add New Customer"}
        open={open}
        destroyOnClose
        onCancel={() => setOpen(false)}
        footer={null}
        width={850}
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <h3 className="text-lg font-semibold mb-2">Billing Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input placeholder="Enter customer name" />
            </Form.Item>
            <Form.Item name="contact_person" label="Contact Person">
              <Input placeholder="Enter contact person name" />
            </Form.Item>
            <Form.Item name="email" label="Email">
              <Input placeholder="Enter email" />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
              <Input placeholder="Enter phone number" />
            </Form.Item>
            <Form.Item name="gst_no" label="GST Number">
              <Input placeholder="Enter GST number" />
            </Form.Item>
            <Form.Item name="pan_no" label="PAN Number">
              <Input placeholder="Enter PAN number" />
            </Form.Item>
            <Form.Item name="address" label="Address">
              <Input placeholder="Enter address" />
            </Form.Item>
            {/* <Form.Item name="city" label="City">
              <Input placeholder="Enter city" />
            </Form.Item> */}
            <Form.Item name="district_id" label="District">
              <Select placeholder="Select district">
                {districts.map((d) => (
                  <Option key={d.id} value={d.id}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="state_id" label="State">
              <Select placeholder="Select state">
                {states.map((s) => (
                  <Option key={s.id} value={s.id}>
                    {s.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="pincode" label="Pincode">
              <Input placeholder="Enter pincode" />
            </Form.Item>
            <Form.Item name="country" label="Country" initialValue="India">
              <Input placeholder="Enter country" />
            </Form.Item>
          </div>

          <h3 className="text-lg font-semibold mt-4 mb-2">
            Shipping Details
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item name="shipping_address" label="Shipping Address">
              <Input placeholder="Enter shipping address" />
            </Form.Item>
            <Form.Item name="shipping_city" label="Shipping City">
              <Input placeholder="Enter shipping city" />
            </Form.Item>
            <Form.Item name="shipping_district" label="Shipping District">
              <Select placeholder="Select shipping district">
                {districts.map((d) => (
                  <Option key={d.id} value={d.id}>
                    {d.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="shipping_state" label="Shipping State">
              <Select placeholder="Select shipping state">
                {states.map((s) => (
                  <Option key={s.id} value={s.id}>
                    {s.name}
                  </Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item name="shipping_pinocde" label="Shipping Pincode">
              <Input placeholder="Enter shipping pincode" />
            </Form.Item>
            <Form.Item
              name="shipping_country"
              label="Shipping Country"
              initialValue="India"
            >
              <Input placeholder="Enter shipping country" />
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

export default CustomerMaster;
