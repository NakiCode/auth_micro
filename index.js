import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import moment from "moment-timezone";
import dbConnect from "./config/db.js";
// APP CONFIG
const app = express();

dotenv.config();
moment.tz.setDefault(process.env.TIMEZONE);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("files"));

const PORT = process.env.PORT

// DATABASE
dbConnect()

app.listen(PORT, () => {
    console.log(`LE  PORT ECOUTE SUR LE PORT : ${PORT}`);
})