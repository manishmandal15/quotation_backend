// // import React, { useEffect, useState } from "react";
// // import {
// //   Table,
// //   Button,
// //   Modal,
// //   Form,
// //   Input,
// //   message,
// //   Popconfirm,
// // } from "antd";
// // import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
// // import axios from "axios";

// // const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // const API = axios.create({
// //   baseURL: `${BASE_URL}/module-menu`,
// //   headers: { "Content-Type": "application/json" },
// // });

// // const ModuleMenuMaster: React.FC = () => {
// //   const [data, setData] = useState<any[]>([]);
// //   const [loading, setLoading] = useState(false);
// //   const [isModalVisible, setIsModalVisible] = useState(false);
// //   const [editingRecord, setEditingRecord] = useState<any>(null);
// //   const [form] = Form.useForm();

// //   // Fetch All
// //   const fetchData = async () => {
// //     setLoading(true);
// //     try {
// //       const res = await API.get("/");
// //       setData(res.data);
// //     } catch (err) {
// //       console.error(err);
// //       message.error("Failed to fetch records");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchData();
// //   }, []);

// //   // Add new
// //   const handleAdd = () => {
// //     setEditingRecord(null);
// //     form.resetFields();
// //     setIsModalVisible(true);
// //   };

// //   // Edit
// //   const handleEdit = (record: any) => {
// //     setEditingRecord(record);
// //     form.setFieldsValue({
// //       module_menu_name: record.module_menu_name,
// //       url: record.url,
// //     });
// //     setIsModalVisible(true);
// //   };

// //   // Delete
// //   const handleDelete = async (id: number) => {
// //     try {
// //       await API.delete(`/${id}`);
// //       message.success("Record deleted successfully");
// //       fetchData();
// //     } catch (err) {
// //       console.error(err);
// //       message.error("Failed to delete");
// //     }
// //   };

// //   // Save or Update
// //   const handleSave = async () => {
// //     try {
// //       const values = await form.validateFields();
// //       const payload = {
// //         module_menu_name: values.module_menu_name.trim(),
// //         url: values.url.trim(),
// //       };

// //       if (editingRecord) {
// //         await API.put(`/${editingRecord.id}`, payload);
// //         message.success("Updated successfully");
// //       } else {
// //         await API.post("/", payload);
// //         message.success("Added successfully");
// //       }

// //       setIsModalVisible(false);
// //       form.resetFields();
// //       fetchData();
// //     } catch (err) {
// //       console.error(err);
// //       message.error("Failed to save");
// //     }
// //   };

// //   // Table Columns
// //   const columns = [
// //     {
// //       title: "Sno",
// //       key: "sno",
// //       render: (_: any, _record: any, index: number) => index + 1,
// //       width: 60,
// //     },
// //     { title: "Module Menu Name", dataIndex: "module_menu_name", key: "module_menu_name" },
// //     { title: "URL", dataIndex: "url", key: "url" },

// //     {
// //       title: "Actions",
// //       key: "actions",
// //       width: 120,
// //       render: (_: any, record: any) => (
// //         <div style={{ display: "flex", gap: 8 }}>
// //           <Button
// //             type="default"
// //             icon={<EditOutlined style={{ color: "#1677ff" }} />}
// //             onClick={() => handleEdit(record)}
// //             style={{
// //               borderColor: "#1677ff",
// //               borderRadius: 4,
// //               padding: "4px 8px",
// //               minWidth: 36,
// //               height: 36,
// //             }}
// //           />

// //           <Popconfirm
// //             title="Are you sure to delete this record?"
// //             onConfirm={() => handleDelete(record.id)}
// //           >
// //             <Button
// //               type="default"
// //               icon={<DeleteOutlined style={{ color: "red" }} />}
// //               style={{
// //                 borderColor: "red",
// //                 borderRadius: 4,
// //                 padding: "4px 8px",
// //                 minWidth: 36,
// //                 height: 36,
// //               }}
// //             />
// //           </Popconfirm>
// //         </div>
// //       ),
// //     },
// //   ];

// //   return (
// //     <div style={{ padding: 20 }}>
// //       {/* Header */}
// //       <div
// //         style={{
// //           display: "flex",
// //           justifyContent: "space-between",
// //           alignItems: "center",
// //           marginBottom: 16,
// //         }}
// //       >
// //         <h2 style={{ margin: 0 }}>Module Menu Master</h2>
// //         <Button
// //           type="primary"
// //           icon={<PlusOutlined />}
// //           onClick={handleAdd}
// //           style={{ borderRadius: 4 }}
// //         >
// //           Add Menu
// //         </Button>
// //       </div>

