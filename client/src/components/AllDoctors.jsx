import React, { useEffect, useState } from "react";
import { Table, Typography, Button, Modal, Space, message, Popconfirm } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const { Title } = Typography;

const AllDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  useEffect(() => {
    fetchDoctors();
  }, []);

  const fetchDoctors = async () => {
    try {
      const response = await axios.get("http://localhost:8000/api/paldoc/admin/getdoctors", {
        withCredentials: true
      });
      setDoctors(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching doctors:", error);
      message.error("Failed to fetch doctors");
      setLoading(false);
    }
  };

  const handleViewApplication = (doctor) => {
    setSelectedDoctor(doctor);
    setModalVisible(true);
  };

  const handleReject = async () => {
    try {
      await axios.delete(`http://localhost:8000/api/paldoc/admin/deleteuser/${selectedDoctor._id}`, {
        withCredentials: true
      });
      message.success("Application rejected successfully");
      setModalVisible(false);
      fetchDoctors();
    } catch (error) {
      message.error("Failed to reject application");
    }
  };

  const handleAccept = async () => {
    try {
      await axios.post(`http://localhost:8000/api/paldoc/admin/approvedoctor/${selectedDoctor._id}`, {}, {
        withCredentials: true
      });
      message.success("Doctor approved successfully");
      setModalVisible(false);
      fetchDoctors();
    } catch (error) {
      message.error("Failed to approve doctor");
    }
  };

  const handleDeleteDoctor = async (doctorId) => {
    try {
      await axios.delete(`http://localhost:8000/api/paldoc/admin/deleteuser/${doctorId}`, {
        withCredentials: true
      });
      message.success("Doctor deleted successfully");
      fetchDoctors();
    } catch (error) {
      message.error("Failed to delete doctor");
    }
  };

  const pendingColumns = [
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
      title: "Specialty",
      dataIndex: ["doctor", "professionalSpecialty"],
      key: "specialty",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Button type="primary" onClick={() => handleViewApplication(record)}>
          View Application
        </Button>
      ),
    }
  ];

  const activeColumns = [
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
      title: "Specialty",
      dataIndex: ["doctor", "professionalSpecialty"],
      key: "specialty",
    },
    {
      title: "Phone Number",
      dataIndex: "phonenumber",
      key: "phonenumber",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_, record) => (
        <Popconfirm
          title="Delete Doctor"
          description="Are you sure you want to delete this doctor?"
          onConfirm={() => handleDeleteDoctor(record._id)}
          okText="Yes"
          cancelText="No"
        >
          <Button type="primary" danger icon={<DeleteOutlined />}>
            
          </Button>
        </Popconfirm>
      ),
    }
  ];

  const pendingDoctors = doctors.filter(doctor => doctor.doctor && !doctor.doctor.approved);
  const activeDoctors = doctors.filter(doctor => doctor.doctor && doctor.doctor.approved);

  return (
    <div className="p-6">
      <Title level={2} className="mb-6">Pending Doctors</Title>
      <Table 
        dataSource={pendingDoctors} 
        columns={pendingColumns} 
        loading={loading} 
        rowKey="_id" 
        className="mb-8"
      />

      <Title level={2} className="mb-6">Active Doctors</Title>
      <Table 
        dataSource={activeDoctors} 
        columns={activeColumns} 
        loading={loading} 
        rowKey="_id" 
      />

      <Modal
        title="Doctor Application Details"
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedDoctor && (
          <div className="p-4">
            <div className="mb-4">
              <h3 className="font-semibold mb-2">License Number</h3>
              <p>{selectedDoctor.doctor?.licenseNumber || "Not provided"}</p>
            </div>

            <div className="mb-4">
              <h3 className="font-semibold mb-2">Verification Documents</h3>
              <div className="flex flex-col gap-2">
                <ul>
                {selectedDoctor.doctor?.verificationDocuments?.map((doc, index) => (
                  <li><a 
                    key={index} 
                    href={doc} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Document {index + 1}
                  </a></li>
                ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <Button danger onClick={handleReject}>
                Reject Application
              </Button>
              <Button type="primary" onClick={handleAccept}>
                Accept Application
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default AllDoctors;