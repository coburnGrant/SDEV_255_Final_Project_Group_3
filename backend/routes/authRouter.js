const express = require('express');
const { User } = require('../models/User');
const Authenticator = require('../Authenticator');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

/**
 * @swagger
 * /api/auth:
 *   post:
 *     summary: Authenticate user and get JWT token
 *     description: Login with username and password to receive a JWT token for authentication
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *           example:
 *             username: "johndoe"
 *             password: "password123"
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/LoginResponse'
 *             example:
 *               user:
 *                 _id: "507f1f77bcf86cd799439011"
 *                 username: "johndoe"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 email: "john@example.com"
 *                 role: "teacher"
 *                 status: "active"
 *                 createdAt: "2024-01-01T00:00:00.000Z"
 *                 updatedAt: "2024-01-01T00:00:00.000Z"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Missing username or password
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Missing username or password"
 *       401:
 *         description: Authentication failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Failed to authenticate."
 *       500:
 *         description: Internal server error
 */
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

        res.status(200).json({
            user: userResponse,
            token
        });
    } catch (err) {
        console.error("Login error:", err);
        res.sendStatus(500);
    }
});

/**
 * @swagger
 * /api/auth/status:
 *   get:
 *     summary: Verify JWT token validity
 *     description: Check if the provided JWT token is valid and not expired
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid
 *       401:
 *         description: Invalid or expired token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Invalid or expired token"
 *       400:
 *         description: Missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Access token required"
 */
router.get("/status", authenticateToken, async (req, res) => {
    // If middleware passes, token is valid and user exists
    res.sendStatus(200);
});

module.exports = router;