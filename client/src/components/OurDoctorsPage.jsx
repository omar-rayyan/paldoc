import React, { useState, useEffect } from "react";
import { Modal, Button, Select, Card, Spin, notification } from "antd";
import FooterMin from "./FooterMin";
import Navbar from "./Navbar";
import axios from "axios";
import "../styles/ourdoctors.css";
import { Navigate, useNavigate } from "react-router-dom";

const { Option } = Select;

const OurDoctorsPage = () => {
  const [doctors, setDoctors] = useState([]);
  const [filteredDoctors, setFilteredDoctors] = useState([]);
  const [specialization, setSpecialization] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [doctorAvailability, setDoctorAvailability] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedSlotTime, setSelectedSlotTime] = useState(null);
  const navigate = useNavigate();

  const getDayName = (dayIndex) => {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    return days[dayIndex] || "Invalid Day";
  };

  useEffect(() => {
    axios
      .get("http://localhost:8000/api/paldoc/getapproveddoctors")
      .then((response) => {
        const approvedDoctors = response.data;
        setDoctors(approvedDoctors);
        setFilteredDoctors(approvedDoctors);
      })
      .catch((error) => console.error("Error fetching doctors:", error))
      .finally(() => setLoading(false));
  }, []);

  const handleFilterChange = (value) => {
    setSpecialization(value);
    setFilteredDoctors(
      value ? doctors.filter(user => user.doctor.professionalSpecialty === value) : doctors
    );
  };

  const handleSlotChange = (selectedTime) => {
    const [dayOfWeek, startTime, endTime] = selectedTime.split("-");
    
    const selected = doctorAvailability.find(
      (slot) => 
        slot.dayOfWeek.toString() === dayOfWeek && 
        slot.startTime === startTime && 
        slot.endTime === endTime
    );
    
    setSelectedSlot(selected);
    setSelectedSlotTime(selectedTime);
};


  const handleBookAppointment = (doctor) => {
    setSelectedDoctor(doctor);
    setLoading(true);

    axios
      .get(`http://localhost:8000/api/paldoc/availability/${doctor._id}`, { withCredentials: true })
      .then((response) => {
        setDoctorAvailability(response.data);
        setModalVisible(true);
      })
      .catch((error) => console.error("Error fetching availability:", error))
      .finally(() => setLoading(false));
      setSelectedSlot(null);
      setSelectedSlotTime(null);
  };

  const handleMessage = (doctorId) => {
    axios
      .post(`http://localhost:8000/api/paldoc/startchat/${doctorId}`, {}, { withCredentials: true })
      .then(() => {
        notification.success({ message: "Chat initiated!" });
        navigate("/messages");
      })
      .catch((error) => {
        console.error("Error initiating chat:", error);
        notification.error({ message: "Error initiating chat!" });
      });
  };

  const confirmAppointment = () => {
    if (!selectedSlot) {
      notification.error({ message: "Please select a slot first." });
      return;
    }
    
    axios
      .post("http://localhost:8000/api/paldoc/appointments/book", {
        doctorId: selectedDoctor._id,
        dayOfWeek: selectedSlot.dayOfWeek,
        startTime: selectedSlot.startTime,
        endTime: selectedSlot.endTime,
      }, { withCredentials: true })
      .then(() => {
        notification.success({ message: "Appointment booked successfully!" });
        handleModalCancel();
      })
      .catch((error) => {
        console.error("Error booking appointment:", error);
        notification.error({ message: "Failed to book the appointment!" });
      });
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    setSelectedDoctor(null);
    setDoctorAvailability([]);
    setSelectedSlot(null);
  };

  return (
    <div>
      <Navbar />
      <div className="container py-4" style={{ minHeight: "80vh" }}>
        <h2 className="text-center mb-4">Our Doctors</h2>
        
        <div className="filter-container mb-4">
          <label className="filter-label">Doctor Specialization:</label>
          <Select value={specialization} onChange={handleFilterChange} allowClear style={{ width: 200 }}>
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
                  <div className="doctor-buttons">
                    <Button type="primary" block onClick={() => handleBookAppointment(user)}>
                      Book Appointment
                    </Button>
                    <Button type="default" block onClick={() => handleMessage(user._id)}>
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

        <Modal
          title="Book Appointment"
          open={modalVisible}
          onCancel={handleModalCancel}
          footer={null}
          width={600}
        >
          {selectedDoctor && (
            <>
              <h4 className="text-center mb-3">{selectedDoctor.firstName} {selectedDoctor.lastName}</h4>
              <label className="d-block mb-2">Select Available Slot:</label> 
              
              <Select
                className="w-100 mb-4"
                onChange={handleSlotChange}
                value={selectedSlotTime}
                placeholder="Select a time slot"
                style={{ width: "100%" }}
              >
                {doctorAvailability.map((slot) => {
                  const key = `${slot.dayOfWeek}-${slot.startTime}-${slot.endTime}`;
                  return (
                    <Option key={key} value={key}>
                      {getDayName(slot.dayOfWeek)} - {slot.startTime} to {slot.endTime}
                    </Option>
                  );
                })}
              </Select>

              <Button 
                type="primary" 
                block
                onClick={confirmAppointment}
                disabled={!selectedSlot}  // Disable button until a slot is selected
              >
                Confirm Appointment
              </Button>
            </>
          )}
        </Modal>
      </div>
      <FooterMin />
    </div>
  );
};

export default OurDoctorsPage;