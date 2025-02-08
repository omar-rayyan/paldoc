import { User, Appointment, Message } from "../models/paldoc.models.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

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
                .cookie("usertoken", userToken, process.env.SECRET_KEY, {
                    httpOnly: true,
                })
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
                        licenseNumber: license,
                        professionalSpecialty: professionalSpecialty || "", // Add the professional specialty
                    }
                    : null,
            });
    
            // Create JWT token
            const userToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);
    
            // Send response with token
            res
                .cookie("usertoken", userToken, {
                    httpOnly: true,
                })
                .json({ msg: "Registration successful!", user: { id: user._id, email: user.email } });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },
    
    getDoctors: async (req, res) => {
        User.find({ "doctor.approved": true })
            .then(allDoctors => res.json(allDoctors))
            .catch(err => res.status(500).json({ success: false, error: err.message }));
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
};

export default PalDocController;