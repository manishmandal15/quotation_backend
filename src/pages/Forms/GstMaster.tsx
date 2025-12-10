import React, { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  message,
  Popconfirm,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;

const API = axios.create({
  baseURL: "http://localhost:5001/api/gst-master", 
});

const GstMasterCrud: React.FC = () => {
  const [gstList, setGstList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingGst, setEditingGst] = useState<any>(null);
  const [form] = Form.useForm();

  // Fetch all GST records
  const fetchGst = async () => {
    setLoading(true);
    try {
      const res = await API.get("");
      setGstList(res.data);
    } catch (err) {
      console.error("❌ GST Fetch Error:", err);
      message.error("Failed to fetch GST records");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGst();
  }, []);

  // Open modal to add new GST
  const handleAdd = () => {
    setEditingGst(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Open modal to edit existing GST
  const handleEdit = (record: any) => {
    setEditingGst(record);
    form.setFieldsValue({
      gst_name: record.gst_name,
      cgst: record.cgst,
      sgst: record.sgst,
      igst: record.igst,
      effective_from: dayjs(record.effective_from),
      effective_to: record.effective_to ? dayjs(record.effective_to) : null,
      status: record.status,
    });
    setIsModalVisible(true);
  };

  // Delete GST
  const handleDelete = async (id: number) => {
    try {
      await API.delete(`/${id}`);
      message.success("GST deleted successfully");
      fetchGst();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete GST");
    }
  };

  // Save GST (Add or Edit)
  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const payload = {
        gst_name: values.gst_name,
        cgst: Number(values.cgst),
        sgst: Number(values.sgst),
        igst: Number(values.igst),
        effective_from: values.effective_from.format("YYYY-MM-DD"),
        effective_to: values.effective_to
          ? values.effective_to.format("YYYY-MM-DD")
          : null,
        status: values.status || "Active",
      };

      if (editingGst) {
        await API.put(`/${editingGst.gst_id}`, payload);
        message.success("GST updated successfully");
      } else {
        await API.post("", payload);
        message.success("GST added successfully");
      }

      setIsModalVisible(false);
      fetchGst();
    } catch (err) {
      console.error(err);
      message.error("Failed to save GST");
    }
  };

  // Table columns
  const columns = [
    { title: "Sno", render: (_: any, __: any, i: number) => i + 1 },
    { title: "Name", dataIndex: "gst_name" },
    { title: "CGST %", dataIndex: "cgst" },
    { title: "SGST %", dataIndex: "sgst" },
    { title: "IGST %", dataIndex: "igst" },
    {
      title: "Effective From",
      dataIndex: "effective_from",
      render: (d: string) => dayjs(d).format("DD-MM-YYYY"),
    },
    {
      title: "Effective To",
      dataIndex: "effective_to",
      render: (d: string) => (d ? dayjs(d).format("DD-MM-YYYY") : "-"),
    },
    { title: "Status", dataIndex: "status" },
    {
      title: "Actions",
      render: (_: any, record: any) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Delete?"
            onConfirm={() => handleDelete(record.gst_id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
  <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 15 }}>
    <Button
      type="primary"
      icon={<PlusOutlined />}
      onClick={handleAdd}
    >
      Add GST
    </Button>
  </div>

  <Table
    columns={columns}
    dataSource={gstList}
    loading={loading}
    rowKey="gst_id"
  />

  <Modal
    title={editingGst ? "Edit GST" : "Add GST"}
    open={isModalVisible}
    onOk={handleSave}
    onCancel={() => setIsModalVisible(false)}
  >
    <Form form={form} layout="vertical">
      <Form.Item
        label="GST Name"
        name="gst_name"
        rules={[{ required: true }]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="CGST" name="cgst" rules={[{ required: true }]}>
        <Input type="number" />
      </Form.Item>

      <Form.Item label="SGST" name="sgst" rules={[{ required: true }]}>
        <Input type="number" />
      </Form.Item>

      <Form.Item label="IGST" name="igst" rules={[{ required: true }]}>
        <Input type="number" />
      </Form.Item>

      <Form.Item
        label="Effective From"
        name="effective_from"
        rules={[{ required: true }]}
      >
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Effective To" name="effective_to">
        <DatePicker style={{ width: "100%" }} />
      </Form.Item>

      <Form.Item label="Status" name="status">
        <Select>
          <Option value="Active">Active</Option>
          <Option value="Inactive">Inactive</Option>
        </Select>
      </Form.Item>
    </Form>
  </Modal>
</div>

  );
};

export default GstMasterCrud;
