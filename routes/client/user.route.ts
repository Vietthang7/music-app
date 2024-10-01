import express from "express";
const router = express.Router();
import { Register } from "../../validates/user.validate";
import { requireAuth } from "../../middleware/client/user.middleware";
import * as controller from "../../controllers/client/user.controller";
router.get("/register", controller.register);
router.post("/register", Register, controller.registerPost);
router.get("/login", controller.login);
router.post("/login", controller.loginPost);
router.get("/logout", controller.logout);
router.get("/profile", requireAuth, controller.profile);

export const userRoute = router;