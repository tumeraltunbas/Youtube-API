import { createMailOptions, sendMail } from "../helpers/email/emailHelpers.js";
import Channel from "../models/Channel.js";
import ChannelVerification from "../models/ChannelVerification.js";
import Report from "../models/Report.js";
export const verificationRequests = async(req, res, next) => {
    try{
        const verificationRequests = await ChannelVerification.find({isVisible:true});
        return res.status(200).json({success:true, data:verificationRequests});
    }
    catch(err)
    {
        return next(err);
    }
}

export const verifyChannel = async(req, res, next) => {
    try{
        const {channelId} = req.params;
        const channel = await Channel.findOne({_id:channelId}).select("_id email");
        await ChannelVerification.updateOne({channel:channel.id}, {isVisible:false}, {new:true});
        await channel.updateOne({isChannelVerified:true}, {new:true});
        sendMail(createMailOptions(channel.email, 'Channel Verification Request', '<p>Your channel verification request has been positive. Your channel has been successfully verified.</p>'));
        return res.status(200).json({success:true, message:"Channel has been verified"});
    }
    catch(err){
        return next(err);
    }
}

export const refuseChannelVerification = async(req, res, next) => {
    try{
        const {channelId} = req.params;
        const channel = await Channel.findOne({_id:channelId}).select("_id email");
        await ChannelVerification.updateOne({channel:channelId}, {isVisible:false}, {new:true});
        sendMail(createMailOptions(channel.email, 'Channel Verification Request', '<p>Your channel verification request has been negative. Your channel has not been verified.</p>'));
        return res.status(200).json({success:true, message:"Verification request has been refused"});
    }
    catch(err){
        return next(err);
    }
}

export const getReports = async(req, res, next) => {
    try{
        const reports = await Report.find({isVisible:true}).populate({path: "video", select:"title video viewCount likeCount dislikeCount"}).populate({path:"user", select:"firstName lastName"});
        return res.status(200).json({success:true, data:reports});
    }
    catch(err){
        return next(err);
    }
}