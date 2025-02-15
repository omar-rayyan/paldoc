import React, { useState, useEffect } from "react";
import {
  Table,
  Typography,
  Card,
  message,
  Layout,
  Modal,
  Button,
  Descriptions,
  Spin,
} from "antd";
import FooterMin from "./FooterMin";
import Navbar from "./Navbar";
import axios from "axios";

const { Title } = Typography;
const { Content } = Layout;

export default function DoctorAppointments() {
  const [appointments, setAppointments] = useState([]);
  const [healthHistoryData, setHealthHistoryData] = useState(null);
  const [healthHistoryModalVisible, setHealthHistoryModalVisible] = useState(false);
  const [healthHistoryLoading, setHealthHistoryLoading] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState({ name: "", id: "" });

  // Helper to convert day index to day name
  const getDayName = (dayIndex) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayIndex] || "Invalid Day";
  };

  useEffect(() => {
    fetchAppointments();
  }, []);

  // Fetch appointments from API
  const fetchAppointments = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/paldoc/doctor/getappointments", {
        withCredentials: true,
      });
      setAppointments(response.data);
      console.log(response.data);
    } catch (error) {
      message.error("An error occurred while fetching appointments.");
    }
  };

  // Mark appointment as finished
  const markAsFinished = async (appointmentId) => {
    try {
      await axios.put(
        `http://localhost:8000/api/paldoc/doctor/appointments/${appointmentId}/finish`,
        {},
        { withCredentials: true }
      );
      message.success("Appointment marked as finished!");
      fetchAppointments(); // Refresh the table
    } catch (error) {
      message.error("Failed to update appointment status.");
    }
  };

  // Handler for "View Health History" button
  const handleViewHealthHistory = (record) => {
    // Save selected patient details
    setSelectedPatient({ name: record.patientName, id: record.userId });
    setHealthHistoryLoading(true);
    axios
      .get(`http://localhost:8000/api/paldoc/healthhistory/${record.userId}`, {
        withCredentials: true,
      })
      .then((res) => {
        setHealthHistoryData(res.data);
        setHealthHistoryModalVisible(true);
      })
      .catch((err) => {
        message.error("Failed to fetch health history");
        setHealthHistoryData(null);
        setHealthHistoryModalVisible(true);
      })
      .finally(() => {
        setHealthHistoryLoading(false);
      });
  };

  const upcomingAppointments = appointments.filter(
    (appointment) => appointment.status !== "Finished"
  );
  const pastAppointments = appointments.filter(
    (appointment) => appointment.status === "Finished"
  );

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
      render: (text, record) =>
        record.status !== "Finished" && (
          <button
            onClick={() => markAsFinished(record._id)}
            style={{
              backgroundColor: "#1890ff",
              color: "white",
              border: "none",
              padding: "5px 10px",
              cursor: "pointer",
              borderRadius: "5px",
              marginRight: "8px",
            }}
          >
            Mark As Finished
          </button>
        ),
    },
    {
      title: "Health History",
      key: "healthHistory",
      render: (text, record) => (
        <Button type="default" onClick={() => handleViewHealthHistory(record)}>
          View Health History
        </Button>
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
            <Table
              columns={columns}
              dataSource={upcomingAppointments}
              rowKey="_id"
              pagination={false}
            />
          </Card>

          <Card
            title="Past Appointments"
            bordered={false}
            style={{
              borderRadius: 10,
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Table
              columns={columns}
              dataSource={pastAppointments}
              rowKey="_id"
              pagination={false}
            />
          </Card>
        </div>
      </Content>
      <FooterMin style={{ marginTop: "auto" }} />

      {/* Health History Modal */}
      <Modal
        title={`Health History for ${selectedPatient.name || "Patient"}`}
        visible={healthHistoryModalVisible}
        onCancel={() => setHealthHistoryModalVisible(false)}
        footer={[
          <Button key="close" type="primary" onClick={() => setHealthHistoryModalVisible(false)}>
            Close
          </Button>,
        ]}
      >
        {healthHistoryLoading ? (
          <Spin size="large" />
        ) : healthHistoryData ? (
          <Descriptions bordered column={1} size="small">
            <Descriptions.Item label="Medical Conditions">
              {healthHistoryData.medicalConditions && healthHistoryData.medicalConditions.length > 0
                ? healthHistoryData.medicalConditions.join(", ")
                : "None"}
            </Descriptions.Item>
            <Descriptions.Item label="Allergies">
              {healthHistoryData.allergies && healthHistoryData.allergies.length > 0
                ? healthHistoryData.allergies.join(", ")
                : "None"}
            </Descriptions.Item>
            <Descriptions.Item label="Current Medications">
              {healthHistoryData.currentMedications && healthHistoryData.currentMedications.length > 0
                ? healthHistoryData.currentMedications.join(", ")
                : "None"}
            </Descriptions.Item>
            <Descriptions.Item label="Surgical History">
              {healthHistoryData.surgicalHistory && healthHistoryData.surgicalHistory.length > 0
                ? healthHistoryData.surgicalHistory.join(", ")
                : "None"}
            </Descriptions.Item>
            <Descriptions.Item label="Smoking Status">
              {healthHistoryData.smokingStatus || "None"}
            </Descriptions.Item>
            <Descriptions.Item label="Alcohol Consumption">
              {healthHistoryData.alcoholConsumption || "None"}
            </Descriptions.Item>
            <Descriptions.Item label="Blood Type">
              {healthHistoryData.bloodType || "None"}
            </Descriptions.Item>
            <Descriptions.Item label="Emergency Contact">
              {healthHistoryData.emergencyContact
                ? `${healthHistoryData.emergencyContact.name} (${healthHistoryData.emergencyContact.relationship}) - ${healthHistoryData.emergencyContact.phone}`
                : "None"}
            </Descriptions.Item>
          </Descriptions>
        ) : (
          <p>No health history available.</p>
        )}
      </Modal>
    </>
  );
}
