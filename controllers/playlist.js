import Playlist from "../models/Playlist.js";

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