import { createMailOptions, sendMail } from "../helpers/email/emailHelpers.js";
import Channel from "../models/Channel.js";
import ChannelVerification from "../models/ChannelVerification.js";
import Report from "../models/Report.js";
import Video from "../models/Video.js";
import User from "../models/User.js";

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

export const confirmReport = async(req, res, next) => {
    try{
        const {reportId} = req.params;
        const report = await Report.findOne({_id:reportId}).select("_id video user reason"); 
        const video = await Video.findOne({_id: report.video}).select("_id channel");
        const channel = await Channel.findOne({_id:video.channel}).select("_id email");
        const user = await User.findOne({_id:report.user}).select("_id firstName lastName email");
        await video.updateOne({isVisible:false});
        await report.updateOne({isVisible:false});
        sendMail(createMailOptions(channel.email, "Your video has been deleted", `<p>Your video has been deleted from Youtube due to ${report.reason}</p>`));
        sendMail(createMailOptions(user.email, "Thanks for report", `<p>Dear ${user.firstName} ${user.lastName}, Your report was received positively by us and the related video was removed from YouTube.</p>`));
        res.status(200).json({success:true, message:"Report has been confirmed"});        
    }
    catch(err){
        return next(err);
    }
}