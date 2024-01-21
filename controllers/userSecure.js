import { tbl_User } from "../models/UserModel.js";
import catchAsync from "../middleware/catch/catchAsync.js";
import * as jwtToken from "../middleware/jwt/token.js";
import * as jwtCookie from "../middleware/jwt/cookies.js";

export const checkEmailCode = catchAsync(async (req, res, next) => {
    let response = { statusCode: 404, success: false, data: [], message: "Code invalide" }
    if (!req.query.code && req.query.code?.length < 4) {
        response.message = "Veuillez renseigner un code valide"
        return res.status(404).json(response);
    }
    const user = await tbl_User.findOne({ emailCode: code });
    if (!user) {
        response.message = "Code invalide"
        return res.status(404).json(response);
    }
    if (user.isExpires('emailCodeExpiresAt', new Date())) {
        response.message = "Code expire"
        return res.status(404).json(response);
    }
    user.emailCode = null;
    user.emailCodeExpiresAt = null;
    if (req.path.includes('verify/email/account')) {
        user.isEmailVerified = true;
    }
    await user.save({ new: true, runValidators: true });

    const attach = jwtToken.attachTokensToUser(user);
    jwtCookie.attachCookies(attach.access, attach.refresh, res);
    const respo = { statusCode: 200, success: true, data: attach, message: "Connexion réussie" };
    return res.status(200).json(respo);

})