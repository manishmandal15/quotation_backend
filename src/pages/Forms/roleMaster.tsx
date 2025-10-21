// // import React, { useState, useEffect } from "react";
// // import {
// //   Button,
// //   Modal,
// //   Form,
// //   Table,
// //   Input,
// //   Select,
// //   message,
// //   Popconfirm,
// // } from "antd";
// // import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// // import axios from "axios";

// // const API = axios.create({
// //   baseURL: "http://localhost:3000/api",
// //   headers: { "Content-Type": "application/json" },
// // });

// // interface Role {
// //   id: number;
// //   name: string;
// //   description: string;
// //   is_active: number;
// // }

// // const RoleMaster: React.FC = () => {
// //   const [roles, setRoles] = useState<Role[]>([]);
// //   const [open, setOpen] = useState(false);
// //   const [form] = Form.useForm();
// //   const [editId, setEditId] = useState<number | null>(null);

// //   // ✅ Fetch all roles
// //   const fetchRoles = async () => {
// //     try {
// //       const res = await API.get("/roles");
// //       setRoles(res.data);
// //     } catch {
// //       message.error("Failed to fetch roles");
// //     }
// //   };

// //   useEffect(() => {
// //     fetchRoles();
// //   }, []);

// //   // ✅ Save role (Add / Edit)
// //   const handleSave = async (values: any) => {
// //     try {
// //       if (editId) {
// //         await API.put(`/roles/${editId}`, values);
// //         message.success("✅ Role updated successfully!");
// //       } else {
// //         await API.post("/roles", values);
// //         message.success("✅ Role added successfully!");
// //       }

// //       fetchRoles();
// //       setOpen(false);
// //       form.resetFields();
// //       setEditId(null);
// //     } catch {
// //       message.error("❌ Error saving role");
// //     }
// //   };

// //   // ✅ Edit role
// //   const handleEdit = (record: Role) => {
// //     form.setFieldsValue(record);
// //     setEditId(record.id);
// //     setOpen(true);
// //   };

// //   // ✅ Delete role
// //   const handleDelete = async (id: number) => {
// //     try {
// //       await API.delete(`/roles/${id}`);
// //       message.success("🗑️ Role deleted successfully!");
// //       fetchRoles();
// //     } catch {
// //       message.error("❌ Error deleting role");
// //     }
// //   };

// //   // ✅ Table Columns
// //   const columns = [
// //     { title: "ID", dataIndex: "id", key: "id", width: 60 },
// //     { title: "Role Name", dataIndex: "name", key: "name" },
// //     { title: "Description", dataIndex: "description", key: "description" },
// //     {
// //       title: "Status",
// //       dataIndex: "is_active",
// //       key: "is_active",
// //       render: (val: number) =>
// //         val === 1 ? (
// //           <span style={{ color: "green" }}>Active</span>
// //         ) : (
// //           <span style={{ color: "red" }}>Inactive</span>
// //         ),
// //     },
// //     {
// //       title: "Actions",
// //       key: "actions",
// //       render: (_: any, record: Role) => (
// //         <>
// //           <Button
// //             type="primary"
// //             icon={<EditOutlined />}
// //             onClick={() => handleEdit(record)}
// //             style={{ marginRight: 4 }}
// //           />
// //           <Popconfirm
// //             title="Are you sure to delete this role?"
// //             onConfirm={() => handleDelete(record.id)}
// //             okText="Yes"
// //             cancelText="No"
// //           >
// //             <Button danger icon={<DeleteOutlined />} />
// //           </Popconfirm>
// //         </>
// //       ),
// //     },
// //   ];

// //   return (
// //     <div className="p-6">
// //       {/* Header with Add button on right */}
// //       <div className="flex justify-between items-center mb-4">
// //         <h2 className="text-2xl font-semibold">Role Master</h2>
// //         <Button
// //           type="primary"
// //           icon={<PlusOutlined />}
// //           onClick={() => {
// //             setEditId(null);
// //             form.resetFields();
// //             setOpen(true);
// //           }}
// //         >
// //           Add Role
// //         </Button>
// //       </div>

// //       {/* Table */}
// //       <Table
// //         dataSource={roles}
// //         columns={columns}
// //         rowKey="id"
// //         bordered
// //         pagination={{ pageSize: 5 }}
// //       />

