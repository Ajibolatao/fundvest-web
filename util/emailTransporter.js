import dotenv from "dotenv";
import nodemailer from "nodemailer";

if (process.env.NODE_ENV !== "production") dotenv.config();

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // generated ethereal user
    pass: process.env.EMAIL_PASS, // generated ethereal password
  },
});


export default transporter;
