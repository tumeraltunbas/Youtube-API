import Channel from "../models/Channel.js";
import Video from "../models/Video.js";
import randomInteger from "random-int";
import path from "path";
import root from "app-root-path";
import { uploadFile } from "../helpers/fileUpload/fileUpload.js";

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
        const videoName = String(channel.id + '_' + randomInteger(4) + '.' + video.mimetype.split("/")[1]);
        let uploadPath = path.join(root.path, "public", "videos" , videoName);
        await video.mv(uploadPath, function(err){
            return next(err);
        });
        const uploadedVideo = await Video.create({title:title, description:description, video:videoName});
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