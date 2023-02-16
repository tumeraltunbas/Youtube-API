import CustomizedError from "../helpers/error/CustomizedError.js";
import { uploadFile } from "../helpers/fileUpload/fileUpload.js";
import Channel from "../models/Channel.js";
import User from "../models/User.js";

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
        const {slug} = req.params;
        const channel = await Channel.findOne({slug:slug}).select("name channelDescription videos videoCount subscribeCount channelProfilePhoto location channels email totalViews");
        return res.status(200).json({success:true, data:channel}); 
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