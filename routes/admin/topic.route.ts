import express from "express";
const router = express.Router();
import multer from "multer";
const upload = multer();
import * as uploadCloud from "../../middleware/admin/uploadCloud.middleware";
import * as controller from "../../controllers/admin/topic.controller";
import { createTopic } from "../../validates/admin/topic.validate";
router.get("/", controller.index);


router.get("/create", controller.create);
router.post("/create",
  upload.single('avatar'),
  uploadCloud.uploadSingle,
  createTopic,
  controller.createPost);
  router.get("/edit/:id", controller.edit);
router.patch(
  "/edit/:id",
  upload.single('avatar'),
  uploadCloud.uploadSingle,
  createTopic,
  controller.editPatch
);
router.get("/detail/:id", controller.detail);
router.patch("/delete/:id", controller.deleteTopic);
router.patch("/change-status/:statusChange/:id", controller.changeStatus);

export const topicRoute = router;