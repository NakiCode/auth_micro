import catchAsync from "../../middleware/catch/catchAsync.js";
import { tbl_User } from "../../models/UserModel.js";

const isAuthorizeToAccess = (roles) => catchAsync(async (req, res, next) => {
  const allRoles = {
    ADMIN: "ADMIN",
    USER: "USER",
    ANONYMOUS: "ANONYMOUS"
  };

  const validRoles = roles.filter(role => Object.values(allRoles).includes(role));

  if (validRoles.length === 0) {
    const respo = {
      statusCode: 400,
      success: false,
      data: [],
      message: "Veuillez renseigner le rôle"
    };
    return res.status(400).json(respo);
  }

  const user = await tbl_User.findOne({ _id: req.user._id }).select("role");

  if (!user) {
    const respo = {
      statusCode: 404,
      success: false,
      data: [],
      message: "Veuillez vous connecter ou réessayer ultérieurement"
    };
    return res.status(404).json(respo);
  }

  if (!validRoles.includes(user.role)) {
    const respo = {
      statusCode: 401,
      success: false,
      data: [],
      message: "Vous n'avez pas l'autorisation d'accéder à cette ressource"
    };
    return res.status(401).json(respo);
  }

  req.userRole = user.role;
  return next();
});

export default isAuthorizeToAccess;