import CustomizedError from "../../helpers/error/CustomizedError.js";
import Channel from "../../models/Channel.js";
import Playlist from "../../models/Playlist.js";
import Video from "../../models/Video.js";

export const isVideoExists = async(req, res, next) => {
    try{
        const {channelSlug, videoSlug} = req.params;
        const channel = await Channel.findOne({slug:channelSlug}).select("_id");
        if(!await Video.findOne({slug:videoSlug, channel:channel.id}))
        return next(new CustomizedError(400, "There is no video like this"));
        next();
    }
    catch(err) {
        return next(err);
    }
}

export const isChannelExist = async(req, res, next) => {
    try {
        const {channelSlug} = req.params;
        if(!await Channel.findOne({slug:channelSlug}).select("_id"))
        return next(new CustomizedError(400, "There is no channel with this slug"));
        next();
    }
    catch(err) {
        return next(err);
    }
}

export const isCommentExists = async(req, res, next) => {
    try {
        const {videoSlug, commentId} = req.params;
        const video = await Video.findOne({slug:videoSlug}).select("_id comments");
        if(!video.comments.includes(commentId))
        return next(new CustomizedError(400, "There is no comment in this video"));
        next();
    }
    catch(err) {
        return next(err);
    }
}

export const isPlaylistExists = async(req, res, next) => {
    try{
        const {playlistId} = req.params;
        if(!await Playlist.findById(playlistId).select("_id"))
        return next(new CustomizedError(400, "There is no playlist with that id"));
        next();
    }
    catch(err){
        return next(err);
    }
}

export const isVideoExistsInPlaylist = async(req, res, next) => {
    try{
        const {videoSlug, playlistId} = req.params;
        const playlist = await Playlist.findById(playlistId).select("_id videos");
        const video = await Video.findOne({slug:videoSlug}).select("_id");
        if(!playlist.videos.includes(video.id))
        return next(new CustomizedError(400, "There is no video in this playlist"));
        next();
    }
    catch(err){
        return next(err);
    }
}