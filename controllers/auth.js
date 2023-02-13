import { createMailOptions, sendMail } from "../helpers/email/emailHelpers.js";
import User from "../models/User.js";
export const register = async(req, res, next) => {
    try{
        const {firstName, lastName, email, password, gender} = req.body;
        const user = await User.create({firstName:firstName, lastName:lastName, email:email, password:password, gender:gender});
        const verificationCode = await user.emailVerification();
        sendMail(createMailOptions(email, "Email confirmation", `<p>Your email verification code is ${verificationCode}. This code is only valid for 10 minutes</p>`));
        return res.status(200).json({success:true, message:`Email verification code sent to ${email}`});
    }
    catch(err){
        return next(err);
    }
}