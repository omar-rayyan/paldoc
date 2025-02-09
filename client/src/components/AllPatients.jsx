import React, { useEffect, useState } from "react";
import { Table, Typography, Tag, Button, message } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const { Title } = Typography;

const AllPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:8000/api/paldoc/admin/getpatients", {withCredentials: true})
      .then(response => {
        setPatients(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching patients:", error);
        setLoading(false);
      });
  }, []);

  const handleDelete = (id) => {
    axios.delete(`http://localhost:8000/api/paldoc/admin/deleteuser/${id}`, {withCredentials: true})
      .then(() => {
        message.success("Deleted successfully");
        setPatients(patients.filter(patient => patient._id !== id));
      })
      .catch(err => {
        message.error("Failed to delete: ", err);
      });
  };

  const columns = [
    {
      title: "First Name",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phonenumber",
      key: "phonenumber",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
    {
      title: "Role",
      dataIndex: "isAdmin",
      key: "isAdmin",
      render: isAdmin => (
        <Tag color={isAdmin ? "volcano" : "blue"} style={{ fontSize: "14px", padding: "5px 10px" }}>
          {isAdmin ? "Admin" : "User"}
        </Tag>
      ),
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Button type="primary" danger icon={<DeleteOutlined />} onClick={() => handleDelete(record._id)} />
      ),
    }
  ];

  return (
    <div>
      <Title level={2} style={{ textAlign: "center" }}>All Patients</Title>
      <Table dataSource={patients} columns={columns} loading={loading} rowKey="_id" />
    </div>
  );
};

export default AllPatients;