// //       {/* Modal Form */}
// //       <Modal
// //         title={editId ? "Edit Role" : "Add New Role"}
// //         open={open}
// //         onCancel={() => setOpen(false)}
// //         footer={null}
// //         width={600}
// //       >
// //         <Form layout="vertical" form={form} onFinish={handleSave}>
// //           <Form.Item
// //             name="name"
// //             label="Role Name"
// //             rules={[{ required: true, message: "Please enter role name" }]}
// //           >
// //             <Input placeholder="Enter role name" />
// //           </Form.Item>

// //           <Form.Item name="description" label="Description">
// //             <Input.TextArea rows={3} placeholder="Enter description" />
// //           </Form.Item>

// //           <Form.Item
// //             name="is_active"
// //             label="Status"
// //             initialValue={1}
// //             rules={[{ required: true }]}
// //           >
// //             <Select
// //               options={[
// //                 { value: 1, label: "Active" },
// //                 { value: 0, label: "Inactive" },
// //               ]}
// //             />
// //           </Form.Item>

// //           <div className="flex justify-end mt-4">
// //             <Button onClick={() => setOpen(false)} style={{ marginRight: 8 }}>
// //               Close
// //             </Button>
// //             <Button type="primary" htmlType="submit">
// //               Save
// //             </Button>
// //           </div>
// //         </Form>
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default RoleMaster;



// import React, { useState, useEffect } from "react";
// import {
//   Button,
//   Modal,
//   Form,
//   Table,
//   Input,
//   Select,
//   Popconfirm,
//   notification,
// } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import axios from "axios";

// const API = axios.create({
//   baseURL: "http://localhost:3000/api",
//   headers: { "Content-Type": "application/json" },
// });

// interface Role {
//   id: number;
//   name: string;
//   description: string;
//   is_active: number;
// }

// const RoleMaster: React.FC = () => {
//   const [roles, setRoles] = useState<Role[]>([]);
//   const [open, setOpen] = useState(false);
//   const [form] = Form.useForm();
//   const [editId, setEditId] = useState<number | null>(null);

//   // ✅ Notification config
//   const openNotification = (
//     type: "success" | "error" | "info",
//     message: string,
//     description?: string
//   ) => {
//     notification[type]({
//       message,
//       description,
//       placement: "topRight",
//       duration: 2,
//     });
//   };

//   // ✅ Fetch all roles
//   const fetchRoles = async () => {
//     try {
//       const res = await API.get("/roles");
//       setRoles(res.data);
//     } catch {
//       openNotification("error", "Failed to Fetch Roles");
//     }
//   };

//   useEffect(() => {
//     fetchRoles();
//   }, []);

//   // ✅ Save role (Add / Edit)
//   const handleSave = async (values: any) => {
//     try {
//       if (editId) {
//         await API.put(`/roles/${editId}`, values);
//         openNotification(
//           "success",
//           "Role Updated",
//           "Role updated successfully!"
//         );
//       } else {
//         await API.post("/roles", values);
//         openNotification(
//           "success",
//           "Role Added",
//           "Role added successfully!"
//         );
//       }

//       await new Promise((res) => setTimeout(res, 300)); // ensure notification shows first
//       fetchRoles();
//       setOpen(false);
//       form.resetFields();
//       setEditId(null);
//     } catch {
//       openNotification("error", "Error Saving Role");
//     }
//   };

//   // ✅ Edit role
//   const handleEdit = (record: Role) => {
//     form.setFieldsValue(record);
//     setEditId(record.id);
//     setOpen(true);
//   };

//   // ✅ Delete role
//   const handleDelete = async (id: number) => {
//     try {
//       await API.delete(`/roles/${id}`);
//       openNotification(
//         "success",
//         "Role Deleted",
//         "Role deleted successfully!"
//       );
//       await new Promise((res) => setTimeout(res, 300));
//       fetchRoles();
//     } catch {
//       openNotification("error", "Error Deleting Role");
//     }
//   };

