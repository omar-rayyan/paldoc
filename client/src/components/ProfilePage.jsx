import React from "react";
import Footer from "../components/Footer";
import EditProfile from "../components/EditProfile";
import Navbar from "../components/Navbar";

const ProfilePage = () => {
  return (
    <>
      <Navbar />
      <EditProfile/>
      <Footer />
    </>
  );
};

export default ProfilePage;