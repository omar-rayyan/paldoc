import React, { useState, useEffect } from "react";
import { Modal, Button, Select, Card, DatePicker, TimePicker, Spin } from "antd";
import FooterMin from "./FooterMin";
import Navbar from "./Navbar";
import axios from "axios";
import "../styles/ourdoctors.css";

const { Option } = Select;

const OurDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [appointmentDate, setAppointmentDate] = useState(null);
  const [appointmentTime, setAppointmentTime] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    axios.get("http://localhost:8000/api/paldoc/getdoctors")
      .then(response => {
        const approvedDoctors = response.data;
        setDoctors(approvedDoctors);
        setFilteredDoctors(approvedDoctors);
      })
      .catch(error => console.error("Error fetching doctors:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleFilterChange = (value) => {
    setSpecialization(value);
    if (value) {
      setFilteredDoctors(doctors.filter(user => user.doctor.professionalSpecialty === value));
    } else {
      setFilteredDoctors(doctors);
    }
  };

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

  return (
    <div>
      <Navbar />
      <div className="container py-4" style={{ minHeight: "80vh" }}>
        <h2 className="text-center mb-4">Our Doctors</h2>

        <div className="filter-container mb-4">
          <label className="filter-label">Doctor Specialization:</label>
          <Select 
            value={specialization} 
            onChange={handleFilterChange} 
            allowClear 
            style={{ width: 200 }}
            placeholder="Select Specialty"
          >
            {[...new Set(doctors.map(user => user.doctor.professionalSpecialty))].map(specialty => (
              <Option key={specialty} value={specialty}>{specialty}</Option>
            ))}
          </Select>
        </div>

        {loading ? (
          <div className="loading-spinner">
            <Spin size="large" />
          </div>
        ) : (
          <div className="doctor-cards">
            {filteredDoctors.length > 0 ? (
              filteredDoctors.map(user => (
                <Card key={user._id} className="doctor-card text-center">
                  <div className="doctor-avatar-container">
                    <img src={user.pic} alt={`${user.firstName} ${user.lastName}`} className="doctor-avatar" />
                  </div>
                  <h4>{user.firstName} {user.lastName}</h4>
                  <p><strong>Specialization:</strong> {user.doctor.professionalSpecialty}</p>
                  <p><strong>Phone:</strong> {user.phonenumber || "N/A"}</p>
                  
                  {/* Buttons Container with Flexbox */}
                  <div className="doctor-buttons">
                    <Button type="primary" block onClick={() => handleBookAppointment(user)}>
                      Book Appointment
                    </Button>
                    <Button type="default" block>
                      Message
                    </Button>
                  </div>
                </Card>
              ))
            ) : (
              <p className="text-center">No doctors found.</p>
            )}
          </div>
        )}

        <Modal title="Book Appointment" visible={modalVisible} onCancel={handleModalCancel}>
          {selectedDoctor && (
            <>
              <h4 className="text-center mb-3">{selectedDoctor.firstName} {selectedDoctor.lastName}</h4>
              <label>Date:</label>
              <DatePicker className="w-100 mb-3" onChange={(date) => setAppointmentDate(date)} />
              <label>Time:</label>
              <TimePicker className="w-100" format="HH:mm" onChange={(time) => setAppointmentTime(time)} />
            </>
          )}
        </Modal>
      </div>
      <FooterMin />
    </div>
  );
}
export default OurDoctorsPage;