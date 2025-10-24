import React, { useState } from "react";
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
} from "antd";
import dayjs from "dayjs";

const { Option } = Select;
const { TextArea } = Input;

const QuotationAll: React.FC = () => {
  const [form] = Form.useForm();
  const [showTable, setShowTable] = useState(false);
  const [dataSource, setDataSource] = useState<any[]>([]);
  const [count, setCount] = useState(1);

  const [products] = useState([
    { id: 1, name: "Product A", hsn: "1001", unitPrice: 100 },
    { id: 2, name: "Product B", hsn: "1002", unitPrice: 200 },
    { id: 3, name: "Product C", hsn: "1003", unitPrice: 300 },
  ]);

  // Step 1: Move to product list
  const handleNext = () => {
    form
      .validateFields()
      .then(() => setShowTable(true))
      .catch(() => message.error("Please fill all required fields"));
  };

  // Step 2: Add new product row
  const handleAddProduct = () => {
    const newRow = {
      key: count,
      sno: count,
      product: "",
      hsn: "",
      unitPrice: 0,
      qty: 1,
      discount: 0,
      gstRate: 0,
      gstAmount: 0,
      netAmt: 0,
    };
    setDataSource([...dataSource, newRow]);
    setCount(count + 1);
  };

  // Handle Product Change
  const handleProductChange = (value: number, record: any) => {
    const selected = products.find((p) => p.id === value);
    if (!selected) return;
    const newData = dataSource.map((item) => {
      if (item.key === record.key) {
        const gstAmount =
          ((selected.unitPrice * item.qty - item.discount) * item.gstRate) /
          100;
        const netAmt =
          selected.unitPrice * item.qty - item.discount + gstAmount;
        return {
          ...item,
          product: selected.name,
          hsn: selected.hsn,
          unitPrice: selected.unitPrice,
          gstAmount,
          netAmt,
        };
      }
      return item;
    });
    setDataSource(newData);
  };

  // Handle numeric field changes
  const handleChange = (value: any, record: any, field: string) => {
    const newData = dataSource.map((item) => {
      if (item.key === record.key) {
        const updated = { ...item, [field]: value };
        const gstAmount =
          ((updated.unitPrice * updated.qty - updated.discount) *
            updated.gstRate) /
          100;
        const netAmt =
          updated.unitPrice * updated.qty - updated.discount + gstAmount;
        return { ...updated, gstAmount, netAmt };
      }
      return item;
    });
    setDataSource(newData);
  };

  // Table Columns
  const columns = [
    { title: "S.No", dataIndex: "sno", width: 60 },
    {
      title: "Product",
      dataIndex: "product",
      render: (_: any, record: any) => (
        <Select
          placeholder="Select Product"
          style={{ width: 150 }}
          onChange={(value) => handleProductChange(value, record)}
        >
          {products.map((p) => (
            <Option key={p.id} value={p.id}>
              {p.name}
            </Option>
          ))}
        </Select>
      ),
    },
    { title: "HSN No.", dataIndex: "hsn", width: 100 },
    {
      title: "Unit Price",
      dataIndex: "unitPrice",
      render: (text: any, record: any) => (
        <InputNumber
          value={text}
          onChange={(value) => handleChange(value, record, "unitPrice")}
        />
      ),
    },
    {
      title: "Qty",
      dataIndex: "qty",
      render: (text: any, record: any) => (
        <InputNumber
          min={1}
          value={text}
          onChange={(value) => handleChange(value, record, "qty")}
        />
      ),
    },
    {
      title: "Discount",
      dataIndex: "discount",
      render: (text: any, record: any) => (
        <InputNumber
          min={0}
          value={text}
          onChange={(value) => handleChange(value, record, "discount")}
        />
      ),
    },
    {
      title: "GST Rate (%)",
      dataIndex: "gstRate",
      render: (text: any, record: any) => (
        <InputNumber
          min={0}
          value={text}
          onChange={(value) => handleChange(value, record, "gstRate")}
        />
      ),
    },
    {
      title: "GST Amount",
      dataIndex: "gstAmount",
      render: (text: number) => text.toFixed(2),
    },
    {
      title: "Net Amount",
      dataIndex: "netAmt",
      render: (text: number) => text.toFixed(2),
    },
  ];

  const totalAmount = dataSource.reduce(
    (sum, row) => sum + (row.netAmt || 0),
    0
  );

  // Final Submit
  const handleSubmit = () => {
    const formValues = form.getFieldsValue();
    const finalData = {
      ...formValues,
      quotationDate: formValues.quotationDate?.format("YYYY-MM-DD"),
      products: dataSource,
      totalAmount,
    };
    console.log("Quotation Data:", finalData);
    message.success("Quotation Saved Successfully!");
  };

  return (
    <Card title="Quotation Form" style={{ margin: 20, borderRadius: 12 }}>
      {!showTable && (
        <Form
          form={form}
          layout="vertical"
          initialValues={{ quotationDate: dayjs() }}
        >
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="customerName"
                label="Customer Name"
                rules={[{ required: true, message: "Select a customer" }]}
              >
                <Select placeholder="Select Customer">
                  <Option value="cust1">Customer 1</Option>
                  <Option value="cust2">Customer 2</Option>
                </Select>
              </Form.Item>
            </Col>

            <Col span={8}>
              <Form.Item
                name="quotationDate"
                label="Quotation Date"
                rules={[{ required: true }]}
              >
                <DatePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="address" label="Address">
                <TextArea rows={2} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="mobile" label="Mobile No.">
                <Input />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="gst" label="GST No.">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item name="paymentTerms" label="Payment Terms">
                <TextArea rows={2} />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="deliveryTerms" label="Delivery Terms">
                <TextArea rows={2} />
              </Form.Item>
            </Col>
          </Row>

          <Button type="primary" onClick={handleNext}>
            Next (Add Products)
          </Button>
        </Form>
      )}

      {showTable && (
        <>
          <Button
            type="dashed"
            onClick={handleAddProduct}
            style={{ marginBottom: 10 }}
          >
            + Add Product
          </Button>

          <Table
            columns={columns}
            dataSource={dataSource}
            pagination={false}
            bordered
          />

          <h3 style={{ textAlign: "right", marginTop: 10 }}>
            Total Net Amount: ₹ {totalAmount.toFixed(2)}
          </h3>

          <Button type="primary" onClick={handleSubmit}>
            Submit Quotation
          </Button>
        </>
      )}
    </Card>
  );
};

export default QuotationAll;
