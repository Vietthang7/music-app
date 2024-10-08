import { Request, Response } from "express";
import { systemConfig } from "../../config/system";
import Account from "../../models/accounts.model";
import Role from "../../models/role.model";
import moment from "moment";
import { paginationAccount } from "../../helpers/pagination.helper";
import md5 from "md5";
import { generateRandomString } from "../../helpers/generate.helper";
// [GET] /admin/accounts
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
  const pagination = await paginationAccount(req, find);
  //Hết  Phân trang

  const records = await Account
    .find(find)
    .limit(pagination.limitItems) // số lượng tối thiểu 
    .skip(pagination["skip"]) // bỏ qua
    .sort(sort);
  for (const item of records) {
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
  } for (const record of records) {
    const role = await Role.findOne({
      _id: record.role_id,
      deleted: false
    });
    record["roleTitle"] = role.title;
  }
  res.render("admin/pages/accounts/index", {
    pageTitle: "Tài khoản admin",
    records: records,
    keyword: keyword,
    filterStatus: filterStatus,
    pagination: pagination
  }
  );
}
// [GET] /admin/accounts/create
export const create = async (req: Request, res: Response) => {
  const roles = await Role.find({
    deleted: false
  }).select("title");
  res.render("admin/pages/accounts/create", {
    pageTitle: "Tài khoản admin",
    roles: roles
  }
  );
}
// [POST] /admin/accounts/create
export const createPost = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("accounts_create")) {
    const existAccountTrash = await Account.findOne({
      email: req.body.email,
      deleted: true
    })
    if (existAccountTrash) {
      req.flash("error", "Tài khoản đã tồn tại và nằm trong thùng rác");
      res.redirect("back");
      return;
    }
    const existAccount = await Account.findOne({
      email: req.body.email,
      deleted: false
    })
    if (existAccount) {
      req.flash("error", "Email đã tồn tại");
      res.redirect("back");
      return;
    }
    req.body.password = md5(req.body.password);
    req.body.token = generateRandomString(30);
    req.body.createdBy = res.locals.account.id;
    const account = new Account(req.body);
    await account.save();
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  } else {
    res.send("403");
  }
}
// [GET] /admin/accounts/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const account = await Account.findOne({
      _id: id,
      deleted: false
    });
    if (account) {
      const roles = await Role.find({
        deleted: false
      }).select("title");

      res.render("admin/pages/accounts/edit", {
        pageTitle: "Tài khoản admin",
        roles: roles,
        account: account
      });
    } else {
      res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  }
}
// [PATCH] /admin/accounts/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("accounts_edit")) {
    try {
      const id = req.params.id;

      if (req.body.password == "") {
        delete req.body.password;
      } else {
        req.body.password = md5(req.body.password);
      }
      req.body.updatedBy = res.locals.account.id;
      await Account.updateOne({
        _id: id,
        deleted: false
      }, req.body);
      req.flash("success", "Cập nhật thành công!");
    } catch (error) {
      req.flash("error", "Id tài khoản không hợp lệ!");
    }
    res.redirect("back");
  } else {
    res.send("403");
  }
}
// [GET] /admin/accounts/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const account = await Account.findOne({
      _id: id,
      deleted: false
    });
    if (account) {
      const role = await Role.findOne({
        _id: account.role_id,
        deleted: false
      });
      res.render("admin/pages/accounts/detail", {
        pageTitle: "Chi tiết tài khoản",
        role: role,
        account: account
      });
    } else {
      res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
  } catch (error) {
    res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
  }
}
// [PATCH] /admin/accounts/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("accounts_delete")) {
    try {
      const id = req.params.id;
      await Account.deleteOne({
        _id: id
      });
      req.flash('success', 'Đã xóa!');
      res.json({
        code: 200
      })
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
  } else {
    res.send(`403`);
  }
}
// [PATCH] /admin/accounts/change-status/:statusChange/:id
export const changeStatus = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("accounts_edit")) {
    try {
      const {
        id,
        statusChange
      } = req.params;
      await Account.updateOne({
        _id: id

      }, {
        status: statusChange
      });
      req.flash('success', 'Cập nhật trạng thái thành công!');

      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
  }
  else {
    res.send(`403`);
  }
}
// [PATCH] /admin/accounts/change-multi
export const changeMulti = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("accounts_edit")) {
    try {
      const {
        status,
        ids
      } = req.body;
      switch (status) {
        case "active":
        case "inactive":
          await Account.updateMany({
            _id: ids
          }, {
            status: status
          });
          break;
        case "delete":
          await Account.updateMany({
            _id: ids
          }, {
            deleted: true

          });
        default:
          break;
      }
      res.json({
        code: 200
      });
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/accounts`);
    }
  } else {
    res.send(`403`);
  }
}