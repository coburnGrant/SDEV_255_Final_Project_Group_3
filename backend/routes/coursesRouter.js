/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Course:
 *       type: object
 *       required:
 *         - name
 *         - number
 *         - prefix
 *         - creditHoursMin
 *       properties:
 *         _id:
 *           type: string
 *           description: MongoDB ObjectId
 *         prefix:
 *           type: string
 *           description: Course code prefix (e.g., "SDEV")
 *         number:
 *           type: string
 *           description: Course code number (e.g., "255")
 *         name:
 *           type: string
 *           description: Full name of the course
 *         program:
 *           type: string
 *           description: Program the course belongs to
 *         description:
 *           type: string
 *           description: Description of the course
 *         prerequisites:
 *           type: array
 *           items:
 *             type: string
 *           description: List of prerequisite course codes
 *         creditHoursMin:
 *           type: number
 *           description: Minimum credit hours required
 *         creditHoursMax:
 *           type: number
 *           description: Maximum credit hours allowed
 *         lectureHoursMin:
 *           type: number
 *           description: Minimum lecture hours required
 *         dateOfLastRevision:
 *           type: string
 *           format: date
 *           description: Date this course was last revised
 *         learningObjectives:
 *           type: array
 *           items:
 *             type: string
 *           description: Learning objectives of the course
 *         topics:
 *           type: array
 *           items:
 *             type: string
 *           description: Topics covered in the course
 */

const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

/**
 * @swagger
 * /api/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: A list of courses
 */
router.get("/", async (req, res) => {
    let query = {};

    // TODO: Possibly add additional query parameters in the future

    try {
        const courses = await Course.find(query);
        res.send(courses);
    }
    catch (err) {
        console.log(err)
    }
})

/**
 * @swagger
 * /api/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       201:
 *         description: Course created
 *       400:
 *         description: Bad request
 */
router.post("/", async (req, res) => {
    const json = req.body;

    if (!json) {
        res.status(400).send('No course data found in request');
    }

    try {
        const course = new Course(json);zq

        await course.save();

        res.status(201).json(course);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

/**
 * @swagger
 * /api/courses/{id}:
 *   get:
 *     summary: Get course by ID
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Course ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course found
 *       400:
 *         description: Invalid ID
 */
router.get("/:id", async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        res.json(course);
    }
    catch {
        res.status(400).send(err);
    }
});

/**
 * @swagger
 * /api/courses/{id}:
 *   put:
 *     summary: Update a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Course ID
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Course'
 *     responses:
 *       204:
 *         description: Course updated
 *       400:
 *         description: Bad request
 */
router.put("/:id", async (req, res) => {
    const courseId = req.params.id;
    const course = req.body;

    if (!courseId || !course) {
        res.sendStatus(400);
        return
    }

    try {
        await Course.updateOne({ _id:  courseId}, course);

        res.sendStatus(204);
    }
    catch (err) {
        res.status(400).send(err);
    }
});

/**
 * @swagger
 * /api/courses/{id}:
 *   delete:
 *     summary: Delete a course
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Course ID
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Course deleted
 *       400:
 *         description: Invalid ID
 */
router.delete('/:id', async (req, res) => {
    const courseId = req.params.id;

    if (!courseId) {
        res.sendStatus(400);
        return
    }

    try {
        await Course.deleteOne({_id: courseId});

        res.sendStatus(200);
    } catch(error) {
        console.log('error deleting course', error);

        res.sendStatus(400);
    }
});

module.exports = router;