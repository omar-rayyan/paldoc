import dotenv from 'dotenv';
import express from 'express';
import "./config/mongoose.config.js";
import paldocRoutes from "./routes/paldoc.routes.js";
import cors from 'cors';


dotenv.config();

const app = express();
const port = process.env.PORT;

// Middleware
app.use(cookieParser());
app.use(cors({credentials: true, origin: 'http://localhost:5173'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/api/paldoc", paldocRoutes);

// Start the server
app.listen(port, () => console.log(`Server is running on port: ${port}`));