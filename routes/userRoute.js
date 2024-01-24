import * as userController from "../controllers/userControllers.js";
import * as userSecure from "../controllers/userSecure.js";
import dispatchImage from "../middleware/images/uploadDispatch.js";
import uploadImage from "../middleware/images/uploadImage.js";
import protect from "../middleware/secure/protect.js";
import refresh from "../middleware/secure/refresh.js";

import express from "express";

const router = express.Router();

// CONTROLLERS
router.post("/signup", userController.createUser);
router.post("/login", userController.login);
router.patch("/update", protect, userController.updateUser);
router.get("/find", protect, userController.findUser);
router.delete("/delete", protect, userController.deleteUser);
// VERIFY EMAIL OR PHONE ACCOUNT
router.get("/verify/email/account", userSecure.checkEmailCode);
router.get("/verify/phone/account", userSecure.checkPhoneCode);
// VERIFY CODE SENT TO EMAIL OR PHONE
router.get("/verify/code/email", userSecure.checkEmailCode);
router.get("/verify/code/phone", userSecure.checkPhoneCode);
// SECURE
router.patch("/add/phonenumber", protect, userSecure.addPhoneNumber);
router.patch("/add/email", protect, userSecure.addEmail);
router.get("/forget/pwd", userSecure.forgetPwd);
router.patch("/reset/pwd", userSecure.resetPwd);
router.get("/refresh", refresh);
// UPLOAD IMAGE
router.post("/upload/image", [protect, uploadImage], dispatchImage);

export default router;