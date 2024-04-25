const express = require("express");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const usersRoute = require("./routes/usersRoute.js");
const emailRoute = require("./routes/emailRoute.js");
const { authenticateUser } = require("./middlewares/authMiddleware.js");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

//MIDDLEWARES

//Routes

app.use("/auth/", usersRoute);
app.use("/email/", emailRoute);

app.listen(port, () => {
  console.log(`Server started on port  ${port}`);
});
