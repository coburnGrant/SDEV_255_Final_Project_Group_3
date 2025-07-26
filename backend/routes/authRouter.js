const express = require('express');
const { User } = require('../models/User');
const Authenticator = require('../Authenticator');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Login route: Authenticates user and returns JWT
router.post("/", async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ error: "Missing username or password" });
    }

    try {
        const user = await User.findOne({ username });

        if (!user) {
            return res.status(401).json({ error: "Failed to authenticate." });
        }

        const passwordMatch = await Authenticator.passwordMatches(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ error: "Failed to authenticate." });
        }

        const userId = user._id;
        // Create JWT token
        const token = Authenticator.createToken(userId);

        // Return user info (excluding password) along with token
        const userResponse = {
            _id: user._id,
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            role: user.role,
            status: user.status,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt
        };

        res.json({
            user: userResponse,
            token
        });
    } catch (err) {
        console.error("Login error:", err);
        res.sendStatus(500);
    }
});

// Token status route: Verifies JWT token
router.get("/status", authenticateToken, async (req, res) => {
    // If middleware passes, token is valid and user exists
    res.sendStatus(200);
});

module.exports = router;