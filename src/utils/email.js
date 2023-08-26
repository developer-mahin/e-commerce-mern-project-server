const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.SMPT_USERNAME,
    pass: process.env.SMPT_PASSWORD,
  },
});

exports.sendEmailWithNodeMailer = async (emailData) => {
  try {
    const mailOption = {
      from: process.env.SMPT_USERNAME,
      to: emailData.email,
      subject: emailData.subject,
      html: emailData.html,
    };

    const info = await transporter.sendMail(mailOption);
    console.log("message %s", info.response);
  } catch (error) {
    throw error;
  }
};
