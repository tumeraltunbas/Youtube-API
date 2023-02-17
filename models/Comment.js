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
    dislikeCount: {
        type: Number,
        default:0
    },
    isVisible:{
        type: Boolean,
        default: true
    },
    lastEdited: {
        type: Date,
        default:null,
    },
    deletedAt: {
        type:Date,
        default: null
    },
    createdAt: {
        type: Date,
        default: Date.now()
    },
});

//When a comment is updated, all its likes and dislikes will be deleted.
CommentSchema.pre("save", function(next)
{
    if(this.isModified("lastEdited"))
    {
        this.likeCount = 0;
        this.dislikeCount = 0;
        this.likes = [];
        this.dislikes = [];
        next();
    }
    next();
});

const Comment = mongoose.model("Comment", CommentSchema);
export default Comment;