import express from "express";
const router = express.Router();
import multer from "multer";
import { Register } from "../../validates/client/user.validate";
import { infoUser } from "../../validates/client/user.validate";
import { requireAuth } from "../../middleware/client/user.middleware";
import * as controller from "../../controllers/client/user.controller";
import { valiPassword } from "../../validates/client/password.validate"
import * as uploadCloud from "../../middleware/admin/uploadCloud.middleware";
const upload = multer();
router.get("/register", controller.register);
router.post("/register", Register, controller.registerPost);
router.get("/login", controller.login);
router.post("/login", controller.loginPost);
router.get("/logout", controller.logout);
router.get("/profile", requireAuth, controller.profile);
router.get("/editprofile", requireAuth, controller.editProfile);
router.patch(
  "/edit",
  upload.single('avatar'),
  uploadCloud.uploadSingle,
  infoUser,
  controller.editPatch
);

router.get("/edit-password", requireAuth, controller.editPassword);
router.post("/edit-password", requireAuth, valiPassword, controller.editPasswordPost);
router.get("/password/reset",requireAuth,controller.resetPassword);
router.patch("/password/reset", requireAuth,valiPassword, controller.resetPasswordPatch);
router.get("/password/forgot", controller.forgotPassword);
router.post("/password/forgot", controller.forgotPasswordPost);
router.get("/password/otp", controller.otpPassword);
router.post("/password/otp", controller.otpPasswordPost);

export const userRoute = router;