// //       {/* Table */}
// //       <Table
// //         dataSource={data}
// //         columns={columns}
// //         rowKey="id"
// //         loading={loading}
// //         bordered
// //         pagination={{ pageSize: 6 }}
// //       />

// //       {/* Modal */}
// //       <Modal
// //         title={editingRecord ? "Edit Menu" : "Add Menu"}
// //         open={isModalVisible}
// //         onCancel={() => setIsModalVisible(false)}
// //         onOk={handleSave}
// //         destroyOnClose
// //         okText="Save"
// //         width={600}
// //       >
// //         <Form form={form} layout="vertical">
// //           <Form.Item
// //             name="module_menu_name"
// //             label="Menu Name"
// //             rules={[{ required: true, message: "Please enter menu name" }]}
// //           >
// //             <Input placeholder="Enter menu name" />
// //           </Form.Item>

// //           <Form.Item
// //             name="url"
// //             label="Menu URL"
// //             rules={[{ required: true, message: "Please enter URL" }]}
// //           >
// //             <Input placeholder="/dashboard, /module/menu1 ..." />
// //           </Form.Item>
// //         </Form>
// //       </Modal>
// //     </div>
// //   );
// // };

// // export default ModuleMenuMaster;


// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Modal,
//   Form,
//   Input,
//   Popconfirm,
//   message,
// } from "antd";
// import axios from "axios";
// import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";

// const API_URL = "http://localhost:5000/api/module-menu";

// export default function ModuleMenuMaster() {
//   const [data, setData] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [form] = Form.useForm();
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editing, setEditing] = useState(null);

//   // FETCH
//   const getData = async () => {
//     setLoading(true);
//     try {
//       const res = await axios.get(API_URL);
//       setData(res.data);
//     } catch {
//       message.error("Failed to load data");
//     }
//     setLoading(false);
//   };

//   useEffect(() => {
//     getData();
//   }, []);

//   // ADD
//   const openAddModal = () => {
//     setEditing(null);
//     form.resetFields();
//     setIsModalOpen(true);
//   };

//   // EDIT
//   const openEditModal = (record) => {
//     setEditing(record);
//     form.setFieldsValue(record);
//     setIsModalOpen(true);
//   };

//   // SUBMIT
//   const handleSubmit = async (values) => {
//     try {
//       if (editing) {
//         await axios.put(`${API_URL}/${editing.module_menu_id}`, values);
//         message.success("Updated");
//       } else {
//         await axios.post(API_URL, values);
//         message.success("Saved");
//       }

//       setIsModalOpen(false);
//       form.resetFields();
//       getData();
//     } catch {
//       message.error("Failed");
//     }
//   };

//   // DELETE
//   const deleteItem = async (id) => {
//     try {
//       await axios.delete(`${API_URL}/${id}`);
//       message.success("Deleted");
//       getData();
//     } catch {
//       message.error("Delete failed");
//     }
//   };

//   // COLUMNS
//   const columns = [
//     {
//       title: "ID",
//       dataIndex: "module_menu_id",
//       width: 80,
//     },
//     {
//       title: "Module Menu Name",
//       dataIndex: "module_menu_name",
//     },
//     {
//       title: "URL",
//       dataIndex: "url",
//     },
//     {
//       title: "Actions",
//       width: 150,
//       render: (_, record) => (
//         <>
//           <Button
//             icon={<EditOutlined />}
//             onClick={() => openEditModal(record)}
//             style={{ marginRight: 10 }}
//           />
//           <Popconfirm
//             title="Are you sure?"
//             onConfirm={() => deleteItem(record.module_menu_id)}
//           >
//             <Button danger icon={<DeleteOutlined />} />
//           </Popconfirm>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div>
//       <h2>Module Menu Master</h2>

//       <Button
//         type="primary"
//         icon={<PlusOutlined />}
//         onClick={openAddModal}
//         style={{ marginBottom: 15 }}
//       >
//         Add New
//       </Button>

//       <Table
//         columns={columns}
//         rowKey="module_menu_id"
//         dataSource={data}
//         loading={loading}
//         bordered
//       />

//       <Modal
//         title={editing ? "Update Menu" : "Add Menu"}
//         open={isModalOpen}
//         onCancel={() => setIsModalOpen(false)}
//         onOk={() => form.submit()}
//       >
//         <Form form={form} layout="vertical" onFinish={handleSubmit}>
//           <Form.Item
//             name="module_menu_name"
//             label="Module Menu Name"
//             rules={[{ required: true, message: "Required" }]}
//           >
//             <Input placeholder="Enter module menu name" />
//           </Form.Item>

