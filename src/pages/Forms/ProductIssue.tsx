// import { useEffect, useState } from "react";
// import {
//   Table,
//   Button,
//   Modal,
//   Form,
//   Input,
//   DatePicker,
//   Select,
//   message,
//   Popconfirm,
// } from "antd";
// import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
// import axios from "axios";
// import dayjs from "dayjs";

// const { Option } = Select;
// const BASE_URL = import.meta.env.VITE_API_BASE_URL;

// const issueAPI = axios.create({
//   baseURL: `${BASE_URL}/product-issue`,
// });

// const ProductIssue = () => {
//   const [data, setData] = useState<any[]>([]);
//   const [customers, setCustomers] = useState<any[]>([]);
//   const [open, setOpen] = useState(false);
//   const [editId, setEditId] = useState<number | null>(null);
//   const [form] = Form.useForm();

//   const fetchIssues = async () => {
//     const res = await issueAPI.get("/");
//     setData(res.data);
//   };

//   const fetchCustomers = async () => {
//     const res = await axios.get(`${BASE_URL}/customers`);
//     setCustomers(res.data);
//   };

//   useEffect(() => {
//     fetchIssues();
//     fetchCustomers();
//   }, []);

//   const handleSave = async (values: any) => {
//     values.issue_date = values.issue_date?.format("YYYY-MM-DD");

//     if (editId) {
//       await issueAPI.put(`/${editId}`, values);
//       message.success("Issue updated");
//     } else {
//       await issueAPI.post("/", values);
//       message.success("Issue created");
//     }

//     fetchIssues();
//     setOpen(false);
//     form.resetFields();
//     setEditId(null);
//   };

//   const handleEdit = (record: any) => {
//     setEditId(record.issue_no);
//     form.setFieldsValue({
//       ...record,
//       issue_date: record.issue_date ? dayjs(record.issue_date) : null,
//     });
//     setOpen(true);
//   };

//   const handleDelete = async (id: number) => {
//     await issueAPI.delete(`/${id}`);
//     message.success("Issue deleted");
//     fetchIssues();
//   };

//   const columns = [
//     { title: "SNo", render: (_: any, __: any, i: number) => i + 1 },
//     { title: "Issue No", dataIndex: "issue_no" },
//     { title: "Order No", dataIndex: "order_no" },
//     { title: "Bill/Invoice No", dataIndex: "bill_no_invoice_no" },
//     { title: "Customer", dataIndex: "customer_name" },
//     {
//       title: "Issue Date",
//       dataIndex: "issue_date",
//       render: (v: string) => (v ? dayjs(v).format("YYYY/MM/DD") : "-"),
//     },
//     { title: "Issue Type", dataIndex: "issue_type" },
//     { title: "Issue By", dataIndex: "issue_by" },
//     {
//       title: "Actions",
//       render: (_: any, r: any) => (
//         <>
//           <Button icon={<EditOutlined />} onClick={() => handleEdit(r)} />
//           <Popconfirm
//             title="Delete?"
//             onConfirm={() => handleDelete(r.issue_no)}
//           >
//             <Button icon={<DeleteOutlined />} danger />
//           </Popconfirm>
//         </>
//       ),
//     },
//   ];

//   return (
//     <div className="p-6">
//       <div className="flex justify-between mb-4">
//         <h2 className="text-xl font-semibold">Product Issue</h2>
//         <Button
//           type="primary"
//           icon={<PlusOutlined />}
//           onClick={() => setOpen(true)}
//         >
//           Add Issue
//         </Button>
//       </div>

//       <Table rowKey="issue_no" bordered dataSource={data} columns={columns} />

//       <Modal
//         open={open}
//         title={editId ? "Edit Issue" : "Add Issue"}
//         onCancel={() => setOpen(false)}
//         footer={null}
//         width={800}
//       >
//         <Form layout="vertical" form={form} onFinish={handleSave}>
//           <Form.Item name="order_no" label="Order No">
//             <Input />
//           </Form.Item>

//           <Form.Item name="bill_no_invoice_no" label="Bill / Invoice No">
//             <Input />
//           </Form.Item>

//          <Form.Item
//   name="customer_id"
//   label="Customer"
//   rules={[{ required: true, message: "Select customer" }]}
// >
//   <Select
//     showSearch
//     placeholder="Select customer"
//     optionFilterProp="children"
//     filterOption={(input, option) =>
//       option?.children
//         ?.toLowerCase()
//         .includes(input.toLowerCase())
//     }
//   >
//     {customers.map((c) => (
//       <Option key={c.customer_id} value={c.customer_id}>
//         {c.name}
//       </Option>
//     ))}
//   </Select>
// </Form.Item>

