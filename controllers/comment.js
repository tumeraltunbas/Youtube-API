import CustomizedError from "../helpers/error/CustomizedError.js";
import Comment from "../models/Comment.js";
import Video from "../models/Video.js";

export const createComment = async(req, res, next) => {
    try{
        const {text} = req.body;
        const {videoSlug} = req.params;
        if(!text)
        return next(new CustomizedError(400, "You have to provide a text"));
        const video = await Video.findOne({slug:videoSlug}).select("_id comments commentCount");
        const comment = await Comment.create({text:text, user:req.user.id, video: video.id});
        video.comments.push(comment.id);
        video.commentCount+=1;
        await video.save();
        return res.status(200).json({success:true, data:comment});
    }
    catch(err) {
        return next(err);
    }
}

export const hideComment = async(req, res, next) => {
    try{
        const {commentId} = req.params;
        const comment = await Comment.findOne({_id:commentId}).select("_id isVisible");
        if(comment.isVisible === false)
        return next(new CustomizedError(400, "This comment already hidden"));
        await comment.updateOne({isVisible:false, deletedAt: Date.now()});
        return res.status(200).json({success:true, message: "Your comment has been hidden"});
    }
    catch(err) {
        return next(err);
    }
}

export const likeComment = async(req, res, next) => {
    try{
        const {commentId} = req.params;
        const comment = await Comment.findById(commentId).select("_id likes likeCount dislikes dislikeCount");
        if(comment.likes.includes(req.user.id))
        return next(new CustomizedError(400, "You already liked this comment"));
        if(comment.dislikes.includes(req.user.id))
        {
            comment.dislikes.splice(req.user.id, 1);
            comment.dislikeCount -=1;
        }
        comment.likes.push(req.user.id);
        comment.likeCount +=1;
        await comment.save();
        res.status(200).json({success:true, message:"Comment has been liked"});
    }
    catch(err){
        return next(err);
    }
}