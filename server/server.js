import dotenv from 'dotenv';
import express from 'express';
import { createServer } from 'http';
import "./config/mongoose.config.js";
import paldocRoutes from "./routes/paldoc.routes.js";
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import initializeSocket from './socket/socket.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT;

const httpServer = createServer(app);

const io = initializeSocket(httpServer);

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cookieParser());
app.use(cors({credentials: true, origin: 'http://localhost:5173'}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

paldocRoutes(app);

httpServer.listen(port, () => {
    console.log(`Server is running on port: ${port}`);
});