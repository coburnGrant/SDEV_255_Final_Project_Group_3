const express = require('express');
const { User, UserRole } = require('../models/User');
const Authenticator = require('../Authenticator');
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

router.get('/me', async (req, res) => {
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
            res.status(201).json(user);
        } else {
            res.status(401).json({ error: "Invalid or expired token" });
        }
    } catch (err) {
        res.status(401).json({ error: "Invalid or expired token" });
    }
});

module.exports = router;