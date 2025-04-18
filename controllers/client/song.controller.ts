import { Request, Response } from "express";
import unidecode from "unidecode";
import Topic from "../../models/topic.model";
import Song from "../../models/song.model";
import Singer from "../../models/singer.model";
import FavoriteSong from "../../models/favorite-song.model";
import LikeSong from "../../models/like.model";
import moment from "moment";
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
  });


  for (const item of songs) {
    const singerInfo = await Singer.findOne({
      _id: item.singerId
    }).select("fullName");
    if (singerInfo) {
      item["singerFullName"] = singerInfo["fullName"];
    } else {
      item["singerFullName"] = "Chưa có thông tin";
    }
    if (item["createdAt"]) {
      const formattedDate = moment(item["createdAt"]).format("DD/MM/YY HH:mm:ss");
      // Bạn có thể tạo một thuộc tính mới để lưu trữ ngày đã được định dạng  
      item["formattedCreatedAt"] = formattedDate; // Lưu ngày đã định dạng vào một thuộc tính mới  
    }
  }
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
  if (song["createdAt"]) {
    const formattedDate = moment(song["createdAt"]).format("DD/MM/YY HH:mm:ss");
    // Bạn có thể tạo một thuộc tính mới để lưu trữ ngày đã được định dạng  
    song["formattedCreatedAt"] = formattedDate; // Lưu ngày đã định dạng vào một thuộc tính mới  
  }
  const singer = await Singer.findOne({
    _id: song.singerId
  }).select("fullName")

  const topic = await Topic.findOne({
    _id: song.topicId
  }).select("title");
  const tokenUser = req.cookies.tokenUser;
  if (tokenUser && res.locals.user && res.locals.user.id) {
    const existSongInFavorite = await FavoriteSong.findOne({
      userId: res.locals.user.id,
      songId: song.id
    });

    if (existSongInFavorite) {
      song["isFavorite"] = true;
    } else {
      song["isFavorite"] = false;
    }
    const existSongInLike = await LikeSong.findOne({
      userId: res.locals.user.id,
      songId: song.id
    });

    if (existSongInLike) {
      song["isLike"] = true;
    } else {
      song["isLike"] = false;
    }
  }
  res.render("client/pages/songs/detail", {
    pageTitle: "Chi tiết bài hát",
    song: song,
    singer: singer,
    topic: topic
  });
}
// [PATCH] /songs/like
export const like = async (req: Request, res: Response) => {
  const tokenUser = req.cookies.tokenUser;
  if (tokenUser && res.locals.user && res.locals.user.id) {
    try {
      const { id, type } = req.body;
      const song = await Song.findOne({
        _id: id,
        status: "active",
        deleted: false
      });
      const data = {
        userId: res.locals.user.id,
        songId: id
      };
      let status = "";
      const songLike = await LikeSong.findOne(data);
      if (!songLike && type == "like") {
        const record = new LikeSong(data);
        await record.save();
        status = "add";
      } else if (songLike && type == "dislike") {
        await LikeSong.deleteOne(data);
      }
      let updateLike = song.like;
      if (type == "like") {
        updateLike = updateLike + 1;
      } else if (type == "dislike") {
        updateLike = updateLike - 1;
      }
      await Song.updateOne({
        _id: id,
        status: "active",
        deleted: false
      }, {
        like: updateLike
      });
      res.json({
        code: 200,
        updateLike: updateLike,
        message: " Cập nhật thành công!",
        status: status
      });
    } catch (error) {
      res.redirect("/");
    }
  } else {
    return res.status(401).json({
      code: 401,
      message: "Vui lòng đăng nhập"
    });
  }

};
// [PATCH] /songs/favoritePatch
export const favoritePatch = async (req: Request, res: Response) => {
  const tokenUser = req.cookies.tokenUser;
  if (tokenUser && res.locals.user && res.locals.user.id) {
    try {
      const { id } = req.body;
      const data = {
        userId: res.locals.user.id,
        songId: id
      }
      const existSongInFavorite = await FavoriteSong.findOne(data);
      let status = "";
      if (existSongInFavorite) {
        await FavoriteSong.deleteOne(data);
      } else {
        const record = new FavoriteSong(data);
        await record.save();
        status = "add";
      }
      res.json({
        code: 200,
        status: status
      });
    } catch (error) {
      res.redirect("/");
    }
  } else {
    return res.status(401).json({
      code: 401,
      message: "Vui lòng đăng nhập"
    });
  }
};
// [GET] /songs/favorite
export const favorite = async (req: Request, res: Response) => {
  const tokenUser = req.cookies.tokenUser;
  if (tokenUser && res.locals.user && res.locals.user.id) {
    const songs = await FavoriteSong.find({
      userId: res.locals.user.id
    });
    for (const song of songs) {
      const infoSong = await Song.findOne({
        _id: song.songId
      }).select("title avatar singerId slug");
      const infoSinger = await Singer.findOne({
        _id: infoSong.singerId
      }).select("fullName");
      song["infoSong"] = infoSong;
      song["infoSinger"] = infoSinger;
    }
    res.render("client/pages/songs/favorite", {
      pageTitle: "Bài hát yêu thích",
      songs: songs
    });
  } else {
    req.flash("error", "Bạn chưa đăng nhập");
    res.redirect("back");
  }

};
// [GET] /songs/search/:type
export const search = async (req: Request, res: Response) => {
  const type = req.params.type;
  // console.log(type);
  const keyword = `${req.query.keyword}`;
  // Khi muốn res.json({}) ra ngoài 1 object và thêm vài trường vào object thì sẽ không json ra cho FE được , bạn cần
  // phải tạo ra 1 object mới và add những trường dữ liệu cần thiết vào object đó
  let songsFinal = [];
  if (keyword) {
    let keywordSlug = keyword.trim();
    keywordSlug = keywordSlug.replace(/\s/g, "-");
    // Thay thế tất cả các khoảng trắng bằng dấu gạch ngang. 
    keywordSlug = keywordSlug.replace(/\-+/g, "-");
    // Loại bỏ các dấu gạch ngang liên tiếp.
    keywordSlug = unidecode(keywordSlug);
    // Chuẩn hóa các ký tự đặc biệt thành dạng ASCII.
    // console.log(keyword);
    // console.log(keywordSlug);
    const regexKeyword = new RegExp(keyword, "i");
    const regexKeywordSlug = new RegExp(keywordSlug, "i");
    const songs = await Song.find({
      $or: [
        {
          title: regexKeyword
        },
        {
          slug: regexKeywordSlug
        }
      ],
      status: "active",
      deleted: false
    }).select("title avatar singerId like slug");
    for (const item of songs) {
      const singerInfo = await Singer.findOne({
        _id: item.singerId
      }).select("fullName");
      const itemFinal = {
        title: item.title,
        avatar: item.avatar,
        singerId: item.singerId,
        like: item.like,
        slug: item.slug,
        singerFullName: singerInfo["fullName"],
      };
      songsFinal.push(itemFinal);
    }
  }
  if (type == "result") {
    res.render("client/pages/songs/list", {
      pageTitle: "Kết quả tìm kiếm: " + keyword,
      keyword: keyword,
      songs: songsFinal
    });
  } else if (type == "suggest") {
    res.json({
      code: 200,
      songs: songsFinal
    })
  } else {
    res.json({
      code: 400
    })
  };
};

// [GET] /songs/listen/:id
export const listen = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const song = await Song.findOne({
      _id: id,
      status: "active",
      deleted: false
    });
    const updateListen = song.listen + 1;
    await Song.updateOne({
      _id: id,
      status: "active",
      deleted: false
    }, {
      listen: updateListen,
    });
    res.json({
      code: 200,
      listen: updateListen
    });
  } catch (error) {
    res.redirect("/topics");
  }
};
