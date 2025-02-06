import React, { useReducer, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, Radio, Spin, notification } from "antd";
import "../styles/register.css";

// Initial form state
const initialState = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confpassword: "",
  phonenumber: "",
  age: "",
  pic: "",
  isDoctor: false,
  license: "",
  loading: false,
  professionalSpecialty: "",
};

const formReducer = (state, action) => {
  switch (action.type) {
    case "SET_FIELD":
      return { ...state, [action.field]: action.value };
    case "SET_LOADING":
      return { ...state, loading: action.value };
    default:
      return state;
  }
};

function Register() {
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const navigate = useNavigate();
  const [file, setFile] = useState("");

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
    } else {
      notification.error({ message: "Invalid image format. Only jpeg or png allowed." });
    }
    dispatch({ type: "SET_LOADING", value: false });
  };

  const formSubmit = async (values) => {
    try {
      const { firstName, lastName, email, password, confpassword, age, isDoctor, license } = formState;

      if (!firstName || !lastName || !email || !password || !confpassword || !age) {
        notification.error({ message: "All fields are required" });
        return;
      }
      if (password !== confpassword) {
        notification.error({ message: "Passwords do not match" });
        return;
      }

      const userPayload = {
        firstName,
        lastName,
        email,
        password,
        age,
        phonenumber,
        pic: file,
        isDoctor,
        license: isDoctor ? license : "",
        professionalSpecialty: isDoctor ? formState.professionalSpecialty : "",
      };

      dispatch({ type: "SET_LOADING", value: true });
      const response = await axios.post("http://localhost:8000/api/paldoc/register", userPayload, { withCredentials: true });
      notification.success({ message: "Registration successful!" });
      navigate("/login");
    } catch (error) {
      console.error(error);
      notification.error({ message: "Unable to register user" });
    } finally {
      dispatch({ type: "SET_LOADING", value: false });
    }
  };

  return (
    <section className="register-section flex-center">
      <div className="register-container flex-center">
        <h2 className="form-heading">Sign Up</h2>
        <Form
          onFinish={formSubmit}
          className="register-form"
          initialValues={{ remember: true }}
        >
          <Form.Item label="First Name" required>
            <Input
              type="text"
              name="firstName"
              placeholder="Enter your first name"
              value={formState.firstName}
              onChange={inputChange}
            />
          </Form.Item>

          <Form.Item label="Last Name" required>
            <Input
              type="text"
              name="lastName"
              placeholder="Enter your last name"
              value={formState.lastName}
              onChange={inputChange}
            />
          </Form.Item>

          <Form.Item label="Email Address" required>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formState.email}
              onChange={inputChange}
            />
          </Form.Item>

          <Form.Item label="Age" required>
            <Input
              type="number"
              name="age"
              placeholder="Enter your age"
              value={formState.age}
              onChange={inputChange}
            />
          </Form.Item>

          <Form.Item label="Phone Number" required>
            <Input
              type="text"
              name="phonenumber"
              placeholder="Enter your phone number"
              value={formState.phonenumber}
              onChange={inputChange}
            />
          </Form.Item>

          <Form.Item label="Profile Picture">
            <Input
              type="file"
              onChange={(e) => handleFileUpload(e.target.files[0])}
              name="profile-pic"
              className="form-input"
            />
          </Form.Item>

          <Form.Item label="Password" required>
            <Input.Password
              name="password"
              placeholder="Enter your password"
              value={formState.password}
              onChange={inputChange}
            />
          </Form.Item>

          <Form.Item label="Confirm Password" required>
            <Input.Password
              name="confpassword"
              placeholder="Confirm your password"
              value={formState.confpassword}
              onChange={inputChange}
            />
          </Form.Item>

          <Form.Item label="Register As" required>
            <Radio.Group
              name="isDoctor"
              value={formState.isDoctor}
              onChange={inputChange}
            >
              <Radio value={false}>Patient</Radio>
              <Radio value={true}>Doctor</Radio>
            </Radio.Group>
          </Form.Item>

          {formState.isDoctor && (
            <>
              <Form.Item label="License Number" required>
                <Input
                  type="text"
                  name="license"
                  placeholder="Enter your license number"
                  value={formState.license}
                  onChange={inputChange}
                />
              </Form.Item>
              <Form.Item label="Professional Specialty" required>
                <select
                  name="professionalSpecialty"
                  value={formState.professionalSpecialty}
                  onChange={inputChange}
                  disabled={!formState.isDoctor}
                >
                  <option value="">Select Specialty</option>
                  <option value="Cardiologist">Cardiologist</option>
                  <option value="Neurologist">Neurologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Orthopedic">Orthopedic</option>
                  <option value="Pediatrician">Pediatrician</option>
                  <option value="General Surgeon">General Surgeon</option>
                  <option value="Ophthalmologist">Ophthalmologist</option>
                  <option value="ENT Specialist">ENT Specialist</option>
                  <option value="Psychiatrist">Psychiatrist</option>
                  <option value="Endocrinologist">Endocrinologist</option>
                  <option value="Oncologist">Oncologist</option>
                  <option value="Gastroenterologist">Gastroenterologist</option>
                  <option value="Pulmonologist">Pulmonologist</option>
                  <option value="Rheumatologist">Rheumatologist</option>
                  <option value="Urologist">Urologist</option>
                  <option value="Nephrologist">Nephrologist</option>
                  <option value="Infectious Disease Specialist">Infectious Disease Specialist</option>
                  <option value="Plastic Surgeon">Plastic Surgeon</option>
                  <option value="Vascular Surgeon">Vascular Surgeon</option>
                  <option value="Obstetrician and Gynecologist">Obstetrician and Gynecologist</option>
                  <option value="Family Medicine">Family Medicine</option>
                  <option value="Geriatrician">Geriatrician</option>
                  <option value="Anesthesiologist">Anesthesiologist</option>
                  <option value="Radiologist">Radiologist</option>
                  <option value="Pathologist">Pathologist</option>
                  <option value="Sports Medicine Specialist">Sports Medicine Specialist</option>
                  <option value="Allergist/Immunologist">Allergist/Immunologist</option>
                  <option value="Hematologist">Hematologist</option>
                  <option value="Addiction Medicine Specialist">Addiction Medicine Specialist</option>
                </select>
              </Form.Item>
              <Form.Item>
                <span style={{ fontStyle: "italic" }}>
                  Your account needs to be approved by an admin to start using the site.
                </span>
              </Form.Item>
            </>
          )}

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="form-btn"
              disabled={formState.loading}
            >
              {formState.loading ? <Spin /> : "Sign Up"}
            </Button>
          </Form.Item>
        </Form>
        <p>
          Already a user?{" "}
          <NavLink className="login-link" to="/login">
            Log in
          </NavLink>
        </p>
      </div>
    </section>
  );
}

export default Register;