import { tbl_User } from "../models/UserModel.js";
import catchAsync from "../middleware/catch/catchAsync.js";
import * as jwtToken from "../middleware/jwt/token.js";
import * as jwtCookie from "../middleware/jwt/cookies.js";
import sender from "../outils/mail/sender.js";
import * as emailTypes from "../outils/mail/emailTypes.js";
import sendWhatsAppMessage from "../outils/sms/whatsapp.js";
import CodeSMS from "../outils/sms/typesms.js";


export const checkEmailCode = catchAsync(async (req, res, next) => {
    const defaultResponse = { statusCode: 404, success: false, data: [], message: "Code invalide" };
    let foundUser = undefined;
    if (!req.query.code || req.query.code.length < 4) {
        defaultResponse.message = "Veuillez renseigner un code valide";
        return res.status(404).json(defaultResponse);
    }
    if (req.user && req.user._id) {
        foundUser = await tbl_User.findOne(
            {
                $and: [{ _id: req.user._id },
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
            {
                $and: [{ _id: req.user._id },
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
export const addPhoneNumber = catchAsync(async (req, res, next) => {
    const { phone } = req.body;
    const userId = req.query.id_user;
    const user = await tbl_User.findOneAndUpdate(
        { $or: [{ _id: req.user._id }, { _id: userId }] }
    ).select("+phoneCode");
    if (!user) {
        const respo = { statusCode: 401, success: false, data: [], message: "Veuillez réessayer ultérieurement !" };
        return res.status(401).json(respo);
    }
    user.phone = phone;
    user.generateCodeAndDateTime("phoneCode", "phoneCodeExpiresAt");
    await user.save({ new: true, runValidators: true });
    // send sms whatsapp asynchronously
    const format = CodeSMS(user.phone, user.phoneCode, "VERIFICATION");
    sendWhatsAppMessage(format).then(senderSMS => {
        console.log(senderSMS);
    });
    const response = {
        statusCode: 200,
        success: true,
        data: user._id,
        message: "Code envoyé sur votre numéro Whatsapp."
    };
    return res.status(200).json(response);

})
// ----------------------------------------------------------------------------
export const addEmail = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const userId = req.query.id_user;
    const user = await tbl_User.findOneAndUpdate(
        { $or: [{ _id: req.user._id }, { _id: userId }] }
    ).select("+emailCode");
    if (!user) {
        const respo = { statusCode: 401, success: false, data: [], message: "Veuillez réessayer ultérieurement !" };
        return res.status(401).json(respo);
    }
    user.email = email;
    user.generateCodeAndDateTime("emailCode", "emailCodeExpiresAt");
    await user.save({ new: true, runValidators: true });
    const response = { statusCode: 200, success: true, data: user._id, message: "Code envoyé sur votre courriel." };

    // send email asynchronously
    const format = emailTypes.emailChangeReset;
    format.code = user.emailCode;
    sender(user.email, format).then(() => {
        res.status(200).json(response);
    });
})
