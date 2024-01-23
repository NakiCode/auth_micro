import * as token from "../../helpers/jwt/token.js";
import  catchAsync from "../../helpers/catch/catchAsync.js";

import { tbl_User } from "../../models/userModel.js";

// To protect route for verify if user is authorized to access to resource
const protect = catchAsync(async (req, res, next) => {
    let token;
    let respo = response(401, false, [], "Accès refusé par authentification ou par autorisation");
    if (req.cookies && req.cookies.jwt) {
        if (jwt.isCookieTokenExpired(req.cookies.jwt)) { }
        token = req.cookies.jwt;
    }
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }
    if (!token) {
        return res.status(401).json(respo);
    }
    const verifyToken = await jwt.verifyToken(token);
    if (!verifyToken) {
        return res.status(401).json(respo);
    }
    const expiresToken = jwt.isTokenExpired(token);
    if (expiresToken) {
        let respo = response(401, false, [], "Veuillez vous connecter, le token est expiré");
        return res.status(401).json(respo)
    }
    const decodeToken = jwt.decodeToken(token);
    const user = await tbl_User.findOne({ _id: decodeToken.id, tokenId: decodeToken.tokenId });
    if (!user) {
        let respo = response(401, false, [], "Veuillez vous reconnecter");
        return res.status(401).json(respo);
    };
    req.user = user;
    return next();
})


export default protect;