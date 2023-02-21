import mongoose from "mongoose";

const ChannelVerificationSchema = new mongoose.Schema({
    channel: {
        type:mongoose.Schema.ObjectId,
        ref:"Channel",
        required:[true, "Channel can not be null"]
    },
    outcome: {
        type:Boolean,
        default:null
    },
    isVisible: {
        type:Boolean,
        default:true
    },
    createdAt: {
        type:Date,
        default:Date.now()
    },
});

const ChannelVerification = mongoose.model("ChannelVerification", ChannelVerificationSchema);
export default ChannelVerification;
