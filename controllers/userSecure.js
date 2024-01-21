import { tbl_User } from "../models/UserModel.js";
import catchAsync from "../middleware/catch/catchAsync.js";
import * as jwtToken from "../middleware/jwt/token.js";
import * as jwtCookie from "../middleware/jwt/cookies.js";

export const checkEmailCode = catchAsync(async (req, res, next) => {
    const defaultResponse = { statusCode: 404, success: false, data: [], message: "Code invalide" };
    let foundUser = undefined;
    if (!req.query.code || req.query.code.length < 4) {
        defaultResponse.message = "Veuillez renseigner un code valide";
        return res.status(404).json(defaultResponse);
    }
    if (req.user && req.user._id) {
        foundUser = await tbl_User.findOne(
            { $and: [{ _id: req.user._id }, 
            { emailCode: req.query.code }] 
        }).select('+tokenId');
    } else {
        foundUser = await tbl_User.findOne({ emailCode: req.query.code }).select('+tokenId');
    }
    if (!foundUser) {
        defaultResponse.message = "Code invalide";
        return res.status(404).json(defaultResponse);
    }
    if (foundUser.isExpires('emailCodeExpiresAt', new Date())) {
        defaultResponse.message = "Code expire";
        return res.status(404).json(defaultResponse);
    }
    foundUser.emailCode = null;
    foundUser.emailCodeExpiresAt = null;
    if (req.path.includes('verify/email/account')) {
        foundUser.isEmailVerified = true;
    }
    await foundUser.save({ new: true, runValidators: true });

    const attach = jwtToken.attachTokensToUser(foundUser);
    jwtCookie.attachCookies(attach.access, attach.refresh, res);
    const response = { statusCode: 200, success: true, data: attach, message: "Connexion réussie" };
    return res.status(200).json(response);
});