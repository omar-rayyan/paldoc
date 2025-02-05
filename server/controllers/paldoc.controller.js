import { User, Doctor, Appointment, Message } from "../models/paldoc.models.js";
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
                .cookie("usertoken", userToken, {
                    httpOnly: true,
                    sameSite: "Strict"
                })
                .json({ msg: "Login successful!", user: { id: user._id, email: user.email } });
        } catch (error) {
            res.status(500).json({ error: "Something went wrong. Please try again later." });
        }
    },

    register: async (req, res) => {
        try {
            const user = await User.create(req.body);

            const userToken = jwt.sign({ id: user._id }, process.env.SECRET_KEY);

            res
                .cookie("usertoken", userToken, {
                    httpOnly: true,
                    sameSite: "Strict"
                })
                .json({ msg: "Registration successful!", user: { id: user._id, email: user.email } });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    },

    logout: (req, res) => {
        res.clearCookie("usertoken");
        res.json({ msg: "Logout successful." });
    }
};

export default PalDocController;