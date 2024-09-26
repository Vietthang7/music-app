"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routesAdmin = void 0;
const system_1 = require("../../config/system");
const dashboard_route_1 = require("./dashboard.route");
const topic_route_1 = require("./topic.route");
const song_route_1 = require("./song.route");
const upload_route_1 = require("./upload.route");
const routesAdmin = (app) => {
    const PATH = `/${system_1.systemConfig.prefixAdmin}`;
    app.use(`${PATH}/dashboard`, dashboard_route_1.dashboardRoute);
    app.use(`${PATH}/topics`, topic_route_1.topicRoute);
    app.use(`${PATH}/songs`, song_route_1.songRoute);
    app.use(`${PATH}/upload`, upload_route_1.uploadRoute);
};
exports.routesAdmin = routesAdmin;
