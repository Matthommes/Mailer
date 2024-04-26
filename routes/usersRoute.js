const express = require("express");
const router = express.Router();
const {
  registerUser,
  loginUser,
  resetPasswordRequest,
  verifyEmail,
} = require("../controllers/usersController.js");
const { authenticateUser } = require("../middlewares/authMiddleware.js");

router.post("/", registerUser);
router.post("/login", loginUser);
router.post("/verify-email/:token", verifyEmail);
router.post("/reset-password/:token", authenticateUser, resetPasswordRequest);

module.exports = router;
