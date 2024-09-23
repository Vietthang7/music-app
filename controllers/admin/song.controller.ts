import { Request, response, Response } from "express";
import Song from "../../models/song.model";
import Topic from "../../models/topic.model";
import Singer from "../../models/singer.model";

//[GET]/admin/songs
export const index = async (req: Request, res: Response) => {
  const songs = await Song.find({
    deleted: false
  });
  res.render("admin/pages/songs/index", {
    pageTitle: "Quản lí bài hát",
    songs: songs
  });
};
//[GET]/admin/songs/create
export const create = async (req: Request, res: Response) => {
  const topics = await Topic.find({
    deleted: false
  }).select("title");
  const singers = await Singer.find({
    deleted: false
  })

  res.render("admin/pages/songs/create", {
    pageTitle: "Thêm mới bài hát",
    topics: topics,
    singers: singers
  });
};
