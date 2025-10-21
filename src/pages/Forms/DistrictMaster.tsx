// import React, { useEffect, useState } from "react";
// import axios from "axios";

// interface StateType {
//   id: number;
//   name: string;
// }

// interface DistrictType {
//   id: number;
//   name: string;
//   state_id: number;
//   is_active: boolean | number;
// }

// type ModalMode = "add" | "edit";

// const DistrictsPage: React.FC = () => {
//   const [districts, setDistricts] = useState<DistrictType[]>([]);
//   const [filteredDistricts, setFilteredDistricts] = useState<DistrictType[]>([]);
//   const [states, setStates] = useState<StateType[]>([]);
//   const [search, setSearch] = useState<string>("");

//   const [showModal, setShowModal] = useState<boolean>(false);
//   const [modalMode, setModalMode] = useState<ModalMode>("add");
//   const [selectedDistrict, setSelectedDistrict] = useState<DistrictType | null>(null);
//   const [districtName, setDistrictName] = useState<string>("");
//   const [selectedStateId, setSelectedStateId] = useState<number | "">("");
//   const [loading, setLoading] = useState<boolean>(false);

//   // ✅ Update this according to your backend URLs
//   const API_DISTRICTS = "http://localhost:5000/api/districts";
// //   const API_STATES = "http://localhost:5000/api/states";

//   // Fetch all states (for dropdown)
//   const fetchStates = async (): Promise<void> => {
//     try {
//       const res = await axios.get<StateType[]>(API_DISTRICTS);
//       setStates(res.data);
//     } catch (err) {
//       console.error("Error fetching states:", err);
//     }
//   };

//   // Fetch all districts
//   const fetchDistricts = async (): Promise<void> => {
//     try {
//       const res = await axios.get<DistrictType[]>(API_DISTRICTS);
//       setDistricts(res.data);
//       setFilteredDistricts(res.data);
//     } catch (err) {
//       console.error("Error fetching districts:", err);
//     }
//   };

//   useEffect(() => {
//     fetchStates();
//     fetchDistricts();
//   }, []);

//   // Search filter
//   useEffect(() => {
//     const lower = search.toLowerCase();
//     setFilteredDistricts(
//       districts.filter((d) => d.name.toLowerCase().includes(lower))
//     );
//   }, [search, districts]);

//   // Open modal
//   const openModal = (mode: ModalMode, district: DistrictType | null = null): void => {
//     setModalMode(mode);
//     setSelectedDistrict(district);
//     setDistrictName(district ? district.name : "");
//     setSelectedStateId(district ? district.state_id : "");
//     setShowModal(true);
//   };

//   // Add or Edit District
//   const handleSave = async (): Promise<void> => {
//     if (!districtName.trim() || !selectedStateId) {
//       alert("Please select state and enter district name");
//       return;
//     }
//     setLoading(true);
//     try {
//       if (modalMode === "add") {
//         await axios.post(API_DISTRICTS, {
//           name: districtName,
//           state_id: selectedStateId,
//         });
//       } else if (modalMode === "edit" && selectedDistrict) {
//         await axios.put(`${API_DISTRICTS}/${selectedDistrict.id}`, {
//           name: districtName,
//           state_id: selectedStateId,
//         });
//       }
//       setShowModal(false);
//       setDistrictName("");
//       fetchDistricts();
//     } catch (err: any) {
//       console.error("Error saving district:", err);
//       alert("Error: " + (err.response?.data?.message || "Something went wrong"));
//     } finally {
//       setLoading(false);
//     }
//   };

//   // Delete District
//   const handleDelete = async (id: number): Promise<void> => {
//     const confirmDelete = window.confirm("Are you sure you want to delete this district?");
//     if (!confirmDelete) return;

//     try {
//       await axios.delete(`${API_DISTRICTS}/${id}`);
//       fetchDistricts();
//     } catch (err) {
//       console.error("Error deleting district:", err);
//       alert("Failed to delete district");
//     }
//   };

//   // Get state name by ID
//   const getStateName = (id: number): string => {
//     const state = states.find((s) => s.id === id);
//     return state ? state.name : "-";
//   };

//   return (
//     <div className="p-6 max-w-4xl mx-auto">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-4">
//         <h1 className="text-2xl font-bold">Districts List</h1>
//         <button
//           onClick={() => openModal("add")}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
//         >
//           Add District
//         </button>
//       </div>

//       {/* Search Box */}
//       <input
//         type="text"
//         placeholder="Search district..."
//         value={search}
//         onChange={(e) => setSearch(e.target.value)}
//         className="w-full border px-3 py-2 mb-4 rounded-md"
//       />

