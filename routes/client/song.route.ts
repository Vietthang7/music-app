import express from "express";
const router = express.Router();
import * as controller from "../../controllers/client/song.controller";


router.get("/topic/:slugTopic", controller.list);
router.get("/detail/:slugSong", controller.detail);
router.patch("/like", controller.like);
router.patch("/favorite", controller.favoritePatch);
router.get("/favorite", controller.favorite);
router.get("/search/:type", controller.search);
export const songRoute = router;
