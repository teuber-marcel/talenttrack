import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import process from 'node:process';
import routes from "./routes/routes.js";
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// defines the port the application is running on. Url is http://localhost:5555
const PORT = 5555;

// define how a request payload will be handled
app.use(bodyParser.json({ extended: true }));
app.use(bodyParser.urlencoded({ extended: true }));

// enable Cross Origin Resource Sharing
app.use(cors());

// hook up all API routes
app.use("/", routes)

// establish a connection to the database. The connection URL, including username and password, is stored in the .env file
const CONNECTION_URL = process.env.DB_CONNECTION_URL;
mongoose.connect(CONNECTION_URL)
    .then(() => {
        app.listen(PORT, () => {
            console.log("Server is running");
        })
    })
    .catch((error) => console.log(error.message));