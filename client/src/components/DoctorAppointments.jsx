import React, { useState, useEffect } from "react";
import { Table, Typography, Card, message, Layout } from "antd";
import FooterMin from "./FooterMin";
import Navbar from "./Navbar";
import axios from "axios";
const { Title } = Typography;
const { Content } = Layout;

export default function DoctorAppointments() {
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
      .get("http://localhost:8000/api/paldoc/doctor/getappointments", { withCredentials: true })
      .then((response) => {
        setAppointments(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        message.error("An error occurred while fetching appointments.");
      });
  };

  const markAsFinished = async (appointmentId) => {
    try {
      await axios.put(`http://localhost:8000/api/paldoc/doctor/appointments/${appointmentId}/finish`, {}, { withCredentials: true });
      message.success("Appointment marked as finished!");
      fetchAppointments(); // Refresh the table
    } catch (error) {
      message.error("Failed to update appointment status.");
    }
  };

  // Filter appointments by status
  const upcomingAppointments = appointments.filter(appointment => appointment.status === "Pending" || appointment.status === "Upcoming");
  const pastAppointments = appointments.filter(appointment => appointment.status === "Finished");

  // Format columns
  const columns = [
    { title: "Patient", dataIndex: "patientName", key: "patientName" },
    {
      title: "Day of Week",
      dataIndex: "dayOfWeek",
      key: "dayOfWeek",
      render: (dayIndex) => getDayName(dayIndex),
    },
    { title: "Start Time", dataIndex: "startTime", key: "startTime" },
    { title: "End Time", dataIndex: "endTime", key: "endTime" },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        record.status != "Finished" && (
        <button
          onClick={() => markAsFinished(record._id)}
          style={{
            backgroundColor: "#1890ff",
            color: "white",
            border: "none",
            padding: "5px 10px",
            cursor: "pointer",
            borderRadius: "5px",
          }}
        >
          Mark As Finished
        </button>)
      ),
    },
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
