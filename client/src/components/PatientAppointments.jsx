import React, { useState, useEffect } from "react";
import { Table, Typography, Card, message, Layout } from "antd";
import FooterMin from "./FooterMin";
import Navbar from "./Navbar";
import axios from "axios";
const { Title } = Typography;
const { Content } = Layout;

export default function PatientAppointments() {
  const [appointments, setAppointments] = useState([]);

  const getDayName = (dayIndex) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayIndex] || "Invalid Day";
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetch appointments from API
  const fetchAppointments = async () => {
    axios
      .get("http://localhost:8000/api/paldoc/patient/getappointments", { withCredentials: true })
      .then((response) => {
        setAppointments(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        message.error("An error occurred while fetching appointments.");
      });
  };

  // Filter appointments by status
  const upcomingAppointments = appointments.filter(appointment => appointment.status !== "Finished");
  const pastAppointments = appointments.filter(appointment => appointment.status === "Finished");

  // Format columns
  const columns = [
    { title: "Doctor", dataIndex: "doctorName", key: "doctorName" },
    {
      title: "Day of Week",
      dataIndex: "dayOfWeek",
      key: "dayOfWeek",
      render: (dayIndex) => getDayName(dayIndex),
    },
    { title: "Start Time", dataIndex: "startTime", key: "startTime" },
    { title: "End Time", dataIndex: "endTime", key: "endTime" },
  ];

  return (
    <>
      <Navbar />
      <Content style={{ padding: "20px", flex: 1 }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <Title level={2} className="text-center" style={{ marginBottom: "30px" }}>
            Appointments
          </Title>

          <Card
            title="Upcoming Appointments"
            bordered={false}
            style={{
              marginBottom: 20,
              borderRadius: 10,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Table columns={columns} dataSource={upcomingAppointments} pagination={false} />
          </Card>

          <Card
            title="Past Appointments"
            bordered={false}
            style={{
              borderRadius: 10,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Table columns={columns} dataSource={pastAppointments} pagination={false} />
          </Card>
        </div>
      </Content>
      <FooterMin style={{ marginTop: "auto" }} />
    </>
  );
}
