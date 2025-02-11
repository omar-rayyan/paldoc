import React from "react";
import FooterMin from "../components/FooterMin";
import Login from "../components/Login";
import Navbar from "../components/Navbar";

const LoginPage = () => {
  return (
    <div className="page-container">
      <Navbar />
      <div className="content">
        <Login />
      </div>
      <FooterMin />
    </div>
  );
};

export default LoginPage;