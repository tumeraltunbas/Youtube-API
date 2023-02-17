import mongoose from "mongoose";

const CommentSchema =  new mongoose.Schema({
    text : {
        type:String,
        required:[true, "Text can not be null"]
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required:[true, "User can not be null"]
    },
    video : {
        type: mongoose.Schema.ObjectId,
        ref: "Video",
        required:[true, "Video can not be null"]
    },
    likes: [{
            type: mongoose.Schema.ObjectId,
            ref:"User" 
        }
    ],
    dislikes: [ {
            type: mongoose.Schema.ObjectId,
            ref:"User",
        }
    ],
    likeCount: {
        type: Number,
        default: 0,
    },
    dislikes: {
        type: Number,
        default:0
    },
    isVisible:{
        type: Boolean,
        default: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
});

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;