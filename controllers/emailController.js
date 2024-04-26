const HttpStatusCodes = require("../constants/HttpStatusCodes.js");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const jwtSecret = process.env.JWT_SECRET;

const emailDetails = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(HttpStatusCodes.EXPECTATION_FAILED).json({
        success: false,
        message: "Please input all fields.",
      });
    }

    const token = generateEmailCredentialsToken(email, { password });
    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "Credentials saved successfully",
      email,
      token,
    });
  } catch (error) {
    console.error(error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Internal server error",
    });
  }
};

const sendEmail = async (req, res) => {
  const { message, subject, recipient } = req.body;
  if (!message || !subject || !recipient)
    return res
      .status(HttpStatusCodes.BAD_REQUEST)
      .json({ success: false, message: "Please input all fields." });
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: req.emailCredentials.email,
        pass: req.emailCredentials.password,
      },
    });

    await transporter.sendMail({
      from: req.emailCredentials.email,
      to: recipient,
      subject: subject,
      text: message,
    });

    res.status(HttpStatusCodes.OK).json({
      success: true,
      message: "Email sent successfully",
    });
  } catch (error) {
    console.error(error);
    res.status(HttpStatusCodes.INTERNAL_SERVER_ERROR).json({
      success: false,
      message: "Failed to send email",
    });
  }
};

const generateEmailCredentialsToken = (email, otherData) => {
  return jwt.sign({ email, ...otherData }, jwtSecret, { expiresIn: "30d" });
};

module.exports = { sendEmail, emailDetails };
