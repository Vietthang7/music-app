import express from "express";
const router = express.Router();

import * as controller from "../../controllers/admin/role.controller";
import { createRole } from "../../validates/admin/role.validate";
router.get("/", controller.index);
router.get("/create", createRole, controller.create);
router.post("/create", controller.createPost);
router.get("/edit/:id", controller.edit);
router.patch("/edit/:id", createRole, controller.editPatch);
router.get("/permissions", controller.permissions);
router.patch("/permissions", controller.permissionsPatch);
router.get("/detail/:id", controller.detail);
router.patch("/delete/:id", controller.deleteItem);
export const roleRoute = router;