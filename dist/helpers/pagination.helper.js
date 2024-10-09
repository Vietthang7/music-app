"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginationUser = exports.paginationAccount = exports.paginationSingers = exports.paginationSongs = exports.paginationTopics = void 0;
const topic_model_1 = __importDefault(require("../models/topic.model"));
const song_model_1 = __importDefault(require("../models/song.model"));
const accounts_model_1 = __importDefault(require("../models/accounts.model"));
const user_model_1 = __importDefault(require("../models/user.model"));
const singer_model_1 = __importDefault(require("../models/singer.model"));
const paginationTopics = (req, find) => __awaiter(void 0, void 0, void 0, function* () {
    const pagination = {
        currentPage: 1,
        limitItems: 4
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination["skip"] = (pagination.currentPage - 1) * pagination.limitItems;
    const countProducts = yield topic_model_1.default.countDocuments(find);
    const totalPage = Math.ceil(countProducts / pagination.limitItems);
    pagination["totalPage"] = totalPage;
    return pagination;
});
exports.paginationTopics = paginationTopics;
const paginationSongs = (req, find) => __awaiter(void 0, void 0, void 0, function* () {
    const pagination = {
        currentPage: 1,
        limitItems: 4
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination["skip"] = (pagination.currentPage - 1) * pagination.limitItems;
    const countProductCategory = yield song_model_1.default.countDocuments(find);
    const totalPage = Math.ceil(countProductCategory / pagination.limitItems);
    pagination["totalPage"] = totalPage;
    return pagination;
});
exports.paginationSongs = paginationSongs;
const paginationSingers = (req, find) => __awaiter(void 0, void 0, void 0, function* () {
    const pagination = {
        currentPage: 1,
        limitItems: 4
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination["skip"] = (pagination.currentPage - 1) * pagination.limitItems;
    const countProductCategory = yield singer_model_1.default.countDocuments(find);
    const totalPage = Math.ceil(countProductCategory / pagination.limitItems);
    pagination["totalPage"] = totalPage;
    return pagination;
});
exports.paginationSingers = paginationSingers;
const paginationAccount = (req, find) => __awaiter(void 0, void 0, void 0, function* () {
    const pagination = {
        currentPage: 1,
        limitItems: 4
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination["skip"] = (pagination.currentPage - 1) * pagination.limitItems;
    const countAcounts = yield accounts_model_1.default.countDocuments(find);
    const totalPage = Math.ceil(countAcounts / pagination.limitItems);
    pagination["totalPage"] = totalPage;
    return pagination;
});
exports.paginationAccount = paginationAccount;
const paginationUser = (req, find) => __awaiter(void 0, void 0, void 0, function* () {
    const pagination = {
        currentPage: 1,
        limitItems: 4
    };
    if (req.query.page) {
        pagination.currentPage = parseInt(req.query.page);
    }
    pagination["skip"] = (pagination.currentPage - 1) * pagination.limitItems;
    const countPosts = yield user_model_1.default.countDocuments(find);
    const totalPage = Math.ceil(countPosts / pagination.limitItems);
    pagination["totalPage"] = totalPage;
    return pagination;
});
exports.paginationUser = paginationUser;
