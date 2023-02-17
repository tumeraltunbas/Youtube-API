import CustomizedError from "../../helpers/error/CustomizedError.js";
import User from "../../models/User.js";
import jwt from "jsonwebtoken";
import Video from "../../models/Video.js";
import Channel from "../../models/Channel.js";
import Comment from "../../models/Comment.js";

export const isEmailVerified = async(req, res, next) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email:email});
        if(!user || user.isEmailVerified != true)
        return next(new CustomizedError(400, "There is no user with that email or you did not verify your email yet."));
        next();
    }
    catch(err) {
        return next(err);
    }
}

export const getAccessToRoute = (req, res, next) => {
    const token = req.cookies.access_token;
    jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decoded){
        if(err)
        return next(err)
        req.user = {
            id:decoded.id,
            lastName:decoded.lastName
        },
        next();
    });
}

export const getVideoOwnerAccess = async(req, res, next) => {
    try {
        const {videoSlug} = req.params;
        const video = await Video.findOne({slug:videoSlug});
        if(!video)
        return next(new CustomizedError(400, "There is no video with that slug"));
        const channel = await Channel.findOne({user:req.user.id});
        if(video.channel != channel.id)
        return next(new CustomizedError(403, "You are not owner of video"));
        next();
    } 
    catch(err) {
        return next(err);
    }
}

export const getCommentOwnerAccess = async(req, res, next) => {
    try {
        const {commentId} = req.params;
        const comment = await Comment.findById(commentId).select("_id user");
        if(comment.user != req.user.id)
        return next(new CustomizedError(400, "You are not owner this comment"));
        next();
    }
    catch(err) {
        return next(err);
    }
}