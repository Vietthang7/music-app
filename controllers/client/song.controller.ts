import { Request, Response } from "express";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
// [GET] /songs/:slugTopic
export const list = async (req: Request, res: Response) => {
  const slugTopic: string = req.params.slugTopic;
  const topic = await Topic.findOne({
    slug: slugTopic,
    deleted: false,
    status: "active"
  });
  const songs = await Song.find({
    topicId: topic.id,
    deleted: false,
    status: "active"
  }).select("title avatar singerId like slug");


  for (const item of songs) {
    const singerInfo = await Singer.findOne({
      _id: item.singerId
    }).select("fullName");
    item["singerFullName"] = singerInfo["fullName"];
  }
  console.log(songs);
  res.render("client/pages/songs/list", {
    pageTitle: topic.title,
    songs: songs
  });
};
// [GET] /songs/detail/:slugTopic
export const detail = async (req: Request, res: Response) => {
  const slugSong: string = req.params.slugSong;
  const song = await Song.findOne({
    slug: slugSong,
    status: "active",
    deleted: false
  });
  const singer = await Singer.findOne({
    _id: song.singerId
  }).select("fullName")

  const topic = await Topic.findOne({
    _id: song.topicId
  }).select("title");
  res.render("client/pages/songs/detail", {
    pageTitle: "Chi tiết bài hát",
    song: song,
    singer: singer,
    topic: topic
  });
};