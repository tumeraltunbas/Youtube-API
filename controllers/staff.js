import ChannelVerification from "../models/ChannelVerification.js";
export const verificationRequests = async(req, res, next) => {
    try{
        const verificationRequests = await ChannelVerification.find({isVisible:true});
        return res.status(200).json({success:true, data:verificationRequests});
    }
    catch(err)
    {
        return next(err);
    }
}