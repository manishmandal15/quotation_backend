import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Select,
  Button,
  DatePicker,
  Table,
  InputNumber,
  Row,
  Col,
  Card,
  message,
  Typography,
  Space,
  Modal,
  Popconfirm,
} from "antd";
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  CheckOutlined,
  CloseOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";

const { Title } = Typography;
const { Option } = Select;
const { TextArea } = Input;

const QUOTATION_API = axios.create({ baseURL: "http://localhost:5000/api/quotations" });
const CUSTOMER_API = axios.create({ baseURL: "http://localhost:5000/api/customers" });
const CURRENCY_API = axios.create({ baseURL: "http://localhost:5000/api/currencies" });

const QuotationApprovalDesk: React.FC = () => {
  const [form] = Form.useForm();
  const [quotationList, setQuotationList] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [count, setCount] = useState(1);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [viewModal, setViewModal] = useState<any | null>(null);
  const [viewItemModal, setViewItemModal] = useState<any | null>(null);

  useEffect(() => {
    fetchQuotations();
    fetchCustomers();
    fetchCurrencies();
  }, []);

  const fetchQuotations = async () => {
    const res = await QUOTATION_API.get("/");
    setQuotationList(res.data || []);
  };

  const fetchCustomers = async () => {
    const res = await CUSTOMER_API.get("/");
    setCustomers(res.data || []);
  };

  const fetchCurrencies = async () => {
    const res = await CURRENCY_API.get("/");
    setCurrencies(res.data || []);
  };

  const handleAddItem = () => {
    const newItem = {
      key: Date.now(),
      sno: count,
      description: "",
      qty: 1,
      unitPrice: 0,
      discount: 0,
      taxableAmount: 0,
    };
    setDataSource([...dataSource, newItem]);
    setCount(count + 1);
  };

  const handleDeleteItem = (key: number) => {
    setDataSource(dataSource.filter((item) => item.key !== key));
  };

  const handleChange = (value: any, record: any, field: string) => {
    const updated = dataSource.map((item) => {
      if (item.key === record.key) {
        const row = { ...item, [field]: value };
        row.taxableAmount = row.qty * row.unitPrice - (row.discount || 0);
        return row;
      }
      return item;
    });
    setDataSource(updated);
  };

  const handleCustomerChange = (customerId: number) => {
    const selected = customers.find((c) => c.id === customerId);
    if (selected) {
      form.setFieldsValue({
        address: selected.address,
        mobile: selected.phone,
        gst: selected.gst_no,
        state: selected.state_name,
        district: selected.district_name,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (!dataSource.length) {
        message.warning("Please add at least one item!");
        return;
      }

      const products = dataSource.map((item) => ({
        product_id: 1,
        description: item.description,
        quantity: Number(item.qty),
        unit_price: Number(item.unitPrice),
        discount: Number(item.discount || 0),
        tax_rate: 0,
        line_total: item.taxableAmount,
      }));

      const payload = {
        quotation_no: values.quotationNo,
        customer_id: values.customerName,
        validity_date: values.validUntil?.format("YYYY-MM-DD"),
        quotation_date: values.quotationDate?.format("YYYY-MM-DD"),
        payment_terms: values.paymentTerms,
        delivery_terms: values.deliveryTerms,
        terms_conditions: values.termsConditions,
        currency_id: values.currencyId,
        products,
        total_amount: products.reduce((s, p) => s + p.unit_price * p.quantity, 0),
        discount_amount: products.reduce((s, p) => s + p.discount, 0),
        net_amount: products.reduce((s, p) => s + p.line_total, 0),
      };

      if (editId) {
        await QUOTATION_API.put(`/${editId}`, payload);
        message.success("Quotation updated successfully!");
      } else {
        await QUOTATION_API.post("/", payload);
        message.success("Quotation created successfully!");
      }

      setIsFormVisible(false);
      setEditId(null);
      form.resetFields();
      setDataSource([]);
      fetchQuotations();
    } catch (err: any) {
      message.error(err.message || "Error submitting quotation");
    }
  };

  // --- APPROVE / REJECT with confirmation ---
  const handleApprove = async (record: any) => {
    await QUOTATION_API.put(`/${record.id}`, { ...record, status: "Approved" });
    message.success("Quotation approved!");
    fetchQuotations();
  };

  const handleReject = async (record: any) => {
    await QUOTATION_API.put(`/${record.id}`, { ...record, status: "Rejected" });
    message.success("Quotation rejected!");
    fetchQuotations();
  };

  const handleDeleteQuotation = async (record: any) => {
    await QUOTATION_API.delete(`/${record.id}`);
    message.success("Quotation deleted successfully!");
    fetchQuotations();
  };

  const handleView = (record: any) => setViewModal(record);

  const handleEdit = (record: any) => {
    setEditId(record.id);
    setIsFormVisible(true);
    form.setFieldsValue({
      quotationNo: record.quotation_no,
      quotationDate: dayjs(record.created_at),
      validUntil: dayjs(record.validity_date),
      currencyId: record.currency_id,
      customerName: record.customer_id,
      paymentTerms: record.payment_terms,
      deliveryTerms: record.delivery_terms,
      termsConditions: record.terms_conditions,
    });
  };

  // --- Product Table Columns with View/Delete actions ---
  const productColumns = [
    { title: "S.No", dataIndex: "sno", width: 60 },
    {
      title: "Description",
      dataIndex: "description",
      render: (_: any, record: any) => (
        <Input
          value={record.description}
          onChange={(e) => handleChange(e.target.value, record, "description")}
        />
      ),
    },
    {
      title: "Qty",
      dataIndex: "qty",
      render: (_: any, record: any) => (
        <InputNumber
          min={1}
          value={record.qty}
          onChange={(v) => handleChange(v || 0, record, "qty")}
        />
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      render: (_: any, record: any) => (
        <InputNumber
          min={0}
          value={record.unitPrice}
          onChange={(v) => handleChange(v || 0, record, "unitPrice")}
        />
      ),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      render: (_: any, record: any) => (
        <InputNumber
          min={0}
          value={record.discount}
          onChange={(v) => handleChange(v || 0, record, "discount")}
        />
      ),
    },
    {
      title: "Taxable Amount",
      dataIndex: "taxableAmount",
      render: (_: any, record: any) => `₹ ${record.taxableAmount.toFixed(2)}`,
    },
    {
      title: "Action",
      key: "action",
      width: 120,
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} size="small" onClick={() => setViewItemModal(record)} />
          <Popconfirm
            title="Delete this item?"
            onConfirm={() => handleDeleteItem(record.key)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<DeleteOutlined />} danger size="small" />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const columns = [
    { title: "S.No", render: (_: any, __: any, i: number) => i + 1 },
    { title: "Quotation No", dataIndex: "quotation_no" },
    { title: "Customer", dataIndex: "customer_name" },
    { title: "Date", dataIndex: "created_at" },
     { title: "Approved By", dataIndex: "approvedBy" },
    { title: "Approved Date", dataIndex: "approved_date" },
    { title: "Net Amount", dataIndex: "net_amount", render: (v: any) => `₹ ${v}` },
    { title: "Status", dataIndex: "status" },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => handleView(record)} />
          
          <Popconfirm
            title="Approve this quotation?"
            onConfirm={() => handleApprove(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<CheckOutlined />} type="primary" />
          </Popconfirm>
          <Popconfirm
            title="Reject this quotation?"
            onConfirm={() => handleReject(record)}
            okText="Yes"
            cancelText="No"
          >
            <Button icon={<CloseOutlined />} danger />
          </Popconfirm>
         
        </Space>
      ),
    },
  ];

  const totalAmount = dataSource.reduce((s, i) => s + i.qty * i.unitPrice, 0);
  const discountAmount = dataSource.reduce((s, i) => s + (i.discount || 0), 0);
  const netAmount = totalAmount - discountAmount;

  return (
    <Card>
      {!isFormVisible ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <Title level={4}>🗂 Quotation Approval Desk</Title>
           
          </div>
          <Table columns={columns} dataSource={quotationList} rowKey="id" bordered />
        </>
      ) : (
        <>
          <div className="flex justify-between items-center mb-4">
            <Title level={4}>{editId ? "✏️ Edit Quotation" : "🧾 New Quotation"}</Title>
            <Button onClick={() => setIsFormVisible(false)}>Back</Button>
          </div>

          <Form
            form={form}
            layout="vertical"
            initialValues={{
              quotationDate: dayjs(),
              validUntil: dayjs().add(7, "day"),
            }}
          >
            {/* Quotation Info */}
            <Card type="inner" title="Quotation Information">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item name="quotationNo" label="Quotation No" rules={[{ required: true }]}>
                    <Input placeholder="Enter quotation number" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="quotationDate" label="Quotation Date" rules={[{ required: true }]}>
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="validUntil" label="Valid Until" rules={[{ required: true }]}>
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Customer Info */}
            <Card type="inner" title="Customer Information">
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item name="customerName" label="Customer" rules={[{ required: true }]}>
                    <Select placeholder="Select Customer" onChange={handleCustomerChange}>
                      {customers.map((c) => (
                        <Option key={c.id} value={c.id}>
                          {c.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="address" label="Address">
                    <Input placeholder="Customer address" />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="mobile" label="Mobile">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="gst" label="GST No">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="state" label="State">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="district" label="District">
                    <Input />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            {/* Product / Items */}
            <Card type="inner" title="Product / Items">
              <div style={{ textAlign: "right", marginBottom: 10 }}>
                <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddItem}>
                  Add Item
                </Button>
              </div>
              <Table columns={productColumns} dataSource={dataSource} pagination={false} bordered size="small" />
              <div style={{ textAlign: "right", marginTop: 10 }}>
                <p>Total Amount: ₹ {totalAmount.toFixed(2)}</p>
                <p>Discount: ₹ {discountAmount.toFixed(2)}</p>
                <h3>Net Amount: ₹ {netAmount.toFixed(2)}</h3>
              </div>
            </Card>

            {/* Payment & Delivery */}
            <Card type="inner" title="Payment & Delivery Terms">
              <Form.Item name="termsConditions" label="Terms & Conditions">
                <TextArea rows={3} placeholder="Enter terms and conditions" />
              </Form.Item>
              <Row gutter={[16, 16]}>
                <Col span={8}>
                  <Form.Item name="paymentTerms" label="Payment Terms" rules={[{ required: true }]}>
                    <Select placeholder="Select Payment Terms">
                      <Option value="Advance Payment">Advance Payment</Option>
                      <Option value="Credit 30 Days">Credit 30 Days</Option>
                      <Option value="50% Advance, 50% on Delivery">50% Advance, 50% on Delivery</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="deliveryTerms" label="Delivery Terms" rules={[{ required: true }]}>
                    <Select placeholder="Select Delivery Terms">
                      <Option value="Within 7 Days">Within 7 Days</Option>
                      <Option value="Within 15 Days">Within 15 Days</Option>
                      <Option value="Immediate Delivery">Immediate Delivery</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="currencyId" label="Currency" rules={[{ required: true }]}>
                    <Select placeholder="Select Currency">
                      {currencies.map((c) => (
                        <Option key={c.id} value={c.id}>
                          {c.code}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <div style={{ textAlign: "right", marginTop: 16 }}>
              <Button type="primary" onClick={handleSubmit}>
                {editId ? "Update Quotation" : "Submit Quotation"}
              </Button>
            </div>
          </Form>
        </>
      )}

      {/* Quotation View */}
      <Modal open={!!viewModal} title="Quotation Details" onCancel={() => setViewModal(null)} footer={null}>
        {viewModal && (
          <div>
            <p><b>Quotation No:</b> {viewModal.quotation_no}</p>
            <p><b>Customer:</b> {viewModal.customer_name}</p>
            <p><b>Status:</b> {viewModal.status}</p>
            <p><b>Amount:</b> ₹ {viewModal.net_amount}</p>
          </div>
        )}
      </Modal>

      {/* Product Item View */}
      <Modal open={!!viewItemModal} title="Product Details" onCancel={() => setViewItemModal(null)} footer={null}>
        {viewItemModal && (
          <div>
            <p><b>Description:</b> {viewItemModal.description}</p>
            <p><b>Quantity:</b> {viewItemModal.qty}</p>
            <p><b>Unit Price:</b> ₹ {viewItemModal.unitPrice}</p>
            <p><b>Discount:</b> ₹ {viewItemModal.discount}</p>
            <p><b>Taxable Amount:</b> ₹ {viewItemModal.taxableAmount}</p>
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default QuotationApprovalDesk;
