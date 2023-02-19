import mongoose from "mongoose";

const PlaylistSchema = new mongoose.Schema({
    name: {
        type:String,
        required:[true, "Name can not be null"]
    },
    videos : [
        {
            type: mongoose.Schema.ObjectId,
            ref:"Video"
        }
    ],
    privacy: {
        type:String,
        enum: ["public", "private"],
        required:[true, "Privacy can not be null"],
    },
    user: {
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:[true, "User can not be null"]
    },
    isVisible: {
        type:Boolean,
        default:true
    },
    createdAt: {
        type:Date,
        default:Date.now()
    },
});

const Playlist = mongoose.model("Playlist", PlaylistSchema);
export default Playlist;