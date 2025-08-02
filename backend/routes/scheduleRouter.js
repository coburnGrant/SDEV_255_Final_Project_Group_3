const express = require('express');
const Schedule = require('../models/Schedule');
const ShoppingCart = require('../models/ShoppingCart');
const { authenticateToken } = require('../middleware/auth');
const { ScheduleTerm, ScheduleCourseStatus } = require('../constants/schedule');
const { UserRole } = require('../constants/user');

const router = express.Router();

// Middleware to ensure user is a student
const requireStudent = (req, res, next) => {
    if (req.user.role !== UserRole.STUDENT) {
        return res.status(403).json({
            error: "Course schedule is only available for students"
        });
    }
    next();
};

// Middleware for requiring a valid course and schedule 
const requireSchedule = async (req, res, next) => {
    const userId = req.user.id;
    const { scheduleId } = req.params;

    try {
        const schedule = await Schedule.findOne({ _id: scheduleId, userId });

        if (!schedule) {
            return res.status(404).json({ message: 'Schedule not found.' });
        } else {
            req.schedule = schedule;

            next();
        }
    } catch(error) {
        console.error('encountered error finding schedule', error)
        return res.status(500);
    }
};

router.get('/', authenticateToken, requireStudent, async (req, res) => {
    try {
        const userId = req.user._id;
        const year = parseInt(req.query.year) || new Date().getFullYear();
        const term = req.query.term;

        const query = { userId, year };
        
        if (term) {
            console.log(term);
            if (!ScheduleTerm.isValidTerm(term)) {
                return res.status(400).json({ message: 'Term is invalid' });
            }
            query.term = term;
        }

        const schedules = await Schedule.find(query).populate('courses.course');

        return res.status(200).json(schedules);
    } catch (err) {
        console.error('Error fetching schedule:', err);
        return res.status(500).json({ message: 'Failed to fetch schedule.' });
    }
});

router.post('/', authenticateToken, requireStudent, async (req, res) => {
    try {
        const userId = req.user.id;
        const { term, year } = req.body;

        if (!term || !year) {
            return res.status(400).json({ message: 'Term and year are required.' });
        }

        if (!ScheduleTerm.isValidTerm(term)) {
            return res.status(400).json({ message: 'Invalid term provided.' });
        }

        // Check for an existing schedule for this term
        const existing = await Schedule.findOne({ userId, term, year });

        if (existing) {
            return res.status(409).json({ message: 'Schedule for this term already exists.' });
        }

        const { startDate, endDate } = ScheduleTerm.getTermDates(term, year);

        const now = new Date();

        if (now >= startDate) {
            return res.status(400).json({ message: 'Cannot create schedule after the term has started.' });
        }

        if (endDate <= now) {
            return res.status(400).json({ message: 'Cannot create schedule after the term has ended.' })
        }

        // Find the user's shopping cart
        const cart = await ShoppingCart.findOne({ userId });

        // Make sure the cart has items
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Your shopping cart is empty.' });
        }

        // Get courses in the cart, make sure they are unique
        const courseIds = [...new Set(cart.items.map(item => item.courseId))];

        // Create the course item objects
        const courseItems = courseIds.map((courseId) => {
            return {
                course: courseId
            }
        });

        const newSchedule = new Schedule({
            userId,
            term,
            year,
            courses: courseItems
        });

        // Save the newly created schedule
        await newSchedule.save();

        // Clear the carts items upon success and save
        cart.items = [];
        await cart.save();

        return res.status(201).json({ message: 'Schedule created successfully.', schedule: newSchedule });

    } catch (err) {
        console.error('Error creating schedule:', err);
        return res.status(500).json({ message: 'Failed to create schedule.' });
    }
});

router.get('/:scheduleId', authenticateToken, requireStudent, requireSchedule, async (req, res) => {
    const fullSchedule = await req.schedule.populate('courses.course');

    res.status(200).json(fullSchedule);
});

router.post('/:scheduleId/add', authenticateToken, requireStudent, requireSchedule, async (req, res) => {
    const userId = req.user.id;
    const schedule = req.schedule;
    const { startDate } = ScheduleTerm.getTermDates(schedule.term, schedule.year);

    if (new Date() >= startDate) {
        return res.status(400).json({ message: 'Cannot add courses after the term has started.' });
    }

    try {
        // Find the user's shopping cart
        const cart = await ShoppingCart.findOne({ userId });

        // Make sure the cart has items
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Your shopping cart is empty.' });
        }

        // Get courses in the cart, make sure they are unique
        const courseIds = [...new Set(cart.items.map(item => item.courseId))];

        for (const courseId of courseIds) {
            // Prevent duplicates unless previously dropped (only if the term has not started)
            const existing = schedule.courses.find(item =>
                item.course.equals(courseId)
            );

            if (existing) {
                if (existing.status === ScheduleCourseStatus.DROPPED) {
                    existing.status = ScheduleCourseStatus.ENROLLED;
                    existing.addedAt = new Date();
                } else {
                    return res.status(409).json({ message: 'Course already added to schedule.' });
                }
            } else {
                schedule.courses.push({ course: courseId });
            }
        }

        await schedule.save();

        return res.status(200).json({ message: 'Course added successfully.', schedule });
    } catch (err) {
        console.error('Error adding course:', err);
        return res.status(500).json({ message: 'Failed to add course to schedule.' });
    }
});

router.post('/:scheduleId/drop', authenticateToken, requireStudent, requireSchedule, async (req, res) => {
    const { courseId } = req.body;

    if (!courseId) {
        return res.status(400).json({ message: 'Course ID is required.' });
    }

    try {
        const schedule = req.schedule;

        const { endDate } = ScheduleTerm.getTermDates(schedule.term, schedule.year);
        const now = new Date();

        if (now > endDate) {
            return res.status(400).json({ message: 'Cannot drop courses after the term has ended.' });
        }

        const courseItem = schedule.courses.find(item =>
            item.course.equals(courseId) && item.status === ScheduleCourseStatus.ENROLLED
        );

        if (!courseItem) {
            return res.status(404).json({ message: 'Course not currently enrolled or already dropped.' });
        }

        courseItem.status = ScheduleCourseStatus.DROPPED;

        await schedule.save();

        return res.status(200).json({ message: 'Course dropped.', schedule });
    } catch (err) {
        console.error('Error dropping course:', err);
        return res.status(500).json({ message: 'Failed to drop course from schedule.' });
    }
});

module.exports = router;