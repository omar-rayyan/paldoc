import React, { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import image from "../images/heroimg.jpg";
import "../styles/hero.css";

const Hero = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if the user is logged in (this is just a placeholder, replace with your actual logic)
    const token = document.cookie.split("; ").find(row => row.startsWith("usertoken"))?.split("=")[1];
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  return (
    <section className="hero">
      <div className="hero-content">
        <h1>
          Your Health, <br />
          Our Responsibility
        </h1>
        <div className="hero-text">
          <p>
            Welcome to PalDoc, where we connect Palestinian patients with trusted healthcare 
            professionals. Experience seamless healthcare access through our innovative 
            digital platform, designed to make quality medical care available to everyone 
            in Palestine.
          </p>
          <NavLink to={isLoggedIn ? "/doctors" : "/register"} className="register-btn">
            {isLoggedIn ? "Find a Doctor Now" : "Register Now"}
          </NavLink>
        </div>
      </div>
      <div className="hero-img">
        <img src={image} alt="hero" />
      </div>
    </section>
  );
};

export default Hero;