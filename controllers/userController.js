import { tbl_User } from "../models/userModel.js";
import catchAsync from "../helpers/catch/catchAsync.js";
import checkPasswordStrength from "../helpers/keys/pwd.js";
import sender  from "../helpers/mail/sender.js";
import * as typeEmail from "../helpers/mail/emailTypes.js"

export const createUser = catchAsync(async (req, res, next) => {
    const {fullname, username, email, phone, address, firebaseToken, password, confirmpassword } = req.body
    let isMatch = checkPasswordStrength(password, confirmpassword)
    if (!isMatch.success) {
        return res.status(isMatch.statusCode).json({
            success: false,
            statusCode: isMatch.statusCode,
            message: isMatch.message
        })
    }
    const user = await tbl_User.create({fullname, username, email, phone, address, password, firebaseToken})
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


    // send push
})