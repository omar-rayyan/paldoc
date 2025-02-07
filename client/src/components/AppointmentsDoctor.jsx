import React, { useState } from "react";
import { Table, Typography, Card, Button, Space, message, DatePicker } from "antd";
import dayjs from "dayjs";
import Footer from "./Footer";
import Navbar from "./Navbar";

const { Title } = Typography;

export default function DoctorAppointments() {
  const [pendingAppointments, setPendingAppointments] = useState([
    { key: 1, patient: "Ali", date: "2023-02-14", time: "20:13", bookingDate: "2025-02-5", bookingTime: "13:42:56", status: "Pending" },
    { key: 2, patient: "Ahmad", date: "2023-02-17", time: "21:30", bookingDate: "2025-02-13", bookingTime: "13:52:56", status: "Pending" },
  ]);

  const [approvedAppointments, setApprovedAppointments] = useState([]);
  const [rescheduledAppointments, setRescheduledAppointments] = useState([
    { key: 3, patient: "Sara", date: "2025-02-07", time: "15:45", bookingDate: "2025-02-07", bookingTime: "10:00:00", status: "Rescheduled" },
    { key: 4, patient: "Michael", date: "2025-02-07", time: "16:30", bookingDate: "2025-02-07", bookingTime: "11:30:00", status: "Rescheduled" },
    { key: 5, patient: "David", date: "2025-02-10", time: "17:00", bookingDate: "2025-02-07", bookingTime: "12:00:00", status: "Rescheduled" },
  ]);

  const [selectedDate, setSelectedDate] = useState(dayjs().format("YYYY-MM-DD"));

  // Handle Approve
  const handleApprove = (appointment) => {
    setApprovedAppointments([...approvedAppointments, { ...appointment, status: "Approved" }]);
    setPendingAppointments(pendingAppointments.filter((item) => item.key !== appointment.key));
    message.success(`${appointment.patient}'s appointment approved!`);
  };

  // Handle Reject
  const handleReject = (appointment) => {
    setPendingAppointments(pendingAppointments.filter((item) => item.key !== appointment.key));
    message.error(`${appointment.patient}'s appointment rejected!`);
  };

  // Debugging logs
  console.log("Selected Date:", selectedDate);
  console.log("Rescheduled Appointments:", rescheduledAppointments);

  // Filter Rescheduled Appointments by Selected Date
  const filteredRescheduledAppointments = rescheduledAppointments.filter((appointment) => {
    console.log(`Checking: ${appointment.bookingDate} === ${selectedDate}`);
    return dayjs(appointment.bookingDate).format("YYYY-MM-DD") === dayjs(selectedDate).format("YYYY-MM-DD");
  });

  // Table Columns
  const columns = [
    { title: "S.No", dataIndex: "key", key: "key" },
    { title: "Patient", dataIndex: "patient", key: "patient" },
    { title: "Appointment Date", dataIndex: "date", key: "date" },
    { title: "Appointment Time", dataIndex: "time", key: "time" },
    { title: "Booking Date", dataIndex: "bookingDate", key: "bookingDate" },
    { title: "Booking Time", dataIndex: "bookingTime", key: "bookingTime" },
    { title: "Status", dataIndex: "status", key: "status" },
  ];

  // Pending Appointments Columns (with Action Buttons)
  const pendingColumns = [
    ...columns,
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <Space>
          <Button type="primary" onClick={() => handleApprove(record)}>Approve</Button>
          <Button danger onClick={() => handleReject(record)}>Reject</Button>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <Navbar />
      <Title level={2} className="text-center">Doctor's Appointments</Title>

      {/* Pending Appointments */}
      <Card title="Pending Appointments" bordered={false} style={{ marginBottom: 20 }}>
        <Table columns={pendingColumns} dataSource={pendingAppointments} pagination={false} />
      </Card>

      {/* Rescheduled Appointments with Date Filter */}
      <Card title="Rescheduled Appointments" bordered={false} style={{ marginBottom: 20 }}>
        <Space style={{ marginBottom: 10 }}>
          <span>Select Date:</span>
          <DatePicker 
            onChange={(date, dateString) => {
              console.log("Selected Date Changed:", dateString);
              setSelectedDate(dateString);
            }} 
            defaultValue={dayjs()} 
            format="YYYY-MM-DD" 
          />
        </Space>
        <Table columns={columns} dataSource={filteredRescheduledAppointments} pagination={false} />
      </Card>

      {/* Approved Appointments */}
      <Card title="Approved Appointments" bordered={false}>
        <Table columns={columns} dataSource={approvedAppointments} pagination={false} />
      </Card>
      <Footer />  
    </div>
  );
}
