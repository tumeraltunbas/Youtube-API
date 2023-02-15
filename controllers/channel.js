import CustomizedError from "../helpers/error/CustomizedError.js";
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