import { createMailOptions, sendMail } from "../email/emailHelpers.js";

export const sendEmailVerificationCode = async(user) => 
{
    const verificationCode = user.emailVerification();
    sendMail(createMailOptions(user.email, "Email confirmation", `<p>Your verification code is ${verificationCode}. This code is only valid for 10 minutes</p>`));
}