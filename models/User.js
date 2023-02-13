import mongoose from "mongoose";
import randomInteger from 'random-int';

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
        match: [/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, "Password must contain: Minimum eight characters, at least one uppercase letter, one lowercase letter and one number"],
        required: [true, "Password can not be null"],
    },
    gender: {
        type: Boolean,
        required:[true, "Gender can not be null"]
    },
    phone: {
        type: String,
        match: [/^(\+\d{1,2}\s?)?1?\-?\.?\s?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/, "Invalid phone format"]
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


UserSchema.methods.createVerificationCode = function()
{
    return randomInteger(111111,999999);
}

UserSchema.methods.emailVerification = function()
{
    const verificationCode = this.createVerificationCode();
    this.emailVerificationCode = verificationCode;
    this.emailVerificationCodeExpires = process.env.EMAIL_VERIFICATION_CODE_EXPIRES
    this.save();
    return verificationCode;
}

const User = mongoose.model("User", UserSchema);
export default User;