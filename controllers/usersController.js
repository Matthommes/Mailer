// import HttpStatusCodes from "../constants/HttpStatusCodes.ts";
// import { prisma } from "../config/db.config.js";

const HttpStatusCodes = require("../constants/HttpStatusCodes.js");
const { prisma } = require("../config/db.config.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendMail } = require("../utils/emails.js");
const { emailVerification } = require("../constants/emailTemp.js");
const { v4: uuidv4 } = require("uuid");

const jwtSecret = process.env.JWT_SECRET;

const registerUser = async (req, res) => {
  const token = uuidv4();
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(HttpStatusCodes.EXPECTATION_FAILED).json({
        success: false,
        message: "Please fill in all required fields.",
      });
      return;
    }
    const userExist = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExist)
      return res.status(HttpStatusCodes.CONFLICT).json({
        success: false,
        message: "A user with this email already exists",
      });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        uuid: token,
        isVerified: false,
      },
    });

    res.status(HttpStatusCodes.CREATED).json({
      success: true,
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });

    const emailMessage = emailVerification(user, token);
    sendMail(user.email, emailMessage, "Welcome to Mailer");
  } catch (error) {
    console.error(error);
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(HttpStatusCodes.EXPECTATION_FAILED).json({
        success: false,
        message: "Please add your email and password",
      });

    // CHECK IF USER EXIST

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user)
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        success: false,
        message: "A User with this email does not exist",
      });

    const hashedPasswordMatch = await bcrypt.compare(password, user.password);
    if (!hashedPasswordMatch)
      return res.status(HttpStatusCodes.UNAUTHORIZED).json({
        success: false,
        message: "Invalid password",
      });

    // Authentication successful
    return res.status(HttpStatusCodes.OK).json({
      success: true,
      _id: user.id,
      name: user.name,
      email: user.email,
      token: generateToken(user.id),
    });
  } catch (error) {
    console.error(error);
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
};

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;
    if (!token) {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ success: false, message: "No token provided" });
      return;
    }
    const user = await prisma.user.findFirst({
      where: { uuid: token },
    });
    if (!user)
      return res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ success: false, message: "Invalid or expired token." });

    if (user.isVerified === null) {
      await prisma.user.update({
        where: { id: user.id },
        data: { isVerified: true, uuid: "" },
      });
      res
        .status(HttpStatusCodes.OK)
        .json({ success: true, message: "Email verification successful" });
    } else {
      res
        .status(HttpStatusCodes.BAD_REQUEST)
        .json({ success: false, message: "User already verified" });
    }
  } catch (error) {
    console.error(error);
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server error" });
  }
};

const resetPasswordRequest = async (req, res) => {
  try {
    const email = req.body.email;

    // CHECK IF USER EXIST IN DB

    const user = await prisma.user.findUnique({
      where: email,
    });

    if (!user)
      return res.status(HttpStatusCodes.BAD_REQUEST).json({
        success: false,
        message: "A user with that email does not exist.",
      });

    const token = uuidv4();

    await prisma.user.update({
      where: { id: user.id },
      uuid: { token },
    });
    const emailMessage = resetPasswordEmail(user, token);
  } catch (error) {
    console.error(error);
    res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server error." });
  }
};

// GENERATE JWT
const generateToken = (id) => {
  return jwt.sign({ id }, jwtSecret, {
    expiresIn: "30d",
  });
};

module.exports = { registerUser, loginUser, verifyEmail, resetPasswordRequest };
