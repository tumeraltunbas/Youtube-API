import CustomizedError from "../../helpers/error/CustomizedError.js";
import User from "../../models/User.js";
import jwt from "jsonwebtoken";

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

export const getAccessToRoute = (req, res, next) => {
    const token = req.cookies.access_token;
    jwt.verify(token, process.env.JWT_SECRET_KEY, function(err, decoded){
        if(err)
        return next(err)
        req.user = {
            id:decoded.id,
            lastName:decoded.lastName
        },
        next();
    });
}