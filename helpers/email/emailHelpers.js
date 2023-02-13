import nodemailer from "nodemailer";

export const sendMail = (mailOptions) => {
    const transport = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    });
    transport.sendMail(mailOptions);
}

export const createMailOptions = (to, subject, html) => {
    const options = {
        from:process.env.SMTP_USER,
        to:to,
        subject:subject,
        html:html
    };
    return options;
}
