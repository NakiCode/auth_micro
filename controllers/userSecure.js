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
        }).select('+tokenId +emailCode');
    } else {
        foundUser = await tbl_User.findOne({ emailCode: req.query.code }).select('+tokenId  +emailCode');
    }
    if (!foundUser) {
        defaultResponse.message = "Code invalide";
        return res.status(404).json(defaultResponse);
    }
    if (foundUser.isExpires('emailCodeExpiresAt', new Date())) {
        defaultResponse.message = "Le Code est expiré";
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

export const checkPhoneCode = catchAsync(async (req, res, next) => {
    const defaultResponse = { statusCode: 404, success: false, data: [], message: "Code invalide" };
    let foundUser = undefined;

    if (!req.query.code || req.query.code.length < 4) {
        defaultResponse.message = "Veuillez renseigner un code valide";
        return res.status(404).json(defaultResponse);
    }
    if (req.user && req.user._id) {
        foundUser = await tbl_User.findOne(
            { $and: [{ _id: req.user._id }, 
            { phoneCode: req.query.code }] 
        }).select('+tokenId +phoneCode');
    } else {
        foundUser = await tbl_User.findOne({ phoneCode: req.query.code }).select('+tokenId +phoneCode');
    }
    if (!foundUser) {
        defaultResponse.message = "Code invalide";
        return res.status(404).json(defaultResponse);
    }
    if (foundUser.isExpires('phoneCodeExpiresAt', new Date())) {
        defaultResponse.message = "Code expire";
        return res.status(404).json(defaultResponse);
    }
    foundUser.phoneCode = null;
    foundUser.phoneCodeExpiresAt = null;
    if (req.path.includes('verify/phone/account')) {
        foundUser.isPhoneVerified = true;
    }
    await foundUser.save({ new: true, runValidators: true });

    const attach = jwtToken.attachTokensToUser(foundUser);
    jwtCookie.attachCookies(attach.access, attach.refresh, res);
    const response = { statusCode: 200, success: true, data: attach, message: "Connexion réussie" };
    return res.status(200).json(response);

});
// ----------------------------------------------------------------------------
export const addPhoneNumber = catchAsync(async (req, res, next)=>{
    const {phone} = req.body
    const userId = req.query.id_user
    const user = await tbl_User.findOneAndUpdate({$or:[{_id: req.user._id}, {_id: userId}]})
        .select("+phoneCode")
    if (!user) {
        return res.status(404).json({
            statusCode: 404,
            data: [],
            message: "Veuillez vous connecter !"
        });
    }
    user.phone = phone
    user.phoneCode = Math.floor(1000 + Math.random() * 9000)
    user.phoneCodeExpiresAt = new Date(Date.now() + 30 * 60 * 1000)

    await user.save({new: true, runValidators: true})
    const attach = jwtToken.attachTokensToUser(user);
    jwtCookie.attachCookies(attach.access, attach.refresh, res);
    const response = { statusCode: 200, success: true, data: attach, message: "Connexion spécie" };
    return res.status(200).json(response);

    
})