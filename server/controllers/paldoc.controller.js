import { User, Appointment, Message, HealthHistory } from "../models/paldoc.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

dotenv.config();

const PalDocController = {
  login: async (req, res) => {
    try {
      const user = await User.findOne({ email: req.body.email });
      if (!user) {
        return res.status(401).json({ error: "Email not found." });
      }
      const correctPassword = await bcrypt.compare(req.body.password, user.password);
      if (!correctPassword) {
        return res.status(401).json({ error: "Incorrect password." });
      }
      const userToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
      res
        .cookie("usertoken", userToken, process.env.SECRET_KEY, { httpOnly: true })
        .json({ msg: "Login successful!", user: { id: user._id, email: user.email } });
    } catch (error) {
      res.status(500).json({ error: "Something went wrong. Please try again later." });
    }
  },

  register: async (req, res) => {
    try {
      const { isDoctor, license, professionalSpecialty, pic, ...userData } = req.body;
  
      // Create the user
      const user = await User.create({
        ...userData,
        pic: pic || "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
        doctor: isDoctor
          ? {
              professionalSpecialty: professionalSpecialty || "",
            }
          : null,
      });
  
      // Create JWT token
      const userToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
  
      res
        .cookie("usertoken", userToken, process.env.SECRET_KEY, { httpOnly: true })
        .json({ msg: "Registration successful!", user: { id: user._id, email: user.email } });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  
  getApprovedDoctors: async (req, res) => {
    User.find({ "doctor.approved": true })
      .then(allDoctors => res.json(allDoctors))
      .catch(err => res.status(500).json({ success: false, error: err.message }));
  },

  deleteUser: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
      res.status(200).json({ msg: "User deleted successfully." });
    } catch (error) {
      res.status(500).json({ error: "Internal server error." });
    }
  },

  getPatients: async (req, res) => {
    User.find({ doctor: null })
      .then(allPatients => res.json(allPatients))
      .catch(err => res.status(500).json({ success: false, error: err.message }));
  },

  getDoctorAvailability: async (req, res) => {
    try {
      const doctor = await User.findById(req.params.doctorId);
  
      if (!doctor || !doctor.doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }
  
      const availableSlots = doctor.doctor.availability.filter(slot => !slot.isBooked);
      res.json(availableSlots);
    } catch (error) {
      res.status(500).json({ error: "Server error" });
    }
  },

  bookAppointment: async (req, res) => {
    try {
      const { doctorId, dayOfWeek, startTime, endTime } = req.body;
      const userId = req.user.id;
  
      // Fetch the doctor and patient details
      const doctor = await User.findById(doctorId);
      const patient = await User.findById(userId); // Fetch the patient's details using the userId
  
      if (!doctor || !doctor.doctor) {
        return res.status(404).json({ error: "Doctor not found" });
      }
      
      if (!patient) {
        return res.status(404).json({ error: "Patient not found" });
      }
  
      // Ensure the slot is available
      const slotIndex = doctor.doctor.availability.findIndex(
        (slot) =>
          slot.startTime === startTime &&
          slot.endTime === endTime &&
          slot.dayOfWeek === dayOfWeek &&
          !slot.isBooked
      );
  
      if (slotIndex === -1) {
        return res.status(400).json({ error: "Slot not available" });
      }
  
      // Mark slot as booked
      doctor.doctor.availability[slotIndex].isBooked = true;
      await doctor.save();
  
      // Create the appointment with doctorName and patientName
      const appointment = new Appointment({
        userId,
        doctorId,
        doctorName: toString(doctor.firstName, doctor.lastName),
        patientName: toString(patient.firstName, patient.lastName),
        dayOfWeek,
        startTime,
        endTime,
        status: "Booked",
      });
      await appointment.save();
  
      res.json({ message: "Appointment booked successfully", appointment });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Server error" });
    }
  },   

  getDoctors: async (req, res) => {
    User.find({ doctor: { $ne: null } })
      .then(allDoctors => res.json(allDoctors))
      .catch(err => res.status(500).json({ success: false, error: err.message }));
  },

  approveDoctor: async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user || !user.doctor) {
        return res.status(404).json({ message: "Doctor not found" });
      }
  
      user.doctor.approved = true;
      await user.save();
  
      res.status(200).json({ message: "Doctor approved successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  logout: (req, res) => {
    res.clearCookie("usertoken");
    res.json({ msg: "Logout successful." });
  },

  authenticate: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
      res.json({ user: { id: user._id, email: user.email, isAdmin: user.isAdmin } });
    } catch (error) {
      res.status(500).json({ error: "Internal server error." });
    }
  },

  getUser: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Internal server error." });
    }
  },

  getHealthHistory: async (req, res) => {
    try {
      const healthHistory = await HealthHistory.findOne({ userId: req.user.id });
      if (!healthHistory) {
        return res.status(404).json({ error: "Health history not found." });
      }
      res.json(healthHistory);
    } catch (error) {
      res.status(500).json({ error: "Internal server error." });
    }
  },  

  updateProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ error: "User not found." });
      }
      const { firstName, lastName, email, phonenumber, age, pic, oldPassword, newPassword } = req.body;
      if (oldPassword && newPassword) {
        const correctPassword = await bcrypt.compare(oldPassword, user.password);
        if (!correctPassword) {
          return res.status(401).json({ error: "Incorrect password." });
        }
      }
      if (newPassword) {
        user.password = newPassword;
      }
      user.firstName = firstName;
      user.lastName = lastName;
      user.email = email;
      user.phonenumber = phonenumber;
      user.age = age;
      user.pic = pic;
      await user.save();
      res.json({ msg: "Profile updated successfully." });
    } catch (error) {
      res.status(500).json({ error: "Internal server error." });
    }
  },

  getPatientAppointments: async (req, res) => {
    try {
      const userId = req.user.id;
  
      const appointments = await Appointment.find({ userId }).sort({ dayOfWeek: 1, startTime: 1 });
  
      res.json(appointments);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch appointments" });
    }
  },

  doctorStatus: async (req, res) => {
    try {
      const user = await User.findById(req.params.userId).populate("doctor");
      if (!user) {
        return res.status(404).json({ message: "User not found." });
      }
  
      const doctorStatus = {
        isDoctor: user.doctor !== null,
        approved: user.doctor ? user.doctor.approved : false,
      };
      res.json(doctorStatus);
    } catch (error) {
      res.status(500).json({ message: "Error fetching doctor status." });
    }
  },

  verifyDoctor: async (req, res) => {
    try {
      const { licenseNumber, documents } = req.body;
      
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.doctor = {
        ...user.doctor,
        licenseNumber,
        verificationDocuments: documents,
      };
  
      await user.save();
      res.status(200).json({ message: "Verification documents submitted successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  setAvailability: async (req, res) => {
    try {
      const { availability } = req.body;
      
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      user.doctor.availability = availability;
      await user.save();
      
      res.status(200).json({ message: "Availability set successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  saveHealthHistory: async (req, res) => {
    try {
      const { _id, ...healthData } = req.body;

      const healthHistory = await HealthHistory.findOneAndUpdate(
        { userId: req.user.id },
        { ...healthData, userId: req.user.id },
        { new: true, upsert: true, setDefaultsOnInsert: true }
      );
      res.status(200).json({ message: "Health history saved successfully", healthHistory });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // --- New File Upload Method (local storage) ---
  uploadFile: async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file provided" });
      }
      // req.file.path contains the local file path.
      // Construct a URL for accessing the file. (Assumes you serve the uploads folder statically.)
      const fileUrl = `${req.protocol}://${req.get("host")}/${req.file.path.replace(/\\/g, "/")}`;
      
      res.json({ url: fileUrl });
    } catch (error) {
      console.log("File upload error:", error);
      res.status(500).json({ error: "File upload failed", details: error.message });
    }
  },
};

export default PalDocController;