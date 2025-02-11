// DoctorVerification.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Upload, Button, Input, Card, notification } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import axios from "axios";

const DoctorVerification = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fileList, setFileList] = useState([]);

  // Updated file upload using axios to our backend endpoint.
  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await axios.post('http://localhost:8000/api/paldoc/upload', formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        },
        withCredentials: true
      });
      return response.data.url;
    } catch (error) {
      notification.error({ message: "File upload failed" });
      return null;
    }
  };

  const submitVerification = async (values) => {
    setLoading(true);
    try {
      // Upload each file via our new endpoint.
      const uploadedFiles = await Promise.all(
        fileList.map(file => handleFileUpload(file.originFileObj))
      );
      const filteredFiles = uploadedFiles.filter(url => url !== null);
      
      // Submit verification with the license number and the array of uploaded document URLs.
      await axios.post('http://localhost:8000/api/paldoc/doctor/verification', {
        licenseNumber: values.licenseNumber,
        documents: filteredFiles,
      }, {withCredentials: true});
  
      notification.success({ message: "Verification submitted successfully!" });
      navigate('/availability-setup');
    } catch (error) {
      notification.error({ 
        message: "Verification submission failed",
        description: error.response?.data?.message || "Please try again later"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verification-container">
      <Card className="verification-card">
        <h2 className="page-title">Doctor Verification</h2>
        
        <Form onFinish={submitVerification} layout="vertical">
          <Form.Item
            name="licenseNumber"
            label="License Number"
            rules={[{ required: true, message: 'License number is required' }]}
          >
            <Input placeholder="Enter your medical license number" />
          </Form.Item>

          <Form.Item
            label="License Documents"
            rules={[{ required: true, message: 'Please upload your documents' }]}
          >
            <Upload.Dragger
              multiple
              listType="picture"
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}  // Prevent automatic upload
            >
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">
                Click or drag files to upload
              </p>
              <p className="ant-upload-hint">
                Upload your medical license and other relevant documents
              </p>
            </Upload.Dragger>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              disabled={fileList.length === 0}
              className="submit-button"
            >
              Continue to Availability Setup
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default DoctorVerification;