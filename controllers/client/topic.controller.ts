import { Response, Request } from "express";
import Topic from "../../models/topic.model";
// [GET] /topics
export const index = async (req: Request, res: Response) => {
  const topics = await Topic.find({
    deleted: false
  });
  console.log(topics);
  res.render("client/pages/topics/index", {
    pageTitle : "Danh sách chủ đề",
    topics : topics
  });
};