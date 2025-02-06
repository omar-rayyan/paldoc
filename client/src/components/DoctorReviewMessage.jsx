import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/doctorreviewmessage.css";

const DoctorReviewMessage = ({ userId }) => {
  const [doctorStatus, setDoctorStatus] = useState(null);

  useEffect(() => {
    if (userId) {
      axios
        .get(`http://localhost:8000/api/paldoc/doctor-status/${userId}`, {
          withCredentials: true,
        })
        .then((response) => {
          setDoctorStatus(response.data);
        })
        .catch((error) => {
          console.error("Error fetching doctor status", error);
        });
    }
  }, [userId]);

  if (!doctorStatus) {
    return null;
  }

  if (doctorStatus.isDoctor && !doctorStatus.approved) {
    return (
      <div className="doctor-review-message">
        <p>
          Your doctor account is still in review. Please wait patiently as one of
          our admins approves it.
        </p>
      </div>
    );
  }

  return null;
};

export default DoctorReviewMessage;