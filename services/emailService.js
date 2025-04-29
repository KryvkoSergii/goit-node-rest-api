import nodemailer from "nodemailer";

const config = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: process.env.MAIL_USERNAME,
    pass: process.env.MAIL_PASSWORD,
  },
};

export async function sendVerificationLetter(email, host, token) {
  const transporter = nodemailer.createTransport(config);
  const emailOptions = {
    from: process.env.MAIL_FROM,
    to: email,
    subject: "Verification link",
    text: `Please verify your email address by clicking the "${host}/api/auth/verify/${token}".`,
  };

  try{
    await transporter.sendMail(emailOptions);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Failed to send email: " + error.message);
  }
}