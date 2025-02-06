import React, { useState } from "react";
import { Modal, Button, Select, Card, DatePicker, TimePicker } from "antd";
import Footer from "./Footer";
import Navbar from "./Navbar";
import "../styles/ourdoctor.css";
const { Option } = Select;

const doctors = [
  { id: 1, name: "Dr. Ali Yahia", specialization: "Dermatology", phone: "" },
  { id: 2, name: "Dr. Mohammed Turk", specialization: "Dermatology", phone: "0699654342" },
  
];

export default function DoctorsPage() {
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setSelectedDoctor(null);
    setAppointmentDate(null);
    setAppointmentTime(null);
  };

  const handleModalOk = () => {
    // Handle booking logic here
    setModalVisible(false);
  };

  return (
    <div>
      <Navbar />
      <div className="container py-4" style={{ minHeight: "80vh" }}>
        <h2 className="text-center mb-4">Our Doctors</h2>

        {/* Specialization Filter */}
        <div className="d-flex justify-content-center mb-4">
          <label className="me-2 fw-semibold">Doctor Specialization:</label>
          <Select defaultValue="Dermatology" style={{ width: 200 }}>
            <Option value="Dermatology">Dermatology</Option>
          </Select>
        </div>

        {/* Doctor Cards */}
        <div className="doctor-cards">
          {doctors.map((doctor) => (
            <div key={doctor.id} className="doctor-card">
              <Card className="text-center">
                <div className="mx-auto bg-secondary rounded-circle" style={{ width: 60, height: 60 }}></div>
                <h4 className="mt-2">{doctor.name}</h4>
                <p><strong>Specialization:</strong> {doctor.specialization}</p>
                <p><strong>Phone:</strong> {doctor.phone || "N/A"}</p>
                <Button type="primary" className="mt-2" onClick={() => handleBookAppointment(doctor)}>
                  Book Appointment
                </Button>
                <Button className="mt-2 w-100 border-secondary">Send Message</Button>
              </Card>
            </div>
          ))}
        </div>

        {/* Appointment Modal */}
        <Modal
          title="Book Appointment"
          // visible={modalVisible}
          onCancel={handleModalCancel}
          onOk={handleModalOk}
        >
          {selectedDoctor && (
            <>
              <h4 className="text-center mb-3">{selectedDoctor.name}</h4>
              <label className="fw-semibold">Date:</label>
              <DatePicker className="w-100 mb-3" onChange={(date) => setAppointmentDate(date)} />

              <label className="fw-semibold">Time:</label>
              <TimePicker className="w-100" format="HH:mm" onChange={(time) => setAppointmentTime(time)} />
            </>
          )}
        </Modal>
      </div>
      <Footer />
    </div>
  );
}
