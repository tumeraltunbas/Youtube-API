import CustomizedError from "../../helpers/error/CustomizedError.js";
import User from "../../models/User.js";
export const isEmailVerified = async(req, res, next) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email:email});
        if(!user || user.isEmailVerified != true)
        return next(new CustomizedError(400, "There is no user with that email or you did not verify your email yet."));
        next();
    }
    catch(err) {
        return next(err);
    }
}