import { useEffect, useState } from "react";
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
import type { ColumnsType } from "antd/es/table";
import axios from "axios";

// ✅ Axios instance
const API = axios.create({
  baseURL: "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
});

// ✅ Customer interface
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
  country?: string;
  is_active?: "Active" | "Inactive" | number;
}

const CustomerMaster = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [form] = Form.useForm<Customer>();

  // Fetch all customers
  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const res = await API.get("/customers");
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
      message.error("Error fetching customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // Save (Add / Update)
  const handleSave = async (values: Customer) => {
    try {
      const payload = {
        ...values,
        is_active: values.is_active === "Active" ? 1 : 0,
      };
      if (editingCustomer?.id) {
        await API.put(`/customers/${editingCustomer.id}`, payload);
        message.success("Customer updated successfully");
      } else {
        await API.post("/customers", payload);
        message.success("Customer added successfully");
      }
      setIsModalOpen(false);
      form.resetFields();
      setEditingCustomer(null);
      fetchCustomers();
    } catch (err) {
      console.error(err);
      message.error("Error saving customer");
    }
  };

  // Delete
  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/customers/${id}`);
      message.success("Customer deleted");
      fetchCustomers();
    } catch (err) {
      console.error(err);
      message.error("Error deleting customer");
    }
  };

  // Table columns
  const columns: ColumnsType<Customer> = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Name", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "GST No", dataIndex: "gst_no", key: "gst_no" },
    { title: "PAN No", dataIndex: "pan_no", key: "pan_no" },
    { title: "Address", dataIndex: "address", key: "address" },
    { title: "City", dataIndex: "city", key: "city" },
    { title: "District ID", dataIndex: "district_id", key: "district_id" },
    { title: "State ID", dataIndex: "state_id", key: "state_id" },
    { title: "Country", dataIndex: "country", key: "country" },
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
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Customer) => (
        <>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => {
              setEditingCustomer(record);
              form.setFieldsValue({
                ...record,
                is_active:
                  record.is_active === 1 || record.is_active === "Active"
                    ? "Active"
                    : "Inactive",
              });
              setIsModalOpen(true);
            }}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Are you sure to delete this customer?"
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
        <h2 className="text-2xl font-semibold">Customer Master</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingCustomer(null);
            form.resetFields();
            setIsModalOpen(true);
          }}
        >
          Add Customer
        </Button>
      </div>

      <Table
        dataSource={customers}
        columns={columns}
        rowKey="id"
        bordered
        loading={loading}
        pagination={{ pageSize: 5 }}
      />

      <Modal
        title={editingCustomer ? "Edit Customer" : "Add Customer"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          form.resetFields();
          setEditingCustomer(null);
        }}
        footer={null}
        width={600}
      >
        <Form form={form} layout="vertical" onFinish={handleSave}>
           <div className="grid grid-cols-2 gap-4">
      <Form.Item name="name" label="Name" rules={[{ required: true }]}>
        <Input placeholder="Enter customer name" />
      </Form.Item>

      <Form.Item name="email" label="Email">
        <Input type="email" placeholder="Enter email" />
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

      <Form.Item name="city" label="City">
        <Input placeholder="Enter city" />
      </Form.Item>

      <Form.Item name="district_id" label="District ID">
        <Input placeholder="Enter district ID" />
      </Form.Item>

      <Form.Item name="state_id" label="State ID">
        <Input placeholder="Enter state ID" />
      </Form.Item>

      <Form.Item name="country" label="Country">
        <Input placeholder="Enter country" />
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
                setEditingCustomer(null);
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

export default CustomerMaster;
