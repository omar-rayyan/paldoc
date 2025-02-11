import React, { useReducer, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Form,
  Input,
  Button,
  Spin,
  notification,
  Tabs,
  Select,
  Radio,
} from "antd";
import "../styles/editProfile.css";
import UpdateAvailability from "./UpdateAvailability";
const { TabPane } = Tabs;
const { Option } = Select;

const initialPersonalState = {
  firstName: "",
  lastName: "",
  email: "",
  age: "",
  pic: "",
  phonenumber: "",
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
  loading: false,
};

const personalFormReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_LOADING":
      return { ...state, loading: action.value };
    case "SET_PERSONAL_DATA":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

const initialHealthState = {
  medicalConditions: [],
  allergies: [],
  currentMedications: [],
  surgicalHistory: [],
  smokingStatus: "",
  alcoholConsumption: "",
  bloodType: "",
  emergencyContact: {
    name: "",
    relationship: "",
    phone: "",
  },
};

function EditProfile() {
  const navigate = useNavigate();

  // Personal details state
  const [personalState, dispatchPersonal] = useReducer(
    personalFormReducer,
    initialPersonalState
  );
  const [profilePic, setProfilePic] = useState("");
  const [isDoctor, setIsDoctor] = useState(false);

  // Health history state
  const [healthState, setHealthState] = useState(initialHealthState);
  const [healthLoading, setHealthLoading] = useState(false);

  useEffect(() => {
    // Fetch personal details
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/paldoc/getuser",
          { withCredentials: true }
        );
        dispatchPersonal({
          type: "SET_PERSONAL_DATA",
          payload: response.data,
        });
        setIsDoctor(response.data.doctor !== null);
        setProfilePic(response.data.pic);
      } catch (error) {
        notification.error({ message: "Failed to load profile data" });
      }
    };

    // Optionally, fetch health history if available.
    // (Assumes you have a GET route for health history.)
    const fetchHealthHistory = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8000/api/paldoc/health-history",
          { withCredentials: true }
        );
        if (response.data) {
          setHealthState(response.data);
        }
      } catch (error) {
        console.log("No health history found or error occurred.");
      }
    };

    fetchUserData();
    fetchHealthHistory();
  }, []);

  // Handlers for personal details
  const handlePersonalChange = (e) => {
    const { name, value } = e.target;
    dispatchPersonal({ type: "SET_FIELD", field: name, value });
  };

  // Upload profile picture to your server (local storage)
  const handleProfilePicUpload = async (file) => {
    dispatchPersonal({ type: "SET_LOADING", value: true });
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const data = new FormData();
      data.append("file", file);
      try {
        const response = await axios.post(
          "http://localhost:8000/api/paldoc/upload",
          data,
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
        setProfilePic(response.data.url);
      } catch (error) {
        notification.error({ message: "Error uploading image" });
      }
    } else {
      notification.error({
        message: "Invalid image format. Only JPEG or PNG allowed.",
      });
    }
    dispatchPersonal({ type: "SET_LOADING", value: false });
  };

  // Submit personal details form
  const handlePersonalSubmit = async () => {
    const {
      firstName,
      lastName,
      email,
      age,
      phonenumber,
      oldPassword,
      newPassword,
      confirmNewPassword,
    } = personalState;
    if (!firstName || !lastName || !email || !age || !phonenumber) {
      notification.error({ message: "All personal fields are required" });
      return;
    }
    if (newPassword && newPassword !== confirmNewPassword) {
      notification.error({ message: "New passwords do not match" });
      return;
    }
    const updatePayload = {
      firstName,
      lastName,
      email,
      age,
      phonenumber,
      pic: profilePic,
      oldPassword: oldPassword || undefined,
      newPassword: newPassword || undefined,
    };
    dispatchPersonal({ type: "SET_LOADING", value: true });
    try {
      await axios.put(
        "http://localhost:8000/api/paldoc/profile/update",
        updatePayload,
        { withCredentials: true }
      );
      notification.success({ message: "Profile updated successfully!" });
      // Optionally, refresh or navigate as needed.
    } catch (error) {
      notification.error({ message: error.response.data.error });
    } finally {
      dispatchPersonal({ type: "SET_LOADING", value: false });
    }
  };

  // For health history array fields, use the Select component in "tags" mode.
  const handleHealthTagsChange = (field, value) => {
    setHealthState((prev) => ({ ...prev, [field]: value }));
  };

  // Handlers for non-array health fields
  const handleHealthChange = (e) => {
    const { name, value } = e.target;
    setHealthState((prev) => ({ ...prev, [name]: value }));
  };

  // For emergency contact
  const handleEmergencyContactChange = (e) => {
    const { name, value } = e.target;
    setHealthState((prev) => ({
      ...prev,
      emergencyContact: { ...prev.emergencyContact, [name]: value },
    }));
  };

  // Submit health history form
  const handleHealthSubmit = async () => {
    setHealthLoading(true);
    try {
      await axios.post(
        "http://localhost:8000/api/paldoc/patient/health-history",
        healthState,
        { withCredentials: true }
      );
      notification.success({ message: "Health history updated successfully!" });
    } catch (error) {
      notification.error({
        message: "Failed to update health history",
        description:
          error.response?.data?.message || "Please try again later",
      });
    } finally {
      setHealthLoading(false);
    }
  };

  return (
    <section className="edit-profile-page">
      <div className="edit-profile-container">
        <h2>Edit Profile</h2>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Personal Details" key="1">
            <Form layout="vertical" onFinish={handlePersonalSubmit}>
              <Form.Item label="First Name" required>
                <Input
                  name="firstName"
                  value={personalState.firstName}
                  onChange={handlePersonalChange}
                />
              </Form.Item>
              <Form.Item label="Last Name" required>
                <Input
                  name="lastName"
                  value={personalState.lastName}
                  onChange={handlePersonalChange}
                />
              </Form.Item>
              <Form.Item label="Email Address" required>
                <Input
                  name="email"
                  type="email"
                  value={personalState.email}
                  onChange={handlePersonalChange}
                  disabled
                />
              </Form.Item>
              <Form.Item label="Age" required>
                <Input
                  name="age"
                  type="number"
                  value={personalState.age}
                  onChange={handlePersonalChange}
                />
              </Form.Item>
              <Form.Item label="Phone Number" required>
                <Input
                  name="phonenumber"
                  value={personalState.phonenumber}
                  onChange={handlePersonalChange}
                />
              </Form.Item>
              <Form.Item label="Profile Picture">
                <Input
                  type="file"
                  onChange={(e) =>
                    handleProfilePicUpload(e.target.files[0])
                  }
                />
              </Form.Item>
              <div className="profile-pic-preview">
                {profilePic && <img src={profilePic} alt="Profile" />}
              </div>
              <h3>Change Password</h3>
              <Form.Item label="Old Password">
                <Input.Password
                  name="oldPassword"
                  value={personalState.oldPassword}
                  onChange={handlePersonalChange}
                />
              </Form.Item>
              <Form.Item label="New Password">
                <Input.Password
                  name="newPassword"
                  value={personalState.newPassword}
                  onChange={handlePersonalChange}
                />
              </Form.Item>
              <Form.Item label="Confirm New Password">
                <Input.Password
                  name="confirmNewPassword"
                  value={personalState.confirmNewPassword}
                  onChange={handlePersonalChange}
                />
              </Form.Item>
              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  disabled={personalState.loading}
                >
                  {personalState.loading ? <Spin /> : "Update Personal Details"}
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          <TabPane tab="Health History" key="2">
            <Form layout="vertical" onFinish={handleHealthSubmit}>
              <Form.Item label="Medical Conditions">
                <Select
                  mode="tags"
                  placeholder="Enter medical conditions"
                  value={healthState.medicalConditions}
                  onChange={(value) =>
                    handleHealthTagsChange("medicalConditions", value)
                  }
                />
              </Form.Item>
              <Form.Item label="Allergies">
                <Select
                  mode="tags"
                  placeholder="Enter allergies"
                  value={healthState.allergies}
                  onChange={(value) =>
                    handleHealthTagsChange("allergies", value)
                  }
                />
              </Form.Item>
              <Form.Item label="Current Medications">
                <Select
                  mode="tags"
                  placeholder="Enter current medications"
                  value={healthState.currentMedications}
                  onChange={(value) =>
                    handleHealthTagsChange("currentMedications", value)
                  }
                />
              </Form.Item>
              <Form.Item label="Surgical History">
                <Select
                  mode="tags"
                  placeholder="Enter previous surgeries"
                  value={healthState.surgicalHistory}
                  onChange={(value) =>
                    handleHealthTagsChange("surgicalHistory", value)
                  }
                />
              </Form.Item>
              <Form.Item label="Smoking Status">
                <Radio.Group
                  name="smokingStatus"
                  onChange={handleHealthChange}
                  value={healthState.smokingStatus}
                >
                  <Radio value="never">Never</Radio>
                  <Radio value="former">Former</Radio>
                  <Radio value="current">Current</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Alcohol Consumption">
                <Radio.Group
                  name="alcoholConsumption"
                  onChange={handleHealthChange}
                  value={healthState.alcoholConsumption}
                >
                  <Radio value="none">None</Radio>
                  <Radio value="occasional">Occasional</Radio>
                  <Radio value="moderate">Moderate</Radio>
                  <Radio value="heavy">Heavy</Radio>
                </Radio.Group>
              </Form.Item>
              <Form.Item label="Blood Type">
                <Select
                  name="bloodType"
                  value={healthState.bloodType}
                  onChange={(value) =>
                    setHealthState((prev) => ({ ...prev, bloodType: value }))
                  }
                  placeholder="Select blood type"
                >
                  <Option value="A+">A+</Option>
                  <Option value="A-">A-</Option>
                  <Option value="B+">B+</Option>
                  <Option value="B-">B-</Option>
                  <Option value="AB+">AB+</Option>
                  <Option value="AB-">AB-</Option>
                  <Option value="O+">O+</Option>
                  <Option value="O-">O-</Option>
                </Select>
              </Form.Item>
              <Form.Item label="Emergency Contact Name">
                <Input
                  name="name"
                  value={healthState.emergencyContact.name}
                  onChange={handleEmergencyContactChange}
                  placeholder="Name"
                />
              </Form.Item>
              <Form.Item label="Emergency Contact Relationship">
                <Input
                  name="relationship"
                  value={healthState.emergencyContact.relationship}
                  onChange={handleEmergencyContactChange}
                  placeholder="Relationship"
                />
              </Form.Item>
              <Form.Item label="Emergency Contact Phone">
                <Input
                  name="phone"
                  value={healthState.emergencyContact.phone}
                  onChange={handleEmergencyContactChange}
                  placeholder="Phone"
                />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit" loading={healthLoading}>
                  {healthLoading ? <Spin /> : "Update Health History"}
                </Button>
              </Form.Item>
            </Form>
          </TabPane>
          {isDoctor && (
          <TabPane tab="Availabilities" key="3">
            <UpdateAvailability/>
          </TabPane>)}
        </Tabs>
      </div>
    </section>
  );
}

export default EditProfile;
