// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Modal,
//   Form,
//   Table,
//   Input,
//   Select,
//   message,
//   Popconfirm,
// } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // ✅ District API Instance
// const DistrictAPI = axios.create({
//   baseURL: `${BASE_URL}/districts`,
//   headers: { "Content-Type": "application/json" },
// });

// // ✅ States API Instance (For dropdown)
// const StatesAPI = axios.create({
//   baseURL: `${BASE_URL}/states`,
//   headers: { "Content-Type": "application/json" },
// });

// interface DistrictItem {
//   id: number;
//   name: string;
//   state_id: number;
//   is_active: number;


// }

// interface StateItem {
//   id: number;
//   name: string;
// }

// const DistrictMaster: React.FC = () => {
//   const [districts, setDistricts] = useState<DistrictItem[]>([]);
//   const [states, setStates] = useState<StateItem[]>([]);
//   const [open, setOpen] = useState(false);
//   const [form] = Form.useForm();
//   const [editId, setEditId] = useState<number | null>(null);

//   // ✅ Fetch all states for dropdown
//   const fetchStates = async () => {
//     try {
//       const res = await StatesAPI.get("/");
//       setStates(res.data);
//     } catch {
//       message.error("❌ Failed to fetch states");
//     }
//   };

//   // ✅ Fetch all districts
//   const fetchDistricts = async () => {
//     try {
//       const res = await DistrictAPI.get("/");
//       setDistricts(res.data);
//     } catch {
//       message.error("❌ Failed to fetch districts");
//     }
//   };

//   useEffect(() => {
//     fetchDistricts();
//     fetchStates();
//   }, []);

//   // ✅ Add / Edit district
//   const handleSave = async (values: any) => {
//     try {
//       if (editId) {
//         await DistrictAPI.put(`/${editId}`, values);
//         message.success("✅ District updated successfully!");
//       } else {
//         await DistrictAPI.post("/", values);
//         message.success("✅ District added successfully!");
//       }

//       fetchDistricts();
//       setOpen(false);
//       form.resetFields();
//       setEditId(null);
//     } catch {
//       message.error("❌ Error saving district");
//     }
//   };

//   // ✅ Edit
//   const handleEdit = (record: DistrictItem) => {
//     form.setFieldsValue(record);
//     setEditId(record.id);
//     setOpen(true);
//   };

//   // ✅ Delete
//   const handleDelete = async (id: number) => {
//     try {
//       await DistrictAPI.delete(`/${id}`);
//       message.success("🗑️ District deleted successfully!");
//       fetchDistricts();
//     } catch {
//       message.error("❌ Error deleting district");
//     }
//   };

