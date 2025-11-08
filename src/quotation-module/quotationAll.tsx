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

  // Open new quotation by default
  setIsFormVisible(true);
  setEditId(null);
  form.resetFields();
  setItems([]);
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

  const onCustomerChange = (id: number) => {
    const customer = customers.find((c) => c.id === id);
    if (customer) {
      form.setFieldsValue({
        phone: customer.phone,
        gst_no: customer.gst_no,
        cstate: customer.cstate,
        district: customer.district,
        address: customer.address,
      });
    }
  };

  const totals = items.reduce(
    (acc, it) => {
      acc.total_amount += Number(it.line_total || 0);
      acc.discount_amount +=
        (Number(it.discount || 0) / 100) *
        (Number(it.quantity || 0) * Number(it.unit_price || 0));
      acc.tax_amount +=
        (Number(it.tax_rate || 0) / 100) *
        (Number(it.quantity || 0) * Number(it.unit_price || 0));
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

  const onFinish = async (values: any) => {
    if (!items.length) {
      message.warning("Please add at least one item.");
      return;
    }

    const payload = {
      quotationNo: values.quotation_no,
      customerId: values.customer_id,
      currencyId: values.currency_id,
      validityDate: values.validity_date
        ? dayjs(values.validity_date).format("YYYY-MM-DD")
        : null,
      paymentTerms: values.payment_terms,
      deliveryTerms: values.delivery_terms,
      status: values.status,
      totalAmount: totals.total_amount,
      discountAmount: totals.discount_amount,
      taxAmount: totals.tax_amount,
      netAmount: totals.total_amount,
      createdBy: 1,
      products: items.map((it) => ({
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

  const onEdit = async (record: any) => {
    setIsFormVisible(true);
    setEditId(record.id);
    form.setFieldsValue({
      quotation_no: record.quotation_no,
      validity_date: record.validity_date ? dayjs(record.validity_date) : null,
      currency_id: record.currency_id,
      customer_id: record.customer_id,
      phone: record.phone,
      gst_no: record.gst_no,
      cstate: record.cstate,
      district: record.district,
      address: record.address,
      terms_conditions: record.terms_conditions,
    });

    try {
      const { data } = await QUOTATION_API.get(`/${record.id}`);
      const itemsFromServer = data.products ?? [];
      const mappedItems = Array.isArray(itemsFromServer)
        ? itemsFromServer.map((it: any, idx: number) => ({
          key: it.id || Date.now() + idx,
          product_id: it.product_id,
          description: it.description || "",
          quantity: it.quantity || 1,
          unit_price: it.unit_price || 0,
          discount: it.discount || 0,
          tax_rate: it.tax_rate || 0,
          line_total: it.line_total || 0,
        }))
        : [];
      setItems(mappedItems);
    } catch (err) {
      console.error("Failed to load quotation details:", err);
      message.error("Failed to load quotation items");
    }
  };

  const onDelete = async (rec: any) => {
    try {
      await QUOTATION_API.delete(`/${rec.id}`);
      message.success("Quotation deleted successfully");
      fetchQuotations();
    } catch (err) {
      console.error(err);
      message.error("Failed to delete quotation");
    }
  };

 const onView = async (record: any) => {
  try {
    const { data } = await QUOTATION_API.get(`/${record.id}`);
    console.log("Preview data:", data);  
    setSelectedPreview(data);
    setPreviewVisible(true);
  } catch (err) {
    console.error("Failed to load quotation preview:", err);
    message.error("Unable to load quotation preview");
  }
};


  const listColumns = [
    {
      title: "S.No",
      render: (_: any, __: any, index: number) => index + 1,
    },
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
          <Popconfirm title="Delete quotation?" onConfirm={() => onDelete(rec)}>
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
          {products.map((p) => (
            <Option key={p.id} value={p.id}>
              {p.name}
            </Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Description",
      dataIndex: "description",
      render: (_: any, record: any) => (
        <Input
          value={record.description}
          onChange={(e) => updateItem(record.key, "description", e.target.value)}
        />
      ),
    },
    {
      title: "Qty",
      dataIndex: "quantity",
      render: (_: any, record: any) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(v) => updateItem(record.key, "quantity", v)}
        />
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unit_price",
      render: (_: any, record: any) => (
        <InputNumber
          min={0}
          value={record.unit_price}
          onChange={(v) => updateItem(record.key, "unit_price", v)}
        />
      ),
    },
    {
      title: "Discount (%)",
      dataIndex: "discount",
      render: (_: any, record: any) => (
        <InputNumber
          min={0}
          value={record.discount}
          onChange={(v) => updateItem(record.key, "discount", v)}
        />
      ),
    },
    {
      title: "Tax (%)",
      dataIndex: "tax_rate",
      render: (_: any, record: any) => (
        <InputNumber
          min={0}
          value={record.tax_rate}
          onChange={(v) => updateItem(record.key, "tax_rate", v)}
        />
      ),
    },
    {
      title: "Line Total",
      dataIndex: "line_total",
      render: (val: any) => `₹ ${Number(val || 0).toFixed(2)}`,
    },
    {
      title: "Action",
      render: (_: any, record: any) => (
        <Popconfirm title="Remove item?" onConfirm={() => removeItem(record.key)}>
          <Button danger icon={<DeleteOutlined />} />
        </Popconfirm>
      ),
    },
  ];

  return (
    <Card>
      {!isFormVisible ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Title level={4}>Quotation List</Title>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => setIsFormVisible(true)}
            >
              Add Quotation
            </Button>
          </div>
          <Table dataSource={quotations} columns={listColumns} rowKey="id" />
        </>
      ) : (
        <>
          <div style={{ marginBottom: 16 }}>
           
          </div>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            {/* --- Quotation Form --- */}
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item
                  label="Quotation No"
                  name="quotation_no"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="Enter quotation number" />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Customer" name="customer_id" rules={[{ required: true }]}>
                  <Select placeholder="Select customer" onChange={onCustomerChange}>
                    {customers.map((c) => (
                      <Option key={c.id} value={c.id}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Currency" name="currency_id">
                  <Select placeholder="Select currency">
                    {currencies.map((c) => (
                      <Option key={c.id} value={c.id}>
                        {c.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="Validity Date" name="validity_date">
                  <DatePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>

            {/* --- Customer Info --- */}
            <Row gutter={16}>
              <Col span={6}>
                <Form.Item label="Phone" name="phone">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="GST No" name="gst_no">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="State" name="cstate">
                  <Input disabled />
                </Form.Item>
              </Col>
              <Col span={6}>
                <Form.Item label="District" name="district">
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <Form.Item label="Address" name="address">
              <Input.TextArea rows={2} disabled />
            </Form.Item>

            <Title level={5}>Product Details</Title>
            <Button
              type="dashed"
              onClick={addItem}
              icon={<PlusOutlined />}
              style={{ marginBottom: 10 }}
            >
              Add Item
            </Button>
            <Table dataSource={items} columns={itemColumns} pagination={false} rowKey="key" />

            <Row justify="end" style={{ marginTop: 20 }}>
              <Col span={6}>
                <div style={{ textAlign: "right" }}>
                  <p>Total: ₹{totals.total_amount.toFixed(2)}</p>
                  <p>Discount: ₹{totals.discount_amount.toFixed(2)}</p>
                  <p>Tax: ₹{totals.tax_amount.toFixed(2)}</p>
                  <h3>Net Amount: ₹{totals.total_amount.toFixed(2)}</h3>
                </div>
              </Col>
            </Row>

            <Form.Item label="Terms & Conditions" name="terms_conditions">
              <Input.TextArea rows={3} placeholder="Enter terms & conditions" />
            </Form.Item>

            <Form.Item label="Status" name="status">
              <Select>
                <Option value="Draft">Draft</Option>
                <Option value="Final">Final</Option>
              </Select>
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              style={{ marginTop: 10 }}
            >
              {editId ? "Update Quotation" : "Create Quotation"}
            </Button>
          </Form>
        </>
      )}

      {previewVisible && (
        <QuotationPreview
          visible={previewVisible}
          onClose={() => setPreviewVisible(false)}
          previewData={selectedPreview}
          
        />
      )}
    </Card>
  );
};

export default NewQuotation;
