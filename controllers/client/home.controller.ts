import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
export const index = async (req: Request, res: Response) => {
  const listSongs = await Song.find({
    deleted: false,
    status: "active"
  })
    .select("title avatar singerId topicId listen like")
    .limit(30);
  const sortedSongs = listSongs.sort((a, b) => b.listen - a.listen);
  for (const song of sortedSongs) {
    const singerInfo = await Singer.findOne({
      _id: song.singerId
    });
    song["singerFullName"] = singerInfo["fullName"];
  }
  res.render("client/pages/home/index", {
    pageTitle: "Top BXH",
    songs: sortedSongs
  });
}
