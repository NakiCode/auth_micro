import { tbl_User } from "../models/userModel.js";
import catchAsync from "../helpers/catch/catchAsync.js";
import checkPasswordStrength from "../helpers/keys/pwd.js";
import sender from "../helpers/mail/sender.js";
import * as typeEmail from "../helpers/mail/emailTypes.js";
import * as token from "../helpers/jwt/token.js";
import attachCookies from "../helpers/jwt/cookies.js";

// ####################### CREATE USER 
export const createUser = catchAsync(async (req, res, next) => {
    const { fullname, username, email, phone, address, firebaseToken, password, confirmpassword } = req.body
    let isMatch = checkPasswordStrength(password, confirmpassword)
    if (!isMatch.success) {
        return res.status(isMatch.statusCode).json({
            success: false,
            statusCode: isMatch.statusCode,
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
    const code = req.query.code;
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
    const code = req.query.code;
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
    user.save({ new: true, runValidators: true });

    res.status(200).json({
        success: true,
        statusCode: 200,
        data: user,
        message: "User verified successfully",
    });
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

    res.status(200).json({
        success: true,
        statusCode: 200,
        data: user,
        ...tokenData,
        message: "User logged in successfully",
    });
})
