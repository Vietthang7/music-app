import Role from "../../models/role.model";
import { Request, Response } from "express";
import { systemConfig } from "../../config/system";
import Account from "../../models/accounts.model";
import moment from "moment";
//[GET] /admin/roles
export const index = async (req: Request, res: Response) => {
  const records = await Role.find({
    deleted: false
  });
  for (const record of records) {
    // Người tạo
    if (record.createdBy) {
      const accountCreated = await Account.findOne({
        _id: record.createdBy
      });
      record["createdByFullName"] = accountCreated.fullName;
    } else {
      record["createdByFullName"] = "";
    }
    record["createdAtFormat"] = moment(record.createdAt).format("DD/MM/YY HH:mm:ss");
    // Người cập nhật
    if (record.updatedBy) {
      const accountUpdated = await Account.findOne({
        _id: record.updatedBy
      });
      record["updatedByFullName"] = accountUpdated.fullName;
    } else {
      record["updatedByFullName"] = "";
    }
    record["updatedAtFormat"] = moment(record.updatedAt).format("DD/MM/YY HH:mm:ss");
  }
  res.render("admin/pages/roles/index", {
    pageTitle: "Nhóm quyền",
    records: records
  });
}
//[GET] /admin/roles/create
export const create = async (req: Request, res: Response) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Tạo mới nhóm quyền",
  });
};
//[POST] /admin/roles/create
export const createPost = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("roles_create")) {
    req.body.createdBy = res.locals.account.id;
    const records = new Role(req.body);
    await records.save();
    res.redirect(`/${systemConfig.prefixAdmin}/roles`);
  } else {
    res.send(`403`);
  }
}

// [GET] /admin/roles/permissions
export const permissions = async (req: Request, res: Response) => {
  const records = await Role.find({
    deleted: false
  });

  res.render("admin/pages/roles/permissions", {
    pageTitle: "Phân quyền",
    records: records
  });
};
// [PATCH] /admin/roles/permissions
export const permissionsPatch = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("roles_permissions")) {
    const roles = req.body;

    for (const role of roles) {
      await Role.updateOne({
        _id: role.id,
        deleted: false
      }, {
        permissions: role.permissions
      });
    }

    res.json({
      code: 200,
      message: "Cập nhật thành công!"
    });
  } else {
    res.send(`403`);
  }
}
// [GET] /admin/roles/edit/:id
export const edit = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const records = await Role.findOne({
      _id: id,
      deleted: false
    });
    res.render("admin/pages/roles/edit", {
      pageTitle: "Chỉnh sửa nhóm quyền",
      records: records
    }
    );

  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};
// [PATCH] /admin/roles/edit/:id
export const editPatch = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("roles_edit")) {
    try {
      const id = req.params.id;
      req.body.updatedBy = res.locals.account.id;
      await Role.updateOne({
        _id: id,
        deleted: false
      }, req.body);
      req.flash("success", "Cập nhật thành công!");
      res.redirect("back");

    } catch (error) {
      req.flash("error", "Id sản phẩm không hợp lệ !");
      res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
  } else {
    res.send(`403`);
  }
}
// [GET] /admin/roles/detail/:id
export const detail = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const records = await Role.findOne({
      _id: id,
      deleted: false
    });
    if (records) {
      res.render("admin/pages/roles/detail", {
        pageTitle: "Chi tiết",
        records: records
      }
      );
    } else {
      res.redirect(`${systemConfig.prefixAdmin}/roles`);
    }
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
};
// [PATCH] /admin/roles/delete/:id
export const deleteItem = async (req: Request, res: Response) => {
  if (res.locals.role.permissions.includes("roles_delete")) {
    try {
      const id = req.params.id;
      await Role.deleteOne({
        _id: id
      });
      req.flash('success', 'Đã xóa!');
      res.json({
        code: 200
      })
    } catch (error) {
      res.redirect(`/${systemConfig.prefixAdmin}/roles`);
    }
  } else {
    res.send(`403`);
  }
}