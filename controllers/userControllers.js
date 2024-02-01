import { tbl_User } from "../models/UserModel.js";
import catchAsync from "../middleware/catch/catchAsync.js";
import * as jwtToken from "../middleware/jwt/token.js";
import * as jwtCookie from "../middleware/jwt/cookies.js";
import { isStrengthPwd } from "../helpers/pwd/hashpwd.js";
import sender from "../outils/mail/sender.js";
import * as emailTypes from "../outils/mail/emailTypes.js";
// --------------------------------------------------------------- OK
export const createUser = catchAsync(async (req, res, next) => {
    const { fullname, username, email, phone, password, confirmpassword, firebaseToken, address, location } = req.body
    const isStrong = isStrengthPwd(password, confirmpassword);
    if (!isStrong.success) {
        return res.status(isStrong.statusCode).json({ statusCode: isStrong.statusCode, success: isStrong.success, data: [], message: isStrong.message });
    }
    const user = await tbl_User.create({ fullname, username, email, phone, password, firebaseToken, address, location });
    res.status(201).json({ statusCode: 201, success: true, data: { _id: user._id }, message: "Compte crée avec succes. Un mail de varification est envoyé sur votre boite mail !" });
    // send email
    let format = emailTypes.createUserAccount
    format.code = user.emailCode
    await sender(user.email, format);
    // send sms Whatsapp

});
// -----------------------------------------------------------------------------------
// LOGIN
export const login = catchAsync(async (req, res, next) => {
    const { email, username, phone, password, } = req.body;
    let user = null
    if (!email && !username && !phone && !password) {
        const respo = { statusCode: 401, success: false, data: [], message: "Veuillez renseigner un email, un nom d'utilisateur ou un numéro de whatsapp et un mot de passe !" };
        return res.status(401).json(respo);
    }
    if (email) {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
        const isValid = emailRegex.test(email);
        if (!isValid) {
            const respo = { statusCode: 401, success: false, data: [], message: "Veuillez renseigner un email valide !" };
            return res.status(401).json(respo);
        }
        user = await tbl_User.findOne({ email: email }).select("+password +tokenId");
    }
    if (username) {
        user = await tbl_User.findOne({ username: username }).select("+password +tokenId");
    }
    if (phone) {
        const isValid = phone.toString().length === 10
        if (!isValid) {
            const respo = { statusCode: 401, success: false, data: [], message: "Veuillez renseigner un numéro de whatsapp valide !" };
            return res.status(401).json(respo);
        }
        user = await tbl_User.findOne({ phone: phone }).select("+password +tokenId");
    }
    if (!user) {
        const respo = { statusCode: 401, success: false, data: [], message: "Vos informations d'authentification sont incorrect !" };
        return res.status(401).json(respo);
    }
    const isMatch = await user.checkMatchPassword(password);
    if (!isMatch) {
        const respo = { statusCode: 401, success: false, data: [], message: "Vos informations d'authentification sont incorrect !" };
        return res.status(401).json(respo);
    }
    if (!user.isEmailVerified && !user.isPhoneVerified) {
        const respo = { statusCode: 200, success: true, data: [], message: "Veuillez verifier votre adresse email ou votre numéro whatsapp avant de vous connecter!" };
        return res.status(200).json(respo);
    }

    const attach = jwtToken.attachTokensToUser(user);
    jwtCookie.attachCookies(attach.access, attach.refresh, res);
    const response = { statusCode: 200, success: true, data: attach, message: "Connexion établie" };
    return res.status(200).json(response);

})
// -----------------------------------------------------------------------------------
// UPDATE USER
export const updateUser = catchAsync(async (req, res, next) => {
    const { fullname, username, address, location } = req.body;

    const user = await tbl_User.findByIdAndUpdate(req.user._id,
        { fullname, username, address, location },
        { new: true, runValidators: true }
    );
    res.status(200).json({
        statusCode: 200,
        success: true,
        data: user,
        message: ""
    })
})
// -----------------------------------------------------------------------------------
// FindUser
export const findUser = catchAsync(async (req, res, next) => {
    const { id_user } = req.query
    const selectFields = "-password -tokenId -emailCode -emailCodeExpiresAt -phoneCode -phoneCodeExpiresAt -isEmailVerified -isPhoneVerified -signature";
    let query = tbl_User.find({});
    if (id_user) {
        query = tbl_User.findById(id_user);
    }
    const user = await query.select(selectFields);

    res.status(200).json({
        statusCode: 200,
        success: true,
        data: user,
        message: "Utilisateur trouvé"
    });
})
// -----------------------------------------------------------------------------------
// delete user 
export const deleteUser = catchAsync(async (req, res, next) => {
    await tbl_User.findByIdAndDelete(req.user._id);

    res.status(200).json({
        statusCode: 200,
        success: true,
        data: [],
        message: "Utilisateur supprimé"
    });
})

// end