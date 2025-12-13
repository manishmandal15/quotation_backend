import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Popconfirm, message,Row, Col } from "antd";
import { PlusOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

interface Location {
  location_id?: number;
  seller_id: number;
  location_name: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  postal_code: string;
  country?: string;
}

export default function WarehouseLocations() {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);

  const [form] = Form.useForm();

  // Fetch locations
  const fetchLocations = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE}/warehouse-locations`);
      setLocations(res.data);
    } catch (err) {
      console.error(err);
      message.error("Failed to load locations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLocations();
  }, []);

  // Open modal for add
  const openAddModal = () => {
    setEditingLocation(null);
    form.resetFields();
    setIsModalOpen(true);
  };

  // Open modal for edit
  const openEditModal = (record: Location) => {
    setEditingLocation(record);
    form.setFieldsValue(record);
    setIsModalOpen(true);
  };

  // Submit Form
  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();

      if (editingLocation) {
        // UPDATE
        await axios.put(
          `${API_BASE}/warehouse-locations/${editingLocation.location_id}`,
          values
        );
        message.success("Location Updated");
      } else {
        // CREATE
        await axios.post(`${API_BASE}/warehouse-locations`, values);
        message.success("Location Created");
      }

      setIsModalOpen(false);
      fetchLocations();
    } catch (err) {
      console.error(err);
      message.error("Something went wrong");
    }
  };

  // DELETE
  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`${API_BASE}/warehouse-locations/${id}`);
      message.success("Location Deleted");
      fetchLocations();
    } catch (err) {
      console.error(err);
      message.error("Delete failed");
    }
  };

  // TABLE COLUMNS
  const columns = [
    {
      title: "Sno",
      key: "sno",
      render: (_text, _record, index) => index + 1,
      width: 60,
    },
    {
      title: "Location Name",
      dataIndex: "location_name",
    },
    {
      title: "City",
      dataIndex: "city",
    },
    {
      title: "State",
      dataIndex: "state",
    },
    {
      title: "Postal Code",
      dataIndex: "postal_code",
    },
    {
      title: "Country",
      dataIndex: "country",
    },
    {
      title: "Actions",
      render: (record: Location) => (
        <div style={{ display: "flex", gap: "10px" }}>
          <Button
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          />
          <Popconfirm
            title="Delete this location?"
            onConfirm={() => handleDelete(record.location_id!)}
          >
            <Button danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <h2 style={{ fontSize: "22px", fontWeight: "600", marginBottom: "20px" }}>
        Warehouse Locations
      </h2>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: 20,
        }}
      >
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddModal}>
          Add Location
        </Button>
      </div>

      <Table
        rowKey="location_id"
        loading={loading}
        columns={columns}
        dataSource={locations}
        bordered
      />

      {/* MODAL */}
      {/* <Modal
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        onOk={handleSubmit}
        title={editingLocation ? "Edit Location" : "Add Location"}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="seller_id"
            label="Seller ID"
            rules={[{ required: true, message: "Seller ID is required" }]}
          >
            <Input type="number" placeholder="Enter seller ID" />
          </Form.Item>

          <Form.Item
            name="location_name"
            label="Location Name"
            rules={[{ required: true }]}
          >
            <Input placeholder="Warehouse name" />
          </Form.Item>

          <Form.Item
            name="address_line1"
            label="Address Line 1"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="address_line2" label="Address Line 2">
            <Input />
          </Form.Item>

          <Form.Item name="city" label="City" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item name="state" label="State" rules={[{ required: true }]}>
            <Input />
          </Form.Item>

          <Form.Item
            name="postal_code"
            label="Postal Code"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item name="country" label="Country" initialValue="India">
            <Input />
          </Form.Item>
        </Form>
      </Modal> */}


      <Modal
  open={isModalOpen}
  onCancel={() => setIsModalOpen(false)}
  onOk={handleSubmit}
  title={editingLocation ? "Edit Location" : "Add Location"}
  width={650}
>
  <Form form={form} layout="vertical">
    <Row gutter={16}>
      <Col xs={24} md={12}>
        <Form.Item
          name="seller_id"
          label="Seller ID"
          rules={[{ required: true, message: "Seller ID is required" }]}
        >
          <Input type="number" placeholder="Enter seller ID" />
        </Form.Item>
      </Col>

      <Col xs={24} md={12}>
        <Form.Item
          name="location_name"
          label="Location Name"
          rules={[{ required: true }]}
        >
          <Input placeholder="Warehouse name" />
        </Form.Item>
      </Col>

      <Col xs={24} md={12}>
        <Form.Item
          name="address_line1"
          label="Address Line 1"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Col>

      <Col xs={24} md={12}>
        <Form.Item name="address_line2" label="Address Line 2">
          <Input />
        </Form.Item>
      </Col>

      <Col xs={24} md={12}>
        <Form.Item name="city" label="City" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>

      <Col xs={24} md={12}>
        <Form.Item name="state" label="State" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
      </Col>

      <Col xs={24} md={12}>
        <Form.Item
          name="postal_code"
          label="Postal Code"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>
      </Col>

      <Col xs={24} md={12}>
        <Form.Item
          name="country"
          label="Country"
          initialValue="India"
        >
          <Input />
        </Form.Item>
      </Col>
    </Row>
  </Form>
</Modal>

    </div>
  );
}
