const express = require("express");
const router = express.Router();
const PasswordModel = require("../db/password/password.model"); // Adjust the path to your Password model
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Middleware to verify JWT token (simplified version)
const verifyToken = (req, res, next) => {
  const token = req.cookies.username; // Assuming the token is stored in cookies
  console.log(token);
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }

  try {
    const decoded = jwt.verify(token, "HUNTERS_PASSWORD"); // Replace "SECRET_KEY" with your actual secret key
    req.user = decoded;
  } catch (err) {
    return res.status(401).send("Invalid Token");
  }

  return next();
};
// Example route to set a cookie
app.get("/set-cookie", (req, res) => {
  const options = {
    httpOnly: true,
    maxAge: 24 * 60 * 60 * 1000, // 24 hours
    secure: process.env.NODE_ENV === "production", // Use Secure cookies in production
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax", // Use SameSite=None with Secure in production
  };

  res.cookie("token", "example_token", options);
  res.send("Cookie has been set");
});
// POST to save a new password entry
router.post("/", verifyToken, async function (request, response) {
  const { url, password } = request.body;
  const date = new Date();

  if (!url || !password) {
    return response.status(422).send("Missing URL or password");
  }

  try {
    const newPasswordEntry = await PasswordModel.createPassword({
      url,
      password,
      date,
      username: request.user, // Assuming the decoded JWT contains a username field
    });
    console.log(newPasswordEntry);
    return response.status(201).send("Password entry successfully created");
  } catch (error) {
    console.error("Error saving the password entry:", error);
    return response.status(500).send(error);
  }
});

// GET all passwords for the logged-in user
router.get("/", verifyToken, async function (request, response) {
  try {
    const password = await PasswordModel.returnAllPassword(
      request.user.username
    );
    response.json(password);
  } catch (error) {
    console.error("Error retrieving password entries:", error);
    response.status(500).send(error);
  }
});

module.exports = router;
