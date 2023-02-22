import Channel from "../models/Channel.js";
import User from "../models/User.js";

export const getAllUsers = async(req, res, next) => {
    try{
        const users = await User.find({}).select("_id firstName lastName email gender phone isActive createdAt");
        const userCount = users.length;
        return res.status(200).json({success:true, data:users, userCount:userCount});
    }
    catch(err){
        return next(err);
    }
}

export const getUserById = async(req, res, next) => {
    try{ 
        const {userId} = req.params; 
        const user = await User.findOne({_id:userId}); 
        return res.status(200).json({success:true, data:user});
    } 
    catch(err){
        return next(err);
    }
}             

export const getAllChannels = async(req, res, next) => {
    try{
        const channels = await Channel.find({}).select("name videoCount subscribeCount location email user totalViews isChannelVerified").populate({path:"user", select: "_id firstName lastName email gender phone isActive createdAt"});
        const channelCount = channels.length;
        return res.status(200).json({success:true, data:channels, channelCount:channelCount});
    }
    catch(err){
        return next(err);
    }
}
