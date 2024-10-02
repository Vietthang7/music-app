import { Express } from "express";
import { systemConfig } from "../../config/system";
import { dashboardRoute } from "./dashboard.route";
import { topicRoute } from "./topic.route";
import { songRoute } from "./song.route";
import { uploadRoute } from "./upload.route";
import { singerRoute } from "./singer.route";
import { accountRoute } from "./account.route";
import { requireAuth } from "../../middleware/admin/auth.middleware";
import { roleRoute } from "./role.route";
import { authRoute } from "./auth.route";

export const routesAdmin = (app: Express) => {
  const PATH = `/${systemConfig.prefixAdmin}`;

  app.use(`${PATH}/dashboard`,
    requireAuth,
    dashboardRoute);
  app.use(`${PATH}/topics`,
    requireAuth,
    topicRoute);
  app.use(`${PATH}/songs`,
    requireAuth,
    songRoute);
  app.use(`${PATH}/singers`,
    requireAuth,
    singerRoute);
  app.use(`${PATH}/accounts`,
    requireAuth,
    accountRoute);
  app.use(`${PATH}/upload`,
    requireAuth,
    uploadRoute);
  app.use(`${PATH}/roles`,
    requireAuth,
    roleRoute);
  app.use(`${PATH}/auth`,
    authRoute);
}