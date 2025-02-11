import React from "react";
import FooterMin from "../components/FooterMin";
import EditProfile from "../components/EditProfile";
import Navbar from "../components/Navbar";

const ProfilePage = () => {
  return (
    <>
      <Navbar />
      <EditProfile/>
      <FooterMin />
    </>
  );
};

export default ProfilePage;