import React from "react";
import image from "../images/aboutimg.jpg";

const AboutUs = () => {
  return (
    <>
      <section className="container">
        <h2 className="page-heading about-heading">About Us</h2>
        <div className="about">
          <div className="hero-img">
            <img
              src={image}
              alt="hero"
            />
          </div>
          <div className="hero-content">
          <p>
              Welcome to PalDoc, your trusted healthcare companion in Palestine. 
              We are dedicated to revolutionizing healthcare accessibility by 
              connecting patients with qualified medical professionals through 
              our innovative digital platform.
            </p>
            <p>
              Our mission is to make quality healthcare services easily accessible 
              to everyone in Palestine. Through PalDoc, patients can schedule 
              appointments, consult with doctors, and manage their health records 
              seamlessly. We believe in creating a healthcare ecosystem that 
              prioritizes patient care while making it convenient for medical 
              professionals to serve their communities effectively.
            </p>
            <p>
              With a network of experienced doctors across various specialties, 
              we ensure that you receive the best medical attention when you need 
              it. Our platform emphasizes security, reliability, and user-friendly 
              experience, making healthcare management simpler for both patients 
              and healthcare providers.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default AboutUs;