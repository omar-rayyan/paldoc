import dotenv from 'dotenv';
import express from 'express';
import "./config/mongoose.config.js";
import paldocRoutes from "./routes/paldoc.routes.js";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT;

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cookieParser());
app.use(cors({credentials: true, origin: 'http://localhost:5173'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
paldocRoutes(app);

// Start the server
app.listen(port, () => console.log(`Server is running on port: ${port}`));