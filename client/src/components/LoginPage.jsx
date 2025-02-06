import React from "react";
import Footer from "../components/Footer";
import Login from "../components/Login";
import Navbar from "../components/Navbar";

const LoginPage = () => {
  return (
    <>
      <Navbar />
      <Login/>
      <Footer />
    </>
  );
};

export default LoginPage;