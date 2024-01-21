import {tbl_User} from "../models/UserModel.js";
import catchAsync from "../middleware/catch/catchAsync.js";


// ---------------------------------------------------------------
export const createUser = catchAsync(async (req, res, next) => {
    const {fullname, username, email, password, firebaseToken, address, location} = req.body
    const user = await tbl_User.create({ fullname, username, email, password, firebaseToken, address, location});


});
