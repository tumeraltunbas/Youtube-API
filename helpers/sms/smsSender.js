import AWS from "aws-sdk";

export const sendSms = async(phone, text) => {
    AWS.config.update({
        region: process.env.AWS_REGION,
        apiVersion:"lastest",
        credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_ID,
        }
    });
    let parameters = {Message:text, PhoneNumber:phone};
    return new AWS.SNS().publish(parameters).promise().then().catch(err=>console.log(err));
}
