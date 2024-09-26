"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routesClient = void 0;
const topic_route_1 = require("./topic.route");
const song_route_1 = require("./song.route");
const user_route_1 = require("./user.route");
const home_route_1 = require("./home.route");
const routesClient = (app) => {
    app.use("/", home_route_1.homeRoute);
    app.use("/topics", topic_route_1.topicRoute);
    app.use("/songs", song_route_1.songRoute);
    app.use("/user", user_route_1.userRoute);
};
exports.routesClient = routesClient;
