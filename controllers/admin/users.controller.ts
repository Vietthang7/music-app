import { Request, Response } from "express";
import { systemConfig } from "../../config/system";
import Account from "../../models/accounts.model";
import User from "../../models/user.model";
import Role from "../../models/role.model";
import moment from "moment";
import { paginationUser } from "../../helpers/pagination.helper";
import md5 from "md5";
import { generateRandomString } from "../../helpers/generate.helper";
// [GET] /admin/users
export const index = async (req: Request, res: Response) => {
  const find = {
    deleted: false
  }
  const filterStatus = [{
    label: "Tất cả",
    value: ""
  },
  {
    label: "Đang hoạt động",
    value: "active"
  },
  {
    label: "Dừng hoạt động",
    value: "inactive"
  },
  ];
  if (req.query.status) {
    find["status"] = req.query.status;
  }
  // Tìm kiếm 
  let keyword = "";
  if (req.query.keyword) {
    const regex = new RegExp(`${req.query.keyword}`, "i");
    find["fullName"] = regex;
    keyword = req.query.keyword.toString();
  }
  // Hết tìm kiếm

  //Sắp xếp
  const sort = {};
  const sortKey = `${req.query.sortKey}`;
  if (sortKey && req.query.sortValue) {
    sort[sortKey] = req.query.sortValue;
  } else {
    sort["createdAt"] = "desc";
  }
  // Hết sắp xếp
  //Phân trang
  const pagination = await paginationUser(req, find);
  //Hết  Phân trang

  const users = await User
    .find(find)
    .limit(pagination.limitItems) // số lượng tối thiểu 
    .skip(pagination["skip"]) // bỏ qua
    .sort(sort);
  for (const item of users) {
    if (item.createdBy) {
      const accountCreated = await Account.findOne({
        _id: item.createdBy
      });

      item["createdByFullName"] = accountCreated.fullName;

    } else {
      item["createdAtFormat"] = "";
    }
    item["createdAtFormat"] = moment(item.createdAt).format("DD/MM/YY HH:mm:ss");
    if (item.updatedBy) {
      const accountUpdated = await Account.findOne({
        _id: item.updatedBy
      });
      item["updatedByFullName"] = accountUpdated.fullName;
    } else {
      item["updatedByFullName"] = "";
    }

    item["updatedAtFormat"] = moment(item.updatedAt).format("DD/MM/YY HH:mm:ss");
  }
  res.render("admin/pages/users/index", {
    pageTitle: "Tài khoản Users",
    users: users,
    keyword: keyword,
    filterStatus: filterStatus,
    pagination: pagination
  }
  );
}
// [GET] /admin/accounts/create
export const create = async (req: Request, res: Response) => {
  res.render("admin/pages/users/create", {
    pageTitle: "Tài khoản User",
  }
  );
}
// [POST] /admin/users/create
export const createPost = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("users_create")) {
    const existUserTrash = await User.findOne({
      email: req.body.email,
      deleted: true
    })
    if (existUserTrash) {
      req.flash("error", "Tài khoản đã tồn tại và nằm trong thùng rác");
      res.redirect("back");
      return;
    }
    const existUser = await User.findOne({
      email: req.body.email,
      deleted: false
    })
    if (existUser) {
      req.flash("error", "Email đã tồn tại");
      res.redirect("back");
      return;
    }
    req.body.password = md5(req.body.password);
    req.body.tokenUser = generateRandomString(30);
    req.body.createdBy = res.locals.account.id;
    const user = new User(req.body);
    await user.save();
    req.flash("success", "Tạo mới tài khoản thành công");
    res.redirect(`/${systemConfig.prefixAdmin}/users`);
  } else {
    res.send("403");
  }
}
// [GET] /admin/users/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({
      _id: id,
      deleted: false
    });
    if (user) {
      res.render("admin/pages/users/edit", {
        pageTitle: "Tài khoản client",
        user: user
      });
    } else {
      res.redirect(`/${systemConfig.prefixAdmin}/users`);
    }
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/users`);
  }
}
// [PATCH] /admin/users/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("users_edit")) {
    try {
      const id = req.params.id;

      if (req.body.password == "") {
        delete req.body.password;
      } else {
        req.body.password = md5(req.body.password);
      }
      req.body.updatedBy = res.locals.account.id;
      await User.updateOne({
        _id: id,
        deleted: false
      }, req.body);
      req.flash("success", "Cập nhật thành công!");
    } catch (error) {
      req.flash("error", "Id tài khoản  không hợp lệ!");
    }
    res.redirect("back");
  } else {
    res.send("403");
  }
}
// [GET] /admin/users/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({
      _id: id,
      deleted: false
    });
    if (user) {
      res.render("admin/pages/users/detail", {
        pageTitle: "Chi tiết tài khoản",
        user: user
      });
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/users`);
    }
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/users`);
  }
}
//[PATCH]/admin/users/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("users_delete")) {
    try {
      const id = req.params.id;
      await User.updateOne({
        _id: id
      }, {

        deleted: true,
        deletedBy: res.locals.account.id
      });
      req.flash('success', 'Đã chuyển vào thùng rác!');
      res.json({
        code: 200
      })
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/users`);
    }
  } else {
    res.send(`403`);
  }
}
// [PATCH] /admin/users/change-status/:statusChange/:id
export const changeStatus = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("users_edit")) {
    try {
      const {
        id,
        statusChange
      } = req.params;
      await User.updateOne({
        _id: id

      }, {
        status: statusChange
      });
      req.flash('success', 'Cập nhật trạng thái thành công!');

      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/users`);
    }
  }
  else {
    res.send(`403`);
  }
}
// [PATCH] /admin/users/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("users_edit")) {
    try {
      const {
        status,
        ids
      } = req.body;
      switch (status) {
        case "active":
        case "inactive":
          await User.updateMany({
            _id: ids
          }, {
            status: status
          });
          req.flash('success', 'Cập nhật trạng thái thành công!');
          break;
        case "delete":
          await User.updateMany({
            _id: ids
          }, {
            deleted: true
          });
          req.flash('success', 'Đã chuyển vào thùng rác!');
        default:
          break;
      }
      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/users`);
    }
  } else {
    res.send(`403`);
  }
}