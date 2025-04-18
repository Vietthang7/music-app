import express from "express";
import multer from "multer";
const router = express.Router();

import * as controller from "../../controllers/admin/singer.controller";
import * as uploadCloud from "../../middleware/admin/uploadCloud.middleware";
import { createSinger } from "../../validates/admin/singer.validate";
const upload = multer();
router.get("/", controller.index);
router.get("/create", controller.create);
router.post("/create",
  upload.single('avatar'),
  uploadCloud.uploadSingle,
  createSinger,
  controller.createPost);
router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single('avatar'),
  uploadCloud.uploadSingle,
  createSinger,
  controller.editPatch
);
router.get("/detail/:id", controller.detail);
router.patch("/delete/:id", controller.deleteSinger);
router.patch("/change-status/:statusChange/:id", controller.changeStatus);
export const singerRoute = router;