const express = require("express");
const ShoppingCart = require("../models/ShoppingCart");
const Course = require("../models/Course");
const { authenticateToken } = require("../middleware/auth");
const { UserRole } = require("../constants/user");

const router = express.Router();

// Middleware to ensure user is a student
const requireStudent = (req, res, next) => {
    if (req.user.role !== UserRole.STUDENT) {
        return res.status(403).json({ 
            error: "Shopping cart is only available for students" 
        });
    }
    next();
};

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get user's shopping cart
 *     description: Retrieve the current user's shopping cart with course details
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Shopping cart retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 userId:
 *                   type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       courseId:
 *                         type: object
 *                         $ref: '#/components/schemas/Course'
 *                       addedAt:
 *                         type: string
 *                         format: date-time
 *                 itemCount:
 *                   type: number
 *                 createdAt:
 *                   type: string
 *                   format: date-time
 *                 updatedAt:
 *                   type: string
 *                   format: date-time
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a student
 *       500:
 *         description: Internal server error
 */
router.get("/", authenticateToken, requireStudent, async (req, res) => {
    try {
        let cart = await ShoppingCart.findOne({ userId: req.user._id })
            .populate('items.courseId');

        if (!cart) {
            // Create empty cart if it doesn't exist
            cart = new ShoppingCart({ userId: req.user._id });
            await cart.save();
        }

        res.json(cart);
    } catch (error) {
        console.error('Error fetching cart:', error);
        res.status(500).json({ error: 'Failed to fetch shopping cart' });
    }
});

/**
 * @swagger
 * /api/cart/add/{courseId}:
 *   post:
 *     summary: Add course to shopping cart
 *     description: Add a course to the user's shopping cart
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: Course ID to add to cart
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course added to cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 added:
 *                   type: boolean
 *       400:
 *         description: Course already in cart
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a student
 *       404:
 *         description: Course not found
 *       500:
 *         description: Internal server error
 */
router.post("/add/:courseId", authenticateToken, requireStudent, async (req, res) => {
    const { courseId } = req.params;

    try {
        // Verify course exists
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Find or create cart
        let cart = await ShoppingCart.findOne({ userId: req.user._id });
        if (!cart) {
            cart = new ShoppingCart({ userId: req.user._id });
        }

        // Add course to cart
        const added = cart.addCourse(courseId);
        await cart.save();

        if (added) {
            res.json({ 
                message: 'Course added to cart successfully',
                added: true 
            });
        } else {
            res.status(400).json({ 
                message: 'Course is already in cart',
                added: false 
            });
        }
    } catch (error) {
        console.error('Error adding course to cart:', error);
        res.status(500).json({ error: 'Failed to add course to cart' });
    }
});

/**
 * @swagger
 * /api/cart/remove/{courseId}:
 *   delete:
 *     summary: Remove course from shopping cart
 *     description: Remove a course from the user's shopping cart
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: Course ID to remove from cart
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course removed from cart successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 removed:
 *                   type: boolean
 *       400:
 *         description: Course not in cart
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a student
 *       500:
 *         description: Internal server error
 */
router.delete("/remove/:courseId", authenticateToken, requireStudent, async (req, res) => {
    const { courseId } = req.params;

    try {
        const cart = await ShoppingCart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ error: 'Shopping cart not found' });
        }

        const removed = cart.removeCourse(courseId);
        await cart.save();

        if (removed) {
            res.json({ 
                message: 'Course removed from cart successfully',
                removed: true 
            });
        } else {
            res.status(400).json({ 
                message: 'Course is not in cart',
                removed: false 
            });
        }
    } catch (error) {
        console.error('Error removing course from cart:', error);
        res.status(500).json({ error: 'Failed to remove course from cart' });
    }
});

/**
 * @swagger
 * /api/cart/clear:
 *   delete:
 *     summary: Clear shopping cart
 *     description: Remove all courses from the user's shopping cart
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a student
 *       500:
 *         description: Internal server error
 */
router.delete("/clear", authenticateToken, requireStudent, async (req, res) => {
    try {
        const cart = await ShoppingCart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ error: 'Shopping cart not found' });
        }

        cart.clearCart();
        await cart.save();

        res.json({ message: 'Shopping cart cleared successfully' });
    } catch (error) {
        console.error('Error clearing cart:', error);
        res.status(500).json({ error: 'Failed to clear shopping cart' });
    }
});

/**
 * @swagger
 * /api/cart/check/{courseId}:
 *   get:
 *     summary: Check if course is in cart
 *     description: Check if a specific course is in the user's shopping cart
 *     tags: [Shopping Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: courseId
 *         required: true
 *         description: Course ID to check
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Check result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 inCart:
 *                   type: boolean
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Not a student
 *       500:
 *         description: Internal server error
 */
router.get("/check/:courseId", authenticateToken, requireStudent, async (req, res) => {
    const { courseId } = req.params;

    try {
        const cart = await ShoppingCart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.json({ inCart: false });
        }

        const inCart = cart.hasCourse(courseId);
        res.json({ inCart });
    } catch (error) {
        console.error('Error checking course in cart:', error);
        res.status(500).json({ error: 'Failed to check course in cart' });
    }
});

module.exports = router; 