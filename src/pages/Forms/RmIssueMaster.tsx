import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  message,
  Popconfirm,
  Select,
  Col,
  Row
} from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

interface RmIssue {
  id?: number;
  order_no?: string;
  job_no?: string;
  issue_date?: string;
  operator_id?: number;
  remark?: string;
  issue_type?: string;
}

const RmIssueMaster = () => {
  const [data, setData] = useState<RmIssue[]>([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form] = Form.useForm();

  // ===============================
  // FETCH ISSUES
  // ===============================
  const fetchIssues = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/rm-issues`);
      setData(res.data || []);
    } catch (err) {
      message.error("Failed to load RM Issues");
    }
  };

  useEffect(() => {
    fetchIssues();
  }, []);

  // ===============================
  // SAVE (ADD / UPDATE)
  // ===============================
  const handleSave = async (values: any) => {
    try {
      const payload = {
        ...values,
        issue_date: values.issue_date
          ? values.issue_date.format("YYYY-MM-DD")
          : null,
      };

      if (editId) {
        await axios.put(`${BASE_URL}/rm-issues/${editId}`, payload);
        message.success("RM Issue updated");
      } else {
        await axios.post(`${BASE_URL}/rm-issues`, payload);
        message.success("RM Issue added");
      }

      fetchIssues();
      setOpen(false);
      setEditId(null);
      form.resetFields();
    } catch (err) {
      message.error("Save failed");
    }
  };

  // ===============================
  // EDIT
  // ===============================
  const handleEdit = (record: RmIssue) => {
    setEditId(record.id || null);
    form.setFieldsValue({
      ...record,
      issue_date: record.issue_date ? dayjs(record.issue_date) : null,
    });
    setOpen(true);
  };

  // ===============================
  // DELETE
  // ===============================
  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await axios.delete(`${BASE_URL}/rm-issues/${id}`);
      message.success("RM Issue deleted");
      fetchIssues();
    } catch (err) {
      message.error("Delete failed");
    }
  };

  // ===============================
  // TABLE COLUMNS
  // ===============================
  const columns = [
    {
      title: "S.No",
      render: (_: any, __: any, index: number) => index + 1,
      width: 70,
    },
    { title: "Order No", dataIndex: "order_no" },
    { title: "Job No", dataIndex: "job_no" },
    { title: "Issue Date", dataIndex: "issue_date" },
    { title: "Issue Type", dataIndex: "issue_type" },
    { title: "Operator ID", dataIndex: "operator_id" },
    { title: "Remark", dataIndex: "remark" },
    {
      title: "Actions",
      render: (_: any, record: RmIssue) => (
        <>
          <Button
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            style={{ marginRight: 8 }}
          />
          <Popconfirm
            title="Delete this issue?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      {/* HEADER */}
      <div className="flex justify-between mb-4">
        <h2 className="text-xl font-semibold">Raw Material Issue</h2>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            form.resetFields();
            setEditId(null);
            setOpen(true);
          }}
        >
          Add Issue
        </Button>
      </div>

      {/* TABLE */}
      <Table
        dataSource={data}
        columns={columns}
        rowKey="id"
        bordered
        pagination={{ pageSize: 10 }}
      />

      {/* MODAL */}
      <Modal
  open={open}
  title={editId ? "Edit RM Issue" : "Add RM Issue"}
  onCancel={() => setOpen(false)}
  footer={null}
  destroyOnClose
>
  <Form layout="vertical" form={form} onFinish={handleSave}>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="order_no" label="Order No">
          <Input />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="job_no" label="Job No">
          <Input />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="issue_date" label="Issue Date">
          <DatePicker style={{ width: "100%" }} />
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="issue_type" label="Issue Type">
          <Select allowClear>
            <Select.Option value="Production">Production</Select.Option>
            <Select.Option value="Maintenance">Maintenance</Select.Option>
            <Select.Option value="Sample">Sample</Select.Option>
          </Select>
        </Form.Item>
      </Col>

      <Col span={12}>
        <Form.Item name="operator_id" label="Operator ID">
          <Input />
        </Form.Item>
      </Col>

      <Col span={12}></Col>

      <Col span={24}>
        <Form.Item name="remark" label="Remark">
          <Input.TextArea rows={3} />
        </Form.Item>
      </Col>
    </Row>

    <div className="flex justify-end gap-2">
      <Button onClick={() => setOpen(false)}>Cancel</Button>
      <Button type="primary" htmlType="submit">
        Save
      </Button>
    </div>
  </Form>
</Modal>

    </div>
  );
};

export default RmIssueMaster;
