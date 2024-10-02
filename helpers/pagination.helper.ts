import Topic from "../models/topic.model";
import Song from "../models/song.model";
import Account from "../models/accounts.model";
import User from "../models/user.model";
import Singer from "../models/singer.model";
//Topics
export const paginationTopics = async (req, find) => {
    const pagination = {
        currentPage: 1,
        limitItems: 4
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination["skip"] = (pagination.currentPage - 1) * pagination.limitItems;

    const countProducts = await Topic.countDocuments(find);
    const totalPage = Math.ceil(countProducts / pagination.limitItems);
    pagination["totalPage"] = totalPage;
    return pagination;
}
// Songs
export const paginationSongs = async (req, find) => {
    const pagination = {
        currentPage: 1,
        limitItems: 4
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination["skip"] = (pagination.currentPage - 1) * pagination.limitItems;

    const countProductCategory = await Song.countDocuments(find);
    const totalPage = Math.ceil(countProductCategory / pagination.limitItems);
    pagination["totalPage"] = totalPage;
    return pagination;
}
// Singers
export const paginationSingers = async (req, find) => {
    const pagination = {
        currentPage: 1,
        limitItems: 4
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination["skip"] = (pagination.currentPage - 1) * pagination.limitItems;

    const countProductCategory = await Singer.countDocuments(find);
    const totalPage = Math.ceil(countProductCategory / pagination.limitItems);
    pagination["totalPage"] = totalPage;
    return pagination;
}
//Accounts
export const paginationAccount = async (req, find) => {
    const pagination = {
        currentPage: 1,
        limitItems: 4
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination["skip"] = (pagination.currentPage - 1) * pagination.limitItems;

    const countAcounts = await Account.countDocuments(find);
    const totalPage = Math.ceil(countAcounts / pagination.limitItems);
    pagination["totalPage"] = totalPage;
    return pagination;
}

//User
export const paginationUser = async (req, find) => {
    const pagination = {
        currentPage: 1,
        limitItems: 4
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination["skip"] = (pagination.currentPage - 1) * pagination.limitItems;

    const countPosts = await User.countDocuments(find);
    const totalPage = Math.ceil(countPosts / pagination.limitItems);
    pagination["totalPage"] = totalPage;
    return pagination;
}
// End User



