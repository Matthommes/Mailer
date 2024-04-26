const jwt = require("jsonwebtoken");
const { prisma } = require("../config/db.config.js");
const HttpStatusCodes = require("../constants/HttpStatusCodes");
const jwtSecret = process.env.JWT_SECRET;

const authenticateUser = async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      const decoded = jwt.verify(token, jwtSecret);
      if (!decoded.id) {
        throw new Error("Invalid token: User ID not found");
      }
      req.userId = await prisma.user.findUnique({
        where: { id: decoded.id },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });
      return next();
    } catch (error) {
      console.error(error);
      res
        .status(HttpStatusCodes.UNAUTHORIZED)
        .json({ message: "Unauthorized" });
    }
  }

  if (!token)
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ success: false, message: "Unauthorized, no token." });
};

const authenticateWithEmailCredentials = (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
     
      const decoded = jwt.verify(token, jwtSecret);
      req.emailCredentials = decoded;
      next();
    } catch (error) {
      console.error(error);
      return res
        .status(HttpStatusCodes.UNAUTHORIZED)
        .json({ message: "Invalid email credentials token" });
    }
  }

  if (!token)
    return res
      .status(HttpStatusCodes.UNAUTHORIZED)
      .json({ success: false, message: "Unauthorized, no token." });
};

module.exports = { authenticateUser, authenticateWithEmailCredentials };
