import CustomizedError from "../../helpers/error/CustomizedError.js";
import Channel from "../../models/Channel.js";
import ChannelVerification from "../../models/ChannelVerification.js";
import Playlist from "../../models/Playlist.js";
import Report from "../../models/Report.js";
import User from "../../models/User.js";
import Video from "../../models/Video.js";

export const isVideoExists = async(req, res, next) => {
    try{
        const {channelSlug, videoSlug} = req.params;
        const channel = await Channel.findOne({slug:channelSlug, isVisible:true}).select("_id");
        if(!channel)
        return next(new CustomizedError(400, "There is no channel with this slug"));
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
        if(!await Channel.findOne({slug:channelSlug, isVisible:true}).select("_id"))
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
        const video = await Video.findOne({slug:videoSlug, isVisible:true}).select("_id comments");
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
        if(!await Playlist.findOne({_id:playlistId, isVisible:true}).select("_id"))
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
        const playlist = await Playlist.findOne({_id: playlistId, isVisible:true}).select("_id videos");
        const video = await Video.findOne({slug:videoSlug}).select("_id");
        if(!playlist.videos.includes(video.id))
        return next(new CustomizedError(400, "There is no video in this playlist"));
        next();
    }
    catch(err){
        return next(err);
    }
}

export const isVerificationRequestExists = async(req, res, next) => {
    try{
        const {channelId} = req.params;
        if(!await ChannelVerification.findOne({channel:channelId, isVisible:true}))
        return next(new CustomizedError(400, "There is no verification request by this channel"));
        next();
    }
    catch(err){
        return next(err);
    }
}

export const isReportExists = async(req, res, next) => {
    try{
        const {reportId} = req.params;
        if(!await Report.findOne({_id:reportId, isVisible:true}).select("_id isVisible"))
        return next(new CustomizedError(400, "There is no report with this id"));
        next();
    }
    catch(err){
        return next(err);
    }
}

export const isUserExists = async(req, res, next) => {
    try{
        const {userId} = req.params;
        if(!await User.findOne({_id:userId}).select("_id"))
        return next(new CustomizedError(400, "There is no user with that id"));
        next();
    }
    catch(err){
        return next(err);
    }
}