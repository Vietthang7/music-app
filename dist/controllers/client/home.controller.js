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
exports.index = void 0;
const song_model_1 = __importDefault(require("../../models/song.model"));
const singer_model_1 = __importDefault(require("../../models/singer.model"));
const index = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const listSongs = yield song_model_1.default.find({
        deleted: false,
        status: "active"
    })
        .select("title avatar singerId topicId listen like slug")
        .limit(30);
    const sortedSongs = listSongs.sort((a, b) => {
        if (b.listen !== a.listen) {
            return b.listen - a.listen;
        }
        return b.like - a.like;
    });
    for (const song of sortedSongs) {
        const singerInfo = yield singer_model_1.default.findOne({
            _id: song.singerId
        });
        song["singerFullName"] = singerInfo["fullName"];
    }
    res.render("client/pages/home/index", {
        pageTitle: "Top BXH",
        songs: sortedSongs
    });
});
exports.index = index;
