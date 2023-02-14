import CustomizedError from "../helpers/error/CustomizedError.js";
import { validateInputs } from "../helpers/inputHelpers/inputHelpers.js";
import { sendJwtToCookie } from "../helpers/jwt/jwt.js";
import { sendEmailVerificationCode } from "../helpers/modelHelpers/modelHelpers.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const register = async(req, res, next) => {
    try{
        const {firstName, lastName, email, password, gender} = req.body;
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/
        if(!passwordRegex.test(password))
        return next(new CustomizedError(400,"Password must contain: Minimum eight characters, at least one uppercase letter, one lowercase letter and one number"));
        const user = await User.create({firstName:firstName, lastName:lastName, email:email, password:password, gender:gender});       
        await sendEmailVerificationCode(user); 
        sendJwtToCookie(user, res);
    }
    catch(err){
        return next(err);
    }
}

export const emailVerification = async(req, res, next) => {
    try {
        const {emailVerificationCode} = req.body;
        const user = await User.findOne(
            {$and : [
                {emailVerificationCode:emailVerificationCode}, 
                {emailVerificationCodeExpires: {$gt: Date.now()}}]})
                .select("isEmailVerified emailVerificationCode emailVerificationCodeExpires");
        if(!user)
        return next(new CustomizedError(400, "Your verification code wrong or expired."));
        await user.update({emailVerificationCode:null, emailVerificationCodeExpires:null, isEmailVerified:true});
        return res.status(200).json({success:true, message:"Your email has been verified."});
    }
    catch(err) {
        return next(err);
    }
}

export const login = async(req, res, next) => {
    try {
        const {email, password} = req.body;
        if(!validateInputs(email, password))
        return next(new CustomizedError(400, "Please make sure you fill all the fields"));
        const user = await User.findOne({email:email}).select("password");
        if(!bcrypt.compareSync(password, user.password ))
        return next(new CustomizedError(400, "Your password is wrong"));
        sendJwtToCookie(user, res);
    }
    catch(err) {
        return next(err);
    }
}