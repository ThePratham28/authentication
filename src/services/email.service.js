import { createTransport } from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

if (!process.env.EMAIL || !process.env.PASS) {
    console.error("Error: EMAIL or PASS environment variables are not set.");
    throw new Error("Missing email configuration");
}

const transporter = createTransport({
    service: "Gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASS,
    },
});

export const sendEmail = async (to, resetLink) => {
    try {
        await transporter.sendMail({
            from: process.env.EMAIL,
            to,
            subject: "Password Reset Request",
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password</p>`,
        });
        console.log("Email sent successfully");
    } catch (error) {
        console.log(error);
    }
};
