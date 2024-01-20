import mongoose from "mongoose";

const response = (code, success, data, message) => {
    const responseData = {
        statusCode: code,
        success: success,
        data: data ? data : [],
        message: message,
    };
    return responseData;
};
const errorHandle = (err, req, res, next) => {
    if (err.name === "ValidationError") {
        const errors = Object.values(err.errors).map((el) => el.message);
        const message = errors.join('. ');
        const respo = response(400, false, [], message);
        return res.status(400).json(respo);
    }
    if (err.name === "CorsError") {
        const message = err.message;
        const respo = response(403, false, [], message);
        return res.status(403).json(respo);
    }
    if (err instanceof mongoose.CastError) {
        const respo = response(400, false, [], "Invalid ID");
        return res.status(400).json(respo);
    }
    if (
        err instanceof SyntaxError &&
        err.status === 400 &&
        "body" in err
    ) {
        const respo = response(400, false, [], "Requête invalide");
        return res.status(400).json(respo);
    }
    if (err.name === "ReferenceError") {
        const respo = response(400, false, [], "Requête invalide");
        return res.status(400).json(respo);
    }
    if (err.name === "FileErrHandle") {
        const respo = response(400, false, [], err.message);
        return res.status(400).json(respo);
    }
    if (err.name === "MulterError") {
        const respo = response(400, false, [], err.message);
        return res.status(400).json(respo);
    }
    if (err.name === "TypeError") {
        const respo = response(400, false, [], err.message);
        return res.status(400).json(respo);
    }
    if (err.name === "NotFindErr") {
        const respo = response(404, false, [], err.message);
        return res.status(404).json(respo);
    }
    if (err.code === "ENOENT") {
        const respo = response(400, false, [], "Problème d'accès au fichier");
        return res.status(400).json(respo);
    }
    if (err.name === "MongoServerSelectionError") {
        const respo = response(500, false, [], "Impossible de se connecter à la base de données MongoDB");
        return res.status(500).json(respo);
    }
    if (err.name === "MongoServerError" && err.code === 11000) {
        const value = Object.keys(err.keyValue)[0];
        const respo = response(409, false, [], `Un(e) ${value} est invalide ou existe déjà. Veuillez choisir un autre`);
        return res.status(409).json(respo);
    }
    if (err.name === "JsonWebTokenError") {
        const respo = response(403, false, [], "Vous n'avez pas d'autorisation d'accéder à cette ressource");
        return res.status(401).json(respo);
    }
    if (err.name === "AssertionError") {
        const respo = response(403, false, [], "Veuillez réessayer ultérieurement !");
        return res.status(403).json(respo);
    }
    if (err.name === "ValidatorError") {
        const respo = response(400, false, [], "Requête invalide");
        return res.status(400).json(respo);
    }
    if (err instanceof Error) {
        const respo = response(500, false, [], "Un problème est survenu");
        return res.status(500).json(respo);
    }
    return next(err);
};

export default errorHandle;