import Playlist from "../models/Playlist.js";

export const createPlaylist = async(req, res, next) => {
    try{
        const {name, privacy} = req.body;
        await Playlist.create({name:name, privacy:privacy});
        return res.status(200).json({success:true, message: "Playlist has been created"});
    }
    catch(err)
    {
        return next(err);
    }
}