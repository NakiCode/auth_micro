import {tbl_User} from "../models/UserModel.js";
import catchAsync from "../middleware/catch/catchAsync.js";
import {isStrengthPwd} from "../helpers/pwd/hashpwd.js";
import sender from "../outils/mail/sender.js";
import * as emailTypes from "../outils/mail/emailTypes.js";

// ---------------------------------------------------------------
export const createUser = catchAsync(async (req, res, next) => {
    const {fullname, username, email, password, confirmpassword, firebaseToken, address, location} = req.body
    const isStrong = isStrengthPwd(password, confirmpassword);
    if (!isStrong.success) {
        return res.status(isStrong.statusCode).json({
            statusCode: isStrong.statusCode,
            success: isStrong.success,
            data: [],
            message: isStrong.message
        });
    }
    const user = await tbl_User.create({ 
        fullname, username, email, 
        password, 
        firebaseToken, address, location
    });
    res.status(201).json({
        statusCode: 201,
        success: true,
        data: user._id,
        message: "Compte crée avec succes. Un mail de varification est envoyé sur votre boite mail !"
    });
    // send email
    let format = emailTypes.createUserAccount
    format.code = user.emailCode
    await sender(user.email, format);
    
});
// -----------------------------------------------------------------------------------
// 