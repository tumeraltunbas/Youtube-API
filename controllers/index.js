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