import { createMailOptions, sendMail } from "../email/emailHelpers.js";

export const sendEmailVerificationCode = async(user) => 
{
    const verificationCode = user.emailVerification();
    sendMail(createMailOptions(user.email, "Email confirmation", `<p>Your verification code is ${verificationCode}. This code is only valid for 10 minutes</p>`));
}

export const sendResetPasswordLink = (user) => {
    const {DOMAIN} = process.env;
    const verificationCode = user.resetPassword();
    sendMail(createMailOptions(user.email, "Reset Password", `<p>Your reset password <a href='${DOMAIN}/auth/resetPassword?resetPasswordToken=${verificationCode}'>link</a>. This link is only valid for 10 minutes</p>`));
}