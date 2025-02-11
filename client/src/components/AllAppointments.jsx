import React, { useEffect, useState } from "react";
import { Table, Typography } from "antd";
import axios from "axios";

const { Title } = Typography;

const AllAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  const getDayName = (dayIndex) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayIndex] || "Invalid Day";
  };

  useEffect(() => {
    axios.get("http://localhost:8000/api/paldoc/admin/getappointments", {withCredentials: true})
      .then(response => {
        setAppointments(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching appointments:", error);
        setLoading(false);
      });
  }, []);

  const columns = [
    {
      title: "Patient",
      dataIndex: "patientName",
      key: "patientName",
    },
    {
      title: "Doctor",
      dataIndex: "doctorName",
      key: "doctorName",
    },
    {
      title: "Day",
      dataIndex: "dayOfWeek",
      key: "dayOfWeek",
      render: (dayIndex) => getDayName(dayIndex),
    },
    {
      title: "Start Time",
      dataIndex: "startTime",
      key: "startTime",
    },
    {
      title: "End Time",
      dataIndex: "endTime",
      key: "endTime",
    },
  ];  

  return (
    <div>
      <Title level={2} style={{ textAlign: "center" }}>All Appointments</Title>
      <Table dataSource={appointments} columns={columns} loading={loading} rowKey="_id" />
    </div>
  );
};

export default AllAppointments;