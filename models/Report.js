import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema({
    video: {
        type:mongoose.Schema.ObjectId,
        required:[true, "Video can not be null"],
        ref:"Video"
    },
    user:{
        type:mongoose.Schema.ObjectId,
        required:[true, "User can not be null"],
        ref:"User"
    },
    reason: {
        type: String,
        enum: ["Violent content", "Tyranny", "Spam or misleading content", "It violates my rights", "Problem is not stated here"],
        required:[true, "Reason can not be null"]
    },
    details: {
        type:String,
        default:null,
    },
    isVisible: {
        type:Boolean,
        default:true
    },
    createdAt: {
        type:Date,
        default:Date.now()
    }
});

const Report = mongoose.model("Report", ReportSchema);
export default Report;