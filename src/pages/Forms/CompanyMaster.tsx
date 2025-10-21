import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  Form,
  Table,
  Input,
  Upload,
  message,
} from "antd";
import {
  UploadOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api",
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

  // Fetch all companies
  const fetchCompanies = async () => {
    try {
      const res = await API.get("/company_settings");
      setCompanies(res.data);
    } catch {
      message.error("Failed to fetch companies");
    }
  };

  useEffect(() => {
    fetchCompanies();
  }, []);

  // Save company (add/edit)
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
        await API.put(`/company_settings/${editId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Company updated successfully!");
      } else {
        await API.post("/company_settings", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        message.success("Company added successfully!");
      }

      fetchCompanies();
      setOpen(false);
      form.resetFields();
      setFileList([]);
      setEditId(null);
    } catch (err) {
      console.error(err);
      message.error("Error saving company");
    }
  };

  // Edit company
  const handleEdit = (record: Company) => {
    form.setFieldsValue(record);
    setEditId(record.id);
    setOpen(true);
    if (record.logo_path) {
      setFileList([
        {
          uid: "-1",
          name: "logo.png",
          status: "done",
          url: record.logo_path,
        },
      ]);
    } else {
      setFileList([]);
    }
  };

  // Delete company
  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/company_settings/${id}`);
      message.success("Company deleted successfully!");
      fetchCompanies();
    } catch {
      message.error("Error deleting company");
    }
  };

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
        logo ? <img src={logo} alt="logo" style={{ width: 50 }} /> : "No Logo",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: Company) => (
        <>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 4 }}
          />
          <Button
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
          />
        </>
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
            setEditId(null);
            form.resetFields();
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

      <Modal
        title={editId ? "Edit Company" : "Add New Company"}
        open={open}
        destroyOnClose
        onCancel={() => setOpen(false)}
        footer={null}
        width={700}
      >
        <Form
          layout="vertical"
          form={form}
          onFinish={handleSave}
          initialValues={{ status: "Active" }}
        >
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

            <Form.Item name="phone" label="Phone Number">
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

            <Form.Item name="logo" label="Company Logo">
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

export default CompanyMaster;
