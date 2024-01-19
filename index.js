import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import moment from "moment-timezone";
import dbConnect from "./config/db.js";
import userRoute from "./routes/userRoute.js";
import errorHandle from "./middleware/err/errHendle.js";
import morgan from "morgan";
import fs from 'fs';

// APP CONFIG
const app = express();

dotenv.config();
moment.tz.setDefault(process.env.TIMEZONE);
// -------------------------------------------------------
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("files"));
// -------------------------------------------------------
// MORGAN
if (process.env.NODE_ENV === "production") {
    const accessLogStream = fs.createWriteStream('access.log', { flags: 'a' });
    app.use(morgan('combined', { stream: accessLogStream }));
} else {
    app.use(morgan("combined"));
}





// ROUTES
app.use(`${process.env.API_URI}/user`, userRoute);



// MIDDLEWARE ERROR HANDLE
app.use(errorHandle)
// -------------------------------------------------------
const PORT = process.env.PORT
// DATABASE
dbConnect()
// -------------------------------------------------------
app.listen(PORT, () => {
    console.log(`LE  PORT ECOUTE SUR LE PORT : ${PORT}`);
})