//       {/* Table */}
//       <table className="w-full border rounded-lg overflow-hidden">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="border px-3 py-2 text-left">ID</th>
//             <th className="border px-3 py-2 text-left">District Name</th>
//             <th className="border px-3 py-2 text-left">State</th>
//             <th className="border px-3 py-2 text-left">Active</th>
//             <th className="border px-3 py-2 text-center">Actions</th>
//           </tr>
//         </thead>
//         <tbody>
//           {filteredDistricts.map((d) => (
//             <tr key={d.id}>
//               <td className="border px-3 py-2">{d.id}</td>
//               <td className="border px-3 py-2">{d.name}</td>
//               <td className="border px-3 py-2">{getStateName(d.state_id)}</td>
//               <td className="border px-3 py-2 text-center">
//                 {d.is_active ? "✅" : "❌"}
//               </td>
//               <td className="border px-3 py-2 text-center">
//                 <button
//                   onClick={() => openModal("edit", d)}
//                   className="bg-yellow-400 text-white px-3 py-1 rounded hover:bg-yellow-500 mr-2"
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(d.id)}
//                   className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
//                 >
//                   Delete
//                 </button>
//               </td>
//             </tr>
//           ))}
//           {filteredDistricts.length === 0 && (
//             <tr>
//               <td
//                 colSpan={5}
//                 className="text-center py-4 text-gray-500 italic border"
//               >
//                 No districts found.
//               </td>
//             </tr>
//           )}
//         </tbody>
//       </table>

//       {/* Modal */}
//       {showModal && (
//         <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center">
//           <div className="bg-white p-6 rounded-lg shadow-lg w-96">
//             <h2 className="text-xl font-semibold mb-4">
//               {modalMode === "add" ? "Add New District" : "Edit District"}
//             </h2>

//             {/* State Dropdown */}
//             <select
//               value={selectedStateId}
//               onChange={(e) => setSelectedStateId(Number(e.target.value))}
//               className="w-full border rounded px-3 py-2 mb-4"
//             >
//               <option value="">Select State</option>
//               {states.map((state) => (
//                 <option key={state.id} value={state.id}>
//                   {state.name}
//                 </option>
//               ))}
//             </select>

//             {/* District Name */}
//             <input
//               type="text"
//               value={districtName}
//               onChange={(e) => setDistrictName(e.target.value)}
//               placeholder="Enter district name"
//               className="w-full border rounded px-3 py-2 mb-4"
//             />

//             {/* Buttons */}
//             <div className="flex justify-end gap-2">
//               <button
//                 onClick={() => setShowModal(false)}
//                 className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//               <button
//                 onClick={handleSave}
//                 disabled={loading}
//                 className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
//               >
//                 {loading ? "Saving..." : "Save"}
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DistrictsPage;



import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

const DistrictMaster: React.FC = () => {
  const [districts, setDistricts] = useState<any[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingDistrict, setEditingDistrict] = useState<any>(null);
  const [form] = Form.useForm();

  const API_BASE = "http://localhost:3000/api";

  // Fetch states for dropdown
  const fetchStates = async () => {
    try {
      const res = await axios.get(`${API_BASE}/states`);
      setStates(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load states");
    }
  };

  // Fetch all districts
  const fetchDistricts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE}/districts`);
      setDistricts(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to fetch districts");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStates();
    fetchDistricts();
  }, []);

  const handleAdd = () => {
    setEditingDistrict(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  const handleEdit = (record: any) => {
    setEditingDistrict(record);
    form.setFieldsValue({
      state_id: record.state_id,
      name: record.name,
      is_active: record.is_active ? "1" : "0",
    });
    setIsModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/districts/${id}`);
      message.success("District deleted successfully");
      fetchDistricts();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete district");
    }
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        state_id: Number(values.state_id),
        name: values.name.trim(),
        is_active: Number(values.is_active),
      };

      if (editingDistrict) {
        await axios.put(`${API_BASE}/districts/${editingDistrict.id}`, payload);
        message.success("District updated successfully");
      } else {
        await axios.post(`${API_BASE}/districts`, payload);
        message.success("District added successfully");
      }

      setIsModalVisible(false);
      fetchDistricts();
    } catch (err: any) {
      console.error(err);
      message.error("Failed to save district");
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: "10%",
    },
    {
      title: "State",
      dataIndex: "state_id",
      key: "state_id",
      render: (state_id: number) =>
        states.find((s) => s.id === state_id)?.name || "—",
    },
    {
      title: "District Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "is_active",
      render: (val: number) => (val === 1 ? "Active" : "Inactive"),
    },
    {
      title: "Actions",
      key: "actions",
      width: "15%",
      render: (_: any, record: any) => (
        <div style={{ display: "flex", gap: 8 }}>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Are you sure to delete this district?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      {/* ✅ Header Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <h2 style={{ margin: 0 }}>District Master</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Add District
        </Button>
      </div>

      {/* ✅ Table */}
      <Table
        dataSource={districts}
        columns={columns}
        rowKey="id"
        loading={loading}
        bordered
        pagination={{ pageSize: 5 }}
      />

      {/* ✅ Modal */}
      <Modal
        title={editingDistrict ? "Edit District" : "Add District"}
        open={isModalVisible}
        onCancel={() => setIsModalVisible(false)}
        onOk={handleSave}
        destroyOnClose
        okText="Save"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="state_id"
            label="State"
            rules={[{ required: true, message: "Please select a state" }]}
          >
            <Select placeholder="Select State">
              {states.map((s) => (
                <Option key={s.id} value={s.id}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="name"
            label="District Name"
            rules={[{ required: true, message: "Please enter district name" }]}
          >
            <Input placeholder="Enter district name" />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Status"
            rules={[{ required: true, message: "Please select status" }]}
          >
            <Select>
              <Option value="1">Active</Option>
              <Option value="0">Inactive</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DistrictMaster;


