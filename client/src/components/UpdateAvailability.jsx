import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Select, TimePicker, Button, Card, List, notification } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import axios from "axios";

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const UpdateAvailability = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [availability, setAvailability] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAvailability = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/paldoc/doctor/availability", { withCredentials: true });
        setAvailability(response.data);
      } catch (error) {
        notification.error({ message: "Failed to load availability" });
      }
    };
    fetchAvailability();
  }, []);

  const addTimeSlot = (values) => {
    const newSlot = {
      dayOfWeek: values.dayOfWeek,
      startTime: values.startTime.format("HH:mm"),
      endTime: values.endTime.format("HH:mm"),
      isBooked: false
    };
    setAvailability([...availability, newSlot]);
    form.resetFields();
  };

  const removeTimeSlot = (index) => {
    setAvailability(availability.filter((_, i) => i !== index));
  };

  const updateAvailability = async () => {
    setLoading(true);
    try {
      await axios.put("http://localhost:8000/api/paldoc/doctor/availability", { availability }, { withCredentials: true });
      notification.success({ message: "Availability updated successfully!" });
      navigate("/profile");
    } catch (error) {
      notification.error({ 
        message: "Failed to update availability", 
        description: error.response?.data?.message || "Please try again later" 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="availability-container">
      <Card className="availability-card">
        <h2 className="page-title">Update Your Availability</h2>

        <Form form={form} onFinish={addTimeSlot} layout="vertical">
          <Form.Item name="dayOfWeek" label="Day of Week" rules={[{ required: true, message: "Please select a day" }]}>
            <Select>
              {DAYS.map((day, index) => (
                <Select.Option key={index} value={index}>{day}</Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item name="startTime" label="Start Time" rules={[{ required: true, message: "Please select start time" }]}>
            <TimePicker format="HH:mm" minuteStep={15} />
          </Form.Item>

          <Form.Item name="endTime" label="End Time" rules={[{ required: true, message: "Please select end time" }]}>
            <TimePicker format="HH:mm" minuteStep={15} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit">Add Time Slot</Button>
          </Form.Item>
        </Form>

        <List
          dataSource={availability}
          renderItem={(slot, index) => (
            <List.Item
              actions={[<Button type="text" danger icon={<DeleteOutlined />} onClick={() => removeTimeSlot(index)} />]}
            >
              <List.Item.Meta title={DAYS[slot.dayOfWeek]} description={`${slot.startTime} - ${slot.endTime}`} />
            </List.Item>
          )}
        />

        <Button type="primary" onClick={updateAvailability} loading={loading} disabled={availability.length === 0}>
          Save Changes
        </Button>
      </Card>
    </div>
  );
};

export default UpdateAvailability;