import mongoose from "mongoose";
import fs from "fs";

const response = (code, success, data, message) => {
  const responseData = {
    statusCode: code,
    success: success,
    data: data ? data : [],
    message: message ? message : "",
  };
  return responseData;
};

const logErrorToFile = (error, req) => {
  const logMessage = `Timestamp: ${new Date().toISOString()}\n` +
    `URL: ${req.url}\n` +
    `Method: ${req.method}\n` +
    `IP: ${req.ip}\n` +
    `Error: ${error.message}\n\n`;
  
  fs.appendFile("error.log", logMessage, (err) => {
    if (err) {
      console.error("Failed to write error to file:", err);
    }
  });
};

const errorHandle = (err, req, res, next) => {
  let respo = response(400, false, [], "");

  if (err.name === "ValidationError") {
    const errors = Object.values(err.errors).map((el) => el.message);
    const message = errors.join(". ");
    respo.message = message;
  } else if (err.name === "CorsError") {
    respo.message = err.message;
    respo.statusCode = 403;
  } else if (err instanceof mongoose.CastError) {
    respo.message = "Invalid ID";
  } else if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    respo.message = "Requête invalide";
  } else if (err.name === "ReferenceError") {
    respo.message = "Requête invalide";
  } else if (err.name === "FileErrHandle") {
    respo.message = err.message;
  } else if (err.name === "MulterError") {
    respo.message = err.message;
  } else if (err.name === "TypeError") {
    respo.message = err.message;
  } else if (err.name === "NotFindErr") {
    respo.statusCode = 404;
    respo.message = err.message;
  } else if (err.code === "ENOENT") {
    respo.message = "Problème d'accès au fichier";
  } else if (err.name === "TokenExpiredError") {
    respo.message = err.message;
  } else if (err.name === "MongoServerError" && err.code === 11000) {
    const value = Object.keys(err.keyValue)[0];
    respo.statusCode = 409;
    respo.message = `Un(e) ${value} est invalide ou existe déjà. Veuillez choisir un autre`;
  } else if (err.name === "JsonWebTokenError") {
    respo.statusCode = 401;
    respo.message = "Vous n'avez pas d'autorisation d'accéder à cette ressource";
  } else if (err.name === "AssertionError") {
    respo.statusCode = 403;
    respo.message = "Veuillez réessayer ultérieurement !";
  } else if (err.name === "ValidatorError") {
    respo.message = "Requête invalide";
  } else if (err.name === "FileFormatError") {
    respo.message = err.message;
  } else if (err.name === "MongooseServerSelectionError") {
    respo.statusCode = 500;
    respo.message = "Impossible de se connecter à la base de données MongoDB";
  } else if (err.name === "FileError") {
    respo.statusCode = 500;
    respo.message = err.message;
  } else if (err instanceof Error) {
    respo.statusCode = 500;
    respo.message = err.message;
  }

  const mode = process.env.NODE_ENV;
  if (mode === "production" && respo.statusCode === 500) {
    logErrorToFile(err, req);
    return res.status(500).json({
      statusCode: 500,
      success: false,
      data: [],
      message: "Une erreur s'est produite. Veuillez reessayer ulterieurement !"
    })
  }
  return res.status(respo.statusCode).json(respo);
};

export default errorHandle;