//           <Form.Item
//             name="url"
//             label="URL"
//             rules={[{ required: true, message: "URL required" }]}
//           >
//             <Input placeholder="Enter URL" />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// }



// src/pages/Forms/ModuleMenuMaster.tsx
// import React, { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Modal,
//   Form,
//   Input,
//   message,
//   Popconfirm,
// } from "antd";
// import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
// import axios from "axios";

// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// // Axios instance
// const API = axios.create({
//   baseURL: `${BASE_URL}/module-menu`,
//   headers: { "Content-Type": "application/json" },
// });

// const ModuleMenuMaster: React.FC = () => {
//   const [menus, setMenus] = useState<any[]>([]);
//   const [loading, setLoading] = useState(false);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [editingMenu, setEditingMenu] = useState<any>(null);
//   const [form] = Form.useForm();

//   // Fetch all module menus
//   const fetchMenus = async () => {
//     setLoading(true);
//     try {
//       const res = await API.get("/");
//       setMenus(res.data);
//     } catch (err) {
//       message.error("Failed to fetch menus");
//       console.error(err);
//     } finally {
//       setLoading(false);
//     }
//   };



//   const [urls, setUrls] = useState([]);

// const fetchUrls = async () => {
//   const res = await axios.get(`${BASE_URL}/url-mst`);
//   setUrls(res.data);
// };

// useEffect(() => {
//   fetchUrls();
// }, []);





//   useEffect(() => {
//     fetchMenus();
//   }, []);

//   // Add
//   const handleAdd = () => {
//     setEditingMenu(null);
//     form.resetFields();
//     setIsModalVisible(true);
//   };

//   // Edit
//   const handleEdit = (record: any) => {
//     setEditingMenu(record);
//     form.setFieldsValue({
//       module_menu_name: record.module_menu_name,
//       url: record.url,
//     });
//     setIsModalVisible(true);
//   };

//   // Delete
//   const handleDelete = async (id: number) => {
//     try {
//       await API.delete(`/${id}`);
//       message.success("Menu deleted successfully");
//       fetchMenus();
//     } catch (err) {
//       console.error(err);
//       message.error("Failed to delete menu");
//     }
//   };

//   // Save / Update
//   const handleSave = async () => {
//     try {
//       const values = await form.validateFields();
//       const payload = {
//         module_menu_name: values.module_menu_name.trim(),
//         url: values.url.trim(),
//       };

//       if (editingMenu) {
//         await API.put(`/${editingMenu.module_menu_id}`, payload);
//         message.success("Menu updated successfully");
//       } else {
//         await API.post("/", payload);
//         message.success("Menu added successfully");
//       }

//       setIsModalVisible(false);
//       form.resetFields();
//       fetchMenus();
//     } catch (err) {
//       console.error(err);
//       message.error("Failed to save menu");
//     }
//   };

//   // Table columns
//   const columns = [
//     {
//       title: "Sno",
//       key: "sno",
//       render: (_t, _r, index) => index + 1,
//       width: 60,
//     },
//     {
//       title: "Menu Name",
//       dataIndex: "module_menu_name",
//       key: "module_menu_name",
//     },
//     {
//       title: "URL",
//       dataIndex: "url",
//       key: "url",
//     },
//     {
//       title: "Actions",
//       key: "actions",
//       width: 150,
//       render: (_: any, record: any) => (
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
//             title="Are you sure to delete this menu?"
//             onConfirm={() => handleDelete(record.module_menu_id)}
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

//           <Button
//   onClick={() => navigator.clipboard.writeText(record.url)}
//   type="default"
// >
//   Copy
// </Button>


//         </div>
//       ),
//     },
//   ];

//   return (
//     <div style={{ padding: 20 }}>
//       {/* Header */}
//       <div
//         style={{
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//           marginBottom: 16,
//         }}
//       >
//         <h2 style={{ margin: 0 }}>Module Menu Master</h2>
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={handleAdd}
//           style={{ borderRadius: 4 }}
//         >
//           Add Menu
//         </Button>
//       </div>

//       {/* Table */}
//       <Table
//         dataSource={menus}
//         columns={columns}
//         rowKey="module_menu_id"
//         bordered
//         loading={loading}
//         pagination={{ pageSize: 5 }}
//       />

//       {/* Modal */}
//       <Modal
//         title={editingMenu ? "Edit Menu" : "Add Menu"}
//         open={isModalVisible}
//         onCancel={() => setIsModalVisible(false)}
//         onOk={handleSave}
//         okText="Save"
//         destroyOnClose
//         width={600}
//       >
//         <Form form={form} layout="vertical">
//           <Form.Item
//             name="module_menu_name"
//             label="Menu Name"
//             rules={[{ required: true, message: "Please enter menu name" }]}
//           >
//             <Input placeholder="Enter menu name" />
//           </Form.Item>

