import mongoose from "mongoose";
import randomInteger from 'random-int';
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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
    emailVerificationCode: {
        type: String
    },
    emailVerificationCodeExpires: {
        type: Date
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    phoneVerificationCode: {
        type: String,
    },
    phoneVerificationCodeExpires: {
        type: Date
    },
    isPhoneVerified: {
        type:Boolean,
        default:false
    },
    isActive: {
        type:Boolean,
        default:0
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

UserSchema.methods.emailVerification = function()
{
    const verificationCode = this.createVerificationCode();
    this.emailVerificationCode = verificationCode;
    this.emailVerificationCodeExpires = new Date(Date.now() +  Number(process.env.EMAIL_VERIFICATION_CODE_EXPIRES))
    this.save();
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

const User = mongoose.model("User", UserSchema);
export default User;