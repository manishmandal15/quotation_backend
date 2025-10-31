import React, { useEffect, useRef, useState } from "react";
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
  Modal,
} from "antd";
import {
  PlusOutlined,
  DeleteOutlined,
  EditOutlined,
  EyeOutlined,
  ArrowLeftOutlined,
  PrinterOutlined,
} from "@ant-design/icons";

import axios from "axios";
import dayjs from "dayjs";

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

  // NEW: preview modal state & data
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewData, setPreviewData] = useState<any | null>(null);
  const printableRef = useRef<HTMLDivElement | null>(null);

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
        updated.line_total = parseFloat((afterTax || 0).toFixed(2));
        return updated;
      })
    );
  };

  const onCustomerChange = (id: number) => {
    const customer = customers.find((c) => c.id === id);
    if (!customer) return;
    form.setFieldsValue({
      phone: customer.phone,
      gst_no: customer.gst_no,
      cstate: customer.cstate,
      district: customer.district,
      address: customer.address,
    });
    // Also update items or preview's bill-to if preview open or later when printing
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

  const net_amount = totals.total_amount;

  const closeForm = () => {
    form.resetFields();
    setItems([]);
    setEditId(null);
    setIsFormVisible(false);
  };

  // Build preview data from form + items
  const buildPreviewFromForm = (values: any) => {
    const customer = customers.find((c) => c.id === values.customer_id) || null;
    const currency = currencies.find((c) => c.id === values.currency_id) || null;

    return {
      id: editId ?? null,
      quotation_no: values.quotation_no,
      validity_date: values.validity_date ? dayjs(values.validity_date).format("YYYY-MM-DD") : null,
      currency: currency ? currency.code : "",
      customer: customer
        ? {
            name: customer.name,
            phone: customer.phone,
            gst_no: customer.gst_no,
            address: customer.address,
            cstate: customer.cstate,
            district: customer.district,
          }
        : null,
      items: items.map((it) => {
        const prod = products.find((p) => p.id === it.product_id) || null;
        return {
          ...it,
          product_name: prod?.name || "",
        };
      }),
      totals: {
        total_amount: totals.total_amount,
        discount_amount: totals.discount_amount,
        tax_amount: totals.tax_amount,
        net_amount: net_amount,
      },
      terms_conditions: values.terms_conditions || "",
      company: {
        // optional logo URL if you have it in project; else will show text
        name: "DSONIK",
        address: "Your Company Address",
        phone: "0000000000",
        logo: undefined, // put a URL string here if you host logo
      },
    };
  };

  const onFinish = async (values: any) => {
    if (!items.length) {
      message.warning("Please add at least one item.");
      return;
    }

    const payload = {
      quotationNo: values.quotation_no, // if available
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
      netAmount: net_amount,
      createdBy: 1, // or from logged-in user
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
      let saved: any = null;
      if (editId) {
        const res = await QUOTATION_API.put(`/${editId}`, payload);
        saved = res.data;
        message.success("Quotation updated successfully");
      } else {
        const res = await QUOTATION_API.post("/", payload);
        saved = res.data;
        message.success("Quotation created successfully");
      }

      // After save -> refresh list
      fetchQuotations();

      // Build preview data: prefer server response, else build from current form
      const preview = saved ? saved : buildPreviewFromForm(values);
      // normalize items if server returned a different shape
      if (preview && preview.products && !preview.items) {
        preview.items = preview.products;
      }
      // If preview doesn't contain customer details, add from form
      if (!preview.customer) {
        preview.customer = (customers.find((c) => c.id === values.customer_id) as any) || null;
      }
      setPreviewData(preview);
      setIsPreviewOpen(true);

      // keep the form open or close? We'll close form but keep preview open
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

    // Set form fields
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
      // backend shape may vary
      const itemsFromServer = data.products ?? data.items ?? data.products_list ?? [];
      // map server items into our items shape (key needed)
      const mappedItems = Array.isArray(itemsFromServer)
        ? itemsFromServer.map((it: any, idx: number) => ({
            key: it.id || Date.now() + idx,
            product_id: it.product_id ?? it.productId ?? it.product?.id ?? null,
            description: it.description ?? it.desc ?? "",
            quantity: it.quantity ?? 1,
            unit_price: it.unit_price ?? it.rate ?? 0,
            discount: it.discount ?? 0,
            tax_rate: it.tax_rate ?? it.tax ?? 0,
            line_total: it.line_total ?? 0,
          }))
        : [];

      setItems(mappedItems);
    } catch (err) {
      console.error("Failed to load quotation details:", err);
      message.error("Failed to load quotation items");
      setItems([]);
    }
  };

  // 🔹 VIEW — Opens Preview Modal Only
  const onView = async (rec: any) => {
    try {
      const { data } = await QUOTATION_API.get(`/${rec.id}`);
      const preview = {
        ...data,
        items: data.products ?? data.items ?? data.products_list ?? [],
      };

      // If customer info not in data, fetch from local customers list
      if (!preview.customer && preview.customer_id) {
        preview.customer =
          customers.find((c) => c.id === preview.customer_id) || null;
      }

      setPreviewData(preview);
      setIsPreviewOpen(true); // ✅ Only opens modal
    } catch (err) {
      console.error(err);
      message.error("Failed to load quotation for preview");
    }
  };

  // 🔹 DELETE — Remove quotation
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

 const handlePrint = () => {
  if (!previewData) {
    message.warning("Nothing to print");
    return;
  }

  const preview = previewData;
  const company = preview.company ?? { name: "DSONIK", address: "", phone: "" };
  const customer = preview.customer ?? {};
  const itemsToPrint = preview.items ?? preview.products ?? [];

  const style = `
    <style>
      body { font-family: Arial, Helvetica, sans-serif; margin: 20px; }
      .header { background: #5b2e8a; color: white; padding: 20px; display:flex; align-items:center; justify-content:space-between; border-radius:6px; }
      .logo { font-weight:700; font-size:20px; }
      .company-details { text-align:right; font-size:12px; }
      .section { margin-top: 16px; }
      table { width:100%; border-collapse: collapse; margin-top:8px; }
      th, td { border:1px solid #ccc; padding:8px; text-align:left; font-size:13px; }
      th { background: #f2f2f2; }
      .right { text-align:right; }
      .bold { font-weight:700; }
      .totals { width:320px; float:right; margin-top:12px; }
      .totals div { display:flex; justify-content:space-between; padding:4px 0; }
      .terms { margin-top:24px; }
    </style>
  `;

  let rows = "";
  itemsToPrint.forEach((it: any, idx: number) => {
    const prodName = it.product_name ?? it.product?.name ?? "";
    const desc = it.description ?? "";
    const qty = it.quantity ?? 0;
    const price = Number(it.unit_price ?? 0).toFixed(2);
    const line = Number(it.line_total ?? 0).toFixed(2);
    rows += `<tr>
      <td>${idx + 1}</td>
      <td>${prodName}</td>
      <td>${desc}</td>
      <td class="right">${qty}</td>
      <td class="right">${price}</td>
      <td class="right">${it.discount ?? 0}%</td>
      <td class="right">${it.tax_rate ?? it.tax ?? 0}%</td>
      <td class="right">${line}</td>
    </tr>`;
  });

  const html = `
    <html>
      <head><title>Quotation ${preview.quotation_no ?? ""}</title>${style}</head>
      <body>
        <div class="header">
          <div class="logo">${company.name}</div>
          <div class="company-details">
            <div>${company.address}</div>
            <div>Phone: ${company.phone}</div>
          </div>
        </div>

        <div class="section" style="display:flex; justify-content:space-between;">
          <div style="width:60%">
            <div class="bold">Bill To:</div>
            <div>${customer.name ?? ""}</div>
            <div>${customer.address ?? ""}</div>
            <div>Phone: ${customer.phone ?? ""}</div>
            <div>GST: ${customer.gst_no ?? ""}</div>
          </div>
          <div style="text-align:right;">
            <div><b>Quotation No:</b> ${preview.quotation_no ?? ""}</div>
            <div><b>Valid Until:</b> ${preview.validity_date ?? ""}</div>
            <div><b>Currency:</b> ${preview.currency ?? ""}</div>
          </div>
        </div>

        <div class="section">
          <table>
            <thead>
              <tr>
                <th>S.No</th>
                <th>Product</th>
                <th>Description</th>
                <th>Qty</th>
                <th>Unit Price</th>
                <th>Discount</th>
                <th>Tax</th>
                <th>Line Total</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </div>

        <div class="totals">
          <div><span>Subtotal</span><span>₹ ${(preview.totals?.total_amount ?? preview.totalAmount ?? 0).toFixed(2)}</span></div>
          <div><span>Discount</span><span>₹ ${(preview.totals?.discount_amount ?? 0).toFixed(2)}</span></div>
          <div><span>Tax</span><span>₹ ${(preview.totals?.tax_amount ?? 0).toFixed(2)}</span></div>
          <div class="bold" style="font-size:15px;"><span>Net Amount</span><span>₹ ${(preview.totals?.net_amount ?? preview.netAmount ?? 0).toFixed(2)}</span></div>
        </div>

        <div class="terms">
          <div class="bold">Terms & Conditions</div>
          <div>${preview.terms_conditions ?? ""}</div>
        </div>
      </body>
    </html>
  `;

  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    message.error("Unable to open print window (popup blocked?)");
    return;
  }
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
};

  const listColumns = [
    {
      title: "S.No",
      dataIndex: "index",
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
          <Button icon={<EditOutlined />} onClick={() => onEdit(rec)} />
          <Popconfirm title="Delete quotation?" onConfirm={() => onDelete(rec)}>
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
          <Button icon={<PrinterOutlined />} onClick={() => handlePrint()} />
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
            const selectedProduct = products.find((p) => p.id === v);
            updateItem(record.key, "product_id", v);
            if (selectedProduct?.description) {
              updateItem(record.key, "description", selectedProduct.description);
            }
            if (selectedProduct?.price) {
              updateItem(record.key, "unit_price", selectedProduct.price);
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
          placeholder="Enter description"
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
            <Button icon={<ArrowLeftOutlined />} onClick={closeForm}>
              Back
            </Button>
          </div>

          <Form form={form} layout="vertical" onFinish={onFinish}>
            <Card type="inner" title="Quotation Info" style={{ marginBottom: 12 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="quotation_no" label="Quotation No" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="validity_date" label="Valid Until">
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="currency_id" label="Currency" rules={[{ required: true }]}>
                    <Select placeholder="Select currency">
                      {currencies.map((c) => (
                        <Option value={c.id} key={c.id}>
                          {c.code}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card type="inner" title="Customer Info" style={{ marginBottom: 12 }}>
              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item name="customer_id" label="Customer" rules={[{ required: true }]}>
                    <Select onChange={onCustomerChange} placeholder="Select customer">
                      {customers.map((c) => (
                        <Option key={c.id} value={c.id}>
                          {c.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="phone" label="Phone">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item name="gst_no" label="GST No">
                    <Input />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item name="address" label="Address">
                    <Input.TextArea rows={2} />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="cstate" label="State">
                    <Input disabled />
                  </Form.Item>
                </Col>
                <Col span={6}>
                  <Form.Item name="district" label="District">
                    <Input disabled />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card type="inner" title="Items" style={{ marginBottom: 12 }}>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 8 }}>
                <Button type="dashed" icon={<PlusOutlined />} onClick={addItem}>
                  Add Item
                </Button>
              </div>
              <Table columns={itemColumns} dataSource={items} pagination={false} rowKey="key" bordered />
              <div style={{ textAlign: "right", marginTop: 10 }}>
                <b>Net Amount:</b> ₹ {net_amount.toFixed(2)}
              </div>
            </Card>

            <Card type="inner" title="Terms & Conditions" style={{ marginBottom: 12 }}>
              <Form.Item name="terms_conditions" label="">
                <Input.TextArea rows={5} />
              </Form.Item>
            </Card>

            <div style={{ textAlign: "right" }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                {editId ? "Update Quotation" : "Submit Quotation"}
              </Button>
            </div>
          </Form>
        </>
      )}

      {/* Preview Modal */}
      <Modal
        open={isPreviewOpen}
        onCancel={() => setIsPreviewOpen(false)}
        footer={[
          <Button key="close" onClick={() => setIsPreviewOpen(false)}>
            Close
          </Button>,
          <Button
            key="print"
            type="primary"
            icon={<PrinterOutlined />}
            onClick={handlePrint}
          >
            Print
          </Button>,
        ]}
        width={900}
        title={`Quotation Preview ${previewData?.quotation_no ? "- " + previewData.quotation_no : ""}`}
      >
        {/* Modal content - visually similar to Excel image (purple header etc) */}
        <div ref={printableRef}>
          <div style={{ background: "#5b2e8a", color: "#fff", padding: 16, borderRadius: 6, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontWeight: 800, fontSize: 20 }}>
              {previewData?.company?.logo ? (
                // If you have logo URL, it will show
                <img src={previewData.company.logo} alt="logo" style={{ height: 48 }} />
              ) : (
                previewData?.company?.name ?? "DSONIK"
              )}
            </div>
            <div style={{ textAlign: "right", fontSize: 12 }}>
              <div>{previewData?.company?.address}</div>
              <div>Phone: {previewData?.company?.phone}</div>
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12 }}>
            <div style={{ width: "60%" }}>
              <div style={{ fontWeight: 700 }}>Bill To:</div>
              <div>{previewData?.customer?.name}</div>
              <div>{previewData?.customer?.address}</div>
              <div>Phone: {previewData?.customer?.phone}</div>
              <div>GST: {previewData?.customer?.gst_no}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div><strong>Quotation No:</strong> {previewData?.quotation_no}</div>
              <div><strong>Valid Until:</strong> {previewData?.validity_date}</div>
              <div><strong>Currency:</strong> {previewData?.currency}</div>
            </div>
          </div>

          <div style={{ marginTop: 12 }}>
            <Table
              dataSource={(previewData?.items ?? previewData?.products ?? []).map((it: any, idx: number) => ({
                key: it.key ?? idx,
                sno: idx + 1,
                product: it.product_name ?? it.product?.name ?? "",
                description: it.description ?? "",
                qty: it.quantity ?? 0,
                unit_price: Number(it.unit_price ?? 0).toFixed(2),
                discount: it.discount ?? 0,
                tax: it.tax_rate ?? it.tax ?? 0,
                line_total: Number(it.line_total ?? 0).toFixed(2),
              }))}
              pagination={false}
              bordered
              size="small"
              columns={[
                { title: "S.No", dataIndex: "sno", key: "sno", width: 50 },
                { title: "Product", dataIndex: "product", key: "product" },
                { title: "Description", dataIndex: "description", key: "description" },
                { title: "Qty", dataIndex: "qty", key: "qty", align: "right" as any, width: 80 },
                { title: "Unit Price", dataIndex: "unit_price", key: "unit_price", align: "right" as any, width: 110 },
                { title: "Discount", dataIndex: "discount", key: "discount", align: "right" as any, width: 100 },
                { title: "Tax", dataIndex: "tax", key: "tax", align: "right" as any, width: 90 },
                { title: "Line Total", dataIndex: "line_total", key: "line_total", align: "right" as any, width: 120 },
              ]}
            />
          </div>

          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 12 }}>
            <div style={{ width: 320 }}>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <div>Subtotal</div>
                <div>₹ {(previewData?.totals?.total_amount ?? previewData?.totalAmount ?? 0).toFixed(2)}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <div>Discount</div>
                <div>₹ {(previewData?.totals?.discount_amount ?? 0).toFixed(2)}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <div>Tax</div>
                <div>₹ {(previewData?.totals?.tax_amount ?? 0).toFixed(2)}</div>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0", fontWeight: 800, fontSize: 16 }}>
                <div>Net Amount</div>
                <div>₹ {(previewData?.totals?.net_amount ?? previewData?.netAmount ?? 0).toFixed(2)}</div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: 24 }}>
            <div style={{ fontWeight: 700 }}>Terms & Conditions</div>
            <div>{previewData?.terms_conditions}</div>
          </div>
        </div>
      </Modal>
    </Card>
  );
};

export default NewQuotation;
