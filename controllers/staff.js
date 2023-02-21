import { createMailOptions, sendMail } from "../helpers/email/emailHelpers.js";
import Channel from "../models/Channel.js";
import ChannelVerification from "../models/ChannelVerification.js";
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
        await ChannelVerification.updateOne({channel:channelId}, {isVisible:false}, {new:true});
        await Channel.updateOne({_id:channelId, isVisible:true}, {isChannelVerified:true}, {new:true});
        return res.status(200).json({success:true, message:"Channel has been verified"});
    }
    catch(err){
        return next(err);
    }
}
//isteklerinin kabul edildiğine veya reddedildiğine dair mail gönder
export const refuseChannelVerification = async(req, res, next) => {
    try{
        const {channelId} = req.params;
        await ChannelVerification.updateOne({channel:channelId}, {isVisible:false}, {new:true});
        return res.status(200).json({success:true, message:"Verification request has been refused"});
    }
    catch(err){
        return next(err);
    }
}