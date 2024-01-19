import catchAsync from "../../helpers/err/catchAsync.js";
import { tbl_Restaurent } from "../../models/restaurent/restoModel.js";
import { tbl_User } from "../../models/user/userModel.js";
import response from "../../helpers/response/responseMessage.js";
const findUserMiddleware = (roles) => catchAsync(async (req, res, next) => {
    const allRoles = {
        ADMIN: "ADMIN",
        USER: "USER",
        ANONYMOUS: "ANONYMOUS"
    };
    const validRoles = roles.filter(role => Object.values(allRoles).includes(role));
    if (validRoles.length === 0) {
        let respo = response(400, false, [], "Veuillez renseigner le role");
        return res.status(400).json(respo);
    }
    const user = await tbl_User.findOne({ _id: req.user._id }).select("role");
    if (!user) {
        let respo = response(404, false, [], "Verifier vos informations d'authentification");
        return res.status(404).json(respo);
    }
    if (!validRoles.includes(user.role)) {
        let respo = response(401, false, [], "Veuillez vous connecter ou recommencer ultèrement");
        return res.status(401).json(respo);
    }
    if (user.role === "ADMIN") {
        const restaurent = await tbl_Restaurent.findOne({ user: user._id }).select("_id");
        if (!restaurent) {
            let respo = response(401, false, [], "Vous n'etes pas autorisé à éffectuer cette operation !!");
            return res.status(401).json(respo);
        }
        req.userRole = user.role;
        req.id_restaurent = restaurent._id;
        return next();
    }
    req.userRole = user.role;
    return next();
});

export default findUserMiddleware;
