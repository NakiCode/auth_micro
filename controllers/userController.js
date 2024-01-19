import { tbl_User } from "../models/userModel.js";
import catchAsync from "../helpers/catch/catchAsync.js";
import checkPasswordStrength from "../helpers/keys/pwd.js";
import sender from "../helpers/mail/sender.js";
import * as typeEmail from "../helpers/mail/emailTypes.js";
import * as token from "../helpers/jwt/token.js";
import attachCookies from "../helpers/jwt/cookies.js";
import *  as isPhoneorEmail from "../helpers/keys/verify.js";

// ####################### CREATE USER 
export const createUser = catchAsync(async (req, res, next) => {
    const { fullname, username, email, phone, address, firebaseToken, password, confirmpassword } = req.body
    let isMatch = checkPasswordStrength(password, confirmpassword)
    if (!isMatch.success) {
        return res.status(isMatch.statusCode).json({
            success: false,
            statusCode: isMatch.statusCode,
            data: [],
            message: isMatch.message
        })
    }
    const user = await tbl_User.create({ fullname, username, email, phone, address, password, firebaseToken })
    res.status(201).json({
        success: true,
        statusCode: 201,
        data: user?._id,
        message: "User created successfully",
    })
    // send email
    let format = typeEmail.createUserAccount
    format.code = user.code
    await sender(user.email, format)
    // send sms
})
// ########################################################################
export const verifyUser = catchAsync(async (req, res, next) => {
    const { code } = req.query;
    const user = await tbl_User.findOne({ code: code }).select(
        "+codeExpiresAt +tokenId +code"
    );
    if (!user) {
        return res.status(404).json({
            success: false,
            statusCode: 404,
            data: [],
            message: "User not found",
        });
    }
    if (user.isExpires(new Date(), user.codeExpiresAt)) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            data: [],
            message: "Code expired",
        });
    }
    user.codeExpiresAt = null;

    if (req.path === "/verifyEmail") {
        user.isEmail = true;
    } else if (req.path === "/verifyPhone") {
        user.isPhone = true;
    }
    user.code = null;
    user.save({ new: true, runValidators: true });

    let tokenData = token.attachTokenToUser(user);
    attachCookies(tokenData.access, tokenData.refresh, res);

    res.status(200).json({
        success: true,
        statusCode: 200,
        data: user,
        ...tokenData,
        message: "User verified successfully",
    });
});

export const verifyCode = catchAsync(async (req, res, next) => {
    const { code } = req.query;
    const user = await tbl_User.findOne({ code: code });
    if (!user) {
        return res.status(404).json({
            success: false,
            statusCode: 404,
            data: [],
            message: "User not found",
        });
    }
    if (user.isExpires(new Date(), user.codeExpiresAt)) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            data: [],
            message: "Code expired",
        });
    }
    user.codeExpiresAt = null;
    user.code = null;
    user.save({ new: true, runValidators: true });

    res.status(200).json({
        success: true,
        statusCode: 200,
        data: user._id,
        message: "User verified successfully",
    });
});

export const sendCodeToPhone = catchAsync(async (req, res, next) => {
    const findUser = await tbl_User.findOne({ _id: req.ures._id });
    if (!findUser) {
        return res.status(404).json({
            success: false,
            statusCode: 404,
            data: [],
            message: "User not found",
        })
    }
    const code = Math.floor(100000 + Math.random() * 900000);
    findUser.code = code;
    findUser.codeExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
    findUser.save({ new: true, runValidators: true });
    // send sms

    return res.status(200).json({
        success: true,
        statusCode: 200,
        data: user._id,
        message: "Code sent successfully to your phone number",
    })

});

