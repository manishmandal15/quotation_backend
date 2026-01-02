// src/pages/Forms/CustomerMaster.tsx
import React, { useState, useEffect } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  Modal,
  message,
  Select,
  Popconfirm,
  Checkbox,
} from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import axios from "axios";

const { Option } = Select;

interface Customer {
  id?: number;
  name: string;
  email?: string;
  phone?: string;
  gst_no?: string;
  pan_no?: string;
  address?: string;
  city?: string;
  district_id?: number;
  state_id?: number;
  pincode?: string;
  country?: string;
  contact_person?: string;

  shipping_address?: string;
  shipping_city?: string;
  shipping_district?: number;
  shipping_state?: number;
  shipping_pinocde?: string;
  shipping_country?: string;

  sameAsBilling?: boolean;
  is_active?: 1 | 0;
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const customerAPI = axios.create({ baseURL: `${BASE_URL}/customers` });
export const stateAPI = axios.create({ baseURL: `${BASE_URL}/states` });
export const districtAPI = axios.create({ baseURL: `${BASE_URL}/districts` });

const CustomerMaster: React.FC = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [open, setOpen] = useState(false);
  const [form] = Form.useForm();
  const [editId, setEditId] = useState<number | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filteredDistricts, setFilteredDistricts] = useState<any[]>([]);
  const [filteredShippingDistricts, setFilteredShippingDistricts] = useState<
    any[]
  >([]);

  const fetchCustomers = async () => {
    try {
      const res = await customerAPI.get("/");
      setCustomers(res.data);
      setFilteredCustomers(res.data);
    } catch {
      message.error("Failed to fetch customers");
    }
  };

  const fetchStates = async () => {
    try {
      const res = await stateAPI.get("/");
      setStates(res.data);
    } catch {
      message.error("Failed to fetch states");
    }
  };

  const fetchDistricts = async () => {
    try {
      const res = await districtAPI.get("/");
      setDistricts(res.data);
    } catch {
      message.error("Failed to fetch districts");
    }
  };

  useEffect(() => {
    fetchCustomers();
    fetchStates();
    fetchDistricts();
  }, []);

  const handleSearch = (text: string) => {
    setSearchText(text);
    const filtered = customers.filter(
      (c) =>
        c.name?.toLowerCase().includes(text.toLowerCase()) ||
        c.contact_person?.toLowerCase().includes(text.toLowerCase())
    );
    setFilteredCustomers(filtered);
  };

  const handleSave = async (values: Customer) => {
    try {
      const payload = { ...values, is_active: values.is_active ?? 1 };

      if (editId) {
        await customerAPI.put(`/${editId}`, payload);
        message.success("Customer updated successfully!");
      } else {
        await customerAPI.post("/", payload);
        message.success("Customer added successfully!");
      }

      fetchCustomers();
      setOpen(false);
      form.resetFields();
      setEditId(null);
    } catch (err) {
      console.error(err);
      message.error("Failed to save customer");
    }
  };

  const handleEdit = (record: Customer) => {
    setEditId(record.id || null);

    // 🔹 Billing districts filter
    if (record.state_id) {
      const fd = districts.filter(
        (d) => Number(d.state_id) === Number(record.state_id)
      );
      setFilteredDistricts(fd);
    }

    // 🔹 Shipping districts filter
    if (record.shipping_state) {
      const sfd = districts.filter(
        (d) => Number(d.state_id) === Number(record.shipping_state)
      );
      setFilteredShippingDistricts(sfd);
    }

    // 🔹 Now set form values
    form.setFieldsValue(record);

    setOpen(true);
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    try {
      await customerAPI.delete(`/${id}`);
      message.success("Customer deleted successfully!");
      fetchCustomers();
    } catch {
      message.error("Failed to delete customer");
    }
  };

  // ⭐ AUTO-FILL SHIPPING
  // const handleSameAsBilling = (checked: boolean) => {
  //   const billing = form.getFieldsValue([
  //     "address",
  //     "city",
  //     "district_id",
  //     "state_id",
  //     "pincode",
  //     "country",
  //   ]);

  //   if (checked) {
  //     form.setFieldsValue({
  //       shipping_address: billing.address,
  //       shipping_city: billing.city,
  //       shipping_district: billing.district_id,
  //       shipping_state: billing.state_id,
  //       shipping_pinocde: billing.pincode,
  //       shipping_country: billing.country,
  //     });
  //   }
  // };


  const handleSameAsBilling = (checked: boolean) => {
  const billing = form.getFieldsValue([
    "address",
    "city",
    "district_id",
    "state_id",
    "pincode",
    "country",
  ]);

  if (checked) {
    // ⭐ FIRST: shipping districts filter karo
    if (billing.state_id) {
      const sfd = districts.filter(
        (d) => Number(d.state_id) === Number(billing.state_id)
      );
      setFilteredShippingDistricts(sfd);
    }

    // ⭐ THEN: form values set karo
    form.setFieldsValue({
      shipping_address: billing.address,
      shipping_city: billing.city,
      shipping_state: billing.state_id,
      shipping_district: billing.district_id,
      shipping_pinocde: billing.pincode,
      shipping_country: billing.country,
    });
  }
};


  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Customer Master</h2>

        <div className="flex items-center gap-4">
          <Input.Search
            placeholder="Search by name or contact person"
            allowClear
            value={searchText}
            onChange={(e) => handleSearch(e.target.value)}
            style={{ width: 300 }}
          />

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              form.resetFields();
              setEditId(null);
              setOpen(true);
            }}
          >
            Add Customer
          </Button>
        </div>
      </div>

      <Table
        dataSource={filteredCustomers}
        rowKey="id"
        bordered
        pagination={{ pageSize: 5 }}
        columns={[
          { title: "Sno", key: "sno", render: (_t, _r, i) => i + 1, width: 60 },
          { title: "Customer Name", dataIndex: "name" },
          { title: "Contact Person", dataIndex: "contact_person" },
          { title: "Email", dataIndex: "email" },
          { title: "Phone", dataIndex: "phone" },
          { title: "GST No", dataIndex: "gst_no" },
          // { title: "PAN No", dataIndex: "pan_no" },

          // {
          //   title: "Billing State",
          //   dataIndex: "state_id",
          //   render: (val) => states.find((s) => s.id == val)?.name || "-",
          // },
          {
            title: "Billing District",
            dataIndex: "district_id",
            render: (val) => districts.find((d) => d.id == val)?.name || "-",
          },
          // {
          //   title: "Shipping State",
          //   dataIndex: "shipping_state",
          //   render: (val) => states.find((s) => s.id == val)?.name || "-",
          // },
          // {
          //   title: "Shipping District",
          //   dataIndex: "shipping_district",
          //   render: (val) => districts.find((d) => d.id == val)?.name || "-",
          // },

          { title: "Country", dataIndex: "country" },
          {
            title: "Status",
            dataIndex: "is_active",
            render: (v) =>
              v === 1 ? (
                <span style={{ color: "green" }}>Active</span>
              ) : (
                <span style={{ color: "red" }}>Inactive</span>
              ),
          },
          {
            title: "Actions",
            key: "actions",
            render: (_: any, record: Customer) => (
              <div style={{ display: "flex", gap: 8 }}>
                <Button
                  type="default"
                  icon={<EditOutlined style={{ color: "#1677ff" }} />}
                  onClick={() => handleEdit(record)}
                />
                <Popconfirm
                  title="Are you sure to delete this customer?"
                  onConfirm={() => handleDelete(record.id)}
                >
                  <Button
                    type="default"
                    icon={<DeleteOutlined style={{ color: "red" }} />}
                  />
                </Popconfirm>
              </div>
            ),
          },
        ]}
      />

      <Modal
        title={editId ? "Edit Customer" : "Add New Customer"}
        open={open}
        destroyOnClose
        onCancel={() => setOpen(false)}
        footer={null}
        width={1000}
      >
        <Form layout="vertical" form={form} onFinish={handleSave}>
          <h3 className="text-lg font-semibold mb-2">Billing Details</h3>

          <div className="grid grid-cols-4 gap-4">
            <Form.Item name="name" label="Name" rules={[{ required: true }]}>
              <Input placeholder="Enter customer name" />
            </Form.Item>

            <Form.Item name="contact_person" label="Contact Person">
              <Input placeholder="Enter contact person" />
            </Form.Item>

            <Form.Item name="email" label="Email">
              <Input placeholder="Enter email" />
            </Form.Item>

            <Form.Item name="phone" label="Phone">
              <Input placeholder="Enter phone number" />
            </Form.Item>

            <Form.Item name="gst_no" label="GST Number">
              <Input placeholder="Enter GST number" />
            </Form.Item>

            <Form.Item name="pan_no" label="PAN Number">
              <Input placeholder="Enter PAN number" />
            </Form.Item>

            <Form.Item name="address" label="Address">
              <Input />
            </Form.Item>

            <Form.Item name="city" label="City">
              <Input />
            </Form.Item>

            <Form.Item name="state_id" label="State">
              <Select
                allowClear
                showSearch
                placeholder="Select State"
                optionFilterProp="label"
                onChange={(stateId) => {
                  form.setFieldsValue({ district_id: undefined });

                  const fd = districts.filter(
                    (d) => Number(d.state_id) === Number(stateId)
                  );
                  setFilteredDistricts(fd);
                }}
              >
                {[...states]
                  .sort((a, b) => a.name.localeCompare(b.name)) // 👈 ORDER BY name ASC
                  .map((s) => (
                    <Option key={s.id} value={s.id} label={s.name}>
                      {s.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item name="district_id" label="District">
              <Select
                allowClear
                showSearch
                optionFilterProp="label"
                placeholder="Select District"
              >
                {[...filteredDistricts]
                  .sort((a, b) => a.name.localeCompare(b.name)) // 👈 ORDER BY name ASC
                  .map((d) => (
                    <Option key={d.id} value={d.id} label={d.name}>
                      {d.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item name="pincode" label="Pincode">
              <Input />
            </Form.Item>

            <Form.Item name="country" label="Country" initialValue="India">
              <Input />
            </Form.Item>
          </div>

          <h3 className="text-lg font-semibold mt-4 mb-2">Shipping Details</h3>

          {/* ⭐ SAME AS BILLING CHECKBOX */}
          <Checkbox
            onChange={(e) => handleSameAsBilling(e.target.checked)}
            className="mb-3"
          >
            Same as Billing
          </Checkbox>

          <div className="grid grid-cols-4 gap-4">
            <Form.Item name="shipping_address" label="Shipping Address">
              <Input />
            </Form.Item>

            <Form.Item name="shipping_city" label="Shipping City">
              <Input />
            </Form.Item>

            <Form.Item name="shipping_state" label="Shipping State">
              <Select
                allowClear
                showSearch // 🔍 searchable
                placeholder="Select Shipping State"
                optionFilterProp="label" // search name se ho
                onChange={(stateId) => {
                  form.setFieldsValue({ shipping_district: undefined });

                  const fd = districts.filter(
                    (d) => Number(d.state_id) === Number(stateId)
                  );
                  setFilteredShippingDistricts(fd);
                }}
              >
                {[...states]
                  .sort((a, b) => a.name.localeCompare(b.name)) // 🔠 ORDER BY name ASC
                  .map((s) => (
                    <Option key={s.id} value={s.id} label={s.name}>
                      {s.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item name="shipping_district" label="Shipping District">
              <Select
                allowClear
                showSearch // 🔍 searchable
                placeholder="Select Shipping District"
                optionFilterProp="label" // name se search
              >
                {[...filteredShippingDistricts]
                  .sort((a, b) => a.name.localeCompare(b.name)) // 🔠 ORDER BY name ASC
                  .map((d) => (
                    <Option key={d.id} value={d.id} label={d.name}>
                      {d.name}
                    </Option>
                  ))}
              </Select>
            </Form.Item>

            <Form.Item name="shipping_pinocde" label="Shipping Pincode">
              <Input />
            </Form.Item>

            <Form.Item
              name="shipping_country"
              label="Shipping Country"
              initialValue="India"
            >
              <Input />
            </Form.Item>

            <Form.Item name="is_active" label="Status">
              <Select>
                <Option value={1}>Active</Option>
                <Option value={0}>Inactive</Option>
              </Select>
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

export default CustomerMaster;
