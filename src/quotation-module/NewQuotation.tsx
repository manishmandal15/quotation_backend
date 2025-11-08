import React, { useEffect, useState } from "react";
import {
  Card,
  Table,
  Button,
  Typography,
  Form,
  Row,
  Col,
  Input,
  Select,
  DatePicker,
  InputNumber,
  message,
  Popconfirm,
  Space,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  PrinterOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import QuotationPreview from "./QuotationPreview";

const { Title } = Typography;
const { Option } = Select;

const QUOTATION_API = axios.create({ baseURL: "http://localhost:5000/api/quotations" });
const CUSTOMER_API = axios.create({ baseURL: "http://localhost:5000/api/customers" });
const CURRENCY_API = axios.create({ baseURL: "http://localhost:5000/api/currencies" });
const PRODUCT_API = axios.create({ baseURL: "http://localhost:5000/api/products" });

const NewQuotation: React.FC = () => {
  const [form] = Form.useForm();
  const [quotations, setQuotations] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [items, setItems] = useState<any[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedPreview, setSelectedPreview] = useState<any>(null);

  useEffect(() => {
    fetchQuotations();
    fetchCustomers();
    fetchCurrencies();
    fetchProducts();
  }, []);

  const fetchQuotations = async () => {
    try {
      const res = await QUOTATION_API.get("/");
      setQuotations(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCustomers = async () => {
    try {
      const res = await CUSTOMER_API.get("/");
      setCustomers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCurrencies = async () => {
    try {
      const res = await CURRENCY_API.get("/");
      setCurrencies(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await PRODUCT_API.get("/");
      setProducts(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  // ----- Item Handlers -----
  const addItem = () => {
    setItems((prev) => [
      ...prev,
      {
        key: Date.now(),
        product_id: null,
        description: "",
        quantity: 1,
        unit_price: 0,
        discount: 0,
        tax_rate: 0,
        line_total: 0,
      },
    ]);
  };

  const removeItem = (key: number) => {
    setItems((prev) => prev.filter((it) => it.key !== key));
  };

  const updateItem = (key: number, field: string, value: any) => {
    setItems((prev) =>
      prev.map((it) => {
        if (it.key !== key) return it;
        const updated = { ...it, [field]: value };
        const qty = Number(updated.quantity || 0);
        const price = Number(updated.unit_price || 0);
        const disc = Number(updated.discount || 0);
        const tax = Number(updated.tax_rate || 0);
        const base = qty * price;
        const afterDiscount = base - (disc / 100) * base;
        const afterTax = afterDiscount + (tax / 100) * afterDiscount;
        updated.line_total = parseFloat(afterTax.toFixed(2));
        return updated;
      })
    );
  };

  const onEdit = async (record: any) => {
  const id = record?.id || record?.quotation_id;
  if (!id) return message.error("Invalid quotation record — missing ID");

  try {
    message.loading({ content: "Loading quotation...", key: "loadQuote" });
    const res = await QUOTATION_API.get(`/${id}`);

    const data = res.data?.data; // the backend wraps in { success, data }

    if (!data) return message.error("Quotation data not found");

    setEditId(id);
    setIsFormVisible(true);

    const customer = customers.find((c) => c.id === data.customer_id) || data.customer || {};

    form.resetFields();
    form.setFieldsValue({
      customer_id: data.customer_id,
      quotation_no: data.quotation_no || `Q-${Date.now()}`,
      phone: customer.phone || "",
      gst_no: customer.gst_no || "",
      cstate: customer.cstate || customer.state || "",
      district: customer.district || "",
      address: customer.address || "",
      validity_date: data.validity_date ? dayjs(data.validity_date) : null,
      payment_terms: data.payment_terms || "",
      delivery_terms: data.delivery_terms || "",
      terms_conditions: data.terms_conditions || "",
      currency_id: data.currency_id || undefined,
    });

    const formattedItems = (data.products || []).map((item: any) => {
      const qty = Number(item.quantity || 1);
      const price = Number(item.unit_price || 0);
      const discount = Number(item.discount || 0);
      const taxRate = Number(item.tax_rate || 0);
      const afterDiscount = price - (price * discount) / 100;
      const afterTax = afterDiscount + (afterDiscount * taxRate) / 100;
      const lineTotal = qty * afterTax;

      return {
        key: item.id || Date.now() + Math.random(),
        product_id: item.product_id,
        product_name: item.product_name || item.description || "",
        description: item.description || "",
        quantity: qty,
        unit_price: price,
        discount,
        tax_rate: taxRate,
        line_total: parseFloat(lineTotal.toFixed(2)),
      };
    });

    setItems(formattedItems);
    message.success({ content: "Quotation loaded for editing", key: "loadQuote", duration: 1.2 });
  } catch (err: any) {
    console.error(err);
    message.error({ content: "Failed to load quotation details", key: "loadQuote" });
  }
};

  // ----- Customer Auto-fill -----
  const onCustomerChange = (id: number) => {
    const customer = customers.find((c) => c.id === id);
    if (customer) {
      form.setFieldsValue({
        phone: customer.phone,
        gst_no: customer.gst_no,
        cstate: customer.state,
        district: customer.district,
        address: customer.address,
      });
    }
  };

  // ----- Totals -----
  const totals = items.reduce(
    (acc, it) => {
      acc.total_amount += Number(it.line_total || 0);
      acc.discount_amount += ((Number(it.discount || 0) / 100) * Number(it.quantity || 0) * Number(it.unit_price || 0));
      acc.tax_amount += ((Number(it.tax_rate || 0) / 100) * Number(it.quantity || 0) * Number(it.unit_price || 0));
      return acc;
    },
    { total_amount: 0, discount_amount: 0, tax_amount: 0 }
  );

  const closeForm = () => {
    form.resetFields();
    setItems([]);
    setEditId(null);
    setIsFormVisible(false);
  };

  // ----- Submit Quotation -----
  const onFinish = async (values: any) => {
    if (!items.length) return message.warning("Please add at least one item.");

    const payload = {
      quotation_no: values.quotation_no,
      customer_id: values.customer_id,
      currency_id: values.currency_id,
      validity_date: values.validity_date ? dayjs(values.validity_date).format("YYYY-MM-DD") : null,
      payment_terms: values.payment_terms,
      delivery_terms: values.delivery_terms,
      total_amount: totals.total_amount,
      discount_amount: totals.discount_amount,
      tax_amount: totals.tax_amount,
      net_amount: totals.total_amount,
      created_by: 1,
      quotation_items: items.map((it) => ({
        product_id: it.product_id,
        description: it.description,
        quantity: it.quantity,
        unit_price: it.unit_price,
        discount: it.discount,
        tax_rate: it.tax_rate,
        line_total: it.line_total,
      })),
      terms_conditions: values.terms_conditions,
    };

    try {
      setLoading(true);
      if (editId) {
        await QUOTATION_API.put(`/${editId}`, payload);
        message.success("Quotation updated successfully");
      } else {
        await QUOTATION_API.post("/", payload);
        message.success("Quotation created successfully");
      }
      fetchQuotations();
      closeForm();
    } catch (err) {
      console.error(err);
      message.error("Failed to submit quotation");
    } finally {
      setLoading(false);
    }
  };

  // ----- View / Print -----
  const onView = async (record: any) => {
    try {
      const res = await QUOTATION_API.get(`/${record.id}`);
      const data = res.data?.data || res.data;
      const customer = customers.find((c) => c.id === data.customer_id) || data.customer || {};
      const productsList = Array.isArray(data.products) ? data.products : data.quotation_items || [];
      setSelectedPreview({ ...data, customer, products: productsList });
      setPreviewVisible(true);
    } catch (err) {
      console.error(err);
      message.error("Failed to load quotation preview");
    }
  };

  const onDelete = async (rec: any) => {
  const id = rec.id || rec.quotation_id; // fallback
  if (!id) return message.error("Quotation ID not found!");

  try {
    const res = await QUOTATION_API.delete(`/${id}`);
    console.log("Delete response:", res.data);
    message.success("Quotation deleted successfully");
    fetchQuotations();
  } catch (err: any) {
    console.error(err.response || err);
    message.error("Failed to delete quotation");
  }
};


  // ----- Columns -----
  const listColumns = [
    { title: "S.No", render: (_: any, __: any, index: number) => index + 1 },
    { title: "Quotation No", dataIndex: "quotation_no" },
    { title: "Customer", dataIndex: "customer_name" },
    { title: "Validity", dataIndex: "validity_date" },
    { title: "Net Amount", dataIndex: "net_amount" },
    { title: "Status", dataIndex: "status" },
    {
      title: "Action",
      render: (_: any, rec: any) => (
        <Space>
          <Button icon={<EyeOutlined />} onClick={() => onView(rec)} />
          <Button icon={<PrinterOutlined />} onClick={() => onView(rec)} />
          <Button icon={<EditOutlined />} onClick={() => onEdit(rec)} />
          <Popconfirm
            title="Delete quotation?"
            onConfirm={() => onDelete(rec)}
            okText="Yes"
            cancelText="No"
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const itemColumns = [
    {
      title: "Product",
      dataIndex: "product_id",
      render: (_: any, record: any) => (
        <Select
          value={record.product_id}
          onChange={(v) => {
            const selected = products.find((p) => p.id === v);
            updateItem(record.key, "product_id", v);
            if (selected) {
              updateItem(record.key, "description", selected.description || "");
              updateItem(record.key, "unit_price", selected.price || 0);
            }
          }}
          placeholder="Select product"
        >
          {products.map((p) => (<Option key={p.id} value={p.id}>{p.name}</Option>))}
        </Select>
      ),
    },
    { title: "Description", dataIndex: "description", render: (_: any, record: any) => <Input value={record.description} onChange={(e) => updateItem(record.key, "description", e.target.value)} /> },
    { title: "Qty", dataIndex: "quantity", render: (_: any, record: any) => <InputNumber min={1} value={record.quantity} onChange={(v) => updateItem(record.key, "quantity", v)} /> },
    { title: "Unit Price", dataIndex: "unit_price", render: (_: any, record: any) => <InputNumber min={0} value={record.unit_price} onChange={(v) => updateItem(record.key, "unit_price", v)} /> },
    { title: "Discount (%)", dataIndex: "discount", render: (_: any, record: any) => <InputNumber min={0} value={record.discount} onChange={(v) => updateItem(record.key, "discount", v)} /> },
    { title: "Tax (%)", dataIndex: "tax_rate", render: (_: any, record: any) => <InputNumber min={0} value={record.tax_rate} onChange={(v) => updateItem(record.key, "tax_rate", v)} /> },
    { title: "Line Total", dataIndex: "line_total", render: (val: any) => `₹ ${Number(val || 0).toFixed(2)}` },
    { title: "Action", render: (_: any, record: any) => <Popconfirm title="Remove item?" onConfirm={() => removeItem(record.key)}><Button danger icon={<DeleteOutlined />} /></Popconfirm> },
  ];

  return (
    <Card>
      {!isFormVisible ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Title level={4}>Quotation List</Title>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsFormVisible(true)}>Add Quotation</Button>
          </div>
          <Table dataSource={quotations} columns={listColumns} rowKey="id" />
        </>
      ) : (
        <>
          <Button icon={<ArrowLeftOutlined />} onClick={closeForm} style={{ marginBottom: 16 }}>Back</Button>
          <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* Form fields */}
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="Quotation No" name="quotation_no" rules={[{ required: true, message: "Please enter quotation number" }]}>
                  <Input placeholder="Enter quotation number" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Customer" name="customer_id" rules={[{ required: true, message: "Please select customer" }]}>
                  <Select placeholder="Select customer" onChange={onCustomerChange} showSearch optionFilterProp="children">
                    {customers.map((c) => (<Option key={c.id} value={c.id}>{c.name}</Option>))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Currency" name="currency_id">
                  <Select placeholder="Select currency">{currencies.map((c) => (<Option key={c.id} value={c.id}>{c.name}</Option>))}</Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Validity Date" name="validity_date"><DatePicker style={{ width: "100%" }} /></Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={6}><Form.Item label="Phone" name="phone"><Input disabled /></Form.Item></Col>
              <Col span={6}><Form.Item label="GST No" name="gst_no"><Input disabled /></Form.Item></Col>
              <Col span={6}><Form.Item label="State" name="cstate"><Input disabled /></Form.Item></Col>
              <Col span={6}><Form.Item label="District" name="district"><Input disabled /></Form.Item></Col>
            </Row>
            <Form.Item label="Address" name="address"><Input.TextArea rows={2} disabled /></Form.Item>

            <Card size="small" title="Product Details" extra={<Button type="dashed" onClick={addItem} icon={<PlusOutlined />}>Add Item</Button>}>
              <Table dataSource={items} columns={itemColumns} pagination={false} rowKey="key" />
            </Card>

            <Row style={{ marginTop: 20, justifyContent: "end" }}>
              <Col span={8}>
                <div style={{ textAlign: "right", lineHeight: 1.8 }}>
                  <p><strong>Total Amount:</strong> ₹{totals.total_amount.toFixed(2)}</p>
                  <p><strong>Discount:</strong> ₹{totals.discount_amount.toFixed(2)}</p>
                  <p><strong>Tax:</strong> ₹{totals.tax_amount.toFixed(2)}</p>
                  <h3><strong>Net Amount:</strong> ₹{totals.total_amount.toFixed(2)}</h3>
                </div>
              </Col>
            </Row>

            <Form.Item label="Terms & Conditions" name="terms_conditions"><Input.TextArea rows={5} /></Form.Item>
            <Row justify="end">
              <Col>
                <Form.Item><Button type="primary" htmlType="submit" loading={loading}>{editId ? "Update" : "Submit"}</Button></Form.Item>
              </Col>
            </Row>
          </Form>
        </>
      )}

      {previewVisible && selectedPreview && (
        <QuotationPreview visible={previewVisible} onClose={() => setPreviewVisible(false)} previewData={selectedPreview} />
      )}
    </Card>
  );
};

export default NewQuotation;
