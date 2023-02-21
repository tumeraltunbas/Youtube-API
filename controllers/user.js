import Channel from "../models/Channel.js";
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
        const videos = await Video.find({views:req.user.id}).select("_id title thumbnail viewCount createdAt channel").sort({createdAt:"desc"}).populate({path:"channel", select: "name channelProfilePhoto"});
        return res.status(200).json({success:true, data:videos});
    }
    catch(err){
        return next(err);
    }
}

export const getSubscriptions = async(req, res, next) => {
    try{
        const subscriptions = await Channel.find({subscribers:req.user.id}).select("_id name channelProfilePhoto");
        return res.status(200).json({success:true, data:subscriptions});
    }
    catch(err){
        return next(err);
    }
}