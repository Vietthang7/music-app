import { Request, response, Response } from "express";
import Topic from "../../models/topic.model";
import { systemConfig } from "../../config/system";
//[GET]/admin/topics
export const index = async (req: Request, res: Response) => {
  const topics = await Topic.find({
    deleted: false
  });
  res.render("admin/pages/topics/index", {
    pageTitle: "Quản lí chủ đề",
    topics: topics
  });
};
// [GET] /admin/topics/create
export const create = async (req: Request, res: Response) => {
  res.render("admin/pages/topics/create", {
    pageTitle: "Thêm mới chủ đề",
  });
}
// [POST] /admin/topics/create
export const createPost = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("topics_create")) {
    req.body.createdBy = res.locals.account.id;
    const newTopic = new Topic(req.body);
    await newTopic.save();
    req.flash("success", "Tạo mới chủ đề thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/topics`);
  } else {
    res.send("403");
  }
}
// [GET] /admin/topics/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const topic = await Topic.findOne({
      _id: id,
      deleted: false
    });
    if (topic) {
      res.render("admin/pages/topics/edit", {
        pageTitle: "Chỉnh sửa chủ đề",
        topic: topic,
      });
    } else {
      res.redirect(`/${systemConfig.prefixAdmin}/topics`);
    }
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/topics`);
  }
}
// [PATCH] /admin/topics/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("topics_edit")) {
    try {
      const id = req.params.id;
      req.body.updatedBy = res.locals.account.id;
      await Topic.updateOne({
        _id: id,
        deleted: false
      }, req.body);
      req.flash("success", "Cập nhật chủ đề thành công!");

    } catch (error) {
      req.flash("error", "Id ca sĩ không hợp lệ !");
    }
    res.redirect("back");
  } else {
    res.send(`403`);
  }
}
// [GET] /admin/topics/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const topic = await Topic.findOne({
      _id: id,
      deleted: false
    });
    if (topic) {
      res.render("admin/pages/topics/detail", {
        pageTitle: "Chi tiết chủ đề",
        topic: topic
      });
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/topics`);
    }
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/topics`);
  }
}
//[PATCH]/admin/topics/delete/:id
export const deleteTopic = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("topics_delete")) {
    try {
      const id = req.params.id;
      await Topic.deleteOne({
        _id: id
      });
      req.flash('success', 'Đã xóa!');
      res.json({
        code: 200
      })
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/topics`);
    }
  } else {
    res.send(`403`);
  }
}
// [PATCH] /admin/topics/change-status/:statusChange/:id
export const changeStatus = async (req:Request, res:Response) => {
  if (res.locals.role.permissions.includes("topics_edit")) {
    try {
      const {
        id,
        statusChange
      } = req.params;
      await Topic.updateOne({
        _id: id

      }, {
        status: statusChange
      });
      req.flash('success', 'Cập nhật trạng thái thành công!');

      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/topics`);
    }
  }
  else {
    res.send(`403`);
  }
}