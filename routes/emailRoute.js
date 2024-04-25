const express = require("express");
const {
  authenticateUser,
  authenticateWithEmailCredentials,
} = require("../middlewares/authMiddleware");
const { sendEmail, emailDetails } = require("../controllers/emailController");
const router = express.Router();

router.post("/set-credentials", authenticateUser, emailDetails);
router.post("/send-email", authenticateWithEmailCredentials, sendEmail);

module.exports = router;
