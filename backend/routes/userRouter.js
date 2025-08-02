const express = require('express');
const User = require('../models/User');
const { UserRole } = require('../constants/user');
const Authenticator = require('../Authenticator');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();

/**
 * @swagger
 * /api/user:
 *   post:
 *     summary: Create a new user account
 *     description: Register a new user account. Admin and super-admin roles cannot be created via this endpoint for security reasons.
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterRequest'
 *           example:
 *             username: "johndoe"
 *             password: "password123"
 *             firstName: "John"
 *             lastName: "Doe"
 *             email: "john@example.com"
 *             role: "teacher"
 *             status: "active"
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 userId:
 *                   type: string
 *                   description: The ID of the created user
 *                 token:
 *                   type: string
 *                   description: JWT token for the new user
 *             example:
 *               userId: "507f1f77bcf86cd799439011"
 *               token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *       400:
 *         description: Invalid request data
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Invalid request"
 *       409:
 *         description: Username already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Username already taken"
 *       500:
 *         description: Internal server error
 */
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

/**
 * @swagger
 * /api/user/me:
 *   get:
 *     summary: Get current user details
 *     description: Retrieve the current authenticated user's information
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/User'
 *             example:
 *               _id: "507f1f77bcf86cd799439011"
 *               username: "johndoe"
 *               firstName: "John"
 *               lastName: "Doe"
 *               email: "john@example.com"
 *               role: "teacher"
 *               status: "active"
 *               createdAt: "2024-01-01T00:00:00.000Z"
 *               updatedAt: "2024-01-01T00:00:00.000Z"
 *       401:
 *         description: Unauthorized - Invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *             example:
 *               error: "Access token required"
 *       500:
 *         description: Internal server error
 */
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