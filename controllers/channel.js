import CustomizedError from "../helpers/error/CustomizedError.js";
import { uploadFile } from "../helpers/fileUpload/fileUpload.js";
import Channel from "../models/Channel.js";
import ChannelVerification from "../models/ChannelVerification.js";
import Playlist from "../models/Playlist.js";
import User from "../models/User.js";
import Video from "../models/Video.js";
import root from "app-root-path"
import path from "path";

export const createChannel = async(req, res, next) => {
    try{
        const {name, channelDecription, location, email} = req.body;
        const user = await User.findOne({_id:req.user.id}).select("_id email");
        if(Channel.findOne({user:user.id}))
        return next(new CustomizedError(400, "You can not create a new channel because you have already one"));
        await Channel.create({name:name, channelDescription:channelDecription, location:location, user:req.user.id, email: email||user.email});
        return res.status(200).json({succes:true, message:"Your channel successfully created"});
    }
    catch(err){
        return next(err);
    }
}

export const uploadChannelProfilePhoto = async(req, res, next) => {
    try {
        const channel = await Channel.findOne({user:req.user.id}).select("_id channelProfilePhoto");
        const fileName = await uploadFile(req, res, next, "channel", channel.id);
        await channel.updateOne({channelProfilePhoto:fileName}, {new:true});
        return res.status(200).json({success:true, message:"Channel profile photo successfully uploaded"});
    }
    catch(err) {
        return next(err);
    }
}

export const uploadBanner = async(req, res, next) => {
    try{
        const channel = await Channel.findOne({user:req.user.id}).select("_id channelBanner");
        const fileName = await uploadFile(req, res, next, "banner", channel.id);
        await channel.updateOne({channelBanner:fileName}, {new:true});
        return res.status(200).json({success:true, message:"Banner has been uploaded"});
    }
    catch(err){
        return next(err);
    }
}

export const editChannelInformations = async(req, res, next) => {
    try {
        const {name, channelDescription, location} = req.body;
        await Channel.updateOne({user:req.user.id}, {name:name, channelDescription:channelDescription, location:location}, {runValidators:true});
        return res.status(200).json({success:true, message:"Your channel's information successfully changed"});
    }
    catch(err){
        return next(err);
    }
}

export const getChannel = async(req, res, next) => {
    try {
        const {channelSlug} = req.params;
        const channel = await Channel.findOne({slug:channelSlug, isVisible:true}).select("_id");
        const videos = await Video.find({channel:channel.id, isVisible:true}).limit(5).select("title video thumbnail viewCount uploadedAt").sort({uploadedAt:"desc"});
        const highlightedVideo = await Video.findOne({isHighlighted:true, isVisible:true}).select("title description video thumbnail viewCount uploadedAt");
        const popularVideos = await Video.find({channel:channel.id, isVisible:true}).limit(5).select("title video thumbnail viewCount uploadedAt").sort({viewCount:"asc"});
        const highlightedPlaylists = await Playlist.find({isHighlighted:true,isVisible:true}).select("title").populate({path:"video", select: "title video thumbnail viewCount createdAt"});
        return res.status(200).json({success:true, videos:videos, highlightedVideo:highlightedVideo, popularVideos:popularVideos, highlightedPlaylists:highlightedPlaylists});
    }
    catch(err){
        return next(err);
    }
}

export const subscribe = async(req, res, next) => {
    try {
        const {channelSlug} = req.params;
        const channel = await Channel.findOne({slug:channelSlug}).select("subscribers subscribeCount");
        if(channel.subscribers.includes(req.user.id))
        return next(new CustomizedError(400, "You already subscribed to this channel"));
        channel.subscribers.push(req.user.id);
        channel.subscribeCount +=1;
        await channel.save();
        return res.status(200).json({success:true, message:"Subscribe successfull"});
    }
    catch(err) {
        return next(err);
    }
}

export const unsubscribe = async(req, res, next) => {
    try {
        const {channelSlug} = req.params;
        const channel = await Channel.findOne({slug:channelSlug}).select("subscribers subscribeCount");
        if(!channel.subscribers.includes(req.user.id))
        return next(new CustomizedError(400, "You already did not subscribe to this channel"));
        channel.subscribers.splice(req.user.id,1);
        channel.subscribeCount -=1;
        await channel.save();
        return res.status(200).json({success:true, message:"Unsubscribe successfull"});
    }
    catch(err) {
        return next(err);
    }
}

export const channelAbout = async(req, res, next) => {
    try {
        const {channelSlug} = req.params;
        const channel = await Channel.findOne({slug:channelSlug, isVisible:true}).select("_id channelDescription location totalViews createdAt");
        return res.status(200).json({success:true, data:channel});
    }
    catch(err){
        return next(err);
    }
}

export const searchInChannel = async(req, res, next) => {
    try {
        const {channelSlug} = req.params;
        const {s} = req.query;
        const regex = new RegExp(s,"i");
        const channel = await Channel.findOne({slug:channelSlug}).select("_id");
        const videos = await Video.find({title:regex, channel:channel.id, isVisible:true});
        return res.status(200).json({success:true, data:videos});
    }
    catch(err){
        return next(err);
    }
}

export const channelVerificationRequest = async(req, res, next) => {
    try{
        const channel = await Channel.findOne({user:req.user.id}).select("_id");
        if(await ChannelVerification.findOne({channel:channel.id, isVisible:true}))
        return next(new CustomizedError(400, "You already have an unfinished channel verification request"))
        if((channel.channelProfilePhoto != "profile.jpg" && channel.channelBanner != "banner.jpg" && channel.isVisible == true && channel.subscribeCount > 100000 && channel.videoCount > 0)) {
            await ChannelVerification.create({channel:channel.id});
        }
        else{
            return next(new CustomizedError(401, "You do not meet the qualifications to request channel verification"));
        }
        return res.status(200).json({success:true, message:"Channel verification request has been sent."});
    }
    catch(err){
        return next(err);
    }
}