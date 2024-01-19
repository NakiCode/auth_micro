import mongoose from "mongoose";

const response = (code, success, data, message) => {
    const responseData = {
        statusCode: code,
        success: success,
        data: data?data:[],
        message: message
    };
    return responseData;
}
const errorHandle = (err, req, res, next)=> {
    console.log(err)
     // Gérer les erreurs de validation
    if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map(el => el.message);
        const message = errors.join('. ');
        let respo = response(400, false, [], message);
        return res.status(400).json(respo);
        }
    if (err.name === 'CorsError') {
        let message = err.message;
        let respo = response(403, false, [], message);
        return res.status(403).json(respo);
        }
        // Gérer l'erreur de type CastError
    if (err instanceof mongoose.CastError) {
        let respo = response(400, false, [], "Invalid ID");
        return res.status(400).json(respo);
        }
        // Gérer les erreurs de SyntaxError
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        let respo = response(400, false, [], 'Requête invalide');
        return res.status(400).json(respo);
        }
        // Gérer les erreurs de references
    if (err.name === 'ReferenceError'){
        let respo = response(400, false, [], 'Requête invalide');
        return res.status(400).json(respo);
        }
        // Gérer les erreurs DuplicateFieldTrack
    if (err.name === "DuplicateFieldTrack") {
        let respo = response(409, false, [], err.message);
        console.log(err)
        return res.status(409).json(respo);
        }
        // Gérer les erreurs FileErrHandle
    if (err.name === "FileErrHandle") {
        let respo = response(400, false, [], err.message);
        return res.status(400).json(respo);
        }
    if (err.name === 'MulterError'){
        let respo = response(400, false, [], err.message);
        return res.status(400).json(respo);
    }
    if(err.name === 'TypeError') {
        let respo = response(400, false, [], err.message);
        return res.status(400).json(respo);
    }
    if(err.name === 'NotFindErr') {
        let respo = response(404, false, [], err.message);
        return res.status(404).json(respo);
    }
    // 
    if  (err.code === 'ENOENT') {
        let respo = response(400, false, [], "Problème d'accès au fichier")
        return res.status(400).json(respo);
    }
    // Gérer les erreurs de connexion
    // Gérer l'erreur de connexion à MongoDB
    if (err.name === 'MongoServerSelectionError') {
        let respo = response(500, false, [], "Impossible de se connecter à la base de données MongoDB");
        return res.status(500).json(respo);
    }
    // Gérer les erreurs MongoServerError
    if (err.name === 'MongoServerError' && err.code === 11000) {
        const value = `${Object.keys(err.keyValue)[0]}`
        let respo = response(409, false, [], `Un(e) ${value} est invalide ou exite déjà. Veuillez choisir un autre`);
        return res.status(409).json(respo);
    };
    if (err.name === "JsonWebTokenError") {
        let respo = response(403, false, [], "Vous n'avez pas d'autorisation d'accéder à cette resource");
        return res.status(401).json(respo);
    }
    if (err.name === "AssertionError") {
        let respo = response(403, false, [], "Veuillez recommancez ultérieurement !");
    }
    if (err.name === "ValidatorError") {
        let respo = response(400, false, [], "Requête invalide");
        return res.status(400).json(respo);
    }
    if (err instanceof Error){
        let respo = response(500, false, [], "Un problème est survenue");
        return res.status(500).json(respo);
    };
    
    return next(err);
};

export default errorHandle;