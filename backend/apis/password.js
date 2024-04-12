const express = require('express');
const router = express.Router();
const PasswordModel = require('../db/password/password.model'); // Adjust the path to your Password model
const jwt = require('jsonwebtoken');

// Middleware to verify JWT token (simplified version)
const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Assuming the token is stored in cookies

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }

    try {
        const decoded = jwt.verify(token, "SECRET_KEY"); // Replace "SECRET_KEY" with your actual secret key
        req.user = decoded;
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }

    return next();
};

// POST to save a new password entry
router.post('/', verifyToken, async function(request, response) {
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
            username: request.user.username // Assuming the decoded JWT contains a username field
        });
        console.log(newPasswordEntry);
        return response.status(201).send("Password entry successfully created");
    } catch (error) {
        console.error('Error saving the password entry:', error);
        return response.status(500).send(error);
    }
});

// GET all passwords for the logged-in user
router.get('/', verifyToken, async function(request, response) {
    try {
        const password = await PasswordModel.returnAllPasswordsByUsername(request.user.username);
        response.json(password);
    } catch (error) {
        console.error('Error retrieving password entries:', error);
        response.status(500).send(error);
    }
});

module.exports = router;
