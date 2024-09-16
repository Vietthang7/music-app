import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
dotenv.config();
import { connectDatabase } from "./config/database";
connectDatabase();
import Topic from "./models/topic.model";

const app: Express = express();
const port: number | string = process.env.PORT || 3000;

app.set("views", `${__dirname}/views`);
app.set("view engine", "pug");
app.get("/topics", async (req: Request, res: Response) => {
  const topics = await Topic.find({
    deleted: false
  });
  console.log(topics);
  res.render("client/pages/topics/index");
});
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
})