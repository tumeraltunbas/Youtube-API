import CustomizedError from "../helpers/error/CustomizedError.js";
import Playlist from "../models/Playlist.js";
import Video from "../models/Video.js";

export const createPlaylist = async(req, res, next) => {
    try{
        const {name, privacy} = req.body;
        await Playlist.create({name:name, privacy:privacy, user:req.user.id});
        return res.status(200).json({success:true, message: "Playlist has been created"});
    }
    catch(err)
    {
        return next(err);
    }
}

export const hidePlaylist = async(req, res, next) => {
    try {
        const {playlistId} = req.params;
        await Playlist.updateOne({_id:playlistId}, {isVisible:false}, {new:true});
        return res.status(200).json({success:true, message:"Your playlist has been deleted"});
    }
    catch(err) {
        return next(err);
    }
}

export const addVideoToPlaylist = async(req, res, next) => {
    try{
        const {videoSlug, playlistId} = req.params;
        const video = await Video.findOne({slug:videoSlug}).select("_id");
        const playlist = await Playlist.findById(playlistId).select("_id videos");
        if(playlist.videos.includes(video.id))
        return next(new CustomizedError(400, "This video is already available on this playlist"));
        playlist.videos.push(video.id);
        await playlist.save();
        return res.status(200).json({success:true, message:"Video has been added to playlist"});
    }
    catch(err){
        return next(err);
    }
}