import AboutUs from "../components/AboutUs";
import Footer from "../components/Footer";
import Hero from "../components/Hero";
import Navbar from "../components/Navbar";
import HomeCircles from "../components/HomeCircles";
import axios from "axios";
import React, { useState, useEffect } from "react";
import DoctorReviewMessage from "./DoctorReviewMessage";

const LandingPage = () => {
    const [user, setUser] = useState(null);

  useEffect(() => {
    const userToken = document.cookie
      .split("; ")
      .find((row) => row.startsWith("usertoken"))
      ?.split("=")[1];
    if (userToken) {
      axios
        .get("http://localhost:8000/api/paldoc/authenticate", {
          headers: { Authorization: `Bearer ${userToken}` },
          withCredentials: true,
        })
        .then((response) => {
          setUser(response.data.user);
          console.log(response.data.user);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);

  return (
    <>
      <Navbar />
      {user && <DoctorReviewMessage userId={user.id} />}
      <Hero />
      <AboutUs />
      <HomeCircles />
      <Footer />
    </>
  );
};

export default LandingPage;