//   // ✅ Table columns
//   const columns = [
//     {
//       title: "Sno",
//       key: "sno",
//       render: (_text, _record, index) => index + 1,
//       width: 60,
//     },
//     // { title: "ID", dataIndex: "id", key: "id", width: 60 },
//     { title: "District Name", dataIndex: "name", key: "name" },
//     {
//       title: "State",
//       dataIndex: "state_id",
//       key: "state_id",
//       render: (state_id: number) =>
//         states.find((state) => state.id === state_id)?.name || "Unknown",
//     },
//     {
//       title: "Status",
//       dataIndex: "is_active",
//       key: "is_active",
//       render: (val: number) =>
//         val === 1 ? (
//           <span style={{ color: "green", fontWeight: 500 }}>Active</span>
//         ) : (
//           <span style={{ color: "red", fontWeight: 500 }}>Inactive</span>
//         ),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_: any, record: DistrictItem) => (
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
//             title="Are you sure to delete this district?"
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
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-semibold">District Master</h2>
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={() => {
//             form.resetFields();
//             setEditId(null);
//             setOpen(true);
//           }}
//         >
//           Add District
//         </Button>
//       </div>

//       {/* Table */}
//       <Table
//         dataSource={districts}
//         columns={columns}
//         rowKey="id"
//         bordered
//         pagination={{ pageSize: 5 }}
//       />

//       {/* Modal Form */}
//       <Modal
//         title={editId ? "Edit District" : "Add New District"}
//         open={open}
//         onCancel={() => setOpen(false)}
//         destroyOnClose
//         footer={null}
//         width={600}
//       >
//         <Form layout="vertical" form={form} onFinish={handleSave}>
//           <Form.Item
//             name="name"
//             label="District Name"
//             rules={[{ required: true, message: "Please enter district name" }]}
//           >
//             <Input placeholder="Enter district name" />
//           </Form.Item>

//           <Form.Item
//             name="state_id"
//             label="State"
//             rules={[{ required: true, message: "Please select state" }]}
//           >
//             <Select
//               placeholder="Select State"
//               options={states.map((state) => ({
//                 value: state.id,
//                 label: state.name,
//               }))}
//             />
//           </Form.Item>

//           <Form.Item
//             name="is_active"
//             label="Status"
//             initialValue={1}
//             rules={[{ required: true }]}
//           >
//             <Select
//               options={[
//                 { value: 1, label: "Active" },
//                 { value: 0, label: "Inactive" },
//               ]}
//             />
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

// export default DistrictMaster;







import React, { useEffect, useState } from "react";
import {
  Button,
  Modal,
  Form,
  Table,
  Input,
  Select,
  message,
  Popconfirm,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// ✅ District API Instance
const DistrictAPI = axios.create({
  baseURL: `${BASE_URL}/districts`,
  headers: { "Content-Type": "application/json" },
});

// ✅ States API Instance (For dropdown)
const StatesAPI = axios.create({
  baseURL: `${BASE_URL}/states`,
  headers: { "Content-Type": "application/json" },
});

interface DistrictItem {
  id: number;
  name: string;
  state_id: number;
  is_active: number;
}

interface StateItem {
  id: number;
  name: string;
}

const DistrictMaster: React.FC = () => {
  const [districts, setDistricts] = useState<DistrictItem[]>([]);
  const [states, setStates] = useState<StateItem[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [editId, setEditId] = useState<number | null>(null);

  // ✅ Fetch all states for dropdown
  const fetchStates = async () => {
    try {
      const res = await StatesAPI.get("/");
      setStates(res.data);
    } catch {
      message.error("❌ Failed to fetch states");
    }
  };

  // ✅ Fetch all districts
  const fetchDistricts = async () => {
    try {
      const res = await DistrictAPI.get("/");
      setDistricts(res.data);
    } catch {
      message.error("❌ Failed to fetch districts");
    }
  };

  useEffect(() => {
    fetchDistricts();
    fetchStates();
  }, []);

  // ✅ Add / Edit district
  const handleSave = async (values: any) => {
    try {
      if (editId) {
        await DistrictAPI.put(`/${editId}`, values);
        message.success("✅ District updated successfully!");
      } else {
        await DistrictAPI.post("/", values);
        message.success("✅ District added successfully!");
      }

      fetchDistricts();
      setOpen(false);
      form.resetFields();
      setEditId(null);
    } catch {
      message.error("❌ Error saving district");
    }
  };

  // ✅ Edit
  const handleEdit = (record: DistrictItem) => {
    form.setFieldsValue(record);
    setEditId(record.id);
    setOpen(true);
  };

  // ✅ Delete
  const handleDelete = async (id: number) => {
    try {
      await DistrictAPI.delete(`/${id}`);
      message.success("🗑️ District deleted successfully!");
      fetchDistricts();
    } catch {
      message.error("❌ Error deleting district");
    }
  };

  // ✅ Table columns
  const columns = [
    {
      title: "Sno",
      key: "sno",
      render: (_text:any, _record:any, index:any) => index + 1,
      width: 60,
    },
    // { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "District Name", dataIndex: "name", key: "name" },
    {
      title: "State",
      dataIndex: "state_id",
      key: "state_id",
      render: (state_id: number) =>
        states.find((state) => state.id === state_id)?.name || "Unknown",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (val: number) =>
        val === 1 ? (
          <span style={{ color: "green", fontWeight: 500 }}>Active</span>
        ) : (
          <span style={{ color: "red", fontWeight: 500 }}>Inactive</span>
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: DistrictItem) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="default"
            icon={<EditOutlined style={{ color: "#1677ff" }} />}
            onClick={() => handleEdit(record)}
            style={{
              borderColor: "#1677ff",
              borderRadius: 4,
              padding: "4px 8px",
              minWidth: 36,
              height: 36,
            }}
          />
          <Popconfirm
            title="Are you sure to delete this district?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button
              type="default"
              icon={<DeleteOutlined style={{ color: "red" }} />}
              style={{
                borderColor: "red",
                borderRadius: 4,
                padding: "4px 8px",
                minWidth: 36,
                height: 36,
              }}
            />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">District Master</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setEditId(null);
            setOpen(true);
          }}
        >
          Add District
        </Button>
      </div>

      {/* Table */}
      <Table
        dataSource={districts}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
      />

      {/* Modal Form */}
      <Modal
        title={editId ? "Edit District" : "Add New District"}
        open={open}
        onCancel={() => setOpen(false)}
        destroyOnClose
        footer={null}
        width={600}
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <Form.Item
            name="name"
            label="District Name"
            rules={[{ required: true, message: "Please enter district name" }]}
          >
            <Input placeholder="Enter district name" />
          </Form.Item>

          <Form.Item
            name="state_id"
            label="State"
            rules={[{ required: true, message: "Please select state" }]}
          >
            <Select
              placeholder="Select State"
              options={states.map((state) => ({
                value: state.id,
                label: state.name,
              }))}
            />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Status"
            initialValue={1}
            rules={[{ required: true }]}
          >
            <Select
              options={[
                { value: 1, label: "Active" },
                { value: 0, label: "Inactive" },
              ]}
            />
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

export default DistrictMaster;







