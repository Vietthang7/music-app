import express from "express";
import multer from "multer";
const router = express.Router();
import { Register } from "../../validates/client/user.validate";
import { editPatch } from "../../validates/client/user.validate";
import * as controller from "../../controllers/admin/users.controller";
import * as uploadCloud from "../../middleware/admin/uploadCloud.middleware";
const upload = multer();
router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single('avatar'),
  uploadCloud.uploadSingle,
  Register,
  controller.createPost
);
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single('avatar'),
  uploadCloud.uploadSingle,
  editPatch,
  controller.editPatch
);
router.get("/detail/:id",controller.detail);
router.patch("/delete/:id", controller.deleteItem);
router.patch("/change-status/:statusChange/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
export const usersRoute = router;