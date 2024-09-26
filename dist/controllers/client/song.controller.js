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
exports.listen = exports.search = exports.favorite = exports.favoritePatch = exports.like = exports.detail = exports.list = void 0;
const unidecode_1 = __importDefault(require("unidecode"));
const topic_model_1 = __importDefault(require("../../models/topic.model"));
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const favorite_song_model_1 = __importDefault(require("../../models/favorite-song.model"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slugTopic = req.params.slugTopic;
    const topic = yield topic_model_1.default.findOne({
        slug: slugTopic,
        deleted: false,
        status: "active"
    });
    const songs = yield song_model_1.default.find({
        topicId: topic.id,
        deleted: false,
        status: "active"
    }).select("title avatar singerId like slug");
    for (const item of songs) {
        const singerInfo = yield singer_model_1.default.findOne({
            _id: item.singerId
        }).select("fullName");
        item["singerFullName"] = singerInfo["fullName"];
    }
    res.render("client/pages/songs/list", {
        pageTitle: topic.title,
        songs: songs
    });
});
exports.list = list;
const detail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const slugSong = req.params.slugSong;
    const song = yield song_model_1.default.findOne({
        slug: slugSong,
        status: "active",
        deleted: false
    });
    const singer = yield singer_model_1.default.findOne({
        _id: song.singerId
    }).select("fullName");
    const topic = yield topic_model_1.default.findOne({
        _id: song.topicId
    }).select("title");
    const existSongInFavorite = yield favorite_song_model_1.default.findOne({
        songId: song.id
    });
    if (existSongInFavorite) {
        song["isFavorite"] = true;
    }
    res.render("client/pages/songs/detail", {
        pageTitle: "Chi tiết bài hát",
        song: song,
        singer: singer,
        topic: topic
    });
});
exports.detail = detail;
const like = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, type } = req.body;
    const song = yield song_model_1.default.findOne({
        _id: id,
        status: "active",
        deleted: false
    });
    let updateLike = song.like;
    if (type == "like") {
        updateLike = updateLike + 1;
    }
    else if (type == "dislike") {
        updateLike = updateLike - 1;
    }
    yield song_model_1.default.updateOne({
        _id: id,
        status: "active",
        deleted: false
    }, {
        like: updateLike
    });
    res.json({
        code: 200,
        updateLike: updateLike,
        message: " Cập nhật thành công!"
    });
});
exports.like = like;
const favoritePatch = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    const data = {
        songId: id
    };
    const existSongInFavorite = yield favorite_song_model_1.default.findOne(data);
    let status = "";
    if (existSongInFavorite) {
        yield favorite_song_model_1.default.deleteOne(data);
    }
    else {
        const record = new favorite_song_model_1.default(data);
        yield record.save();
        status = "add";
    }
    res.json({
        code: 200,
        status: status
    });
});
exports.favoritePatch = favoritePatch;
const favorite = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const songs = yield favorite_song_model_1.default.find({});
    for (const song of songs) {
        const infoSong = yield song_model_1.default.findOne({
            _id: song.songId
        }).select("title avatar singerId slug");
        const infoSinger = yield singer_model_1.default.findOne({
            _id: infoSong.singerId
        }).select("fullName");
        song["infoSong"] = infoSong;
        song["infoSinger"] = infoSinger;
    }
    res.render("client/pages/songs/favorite", {
        pageTitle: "Bài hát yêu thích",
        songs: songs
    });
});
exports.favorite = favorite;
const search = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const type = req.params.type;
    const keyword = `${req.query.keyword}`;
    let songsFinal = [];
    if (keyword) {
        let keywordSlug = keyword.trim();
        keywordSlug = keywordSlug.replace(/\s/g, "-");
        keywordSlug = keywordSlug.replace(/\-+/g, "-");
        keywordSlug = (0, unidecode_1.default)(keywordSlug);
        const regexKeyword = new RegExp(keyword, "i");
        const regexKeywordSlug = new RegExp(keywordSlug, "i");
        const songs = yield song_model_1.default.find({
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
            const singerInfo = yield singer_model_1.default.findOne({
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
    }
    else if (type == "suggest") {
        res.json({
            code: 200,
            songs: songsFinal
        });
    }
    else {
        res.json({
            code: 400
        });
    }
    ;
});
exports.search = search;
const listen = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    const song = yield song_model_1.default.findOne({
        _id: id,
        status: "active",
        deleted: false
    });
    const updateListen = song.listen + 1;
    yield song_model_1.default.updateOne({
        _id: id,
        status: "active",
        deleted: false
    }, {
        listen: updateListen
    });
    res.json({
        code: 200,
        listen: updateListen
    });
});
exports.listen = listen;
