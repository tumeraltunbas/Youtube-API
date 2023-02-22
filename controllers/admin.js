import User from "../models/User.js";

export const getAllUsers = async(req, res, next) => {
    try{
        const users = await User.find({}).select("_id firstName lastName email gender phone isActive createdAt");
        const userCount = users.length;
        return res.status(200).json({success:true, data:users, userCount:userCount});
    }
    catch(err){
        return next(err);
    }
}

export const getUserById = async(req, res, next) => {
    try{ 
        const {userId} = req.params; 
        const user = await User.findOne({_id:userId}); 
        return res.status(200).json({success:true, data:user});
    } 
    catch(err){
        return next(err);
    }
}             