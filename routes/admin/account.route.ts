import express from "express";
import multer from "multer";
const router = express.Router();
import { createPostAccount } from "../../validates/admin/account.validate";

import * as controller from "../../controllers/admin/account.controller";
import * as uploadCloud from "../../middleware/admin/uploadCloud.middleware";
const upload = multer();
router.get("/", controller.index);
router.get("/create", controller.create);
router.post(
  "/create",
  upload.single('avatar'),
  uploadCloud.uploadSingle,
  createPostAccount,
  controller.createPost
);
// router.get("/edit/:id",controller.edit);
// router.patch(
//   "/edit/:id",
//   upload.single('avatar'),
//   uploadCloud.uploadSingle,
//   validate.editPatchAccount,
//   controller.editPatch
// );
// router.get("/detail/:id",controller.detail);
// router.patch("/delete/:id",controller.deleteItem);
// router.patch("/change-status/:statusChange/:id", controller.changeStatus);
// router.patch("/change-multi", controller.changeMulti);
// router.get("/trash",controller.trash);
// router.get("/trash/detail/:id",controller.detailTrash);
// router.delete("/trash/deletePermanently/:id",controller.deletePermanently);
// router.patch("/trash/restore/:id", controller.restore);
// router.patch("/trash/change-multi", controller.changeMultiRestore);
export const accountRoute = router;
