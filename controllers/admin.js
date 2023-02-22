import CustomizedError from "../helpers/error/CustomizedError.js";
import Channel from "../models/Channel.js";
import User from "../models/User.js";
import Video from "../models/Video.js";

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

export const blockUser = async(req, res, next) => {
    try{
        const {userId} = req.params;
        const user = await User.findOne({_id:userId}).select("_id role isActive");
        if(user.id == req.user.id)
        return next(new CustomizedError(400, "You can not block yourself"));
        if(user.role == "admin")
        return next(new CustomizedError(400, "You can not block admin"));
        if(user.isBlockedByAdmin == true && user.isActive == false)
        return next(new CustomizedError(400, "This user already blocked"));
        await user.update({isActive:false, isBlockedByAdmin:true});
        return res.status(200).json({success:true, message:"User has been blocked"});
    }
    catch(err){
        return next(err);
    }
}

export const unblockUser = async(req, res, next) => {
    try{
        const {userId} = req.params;
        const user = await User.findOne({_id:userId}).select("_id role isActive");
        if(user.id == req.user.id)
        return next(new CustomizedError(400, "You can not block yourself"));
        if(user.isBlockedByAdmin == false && user.isActive==true)
        return next(new CustomizedError(400, "This user already unblocked"))
        await user.update({isBlockedByAdmin:false, isActive:true});
        return res.status(200).json({success:true, message:"User has been unblocked"});
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

export const getAllVideos = async(req, res, next) => {
    try{
        const videos = await Video.find({}).select("_id title thumbnail channel viewCount likeCount dislikeCount commentCount isVisible isHidByAdmin");
        const videoCount = videos.length;
        return res.status(200).json({success:true, data:videos, videoCount:videoCount});
    }
    catch(err){
        return next(err);
    }
}

export const getVideoBySlug = async(req, res, next) => {
    try{
        const {videoSlug} = req.params;
        const video = await Video.findOne({slug:videoSlug});
        if(!video)
        return next(new CustomizedError(400, "There is no video with that slug"));
        return res.status(200).json({success:true, data:video});
    }
    catch(err){
        return next(err);
    }
}

export const hideVideo = async(req, res, next) => {
    try{
        const {videoSlug} = req.params;
        const video = await Video.findOne({slug:videoSlug}).select("_id isVisible isHidByAdmin");
        if(!video)
        return next(new CustomizedError(400, "There is no video with that slug"));
        if(video.isVisible == false && video.isHidByAdmin == true)
        return next(new CustomizedError(400, "This video already hid by admin"));
        await video.update({isVisible:false, isHidByAdmin:true});
        return res.status(200).json({success:true, message:"Video has been hidden"});
    }
    catch(err){
        return next(err);
    }
}

export const showVideo = async(req, res, next) => {
    try{
        const {videoSlug} = req.params;
        const video = await Video.findOne({slug:videoSlug}).select("_id isVisible isHidByAdmin");
        if(!video)
        return next(new CustomizedError(400, "There is no video with that slug"));
        if(video.isVisible == true && video.isHidByAdmin == false)
        return next(new CustomizedError(400, "This video already visible"));
        await video.updateOne({isVisible:true, isHidByAdmin:true});
        return res.status(200).json({success:true, message:"Video has been showed"});
    }
    catch(err){
        return next(err);
    }
}