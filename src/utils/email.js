const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.SMPT_USERNAME,
        pass: process.env.SMPT_PASSWORD
    }
});


exports.sendEmailWithNodeMailer = async (mailData) => {
    try {
        const mailOption = {
            from: process.env.SMPT_USERNAME,
            to: mailData.email,
            subject: mailData.subject,
            html: mailData.html,
        }

        const info = await transporter.sendMail(mailOption)
        console.log("Message sent: %s", info.response)

    } catch (error) {

        console.error("something went wrong!", error)
        throw error

    }
}