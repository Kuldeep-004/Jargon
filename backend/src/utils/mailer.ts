import nodemailer from "nodemailer";

const transporter=
    nodemailer.createTransport({
        service:"gmail",
        auth:{user:process.env.GMAIL_ID,pass:process.env.GMAIL_PASS}
    });

export const sendMail = async (email:string,mailtext:string) => {
    await transporter.sendMail({
        from:process.env.GMAIL_ID,
        to: email,
        subject:"OTP FOR JARGON BY KULDEEP",
        text:mailtext,
    })
};
