import Channel from "../models/Channel.js";
import Video from "../models/Video.js";

export const searchVideo = async(req, res, next) => {
    try {
        const {search} = req.query;
        const regex = RegExp(search, "i");
        const videos = await Video.find({title:regex}).select("title thumbnail viewCount");
        const channels = await Channel.find({name:regex}).select("name subscriberCount profilePhoto");
        const data = {
            videos: videos,
            channels:channels
        }
        return res.status(200).json({success:true, data:data});
    }
    catch(err) {
        return next(err);
    }
}

export const index = async(req, res, next) => {
    try{
        const channels = await Channel.find({subscribers:req.user.id}).select("_id name");
        const videos = await Video.find({channel:channels}).select("title thumbnail video viewCount createdAt channel").populate({path:"channel", select:"name channelProfilePhoto"}).limit(30).sort({uploadedAt:"desc"});
        return res.status(200).json({success:true, data:channels, videos:videos});
    }
    catch(err){
        return next(err);
    }
}

export const trends = async(req, res, next) => {
    try{
        const videos = await Video.find({uploadedAt:{$gt: Date.now() - 604800000}}).sort({likeCount:"asc"}).select("title thumbnail video viewCount createdAt channel").populate({path:"channel", select:"name channelProfilePhoto"});
        return res.status(200).json({success:true, data:videos});
    }
    catch(err){
        return next(err);
    }
}