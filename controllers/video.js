import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
import randomInteger from "random-int";
import path from "path";
import root from "app-root-path";
import { uploadFile } from "../helpers/fileUpload/fileUpload.js";
import CustomizedError from "../helpers/error/CustomizedError.js";

export const uploadVideo = async(req, res, next) => {
    try {
        const {title, description} = req.body;
        if(!req.files.video)
        return res.status(200).json({success:true, message:"You have to provide a video"});
        const video = req.files.video;
        const allowedMimetypes = ["video/mp4", "video/x-msvideo"]; //mp4 and avi
        if(!allowedMimetypes.includes(video.mimetype))
        return res.status(400).json({success:false, message:"You can upload only mp4 and avi files"});
        const channel = await Channel.findOne({user:req.user.id});
        const videoName = String(channel.id + '_' + randomInteger(1111,9999) + '.' + video.mimetype.split("/")[1]);
        let uploadPath = path.join(root.path, "public", "videos" , videoName);
        await video.mv(uploadPath, function(err){
            return next(err);
        });
        const uploadedVideo = await Video.create({title:title, description:description, video:videoName, channel:channel});
        if(req.files.file)
        {
            const thumbnail = await uploadFile(req, res, next, "thumbnails", uploadedVideo.id);
            await Video.updateOne({_id:uploadedVideo.id}, {thumbnail:thumbnail}, {runValidators:true, new:true});
        }
        return res.status(200).json({success:true, message:"Video successfully uploaded"});
    }
    catch(err) {
        return next(err);
    }
} 

export const editVideo = async(req, res, next) => {
    try{
        const {videoSlug} = req.params;
        const {title, description} = req.body;
        const video = await Video.findOne({slug:videoSlug});
        if(req.files)
        {
            var fileName = uploadFile(req, res, next, "thumbnail", video.id)
        }
        await video.updateOne({title:title, description:description, thumbnail:fileName});
        return res.status(200).json({success:true, message:"Your video successfully updated"});
    }
    catch(err){
        return next(err);
    }
}

export const watchVideo = async(req, res, next) => {
    try {
        const {videoSlug} = req.params;
        const video = await Video.findOne({slug:videoSlug}).select("title description video views viewCount channel likeCount dislikeCount comments");
        if(!video.views.includes(req.user.id))
        {
            video.views.push(req.user.id);
            video.viewCount +=1;
        }
        await video.save();
        return res.status(200).json({success:true, data:video});
    }
    catch(err) {
        return next(err);
    }
}

export const likeVideo = async(req, res, next) => {
    try{
        const {videoSlug} = req.params;
        const video = await Video.findOne({slug:videoSlug}).select("likeCount likes")
        if(video.likes.includes(req.user.id))
        return next(new CustomizedError(400, "You already liked this video"));
        video.likes.push(req.user.id);
        video.likeCount += 1
        await video.save();
        res.status(200).json({success:true, message:"The video has been successfully liked"});
    }
    catch(err) {
        return next(err);
    }
}