import { Request, Response } from "express";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
export const index = async (req: Request, res: Response) => {
  const listSongs = await Song.find({
    deleted: false,
    status: "active"
  })
    .select("title avatar singerId topicId listen like slug")
    .limit(30);
  const sortedSongs = listSongs.sort((a, b) => {
    // So sánh lượt nghe  
    if (b.listen !== a.listen) {
      return b.listen - a.listen; // Sắp xếp theo lượt nghe giảm dần  
    }
    // Nếu lượt nghe bằng nhau, so sánh lượt like  
    return b.like - a.like; // Sắp xếp theo lượt like giảm dần  
  });
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
