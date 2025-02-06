import React, { useReducer, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, Spin, notification } from "antd";
import "../styles/register.css";

const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  age: "",
  pic: "",
  loading: false,
  oldPassword: "",
  newPassword: "",
  confirmNewPassword: "",
};

const formReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_LOADING":
      return { ...state, loading: action.value };
    case "SET_USER_DATA":
      return { ...state, ...action.payload };
    default:
      return state;
  }
};

function EditProfile() {
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const navigate = useNavigate();
  const [file, setFile] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get("http://localhost:8000/api/paldoc/getuser", { withCredentials: true });
        dispatch({ type: "SET_USER_DATA", payload: response.data });
        setFile(response.data.pic);
      } catch (error) {
        notification.error({ message: "Failed to load profile data" });
      }
    };
    fetchUserData();
  }, []);

  const inputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_FIELD", field: name, value });
  };

  const handleFileUpload = async (element) => {
    dispatch({ type: "SET_LOADING", value: true });
    if (element.type === "image/jpeg" || element.type === "image/png") {
      const data = new FormData();
      data.append("file", element);
      data.append("upload_preset", process.env.REACT_APP_CLOUDINARY_PRESET);
      data.append("cloud_name", process.env.REACT_APP_CLOUDINARY_CLOUD_NAME);
      try {
        const response = await fetch(process.env.REACT_APP_CLOUDINARY_BASE_URL, {
          method: "POST",
          body: data,
        });
        const result = await response.json();
        setFile(result.url.toString());
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    } else {dashboard
      notification.error({ message: "Invalid image format. Only jpeg or png allowed." });
    }
    dispatch({ type: "SET_LOADING", value: false });
  };

  const formSubmit = async () => {
    try {
      const { firstName, lastName, email, age, oldPassword, newPassword, confirmNewPassword } = formState;
      
      if (!firstName || !lastName || !email || !age) {
        notification.error({ message: "All fields are required" });
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
        pic: file,
        oldPassword: oldPassword || undefined,
        newPassword: newPassword || undefined,
      };

      dispatch({ type: "SET_LOADING", value: true });
      await axios.put("http://localhost:8000/api/paldoc/profile/update", updatePayload, { withCredentials: true });
      notification.success({ message: "Profile updated successfully!" });
      navigate("/");
    } catch (error) {
      notification.error({ message: error.response.data.error });
    } finally {
      dispatch({ type: "SET_LOADING", value: false });
    }
  };

  return (
    <section className="register-section flex-center">
      <div className="register-container flex-center">
        <h2 className="form-heading">Edit Profile</h2>
        <Form onFinish={formSubmit} className="register-form">
          <Form.Item label="First Name" required>
            <Input name="firstName" value={formState.firstName} onChange={inputChange} />
          </Form.Item>

          <Form.Item label="Last Name" required>
            <Input name="lastName" value={formState.lastName} onChange={inputChange} />
          </Form.Item>

          <Form.Item label="Email Address" required>
            <Input name="email" type="email" value={formState.email} onChange={inputChange} disabled />
          </Form.Item>

          <Form.Item label="Age" required>
            <Input name="age" type="number" value={formState.age} onChange={inputChange} />
          </Form.Item>

          <Form.Item label="Profile Picture">
            <Input type="file" onChange={(e) => handleFileUpload(e.target.files[0])} />
          </Form.Item>

          <h3>Change Password</h3>
          <Form.Item label="Old Password">
            <Input.Password name="oldPassword" value={formState.oldPassword} onChange={inputChange} />
          </Form.Item>

          <Form.Item label="New Password">
            <Input.Password name="newPassword" value={formState.newPassword} onChange={inputChange} />
          </Form.Item>

          <Form.Item label="Confirm New Password">
            <Input.Password name="confirmNewPassword" value={formState.confirmNewPassword} onChange={inputChange} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" disabled={formState.loading}>
              {formState.loading ? <Spin /> : "Update Profile"}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </section>
  );
}

export default EditProfile;