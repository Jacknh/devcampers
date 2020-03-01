const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD
    }
  })

  const info = await transporter.sendMail({
    from: 'devcamper <noreply@devcamper.io>',
    to: options.to,
    subject: 'Reset password',
    text: options.text
  })

  console.log("Message sent: %s", info.messageId);
}

module.exports = sendEmail