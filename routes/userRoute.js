import * as userController from "../controllers/userControllers.js";
import * as userSecure from "../controllers/userSecure.js";

import express from "express";

const router = express.Router();

router.post("/signup", userController.createUser);

router.get("/verify/email/account", userSecure.checkEmailCode);
router.get("/verify/phone/account", userSecure.checkPhoneCode);

router.get("/verify/code/email", userSecure.checkEmailCode);
router.get("/verify/code/phone", userSecure.checkPhoneCode);



export default router;