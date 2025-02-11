import React from "react";
import FooterMin from "../components/FooterMin";
import AvailabilitySetup from "../components/AvailabilitySetup";
import Navbar from "../components/Navbar";

const AvailabilitySetupPage = () => {
  return (
    <>
      <Navbar />
      <AvailabilitySetup/>
      <FooterMin />
    </>
  );
};

export default AvailabilitySetupPage;