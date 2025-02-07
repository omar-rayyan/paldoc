import React, { useReducer, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Input, Button, Spin, notification } from "antd";
import "../styles/register.css";

// Initial form state for login
const initialState = {
  email: "",
  password: "",
  loading: false,
};

// Reducer function for form state management
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

function Login() {
  const [formState, dispatch] = useReducer(formReducer, initialState);
  const navigate = useNavigate();

  const inputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: "SET_FIELD", field: name, value });
  };

  const formSubmit = async () => {
    try {
      const { email, password } = formState;

      if (!email || !password) {
        notification.error({ message: "Both email and password are required" });
        return;
      }

      const userPayload = {
        email,
        password,
      };

      dispatch({ type: "SET_LOADING", value: true });
      const response = await axios.post("http://localhost:8000/api/paldoc/login", userPayload, { withCredentials: true });
      notification.success({ message: "Login successful!" });
      navigate("/");
    } catch (error) {
      console.error(error);
      notification.error({ message: "Invalid credentials or unable to login" });
    } finally {
      dispatch({ type: "SET_LOADING", value: false });
    }
  };

  return (
    <section className="register-section flex-center">
      <div className="register-container flex-center">
        <h2 className="form-heading">Log In</h2>
        <Form
          onFinish={formSubmit}
          className="register-form"
          initialValues={{ remember: true }}
        >
          <Form.Item label="Email Address" required>
            <Input
              type="email"
              name="email"
              placeholder="Enter your email"
              value={formState.email}
              onChange={inputChange}
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

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="form-btn"
              disabled={formState.loading}
            >
              {formState.loading ? <Spin /> : "Log In"}
            </Button>
          </Form.Item>
        </Form>
        <p>    
          Don't have an account?{" "}
          <NavLink className="login-link" to="/register">
            REGISTER
          </NavLink>
        </p> 
      </div>
    </section>
  );
}

export default Login;
