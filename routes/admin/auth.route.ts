import express from "express";
const router = express.Router();

import * as controller from "../../controllers/admin/auth.controller";
// const accountMiddleware = require("../../middlewares/admin/auth.middleware.js");
// const validatePassword = require("../../validates/admin/password.validate");
router.get("/login",controller.login);
router.post("/login", controller.loginPost);
router.get("/logout",controller.logOut);
// router.get("/password/forgot",controller.forgotPassword);
// router.post("/password/forgot",controller.forgotPasswordPost);
// router.get("/password/otp", controller.otpPassword);
// router.post("/password/otp", controller.otpPasswordPost);
// router.get("/password/reset",accountMiddleware.requireAuth,controller.resetPassword);
// router.patch("/password/reset", accountMiddleware.requireAuth,validatePassword.valiPassword, controller.resetPasswordPatch);
export const authRoute =  router;