//           <Form.Item
//             name="url"
//             label="URL"
//             rules={[{ required: true, message: "Please enter URL" }]}
//           >
//             <Input placeholder="/dashboard, /reports..." />
//           </Form.Item>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default ModuleMenuMaster;





import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Axios instance for module menus
const API = axios.create({
  baseURL: `${BASE_URL}/module-menu`,
  headers: { "Content-Type": "application/json" },
});

const ModuleMenuMaster: React.FC = () => {
  const [menus, setMenus] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingMenu, setEditingMenu] = useState<any>(null);
  const [form] = Form.useForm();
   const [url, setUrl] = useState<string>("");

  // ✅ Fetch all module menus
  const fetchMenus = async () => {
    setLoading(true);
    try {
      const res = await API.get("/");
      setMenus(res.data);
    } catch (err) {
      message.error("Failed to fetch menus");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUrl = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/url");
      // Assuming your API returns something like { url: "https://example.com" }
       console.log("API response:", res.data); // ← ye line add karo
      setUrl(res.data[0].url);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch URL");
    }
  };

  useEffect(() => {
    fetchMenus();
    fetchUrl();
  }, []);

  // Add
  const handleAdd = () => {
    setEditingMenu(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Edit
  const handleEdit = (record: any) => {
    setEditingMenu(record);
    form.setFieldsValue({
      module_menu_name: record.module_menu_name,
      url: record.url,
    });
    setIsModalVisible(true);
  };

  // Delete
  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/${id}`);
      message.success("Menu deleted successfully");
      fetchMenus();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete menu");
    }
  };

  // Save / Update
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        module_menu_name: values.module_menu_name.trim(),
        url: values.url.trim(),
      };

      if (editingMenu) {
        await API.put(`/${editingMenu.module_menu_id}`, payload);
        message.success("Menu updated successfully");
      } else {
        await API.post("/", payload);
        message.success("Menu added successfully");
      }

      setIsModalVisible(false);
      form.resetFields();
      fetchMenus();
    } catch (err) {
      console.error(err);
      message.error("Failed to save menu");
    }
  };

  // Copy URL to clipboard
  const handleCopy = async () => {
  try {
    await navigator.clipboard.writeText(url);
    message.success("URL copied!");
  } catch (err) {
    console.error("Copy failed", err);
    message.error("Failed to copy URL");
  }
};


  // Table columns
  const columns = [
    { title: "Sno", key: "sno", render: (_t, _r, index) => index + 1, width: 60 },
    { title: "Menu Name", dataIndex: "module_menu_name", key: "module_menu_name" },
    { title: "URL", dataIndex: "url", key: "url" },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_: any, record: any) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="default"
            icon={<EditOutlined style={{ color: "#1677ff" }} />}
            onClick={() => handleEdit(record)}
            style={{ borderColor: "#1677ff", borderRadius: 4, padding: "4px 8px", minWidth: 36, height: 36 }}
          />
          <Popconfirm
            title="Are you sure to delete this menu?"
            onConfirm={() => handleDelete(record.module_menu_id)}
          >
            <Button
              type="default"
              icon={<DeleteOutlined style={{ color: "red" }} />}
              style={{ borderColor: "red", borderRadius: 4, padding: "4px 8px", minWidth: 36, height: 36 }}
            />
          </Popconfirm>

          {/* ✅ Copy URL Button */}
          <Button type="primary" onClick={handleCopy}>
      Copy URL
    </Button>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
        <h2 style={{ margin: 0 }}>Module Menu Master</h2>
        <Button type="primary" icon={<PlusOutlined />} onClick={handleAdd} style={{ borderRadius: 4 }}>
          Add Menu
        </Button>
      </div>

      {/* Table */}
      <Table
        dataSource={menus}
        columns={columns}
        rowKey="module_menu_id"
        bordered
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      {/* Modal */}
      <Modal
        title={editingMenu ? "Edit Menu" : "Add Menu"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        okText="Save"
        destroyOnClose
        width={600}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="module_menu_name"
            label="Menu Name"
            rules={[{ required: true, message: "Please enter menu name" }]}
          >
            <Input placeholder="Enter menu name" />
          </Form.Item>

          <Form.Item
            name="url"
            label="URL"
            rules={[{ required: true, message: "Please enter URL" }]}
          >
            <Input placeholder="/dashboard, /reports..." />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ModuleMenuMaster;

