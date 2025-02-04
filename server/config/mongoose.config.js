import dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const dbName = process.env.DB;
const username = process.env.ATLAS_USERNAME;
const password = encodeURIComponent(process.env.ATLAS_PASSWORD);

const uri = `mongodb+srv://${username}:${password}@cluster0.tpxku.mongodb.net/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(uri)
    .then(() => console.log("Established a connection to the database"))
    .catch(err => console.log("Something went wrong when connecting to the database", err));