const express = require('express');
const { User } = require('../models/User');
const Authenticator = require('../Authenticator');

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

        res.json({
            userId,
            token
        });
    } catch (err) {
        console.error("Login error:", err);
        res.sendStatus(500);
    }
});

// Token status route: Verifies JWT token
router.get("/status", async (req, res) => {
    const token = req.headers['x-auth'];
    if (!token) {
        return res.status(400).json({ error: 'Missing x-auth header' });
    }

    try {
        const decoded = Authenticator.verifyToken(token);

        if (!decoded) {
            return res.status(401).json({ error: "Invalid or expired token" });
        }

        const user = await User.findOne({ _id: decoded.userId });

        if (user) {
            res.sendStatus(200);
        } else {
            res.status(401).json({ error: "Invalid or expired token" });
        }
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
});

module.exports = router;