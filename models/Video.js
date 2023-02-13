import mongoose from "mongoose";
import {generate} from "randomstring";

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
        ref: "Channel"
    },
    views: {
        type:Number,
        default:0
    },
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
    uploadedBy:{
        type: mongoose.Schema.ObjectId,
        required:[true, "Uploaded By can not be null"]
    },
    uploadedAt: {
        type:Date,
        default: Date.now()
    },

});

//will be refactor
VideoSchema.pre("save", function(next)
{
    if(this.isModified("uploadedAt")) // it will never change
    this.slug = generate(14);
    next();
});