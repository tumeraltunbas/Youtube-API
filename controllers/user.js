import Video from "../models/Video.js";

export const getLikedVideos = async(req, res, next) => {
    try{
        const videos = await Video.find({likes:req.user.id}).select("_id title thumbnail viewCount createdAt channel").populate({path: "channel", select: "name"});
        return res.status(200).json({success:true, data:videos});
    }
    catch(err){
        return next(err);
    }
}

export const getWatchHistory = async(req, res, next) => {
    try{
        const videos = await Video.find({views:req.user.id}).select("_id title thumbnail viewCount createdAt channel").sort({createdAt:"desc"});
        return res.status(200).json({success:true, data:videos});
    }
    catch(err){
        return next(err);
    }
}