//           <Form.Item name="issue_date" label="Issue Date">
//             <DatePicker format="YYYY/MM/DD" className="w-full" />
//           </Form.Item>

//           <Form.Item name="issue_type" label="Issue Type">
//             <Input />
//           </Form.Item>

//           <Form.Item name="issue_by" label="Issue By">
//             <Input />
//           </Form.Item>

//           <Form.Item name="remarks" label="Remarks">
//             <Input.TextArea rows={2} />
//           </Form.Item>

//           <div className="flex justify-end gap-2">
//             <Button onClick={() => setOpen(false)}>Cancel</Button>
//             <Button type="primary" htmlType="submit">
//               Save
//             </Button>
//           </div>
//         </Form>
//       </Modal>
//     </div>
//   );
// };

// export default ProductIssue;







import { useEffect, useState } from "react";
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
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Option } = Select;
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const issueAPI = axios.create({
  baseURL: `${BASE_URL}/product-issue`,
});

const ProductIssue = () => {
  const [data, setData] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [open, setOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form] = Form.useForm();

  const fetchIssues = async () => {
    const res = await issueAPI.get("/");
    setData(res.data);
  };

  const fetchCustomers = async () => {
    const res = await axios.get(`${BASE_URL}/customers`);
    setCustomers(res.data);
  };

  useEffect(() => {
    fetchIssues();
    fetchCustomers();
  }, []);

  const handleSave = async (values) => {
    values.issue_date = values.issue_date?.format("YYYY-MM-DD");

    if (editId) {
      await issueAPI.put(`/${editId}`, values);
      message.success("Issue updated");
    } else {
      await issueAPI.post("/", values);
      message.success("Issue created");
    }

    setOpen(false);
    form.resetFields();
    setEditId(null);
    fetchIssues();
  };

  const handleEdit = (record) => {
    setEditId(record.issue_no);
    form.setFieldsValue({
      ...record,
      issue_date: record.issue_date ? dayjs(record.issue_date) : null,
    });
    setOpen(true);
  };

  const columns = [
    { title: "SNo", render: (_, __, i) => i + 1 },
    { title: "Issue No", dataIndex: "issue_no" },
    { title: "Order No", dataIndex: "order_no" },
    { title: "Invoice No", dataIndex: "bill_no_invoice_no" },
    { title: "Customer", dataIndex: "customer_name" },
    {
      title: "Issue Date",
      dataIndex: "issue_date",
      render: (v) => (v ? dayjs(v).format("YYYY/MM/DD") : "-"),
    },
    { title: "Issue Type", dataIndex: "issue_type" },
    { title: "Issue By", dataIndex: "issue_by" },
    {
      title: "Actions",
      render: (_, r) => (
        <>
          <Button icon={<EditOutlined />} onClick={() => handleEdit(r)} />
          <Popconfirm
            title="Delete?"
            onConfirm={() => issueAPI.delete(`/${r.issue_no}`).then(fetchIssues)}
          >
            <Button icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Button type="primary" icon={<PlusOutlined />} onClick={() => setOpen(true)}>
        Add Issue
      </Button>

      <Table rowKey="issue_no" columns={columns} dataSource={data} bordered />

      <Modal
        open={open}
        title={editId ? "Edit Issue" : "Add Issue"}
        footer={null}
        onCancel={() => setOpen(false)}
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <Form.Item name="order_no" label="Order No">
            <Input />
          </Form.Item>

          <Form.Item name="bill_no_invoice_no" label="Invoice No">
            <Input />
          </Form.Item>

          <Form.Item
            name="customer_id"
            label="Customer"
            rules={[{ required: true }]}
          >
            <Select showSearch placeholder="Select customer">
              {customers.map((c) => (
                <Option key={c.id} value={c.id}>
                  {c.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="issue_date" label="Issue Date">
            <DatePicker className="w-full" format="YYYY/MM/DD" />
          </Form.Item>

          <Form.Item name="issue_type" label="Issue Type">
            <Input />
          </Form.Item>

          <Form.Item name="issue_by" label="Issue By">
            <Input />
          </Form.Item>

          <Form.Item name="remarks" label="Remarks">
            <Input.TextArea />
          </Form.Item>

          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </Form>
      </Modal>
    </div>
  );
};

export default ProductIssue;