// #################### LOGIN #############################################
export const login = catchAsync(async (req, res, next) => {
    const { email, username, phone, password } = req.body
    const user = await tbl_User.findOne({ $or: [{ email }, { username }, { phone }] });
    if (!user) {
        return res.status(404).json({
            success: false,
            statusCode: 404,
            data: [],
            message: "User not found",
        });
    }
    if (!user.isEmail) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            data: [],
            message: "Please verify your email first",
        });
    }
    if (!user.isPhone) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            data: [],
            message: "Please verify your phone first",
        });
    }
    if (!await user.checkMatchPassword(password)) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            data: [],
            message: "Incorrect password",
        });
    }

    let tokenData = token.attachTokenToUser(user);
    attachCookies(tokenData.access, tokenData.refresh, res);

    return res.status(200).json({
        success: true,
        statusCode: 200,
        data: user,
        ...tokenData,
        message: "User logged in successfully",
    });
})
// ############### UPDATE USER ############################################
export const updateUser = catchAsync(async (req, res, next) => {
    const user = await tbl_User.findByIdAndUpdate(req.user._id, req.body, 
        {new: true, runValidators: true, upsert: true});
    if (!user) {
        return res.status(404).json({
            success: false,
            statusCode: 404,
            data: [],
            message: "User not found",
        });
    }
    res.status(200).json({
        success: true,
        statusCode: 200,
        data: user,
        message: "User updated successfully",
    });
})
// ############### DELETE USER ############################################
export const deleteUser = catchAsync(async (req, res, next) => {
    const user = await tbl_User.findByIdAndDelete(req.user._id);
    if (!user) {
        return res.status(404).json({
            success: false,
            statusCode: 404,
            data: [],
            message: "User not found",
        });
    }
    res.status(200).json({
        success: true,
        statusCode: 200,
        data: user,
        message: "User deleted successfully",
    });
})
// ############### GET USER ############################################
export const getUser = catchAsync(async (req, res, next) => {
    const user = await tbl_User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({
            success: false,
            statusCode: 404,
            data: [],
            message: "User not found",
        });
    }
    res.status(200).json({
        success: true,
        statusCode: 200,
        data: user,
        message: "User fetched successfully",
    });
})
// ############### GET ALL USER ############################################
export const getAllUser = catchAsync(async (req, res, next) => {
    const user = await tbl_User.find();
    if (!user) {
        return res.status(404).json({
            success: false,
            statusCode: 404,
            data: [],
            message: "User not found",
        });
    }
    res.status(200).json({
        success: true,
        statusCode: 200,
        data: user,
        message: "User fetched successfully",
    });
})

// ############### FORGET PASSWORD ############################################
export const forgetPassword = catchAsync(async (req, res, next) => {
    const { email, phone } = req.body;
    if (!email || !phone) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            data: [],
            message: "Please provide email or phone",
        });
    }
    const element = email ? email : phone
    const user = await tbl_User.findOne({ $or: [{ email: element }, { phone: element }] });
    if (!user) {
        return res.status(404).json({
            success: false,
            statusCode: 404,
            data: [],
            message: "User not found",
        });
    }
    if (isPhoneorEmail.isEmailAdress(element)) {
        if (!user.isEmail) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                data: [],
                message: "Please verify your email first",
            });
        }
        const code = Math.floor(100000 + Math.random() * 900000);
        user.code = code;
        user.codeExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
        user.save({ new: true, runValidators: true });
        const format = typeEmail.emailCheckResetPassword
        format.code = code
        res.status(200).json({
            success: true,
            statusCode: 200,
            data: [],
            message: "Code sent successfully to your email address",
        });
        await sender(user.email, format)
    }
    if (isPhoneorEmail.isPhoneNumber(element)) {
        if (!user.isPhone) {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                data: [],
                message: "Please verify your phone first",
            });
        }
        const code = Math.floor(100000 + Math.random() * 900000);
        user.code = code;
        user.codeExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
        user.save({ new: true, runValidators: true });
        let codeToSend = user.code
        // send sms
        res.status(200).json({
            success: true,
            statusCode: 200,
            data: [],
            message: "Code sent successfully to your phone number",
        });
    }
    return res.status(400).json({
        success: false,
        statusCode: 400,
        data: [],
        message: "Please try again later."
    });
})

// ############### CHANGE EMAIL ############################################
export const changeEmail = catchAsync(async (req, res, next) => {
    const { email } = req.body;
    const user = await tbl_User.findOneAndUpdate({ _id: req.user._id }, { email }, { new: true, runValidators: true });
    if (!user) {
        return res.status(404).json({
            success: false,
            statusCode: 404,
            data: [],
            message: "User not found",
        });
    }
    if (!isPhoneorEmail.isEmailAdress(email)) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            data: [],
            message: "Please verify your email first",
        });
    }
    user.isEmail = false;
    user.code = Math.floor(100000 + Math.random() * 900000);
    user.codeExpiresAt = new Date(Date.now() + 30 * 60 * 1000);
    user.save({ new: true, runValidators: true });
    // ############ send email #################
    let format = typeEmail.emailChangeReset
    format.code = user.code
    res.status(200).json({
        success: true,
        statusCode: 200,
        data: user,
        message: "User updated successfully",
    });
    await sender(user.email, format)

})

// ############### CHANGE PASSWORD ############################################
export const changePassword = catchAsync(async (req, res, next) => {
    const { password, confirmpassword, id } = req.body;
    let isMatch = checkPasswordStrength(password, confirmpassword)
    if (!isMatch.success) {
        return res.status(isMatch.statusCode).json({
            success: false,
            statusCode: isMatch.statusCode,
            message: isMatch.message
        })
    }
    const user = await tbl_User.findOneAndUpdate({ _id: id }, { password },
        { new: true, runValidators: true });
    if (!user) {
        return res.status(404).json({
            success: false,
            statusCode: 404,
            data: [],
            message: "User not found",
        });
    }
    let tokenData = token.attachTokenToUser(user);
    attachCookies(tokenData.access, tokenData.refresh, res);

    return res.status(200).json({
        success: true,
        statusCode: 200,
        data: user,
        ...tokenData,
        message: "Password reset successfully"
    });
})