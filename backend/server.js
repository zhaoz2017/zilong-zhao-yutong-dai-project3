const express = require("express");
const helper = require("./apis/helper");
const users = require("./apis/user");
const password = require("./apis/password");
const shareRequest = require("./apis/share-requests");
const cookieParser = require("cookie-parser");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const mongoDBEndpoint = 'mongodb+srv://zilongz0904:Jj6hFWKbl72ACpDJ@cluster0.opo5pqf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
// mongoose.connect(mongoDBEndpoint,  { useNewUrlParser: true });

mongoose
  .connect(mongoDBEndpoint)
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR!!!!");
    console.log(err);
  });

const db = mongoose.connection;
db.on("error", console.error.bind(console, "Error connecting to MongoDB:"));

// app.use(cors());
app.use(
  cors({
    origin: "http://localhost:8000", // This should match your frontend's URL
    credentials: true, // This allows cookies to be sent and received
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use("/api/users/", users);
app.use("/api/password/", password);
app.use("/api/share-requests/", shareRequest);

let frontend_dir = path.join(__dirname, "..", "frontend", "dist");

app.use(express.static(frontend_dir));
app.get("*", function (req, res) {
  console.log("received request");
  res.sendFile(path.join(frontend_dir, "index.html"));
});

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

app.listen(process.env.PORT || 8000, function () {
  console.log("Starting server now...");
});

// const http = require('http');

// const server = http.createServer(function (request, response) {

//     response.writeHead(200, { 'Content-Type': 'text/plain' });
//     response.end('Hello web dev!');

// })

// // 127.0.0.1 === localhost
// server.listen(8000, "127.0.0.1", function() {
//     console.log("The server has started!")
// })
