import { Request, response, Response } from "express";
import Account from "../../models/accounts.model";
import User from "../../models/user.model";
import Singer from "../../models/singer.model";
import Song from "../../models/song.model";
import Topic from "../../models/topic.model";
//[GET]/admin/dashboard
export const index = async (req: Request, res: Response) => {
  const statistic = {
    topic: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    song: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    singer: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    user: {
      total: 0,
      active: 0,
      inactive: 0,
    },
    account: {
      total: 0,
      active: 0,
      inactive: 0,
    }
  }
  //topic
  statistic.topic.total = await Topic.countDocuments({
    deleted: false
  });
  statistic.topic.active = await Topic.countDocuments({
    deleted: false,
    status: "active"
  });
  statistic.topic.inactive = await Topic.countDocuments({
    deleted: false,
    status: "inactive"
  });
  //End topic
  //song
  statistic.song.total = await Song.countDocuments({
    deleted: false
  });
  statistic.song.active = await Song.countDocuments({
    deleted: false,
    status: "active"
  });
  statistic.song.inactive = await Song.countDocuments({
    deleted: false,
    status: "inactive"
  });
  //End song
  //singer
  statistic.singer.total = await Singer.countDocuments({
    deleted: false
  });
  statistic.singer.active = await Singer.countDocuments({
    deleted: false,
    status: "active"
  });
  statistic.singer.inactive = await Singer.countDocuments({
    deleted: false,
    status: "inactive"
  });
  //End singer
  //user
  statistic.user.total = await User.countDocuments({
    deleted: false
  });
  statistic.user.active = await User.countDocuments({
    deleted: false,
    status: "active"
  });
  statistic.user.inactive = await User.countDocuments({
    deleted: false,
    status: "inactive"
  });
  //End user
  //account
  statistic.account.total = await Account.countDocuments({
    deleted: false
  });
  statistic.account.active = await Account.countDocuments({
    deleted: false,
    status: "active"
  });
  statistic.account.inactive = await Account.countDocuments({
    deleted: false,
    status: "inactive"
  });
  //End account
  res.render("admin/pages/dashboard/index", {
    pageTitle: "Tổng quan",
    statistic: statistic
  })
}
