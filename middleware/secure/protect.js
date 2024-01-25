import * as jwtToken from "../../middleware/jwt/token.js";
import * as jwtCookie from "../../middleware/jwt/cookies.js";
import catchAsync from "../../middleware/catch/catchAsync.js";
import { tbl_User } from "../../models/UserModel.js";

const protect = catchAsync(async (req, res, next) => {
    let token;
    if (req.cookies && req.cookies.jwt) {
        if (jwtCookie.isCookiesExpired(req.cookies.jwt)) {
            // Gérer l'expiration des cookies JWT
            return handleUnauthorized(res, "Veuillez vous reconnecter");
        }
        token = req.cookies.jwt;
    }
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        console.log("not token")
        return handleUnauthorized(res, "Veuillez vous reconnecter");
    }
    
    const verifyToken = await jwtToken.verifyAccessToken(token);
    if (!verifyToken) {
        return handleUnauthorized(res, "Veuillez vous reconnecter");
    }
    const user = await tbl_User.findOne({ _id: verifyToken._id, tokenId: verifyToken.tokenId });
    if (!user) {
        return handleUnauthorized(res, "Veuillez vous reconnecter");
    }
    req.user = user;
    return next();
});

// Fonction utilitaire pour gérer les réponses d'erreur
function handleUnauthorized(res, message) {
    const respo = response(401, false, [], message);
    return res.status(401).json(respo);
}

// Fonction utilitaire pour générer une réponse JSON standardisée
function response(status, success, data, message) {
    return { status, success, data, message };
}

export default protect;