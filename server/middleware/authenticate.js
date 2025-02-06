import jwt from "jsonwebtoken";
import { User } from "../models/paldoc.models.js";

const authenticate = (req, res, next) => {
    const token = req.cookies.usertoken || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded; // Attach user info to request
        next(); // Continue to the next middleware
    } catch (error) {
        res.status(401).json({ error: "Invalid or expired token." });
    }
};

const authenticateAdmin = async (req, res, next) => {
    const token = req.cookies.usertoken || req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "No token provided." });
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.user = decoded;

        const user = await User.findById(decoded.id);
        if (!user || !user.isAdmin) {
            return res.status(403).json({ error: "Access denied. Admins only." });
        }

        next();
    } catch (error) {
        res.status(401).json({ error: "Invalid or expired token." });
    }
};

export { authenticate, authenticateAdmin};