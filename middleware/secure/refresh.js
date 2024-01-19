import { tbl_User } from "../../models/user/userModel.js";
import * as jwt from "../../helpers/jwt/jwt.js";
import catchAsync from "../../helpers/err/catchAsync.js";
import response from "../../helpers/response/responseMessage.js";
// ##############################################################################################
// To refresh token ok
export const refresh = catchAsync(async (req, res, next) => {
    let token;
    if (req.cookies && req.cookies.jwt_refresh) {
        if (jwt.isCookieRefreshTokenExpired(req.cookies.jwt_refresh)) { }
        token = req.cookies.jwt_refresh;
    }
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    };
    if (!token) {
        let respo = response(401, false, [], "Veuillez vous connecter");
        return res.status(401).json(respo)
    };
    const verifyRefreshToken = await jwt.isRefreshTokenValid(token);
    if (!verifyRefreshToken) {
        let respo = response(401, false, [], "Veuillez vous connecter");
        return res.status(401).json(respo);
    }
    const expiresRefreshToken = jwt.isRefreshTokenExpired(token);
    if (expiresRefreshToken) {
        let respo = response(401, false, [], "Veuillez vous connecter, le token est expiré");
        return res.status(401).json(respo)
    }
    const decodedRefreshToken = jwt.decodeRefreshToken(token);
    const user = await tbl_User.findById(decodedRefreshToken.id).select('+tokenId');
    if (!user) {
        let respo = response(404, false, [], "Utilisateur non trouver");
        return res.status(404).json(respo);
    };
    const attach = jwt.attachTokenToUser(user);
    const refreshToken = jwt.generateRefreshToken(user);
    attach.refreshToken = refreshToken;
    jwt.createSendToken(user, res);
    jwt.createSendRefreshToken(user, res);
    let respo = response(200, true, attach, "Connexion reussie");
    return res.status(200).json(respo);
});

export default refresh;
