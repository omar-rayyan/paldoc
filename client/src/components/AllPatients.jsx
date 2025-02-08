import React, { useEffect, useState } from "react";
import { Table, Typography } from "antd";
import axios from "axios";

const { Title } = Typography;

const AllPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:8000/api/admin/allpatients")
      .then(response => {
        setPatients(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching patients:", error);
        setLoading(false);
      });
  }, []);

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
      title: "Admin",
      dataIndex: "isAdmin",
      key: "isAdmin",
      render: isAdmin => (isAdmin ? "Yes" : "No"),
    }
  ];

  return (
    <div>
      <Title level={2} style={{ textAlign: "center" }}>All Patients</Title>
      <Table dataSource={patients} columns={columns} loading={loading} rowKey="id" />
    </div>
  );
};

export default AllPatients;