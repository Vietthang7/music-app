import { Express } from "express";
import { topicRoute } from "./topic.route";
import { songRoute } from "./song.route";
import { userRoute } from "./user.route";
import { homeRoute } from "./home.route";
import { infoUser } from "../../middleware/client/user.middleware";
import { setting } from "../../middleware/client/setting.middleware";

export const routesClient = (app: Express) => {
  app.use(infoUser);
  app.use(setting);
  app.use("/", homeRoute);
  app.use("/topics", topicRoute);
  app.use("/songs", songRoute);
  app.use("/user", userRoute);
}