import mongoose from "mongoose";
import randomInteger from 'random-int';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {generate} from "randomstring";
import Comment from "./Comment.js";
import Channel from "./Channel.js";

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required:[true, "First Name can not be null"],
        minlength: [3, "First Name can not be less than 3 characters"]
    },
    lastName: {
        type:String,
        required:[true, "Last Name can not be null"],
        minlength: [2, "Last Name can not be less than 2 characters"]
    },
    email: {
        type:String,
        match: [/^[a-zA-Z0-9_.+]+(?<!^[0-9]*)@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/, "Invalid email format"],
        required:[true, "Email can not be null"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password can not be null"],
    },
    gender: {
        type: Boolean,
        required:[true, "Gender can not be null"]
    },
    phone: {
        type: String,
        match: [/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, "Invalid phone format"],
        unique:true
    },
    profilePhoto: {
        type: String,
    },
    role: {
        type:String,
        enum:["user","staff","admin"],
        default:"user"
    },
    emailVerificationCode: {
        type: String,
        default:null
    },
    emailVerificationCodeExpires: {
        type: Date,
        default:null
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    phoneVerificationCode: {
        type: String,
        default:null
    },
    phoneVerificationCodeExpires: {
        type: Date,
        default:null
    },
    isPhoneVerified: {
        type:Boolean,
        default:false
    },
    lastPasswordChangedAt: {
        type:Date,
        default:null
    },
    resetPasswordToken: {
        type:String,
        default:null
    },
    resetPasswordTokenExpires: {
        type:Date,
        default:null
    },
    isActive: {
        type:Boolean,
        default:true
    },
    createdAt: {
        type: Date,
        default:Date.now()
    }
});

UserSchema.pre("save", function(next)
{
    if(this.isModified("password"))
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync());
    next(); 
});

UserSchema.methods.createVerificationCode = function()
{
    return randomInteger(111111,999999);
}

UserSchema.methods.emailVerification = async function()
{
    const verificationCode = this.createVerificationCode();
    this.emailVerificationCode = verificationCode;
    this.emailVerificationCodeExpires = new Date(Date.now() +  Number(process.env.EMAIL_VERIFICATION_CODE_EXPIRES))
    await this.save();
    return verificationCode;
}

UserSchema.methods.phoneVerification = async function() {
    const verificationCode = this.createVerificationCode();
    this.phoneVerificationCode = verificationCode;
    this.phoneVerificationCodeExpires = new Date(Date.now() + Number(process.env.PHONE_VERIFICATION_CODE_EXPIRES));
    await this.save();
    return verificationCode;
}

UserSchema.methods.createJwt = function() {
    const payload = {
        id: this._id,
        lastName: this.lastName
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {expiresIn:process.env.JWT_EXPIRES});
    return token; 
}

UserSchema.methods.resetPassword = async function() {
    const resetPasswordToken = bcrypt.hashSync(generate(15));
    this.resetPasswordToken = resetPasswordToken;
    this.resetPasswordTokenExpires = new Date(Date.now() +  Number(process.env.RESET_PASSWORD_TOKEN_EXPIRES));
    await this.save();
    return resetPasswordToken;
}

const User = mongoose.model("User", UserSchema);
export default User;