import React, { useEffect, useState } from "react";
import { Modal, Form, Input, Select, Checkbox, Button, message } from "antd";
import axios from "axios";

const { Option } = Select;

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void; // quotation page refresh ke liye
}

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const customerAPI = axios.create({ baseURL: `${BASE_URL}/customers` });
const stateAPI = axios.create({ baseURL: `${BASE_URL}/states` });
const districtAPI = axios.create({ baseURL: `${BASE_URL}/districts` });

const AddCustomer: React.FC<Props> = ({ open, onClose, onSuccess }) => {
  const [form] = Form.useForm();
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [filteredDistricts, setFilteredDistricts] = useState<any[]>([]);
  const [filteredShippingDistricts, setFilteredShippingDistricts] = useState<any[]>([]);

  useEffect(() => {
    stateAPI.get("/").then((r) => setStates(r.data));
    districtAPI.get("/").then((r) => setDistricts(r.data));
  }, []);

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
      if (billing.state_id) {
        const fd = districts.filter(
          (d) => Number(d.state_id) === Number(billing.state_id)
        );
        setFilteredShippingDistricts(fd);
      }

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

  const handleSave = async (values: any) => {
    try {
      await customerAPI.post("/", { ...values, is_active: 1 });
      message.success("Customer added successfully");
      form.resetFields();
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error(err);
      message.error("Failed to save customer");
    }
  };

  return (
    <Modal
      title="Add New Customer"
      open={open}
      onCancel={onClose}
      destroyOnClose
      footer={null}
      width={1000}
    >
      <Form layout="vertical" form={form} onFinish={handleSave}>
        <h3 className="text-lg font-semibold mb-2">Billing Details</h3>

        <div className="grid grid-cols-4 gap-4">
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="contact_person" label="Contact Person">
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>

          <Form.Item name="gst_no" label="GST No">
            <Input />
          </Form.Item>

          <Form.Item name="address" label="Address">
            <Input />
          </Form.Item>

          <Form.Item name="city" label="City">
            <Input />
          </Form.Item>

          <Form.Item name="state_id" label="State">
            <Select
              showSearch
              optionFilterProp="label"
              onChange={(stateId) => {
                form.setFieldsValue({ district_id: undefined });
                setFilteredDistricts(
                  districts.filter((d) => Number(d.state_id) === Number(stateId))
                );
              }}
            >
              {states.map((s) => (
                <Option key={s.id} value={s.id} label={s.name}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="district_id" label="District">
            <Select showSearch optionFilterProp="label">
              {filteredDistricts.map((d) => (
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

        <Checkbox onChange={(e) => handleSameAsBilling(e.target.checked)}>
          Same as Billing
        </Checkbox>

        <div className="grid grid-cols-4 gap-4 mt-3">
          <Form.Item name="shipping_address" label="Shipping Address">
            <Input />
          </Form.Item>

          <Form.Item name="shipping_city" label="Shipping City">
            <Input />
          </Form.Item>

          <Form.Item name="shipping_state" label="Shipping State">
            <Select
              showSearch
              optionFilterProp="label"
              onChange={(stateId) => {
                setFilteredShippingDistricts(
                  districts.filter((d) => Number(d.state_id) === Number(stateId))
                );
              }}
            >
              {states.map((s) => (
                <Option key={s.id} value={s.id} label={s.name}>
                  {s.name}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="shipping_district" label="Shipping District">
            <Select showSearch optionFilterProp="label">
              {filteredShippingDistricts.map((d) => (
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
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={onClose} style={{ marginRight: 8 }}>
            Close
          </Button>
          <Button type="primary" htmlType="submit">
            Save
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddCustomer;
