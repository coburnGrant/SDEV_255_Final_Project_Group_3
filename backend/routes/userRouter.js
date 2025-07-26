const express = require('express');
const { User, UserRole } = require('../models/User');
const Authenticator = require('../Authenticator');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

// Create a new user
router.post("/", async function (req, res) {
    const { username, password, firstName, lastName, email, status, role } = req.body;

    if (!username || !password || !firstName || !lastName || !email) {
        return res.status(400).json({ error: "Invalid request" });
    }

    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
        return res.status(409).json({ error: "Username already taken" }); // 409 Conflict
    }

    // Validate role or set default
    let userRole = UserRole.STUDENT;

    if (role) {
        switch (role) {
            case UserRole.SUPER_ADMIN:
                return res.send(400).json({ error: "Role not permitted" });
            case UserRole.ADMIN:
                return res.send(400).json({ error: "Admin privileges required" });
            case UserRole.TEACHER:
            case UserRole.STUDENT:
                // TODO: Possibly not allow teacher accounts to be created without valid token
                userRole = role;
                break;
            default:
                return res.status(400).json({ error: `Invalid role.` });
        }
    }

    // Hash password before saving
    const hashedPassword = await Authenticator.hashedPassword(password);

    const newUser = new User({
        username,
        firstName,
        lastName,
        email,
        password: hashedPassword,
        status,
        role: userRole
    });

    const userId = newUser._id;
    const token = Authenticator.createToken(userId);

    try {
        await newUser.save();

        res.status(201).json({ userId, token });
    } catch (err) {
        res.status(500).send(err);
    }
});

// Get current user details
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = req.user;
        
        // Return user info (excluding password)
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

        res.json(userResponse);
    } catch (err) {
        console.error("Get user error:", err);
        res.sendStatus(500);
    }
});

module.exports = router;