//   // ✅ Table Columns
//   const columns = [
//     { title: "ID", dataIndex: "id", key: "id", width: 60 },
//     { title: "Role Name", dataIndex: "name", key: "name" },
//     { title: "Description", dataIndex: "description", key: "description" },
//     {
//       title: "Status",
//       dataIndex: "is_active",
//       key: "is_active",
//       render: (val: number) =>
//         val === 1 ? (
//           <span style={{ color: "green" }}>Active</span>
//         ) : (
//           <span style={{ color: "red" }}>Inactive</span>
//         ),
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       render: (_: any, record: Role) => (
//         <>
//           <Button
//             type="primary"
//             icon={<EditOutlined />}
//             onClick={() => handleEdit(record)}
//             style={{ marginRight: 4 }}
//           />
//           <Popconfirm
//             title="Are you sure to delete this role?"
//             onConfirm={() => handleDelete(record.id)}
//             okText="Yes"
//             cancelText="No"
//           >
//             <Button danger icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6">
//       <div className="flex justify-between items-center mb-4">
//         <h2 className="text-2xl font-semibold">Role Master</h2>
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={() => {
//             setEditId(null);
//             form.resetFields();
//             setOpen(true);
//           }}
//         >
//           Add Role
//         </Button>
//       </div>

//       <Table
//         dataSource={roles}
//         columns={columns}
//         rowKey="id"
//         bordered
//         pagination={{ pageSize: 5 }}
//       />

//       <Modal
//         title={editId ? "Edit Role" : "Add New Role"}
//         open={open}
//         onCancel={() => setOpen(false)}
//         footer={null}
//         width={600}
//       >
//         <Form layout="vertical" form={form} onFinish={handleSave}>
//           <Form.Item
//             name="name"
//             label="Role Name"
//             rules={[{ required: true, message: "Please enter role name" }]}
//           >
//             <Input placeholder="Enter role name" />
//           </Form.Item>

//           <Form.Item name="description" label="Description">
//             <Input.TextArea rows={3} placeholder="Enter description" />
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

// export default RoleMaster;



import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Table,
  Input,
  Select,
  Popconfirm,
  notification,
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

// ✅ API instance
const API = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

// ✅ Type definition
interface Role {
  id: number;
  name: string;
  description: string;
  is_active: number;
}

// ✅ Notification Helper
const openNotification = (
  type: "success" | "error" | "info",
  message: string,
  description?: string
) => {
  notification[type]({
    message,
    description,
    placement: "topRight",
    duration: 2,
  });
};

const RoleMaster: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [editId, setEditId] = useState<number | null>(null);

  // ✅ Fetch all roles
  const fetchRoles = async () => {
    try {
      const res = await API.get("/roles");
      setRoles(res.data);
    } catch {
      openNotification("error", "Failed to Fetch Roles", "Please try again!");
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  // ✅ Save Role (Add / Edit)
  const handleSave = async (values: any) => {
    try {
      if (editId) {
        await API.put(`/roles/${editId}`, values);
        openNotification("success", "Role Updated", "Role updated successfully!");
      } else {
        await API.post("/roles", values);
        openNotification("success", "Role Added", "Role added successfully!");
      }

      fetchRoles();
      setOpen(false);
      form.resetFields();
      setEditId(null);
    } catch {
      openNotification("error", "Error Saving Role", "Something went wrong!");
    }
  };

  // ✅ Edit role
  const handleEdit = (record: Role) => {
    form.setFieldsValue(record);
    setEditId(record.id);
    setOpen(true);
  };

  // ✅ Delete role
  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/roles/${id}`);
      openNotification("info", "Role Deleted", "Role deleted successfully!");
      fetchRoles();
    } catch {
      openNotification("error", "Error Deleting Role", "Please try again!");
    }
  };

  // ✅ Table Columns
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Role Name", dataIndex: "name", key: "name" },
    { title: "Description", dataIndex: "description", key: "description" },
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
      render: (_: any, record: Role) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 4 }}
          />
          <Popconfirm
            title="Are you sure to delete this role?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Role Master</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditId(null);
            form.resetFields();
            setOpen(true);
          }}
        >
          Add Role
        </Button>
      </div>

      {/* Table */}
      <Table
        dataSource={roles}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
      />

      {/* Modal Form */}
      <Modal
        title={editId ? "Edit Role" : "Add New Role"}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        width={600}
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <Form.Item
            name="name"
            label="Role Name"
            rules={[{ required: true, message: "Please enter role name" }]}
          >
            <Input placeholder="Enter role name" />
          </Form.Item>

          <Form.Item name="description" label="Description">
            <Input.TextArea rows={3} placeholder="Enter description" />
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

export default RoleMaster;
