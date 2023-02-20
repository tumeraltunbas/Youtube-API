import mongoose from "mongoose";
import {generate} from "randomstring";
import Channel from "./Channel.js";

const VideoSchema = new mongoose.Schema({
    title: {
        type:String,
        required:[true, "Title can not be null"],
        minlength: [3, "Title can not be less than 3 characters"]
    },
    description: {
        type:String,
    },
    video: {
        type: String,
        required:[true, "Video can not be null"]
    },
    thumbnail : {
        type: String,
    },
    channel: {
        type: mongoose.Schema.ObjectId,
        ref: "Channel",
        required:[true, "Channel can not be null"]
    },
    views: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    ],
    likes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    ],
    dislikes: [
        {
            type: mongoose.Schema.ObjectId,
            ref: "User"
        }
    ],
    isHomepage: {
        type:Boolean,
        default:false
    },
    viewCount: {
        type:Number,
        default:0
    },
    likeCount: {
        type:Number,
        default:0
    },
    dislikeCount: {
        type: Number,
        default:0
    },
    comments:
    [
        {
            type: mongoose.Schema.ObjectId,
            ref: "Comment"
        }
    ],
    commentCount: {
        type: Number,
        default:0
    },
    slug:{
        type: String,
    },
    url: {
        type: String
    },
    isVisible: {
        type:Boolean,
        default:true
    },
    uploadedAt: {
        type:Date,
        default: Date.now()
    },

});

VideoSchema.pre("save", async function(next)
{
    if(this.isModified("video"))
    {
        this.slug = generate(14);
        const channel = await Channel.findOne({_id:this.channel}).select("slug");
        this.url = String(process.env.DOMAIN + "/channel/" + channel.slug + "/watch/" + this.slug);
        next();
    }
    next();
});

const Video = mongoose.model("Video", VideoSchema);
export default Video;