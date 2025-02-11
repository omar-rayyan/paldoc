import React from "react";
import FooterMin from "../components/FooterMin";
import PatientQuestionnaire from "../components/PatientQuestionnaire";
import Navbar from "../components/Navbar";

const PatientQuestionnairePage = () => {
  return (
    <>
      <Navbar />
      <PatientQuestionnaire/>
      <FooterMin />
    </>
  );
};

export default PatientQuestionnairePage;