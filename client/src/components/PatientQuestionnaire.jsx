import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Select, Input, Button, Card, Radio, notification } from "antd";
import axios from "axios";
//import "../styles/questionnaire.css";

const PatientQuestionnaire = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const submitQuestionnaire = async (values) => {
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/paldoc/patient/health-history', values, {withCredentials: true});
      notification.success({ message: "Health history saved successfully!" });
      navigate('/profile');
    } catch (error) {
      notification.error({ 
        message: "Failed to save health history",
        description: error.response?.data?.message || "Please try again later"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="questionnaire-container">
      <Card className="questionnaire-card">
        <h2 className="page-title">Health History Questionnaire</h2>
        
        <Form onFinish={submitQuestionnaire} layout="vertical">
          <Form.Item
            name="medicalConditions"
            label="Do you have any medical conditions?"
          >
            <Select
              mode="tags"
              placeholder="Enter medical conditions"
            />
          </Form.Item>

          <Form.Item
            name="allergies"
            label="Do you have any allergies?"
          >
            <Select
              mode="tags"
              placeholder="Enter allergies"
            />
          </Form.Item>

          <Form.Item
            name="currentMedications"
            label="Current Medications"
          >
            <Select
              mode="tags"
              placeholder="Enter current medications"
            />
          </Form.Item>

          <Form.Item
            name="surgicalHistory"
            label="Previous Surgeries"
          >
            <Select
              mode="tags"
              placeholder="Enter previous surgeries"
            />
          </Form.Item>

          <Form.Item
            name="smokingStatus"
            label="Smoking Status"
          >
            <Radio.Group>
              <Radio value="never">Never Smoked</Radio>
              <Radio value="former">Former Smoker</Radio>
              <Radio value="current">Current Smoker</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="alcoholConsumption"
            label="Alcohol Consumption"
          >
            <Radio.Group>
              <Radio value="none">None</Radio>
              <Radio value="occasional">Occasional</Radio>
              <Radio value="moderate">Moderate</Radio>
              <Radio value="heavy">Heavy</Radio>
            </Radio.Group>
          </Form.Item>

          <Form.Item
            name="bloodType"
            label="Blood Type"
          >
            <Select placeholder="Select blood type">
              <Select.Option value="A+">A+</Select.Option>
              <Select.Option value="A-">A-</Select.Option>
              <Select.Option value="B+">B+</Select.Option>
              <Select.Option value="B-">B-</Select.Option>
              <Select.Option value="AB+">AB+</Select.Option>
              <Select.Option value="AB-">AB-</Select.Option>
              <Select.Option value="O+">O+</Select.Option>
              <Select.Option value="O-">O-</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item label="Emergency Contact">
            <Input.Group>
              <Form.Item
                name={["emergencyContact", "name"]}
                rules={[{ required: true, message: 'Name is required' }]}
              >
                <Input placeholder="Name" />
              </Form.Item>
              <Form.Item
                name={["emergencyContact", "relationship"]}
                rules={[{ required: true, message: 'Relationship is required' }]}
              >
                <Input placeholder="Relationship" />
              </Form.Item>
              <Form.Item
                name={["emergencyContact", "phone"]}
                rules={[{ required: true, message: 'Phone number is required' }]}
              >
                <Input placeholder="Phone Number" />
              </Form.Item>
            </Input.Group>
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="submit-button"
            >
              Complete Registration
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default PatientQuestionnaire;