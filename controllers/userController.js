import { tbl_User } from "../models/userModel.js";
import catchAsync from "../helpers/catch/catchAsync.js";

export const createUser = catchAsync(async (req, res, next) => {
    const {fullname, username, email, phone, address, password, firebaseToken} = req.body

    const user = await tbl_User.create({fullname, username, email, phone, address, password, firebaseToken})
    
})