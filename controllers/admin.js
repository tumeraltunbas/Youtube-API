import CustomizedError from "../helpers/error/CustomizedError.js";
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

export const getAllStaffs = async(req, res, next) => {
    try{
        const staffs = await User.find({role:"staff"}).select("_id firstName lastName email gender phone role isActive createdAt");
        return res.status(200).json({success:true, data:staffs});
    }
    catch(err){
        return next(err);
    }
}

export const editStaff = async(req, res, next) => {
    try{
        const {userId} = req.params;
        const{role} = req.body;
        const user = await User.findOne({_id:userId}).select("role");
        if(user.role != "staff")
        return next(new CustomizedError(403, "This user is not staff. Therefore you can not edit him/her"));
        await user.update({role:role});
        return res.status(200).json({success:true, message:"This staff has been updated"});
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

export const getChannelBySlug = async(req, res, next) => {
    try{
        const {channelSlug} = req.params;
        const channel = await Channel.findOne({slug:channelSlug});
        return res.status(200).json({success:true, data:channel});
    }
    catch(err){
        return next(err);
    }
}
