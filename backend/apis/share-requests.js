const express = require("express");
const router = express.Router();
const PasswordShareRequestModel = require("../db/passwordShareRequest/passwordShareRequest.model"); // Adjust the path to your Password model
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

// GET /api/share-requests
router.get("/share-requests", verifyToken, async (req, res) => {
  const username = req.user.username;
  try {
    const requests = await PasswordShareRequest.find({ toUser: username });
    res.json(requests);
  } catch (error) {
    console.error("Failed to retrieve share requests:", error);
    res.status(500).send("Failed to retrieve share requests.");
  }
});

// POST /api/share-requests/:requestId/accept
router.post(
  "/share-requests/:requestId/accept",
  verifyToken,
  async (req, res) => {
    const requestId = req.params.requestId;
    try {
      const request = await PasswordShareRequestModel.findById(requestId);
      if (!request || request.toUser !== req.user) {
        return res
          .status(404)
          .send(
            "Request not found or you do not have permission to accept this request."
          );
      }

      request.status = "accepted";
      await request.save();
      await PasswordModel.findByIdAndUpdate(request.passwordId, {
        $push: { sharedWith: request.toUser },
      });
      res.send("Request accepted and password shared.");
    } catch (error) {
      console.error("Error accepting share request:", error);
      res.status(500).send("Error accepting share request.");
    }
  }
);

// POST /api/share-requests/:requestId/reject
router.post(
  "/share-requests/:requestId/reject",
  verifyToken,
  async (req, res) => {
    const requestId = req.params.requestId;
    try {
      const request = await PasswordShareRequestModel.findById(requestId);
      if (!request || request.toUser !== req.user) {
        return res
          .status(404)
          .send(
            "Request not found or you do not have permission to reject this request."
          );
      }

      request.status = "rejected";
      await request.save();
      res.send("Request rejected.");
    } catch (error) {
      console.error("Error rejecting share request:", error);
      res.status(500).send("Error rejecting share request.");
    }
  }
);

module.exports = router;
