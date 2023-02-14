import { createMailOptions, sendMail } from "../email/emailHelpers.js";

export const sendEmailVerificationCode = async(user) => 
{
    const verificationCode = user.emailVerification();
    sendMail(createMailOptions(user.email, "Email confirmation", `<p>Your verification code is ${verificationCode}. This code is only valid for 10 minutes</p>`));
}

export const sendResetPasswordCode = (user) => {
    const verificationCode = user.resetPassword();
    sendMail(createMailOptions(user.email, "Reset Password", `<p>Your Reset password code is ${verificationCode}. This code is only valid for 10 minutes</p>`));
}