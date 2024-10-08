import mongoose from "mongoose";

const likeSongSchema = new mongoose.Schema(
  {
    userId: String,
    songId: String
  },
  {
    timestamps: true,
  }
);

const LikeSong = mongoose.model("LikeSong", likeSongSchema, "likes");

export default LikeSong;