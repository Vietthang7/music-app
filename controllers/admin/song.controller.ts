import { Request, response, Response } from "express";
import Song from "../../models/song.model";
import Topic from "../../models/topic.model";
import Singer from "../../models/singer.model";
import { systemConfig } from "../../config/system";
import moment from "moment";
//[GET]/admin/songs
export const index = async (req: Request, res: Response) => {
  const songs = await Song.find({
    deleted: false
  });
  for (const item of songs) {
    const singerInfo = await Singer.findOne({
      _id: item.singerId,
      deleted: false,
      status: "active"
    }).select("fullName");
    if (singerInfo) {
      item["singerFullName"] = singerInfo["fullName"];
    } else {
      item["singerFullName"] = "Chưa có thông tin";
    }
    const topicInfo = await Topic.findOne({
      _id: item.topicId,
      deleted: false,
      status: "active"
    }).select("title");
    if (topicInfo) {
      item["topic"] = singerInfo["topic"];
    } else {
      item["topic"] = "Chưa có thông tin";
    }
    if (item["createdAt"]) {
      const formattedDate = moment(item["createdAt"]).format("DD/MM/YY HH:mm:ss");
      // Bạn có thể tạo một thuộc tính mới để lưu trữ ngày đã được định dạng  
      item["formattedCreatedAt"] = formattedDate; // Lưu ngày đã định dạng vào một thuộc tính mới  
    }
    if (item["updatedAt"]) {
      const formattedDate = moment(item["updatedAt"]).format("DD/MM/YY HH:mm:ss");
      // Bạn có thể tạo một thuộc tính mới để lưu trữ ngày đã được định dạng  
      item["formattedUpdatedAt"] = formattedDate; // Lưu ngày đã định dạng vào một thuộc tính mới  
    }
  }
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
// [POST] /admin/songs/create
export const createPost = async (req: Request, res: Response) => {
  if (req.body.avatar) {
    req.body.avatar = req.body.avatar[0];
  }
  if (req.body.audio) {
    req.body.audio = req.body.audio[0];
  }
  const song = new Song(req.body);
  await song.save();
  res.redirect(`/${systemConfig.prefixAdmin}/songs`);
};

// [GET] /admin/songs/edit/:id
export const edit = async (req: Request, res: Response) => {
  const id: string = req.params.id;

  const song = await Song.findOne({
    _id: id,
    deleted: false
  })

  const topics = await Topic.find({
    deleted: false
  }).select("title");

  const singers = await Singer.find({
    deleted: false
  }).select("fullName");

  res.render("admin/pages/songs/edit", {
    pageTitle: "Chính sửa bài hát",
    topics: topics,
    singers: singers,
    song: song
  })
}
// [PATCH] /admin/songs/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  const id: string = req.params.id;
  if (req.body.avatar) {
    req.body.avatar = req.body.avatar[0];
  }
  if (req.body.audio) {
    req.body.audio = req.body.audio[0];
  }
  await Song.updateOne({
    _id: id,
    deleted: false
  }, req.body);
  req.flash('success', 'Cập nhật bài hát thành công!');
  res.redirect(`back`);
}
// [GET] /admin/products/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const song = await Song.findOne({
      _id: id,
      deleted: false
    });
    if (song) {
      const topic = await Topic.findOne({
        _id: song.topicId,
        deleted: false
      }).select("title")
      res.render("admin/pages/songs/detail", {
        pageTitle: "Chi tiết bài hát",
        song: song,
        topic: topic
      });
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/songs`);
    }
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/songs`);
  }
}
//[PATCH]/admin/songs/delete/:id
export const deleteSong = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("songs_delete")) {
    try {
      const id = req.params.id;
      await Song.deleteOne({
        _id: id
      });
      req.flash('success', 'Đã xóa!');
      res.json({
        code: 200
      })
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/songs`);
    }
  } else {
    res.send(`403`);
  }
}
// [PATCH] /admin/songs/change-status/:statusChange/:id
export const changeStatus = async (req:Request, res:Response) => {
  if (res.locals.role.permissions.includes("songs_edit")) {
    try {
      const {
        id,
        statusChange
      } = req.params;
      await Song.updateOne({
        _id: id

      }, {
        status: statusChange
      });
      req.flash('success', 'Cập nhật trạng thái thành công!');

      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/songs`);
    }
  }
  else {
    res.send(`403`);
  }
}