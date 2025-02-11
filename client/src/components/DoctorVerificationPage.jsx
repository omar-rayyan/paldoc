import React from "react";
import FooterMin from "../components/FooterMin";
import DoctorVerification from "../components/DoctorVerification";
import Navbar from "../components/Navbar";

const DoctorVerificationPage = () => {
  return (
    <>
      <Navbar />
      <DoctorVerification/>
      <FooterMin />
    </>
  );
};

export default DoctorVerificationPage;