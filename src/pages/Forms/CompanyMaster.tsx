// src/pages/Forms/CompanyMaster.tsx
import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Table,
  Input,
  Upload,
  message,
  Popconfirm,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";

// ✅ API setup
const API = axios.create({
  baseURL: "http://localhost:5000/api/company_settings",
});

interface Company {
  id: number;
  company_name: string;
  address: string;
  email: string;
  phone: string;
  website: string;
  gst_no: string;
  pan_no: string;
  logo_path?: string;
}

const CompanyMaster: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [editId, setEditId] = useState<number | null>(null);
  const [fileList, setFileList] = useState<any[]>([]);

  // ✅ Fetch all companies
  const fetchCompanies = async () => {
    try {
      const res = await API.get("/");
      setCompanies(res.data);
    } catch (err) {
      message.error("Failed to fetch companies");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // ✅ Save or Update company
  const handleSave = async (values: any) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });

      if (fileList.length > 0) {
        formData.append("logo", fileList[0].originFileObj);
      }

      if (editId) {
        await API.put(`/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Company updated successfully!");
      } else {
        await API.post("/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Company added successfully!");
      }

      fetchCompanies();
      setOpen(false);
      form.resetFields();
      setEditId(null);
      setFileList([]);
    } catch (err) {
      console.error(err);
      message.error("Error saving company");
    }
  };

  // ✅ Edit company
  const handleEdit = (record: Company) => {
    setEditId(record.id);
    form.setFieldsValue({
      company_name: record.company_name,
      email: record.email,
      phone: record.phone,
      website: record.website,
      address: record.address,
      gst_no: record.gst_no,
      pan_no: record.pan_no,
    });

    if (record.logo_path) {
      setFileList([
        {
          uid: "-1",
          name: "logo.png",
          status: "done",
          url: `http://localhost:5000${record.logo_path}`,
        },
      ]);
    } else {
      setFileList([]);
    }

    setOpen(true);
  };

  // ✅ Delete company
  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/${id}`);
      message.success("Company deleted successfully!");
      fetchCompanies();
    } catch {
      message.error("Error deleting company");
    }
  };

  // ✅ Table columns
  const columns = [
    { title: "ID", dataIndex: "id", key: "id", width: 60 },
    { title: "Name", dataIndex: "company_name", key: "company_name" },
    { title: "Email", dataIndex: "email", key: "email" },
    { title: "Phone", dataIndex: "phone", key: "phone" },
    { title: "Website", dataIndex: "website", key: "website" },
    { title: "GST No", dataIndex: "gst_no", key: "gst_no" },
    { title: "PAN No", dataIndex: "pan_no", key: "pan_no" },
    {
      title: "Logo",
      dataIndex: "logo_path",
      key: "logo_path",
      render: (logo: string) =>
        logo ? (
          <img
            src={`http://localhost:5000${logo}`}
            alt="logo"
            style={{
              width: 50,
              height: 50,
              objectFit: "cover",
              borderRadius: 4, // square border
            }}
          />
        ) : (
          "No Logo"
        ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Company) => (
        <div style={{ display: "flex", gap: 8 }}>
          {/* Edit Button */}
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

          {/* Delete Button */}
          <Popconfirm
            title="Are you sure to delete this company?"
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
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Company Master</h2>
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
          Add Company
        </Button>
      </div>

      <Table
        dataSource={companies}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
      />

      {/* Modal Form */}
      <Modal
        title={editId ? "Edit Company" : "Add New Company"}
        open={open}
        destroyOnClose
        onCancel={() => setOpen(false)}
        footer={null}
        width={700}
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <div className="grid grid-cols-2 gap-4">
            <Form.Item
              name="company_name"
              label="Company Name"
              rules={[{ required: true, message: "Please enter company name" }]}
            >
              <Input placeholder="Enter company name" />
            </Form.Item>

            <Form.Item name="email" label="Email">
              <Input type="email" placeholder="Enter email" />
            </Form.Item>

            <Form.Item name="phone" label="Phone">
              <Input placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item name="website" label="Website">
              <Input placeholder="Enter website" />
            </Form.Item>

            <Form.Item name="address" label="Address">
              <Input placeholder="Enter address" />
            </Form.Item>

            <Form.Item name="gst_no" label="GST Number">
              <Input placeholder="Enter GST number" />
            </Form.Item>

            <Form.Item name="pan_no" label="PAN Number">
              <Input placeholder="Enter PAN number" />
            </Form.Item>

            <Form.Item label="Company Logo">
              <Upload
                fileList={fileList}
                beforeUpload={() => false}
                onChange={({ fileList }) => setFileList(fileList)}
                maxCount={1}
              >
                <Button icon={<UploadOutlined />}>Upload Logo</Button>
              </Upload>
            </Form.Item>
          </div>

          <div className="flex justify-end mt-4">
            <Button
              onClick={() => setOpen(false)}
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

export default CompanyMaster;
