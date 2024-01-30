import express from "express";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import moment from "moment-timezone";
import dbConnect from "./config/db.js";
import morgan from "morgan";
import fs from "fs";
import cors from "cors";
import helmet from "helmet";
import hpp from "hpp";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import errorHandle from "./middleware/err/errHendle.js";
import toobusyProtect from "./middleware/secure/toobusy.js";
import userRoute from "./routes/userRoute.js";
import errConstructor from "./middleware/err/err.js";
import createDirectories from "./helpers/file/file.js";
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
  await createDirectories().then(() => {
    console.log("Dossiers creés avec succes");
  }).catch((err) => {
    console.error(err);
  })
  const accessLogStream = fs.createWriteStream("log/journal.log", {
    flags: "a"
  });
  app.use(morgan("combined", { stream: accessLogStream }));
} else {
  app.use(morgan("dev"));
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
app.disable("x-powered-by");

if (process.env.NODE_ENV === "development") {
  app.use(cors());
} else if (process.env.NODE_ENV === "production") {
  const whitelist = ["0.0.0.0"];
  const corsOptions = {
    origin: function (origin, callback) {
      if (whitelist.includes(origin)) {
        callback(null, true);
      } else {
        callback(new errConstructor("CorsError", "Access denied by CORS", 401));
      }
    }
  };
  app.use(cors(corsOptions));
}

app.use(hpp());
app.use(toobusyProtect);
// Routes
app.use(`${process.env.BASE_URL}/user`, userRoute);
// Middleware de gestion des erreurs

app.use(errorHandle);

const PORT = process.env.PORT || 5000;

// Connexion à la base de données
dbConnect();

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Le serveur écoute sur le port : ${PORT} en mode ${process.env.NODE_ENV} `);
});
