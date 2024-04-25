const nodemailer = require("nodemailer");

const sendMail = async (to, html, subject) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const mailOptions = {
    from: "Mailer",
    to,
    html,
    subject,
  };
  return new Promise((resolve, reject) => {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending mail:", error);
        reject(error);
      } else {
        console.log("Mail sent:", info.response);
        resolve({
          to,
          html,
          subject,
        });
      }
    });
  });
};

module.exports = { sendMail };
