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
  Popconfirm,
  Typography,
} from "antd";
import {
  DeleteOutlined,
  PlusOutlined,
  EyeOutlined,
  EditOutlined,
} from "@ant-design/icons";
import axios from "axios";
import dayjs from "dayjs";
import "./NewQuotation.css"; // ✅ add this css file

const { Option } = Select;
const { TextArea } = Input;
const { Title } = Typography;

const QUOTATION_API = axios.create({ baseURL: "http://localhost:5000/api/quotations" });
const CUSTOMER_API = axios.create({ baseURL: "http://localhost:5000/api/customers" });
const CURRENCY_API = axios.create({ baseURL: "http://localhost:5000/api/currencies" });

const NewQuotation: React.FC = () => {
  const [form] = Form.useForm();
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [count, setCount] = useState(1);
  const [customers, setCustomers] = useState<any[]>([]);
  const [currencies, setCurrencies] = useState<any[]>([]);
  const [quotationList, setQuotationList] = useState<any[]>([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    fetchQuotations();
    CUSTOMER_API.get("/")
      .then((res) => setCustomers(res.data))
      .catch(console.error);
    CURRENCY_API.get("/")
      .then((res) => setCurrencies(res.data))
      .catch(console.error);
  }, []);

  const fetchQuotations = () => {
    QUOTATION_API.get("/")
      .then((res) => setQuotationList(res.data))
      .catch(console.error);
  };

  const handleAddDescription = () => {
    const newRow = {
      key: count,
      sno: count,
      description: "",
      hsn: "",
      qty: 1,
      unitPrice: 0,
      discount: 0,
      amount: 0,
      taxableAmount: 0,
    };
    setDataSource([...dataSource, newRow]);
    setCount(count + 1);
  };

  const handleChange = (value: any, record: any, field: string) => {
    const newData = dataSource.map((item) => {
      if (item.key === record.key) {
        const updated = { ...item, [field]: value };
        updated.amount = Number(updated.unitPrice) * Number(updated.qty);
        updated.taxableAmount = updated.amount - (Number(updated.discount) || 0);
        return updated;
      }
      return item;
    });
    setDataSource(newData);
  };

  const handleCustomerChange = (customerId: number) => {
    const selected = customers.find((c) => c.id === customerId);
    if (selected) {
      form.setFieldsValue({
        address: selected.address,
        city: selected.city,
        state: selected.state,
        mobile: selected.mobile,
        gst: selected.gst,
      });
    }
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      if (!dataSource.length) {
        message.warning("Please add at least one product/item!");
        return;
      }

      const payload = {
        quotationNo: values.quotationNo,
        customerId: values.customerName,
        currencyId: values.currencyId,
        quotationDate: values.quotationDate?.format("YYYY-MM-DD"),
        validUntil: values.validUntil?.format("YYYY-MM-DD"),
        products: dataSource.map((item) => ({
          description: item.description,
          hsn: item.hsn,
          quantity: item.qty,
          unitPrice: item.unitPrice,
          discount: item.discount,
          lineTotal: item.taxableAmount,
        })),
        totalAmount: dataSource.reduce((sum, row) => sum + Number(row.amount), 0),
        totalTaxableAmount: dataSource.reduce((sum, row) => sum + Number(row.taxableAmount), 0),
        paymentTerms: values.paymentTerms,
        deliveryTerms: values.deliveryTerms,
        termsAndConditions: values.termsAndConditions,
      };

      if (editId) {
        await QUOTATION_API.put(`/${editId}`, payload);
        message.success("Quotation updated successfully!");
      } else {
        await QUOTATION_API.post("/", payload);
        message.success("Quotation saved successfully!");
      }

      form.resetFields();
      setDataSource([]);
      setCount(1);
      setIsFormVisible(false);
      setEditId(null);
      fetchQuotations();
    } catch (err) {
      console.error(err);
      message.error("Please fill all required fields!");
    }
  };

  const productColumns = [
    { title: "S.No", dataIndex: "sno", width: 60 },
    {
      title: "Description",
      dataIndex: "description",
      render: (_: string, record: any) => (
        <Input size="small" value={record.description} onChange={(e) => handleChange(e.target.value, record, "description")} />
      ),
    },
    {
      title: "HSN",
      dataIndex: "hsn",
      render: (_: string, record: any) => (
        <Input size="small" value={record.hsn} onChange={(e) => handleChange(e.target.value, record, "hsn")} />
      ),
    },
    {
      title: "Qty",
      dataIndex: "qty",
      render: (_: number, record: any) => (
        <InputNumber min={1} size="small" value={record.qty} onChange={(v) => handleChange(v || 0, record, "qty")} />
      ),
    },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      render: (_: number, record: any) => (
        <InputNumber min={0} size="small" value={record.unitPrice} onChange={(v) => handleChange(v || 0, record, "unitPrice")} />
      ),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      render: (_: number, record: any) => (
        <InputNumber min={0} size="small" value={record.discount} onChange={(v) => handleChange(v || 0, record, "discount")} />
      ),
    },
    {
      title: "Amount",
      dataIndex: "amount",
      render: (_: number, record: any) => `₹ ${Number(record.amount).toFixed(2)}`,
    },
    {
      title: "Taxable Amount",
      dataIndex: "taxableAmount",
      render: (_: number, record: any) => `₹ ${Number(record.taxableAmount).toFixed(2)}`,
    },
  ];

  const totalAmount = dataSource.reduce((sum, row) => sum + Number(row.amount), 0);
  const totalTaxableAmount = dataSource.reduce((sum, row) => sum + Number(row.taxableAmount), 0);

  return (
    <Card className="quotation-card">
      {!isFormVisible ? (
        <>
          <div className="quotation-header">
            <Title level={4}>📋 Quotation List</Title>
            <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsFormVisible(true)}>
              Add Quotation
            </Button>
          </div>
          <div className="table-responsive">
            <Table columns={[
                     { title: "S.No", dataIndex: "S.No" },
              { title: "Quotation No", dataIndex: "quotationNo" },
              { title: "Customer Name", dataIndex: "customerName" },
              { title: "Quotation Date", dataIndex: "quotationDate" },
              { title: "Net Amount", dataIndex: "NetAmount" },
              { title: "Approved By", dataIndex: "ApprovedBy" },
              { title: "Approved By", dataIndex: "ApprovedBy" },
              { title: "Approved Date", dataIndex: "ApprovedDate" },
               { title: "Status", dataIndex: "status" },
                { title: "Action", dataIndex: "Action" },
              
              {
                title: "Total Amount",
                dataIndex: "totalAmount",
                render: (amt: any) => `₹ ${amt ? Number(amt).toFixed(2) : "0.00"}`,
              },
            ]} dataSource={quotationList} rowKey="id" bordered size="middle" />
          </div>
        </>
      ) : (
        <>
          <div className="quotation-header">
            <Title level={4}>{editId ? "✏️ Edit Quotation" : "🧾 Create New Quotation"}</Title>
            <Button onClick={() => setIsFormVisible(false)}>Back to List</Button>
          </div>

          <Form
            form={form}
            layout="vertical"
            initialValues={{
              quotationDate: dayjs(),
              validUntil: dayjs().add(7, "day"),
            }}
          >
            <Card type="inner" title="Quotation Info" className="inner-card">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name="quotationNo" label="Quotation No" rules={[{ required: true }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name="quotationDate" label="Quotation Date" rules={[{ required: true }]}>
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name="validUntil" label="Valid Until" rules={[{ required: true }]}>
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card type="inner" title="Customer Info" className="inner-card">
              <Row gutter={[16, 16]}>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name="customerName" label="Customer Name" rules={[{ required: true }]}>
                    <Select onChange={handleCustomerChange}>
                      {customers.map((c) => (
                        <Option key={c.id} value={c.id}>
                          {c.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name="mobile" label="Mobile">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name="gst" label="GST">
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24}>
                  <Form.Item name="address" label="Address">
                    <TextArea rows={2} />
                  </Form.Item>
                </Col>
              </Row>
            </Card>

            <Card type="inner" title="Products / Items" className="inner-card">
              <div className="add-btn">
                <Button type="dashed" icon={<PlusOutlined />} onClick={handleAddDescription}>
                  Add Item
                </Button>
              </div>
              <div className="table-responsive">
                <Table columns={productColumns} dataSource={dataSource} pagination={false} bordered size="small" />
              </div>
              <div className="total-section">
                <h3>Total Amount: ₹ {totalAmount.toFixed(2)}</h3>
                <h4>Total Taxable Amount: ₹ {totalTaxableAmount.toFixed(2)}</h4>
              </div>
            </Card>

            <Card type="inner" title="Terms & Conditions" className="inner-card">
              <Row gutter={[16, 16]}>

                <Col xs={24} sm={24} md={24}>
                  <Form.Item name="termsAndConditions" label="">
                    <TextArea rows={5} />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12} md={8}>
                  <Form.Item name="paymentTerms" label="Payment Terms">
                    <TextArea rows={2} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12} md={8}>
                  <Form.Item name="deliveryTerms" label="Delivery Terms">
                    <TextArea rows={2} />
                  </Form.Item>
                </Col>
                
              </Row>
            </Card>

            <div className="form-submit">
              <Button type="primary" onClick={handleSubmit}>
                {editId ? "Update Quotation" : "Submit Quotation"}
              </Button>
            </div>
          </Form>
        </>
      )}
    </Card>
  );
};

export default NewQuotation;
