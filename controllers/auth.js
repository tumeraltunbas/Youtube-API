import CustomizedError from "../helpers/error/CustomizedError.js";
import { validateInputs } from "../helpers/inputHelpers/inputHelpers.js";
import { sendJwtToCookie } from "../helpers/jwt/jwt.js";
import { sendEmailVerificationCode, sendResetPasswordLink } from "../helpers/modelHelpers/modelHelpers.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { uploadFile } from "../helpers/fileUpload/fileUpload.js";

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

export const logout = (req, res, next) => {
    try {
        return res.cookie("access_token", null, {expires: Date.now()}).status(200).json({success:true, message:"Logout successfull"});
    }
    catch(err) {
        return next(err);
    }
}

export const changePassword = async(req, res, next) => {
    try {
        const {oldPassword, newPassword} = req.body;
        const user = await User.findOne({_id:req.user.id}).select("password");
        if(!bcrypt.compareSync(oldPassword, user.password))
        return next(new CustomizedError(400, "Old password is wrong"));
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if(!passwordRegex.test(newPassword))
        return next(new CustomizedError(400,"Password must contain: Minimum eight characters, at least one uppercase letter, one lowercase letter and one number"));
        user.password = newPassword;
        user.lastPasswordChangedAt = Date.now();
        await user.save();
        return res.status(200).json({success:true, message:"Your password successfully changed"});
    }
    catch(err) {
        return next(err);
    }
}

export const forgotPassword = async(req, res, next) => {
    try {
        const {email} = req.body;
        const user = await User.findOne({email:email}).select("email");
        if(!user)
        return next(new CustomizedError(400, "There is no user with that email"));
        sendResetPasswordLink(user);
        return res.status(200).json({success:true, message: `Password reset link sent to ${user.email[0]}*****@${user.email.split("@")[1]}.`});
    }
    catch(err) {
        return next(err);
    }
}

export const resetPassword = async(req, res, next) => {
    try {
        const {resetPasswordToken} = req.query;
        const {password} = req.body;
        const user = await User.findOne(
            {$and : [
            {resetPasswordToken:resetPasswordToken}, 
            {resetPasswordTokenExpires: {$gt: Date.now()}}]}).select("resetPasswordToken resetPasswordTokenExpires password");
        if(!user)
        return next(new CustomizedError(400,"Your reset password token wrong or expired"));
        if(!validateInputs(password))
        return next(new CustomizedError(400, "Please provide a password"));
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if(!passwordRegex.test(password))
        return next(new CustomizedError(400,"Password must contain: Minimum eight characters, at least one uppercase letter, one lowercase letter and one number"));
        user.password = password;
        user.resetPasswordToken = null;
        user.resetPasswordTokenExpires = null;
        await user.save();
        return res.status(200).json({success:true, message:"Your password successfully changed"})
    }
    catch(err) {
        return next(err);
    }
}

export const uploadProfilePhoto = async (req, res, next) => {
    try {
        const user = await User.findOne({_id:req.user.id}).select("_id profilePhoto");
        await uploadFile(req, next, "user", user._id);
        const fileName = req.files.file.name;
        await user.updateOne({profilePhoto:fileName});
        return res.status(200).json({success:true, message:"Your profile picture successfully uploaded."});
    }
    catch(err) {
        return next(err);
    }
}