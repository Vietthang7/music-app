import { Request, Response } from "express";
import Singer from "../../models/singer.model";
import { systemConfig } from "../../config/system";
//[GET]/admin/singers
export const index = async (req: Request, res: Response) => {
  const singers = await Singer.find({
    deleted: false
  });
  res.render("admin/pages/singers/index", {
    pageTitle: "Quản lí ca sĩ",
    singers: singers
  });
};
// [GET] /admin/singers/create
export const create = async (req: Request, res: Response) => {
  res.render("admin/pages/singers/create", {
    pageTitle: "Thêm mới ca sĩ",
  });
}
// [POST] /admin/singers/create
export const createPost = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("singers_create")) {
    req.body.createdBy = res.locals.account.id;
    const newSinger = new Singer(req.body);
    await newSinger.save();
    req.flash("success", "Tạo mới ca sĩ thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/singers`);
  } else {
    res.send("403");
  }
}
// [GET] /admin/products/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const singer = await Singer.findOne({
      _id: id,
      deleted: false
    });
    if (singer) {
      res.render("admin/pages/singers/edit", {
        pageTitle: "Chỉnh sửa ca sĩ",
        singer: singer,
      });
    } else {
      res.redirect(`/${systemConfig.prefixAdmin}/singers`);
    }
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/singers`);
  }
}
// [PATCH] /admin/singers/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("singers_edit")) {
    try {
      const id = req.params.id;
      req.body.updatedBy = res.locals.account.id;
      await Singer.updateOne({
        _id: id,
        deleted: false
      }, req.body);
      req.flash("success", "Cập nhật ca sĩ thành công!");

    } catch (error) {
      req.flash("error", "Id ca sĩ không hợp lệ !");
    }
    res.redirect("back");
  } else {
    res.send(`403`);
  }
}
// [GET] /admin/products/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const singer = await Singer.findOne({
      _id: id,
      deleted: false
    });
    if (singer) {
      res.render("admin/pages/singers/detail", {
        pageTitle: "Chi tiết ca sĩ",
        singer: singer
      });
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/singers`);
    }
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/singers`);
  }
}
//[PATCH]/admin/singers/delete/:id
export const deleteSinger = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("singers_delete")) {
    try {
      const id = req.params.id;
      await Singer.deleteOne({
        _id: id
      });
      req.flash('success', 'Đã xóa!');
      res.json({
        code: 200
      })
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/singers`);
    }
  } else {
    res.send(`403`);
  }
}
// [PATCH] /admin/singers/change-status/:statusChange/:id
export const changeStatus = async (req:Request, res:Response) => {
  if (res.locals.role.permissions.includes("singers_edit")) {
    try {
      const {
        id,
        statusChange
      } = req.params;
      await Singer.updateOne({
        _id: id

      }, {
        status: statusChange
      });
      req.flash('success', 'Cập nhật trạng thái thành công!');

      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/singers`);
    }
  }
  else {
    res.send(`403`);
  }
}