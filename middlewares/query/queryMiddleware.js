import CustomizedError from "../../helpers/error/CustomizedError.js";
import Channel from "../../models/Channel.js";
import Video from "../../models/Video.js";

export const isVideoExists = async(req, res, next) => {
    try{
        const {channelSlug, videoSlug} = req.params;
        const channel = await Channel.findOne({slug:channelSlug}).select("_id");
        if(!await Video.findOne({slug:videoSlug, channel:channel.id}))
        return next(new CustomizedError(400, "There is no video like this"));
        next();
    }
    catch(err) {
        return next(err);
    }
}

export const isChannelExist = async(req, res, next) => {
    try {
        const {channelSlug} = req.params;
        if(!await Channel.findOne({slug:channelSlug}).select("_id"))
        return next(new CustomizedError(400, "There is no channel with this slug"));
        next();
    }
    catch(err) {
        return next(err);
    }
}