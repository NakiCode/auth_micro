import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import moment from "moment-timezone";
import dbConnect from "./config/db.js";
import morgan from "morgan";
import fs from 'fs';
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import errorHandle from "./middleware/err/errHendle.js";
import toobusyProtect from "./middleware/secure/toobusy.js";
import userRoute from "./routes/userRoute.js";
import errConstructor from './middleware/err/err.js';

// Configuration
dotenv.config();
moment.tz.setDefault(process.env.TIMEZONE);

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("files"));
app.use(cookieParser());

if (process.env.NODE_ENV === "production") {
    const accessLogStream = fs.createWriteStream('access.log', { flags: 'a' });
    app.use(morgan('combined', { stream: accessLogStream }));
} else {
    app.use(morgan("combined"));
}

app.use(helmet());
app.use(helmet.frameguard({ action: "sameorigin" }));
app.use(helmet.xssFilter());
app.use(helmet.noSniff());
app.use(mongoSanitize());
app.use(express.urlencoded({ extended: true, limit: "3kb" }));

app.use(express.static("files/"));

if (process.env.NODE_ENV === "production") {
    app.use(express.static("client/build"));
}

app.enable("trust proxy");

if (process.env.NODE_ENV === "development") {
    app.use(cors());
} else if (process.env.NODE_ENV === "production") {
    const whitelist = ["*"];
    const corsOptions = {
        origin: function (origin, callback) {
            if (whitelist.includes(origin)) {
                callback(null, true);
            } else {
                callback(new errConstructor("CorsError", "Access denied by CORS", 401));
            }
        },
    };
    app.use(cors(corsOptions));
}

app.use(hpp());
app.use(toobusyProtect);
// Routes
app.use(`${process.env.BASE_URL}/user`, userRoute);
// Middleware de gestion des erreurs
app.use(errorHandle);

const PORT = process.env.PORT;

// Connexion à la base de données
dbConnect();

app.listen(PORT, () => {
    console.log(`Le serveur écoute sur le port : ${PORT}`);
});