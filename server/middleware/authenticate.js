import jwt from "jsonwebtoken";

const authenticate = (req, res, next) => {
    const token = req.cookies.usertoken;

    if (!token) {
        return res.status(401).json({ error: "No token provided." });
    }

    jwt.verify(token, process.env.SECRET_KEY, (err, payload) => {
        if (err) { 
            return res.status(401).json({ error: "Invalid or expired token." });
        } else {
            req.user = payload;  
            next();
        }
    });
}

export default authenticate;
