const express = require("express");
const Course = require("../models/Course");

const router = express.Router();

// Get list of all courses
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

// Create a new course
router.post("/", async (req, res) => {
    const json = req.body;

    if (!json) {
        res.status(400).send('No course data found in request');
    }

    try {
        const course = new Course(json);

        await course.save();

        res.status(201).json(course);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

// Get a specific course by ID
router.get("/:id", async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);

        res.json(course);
    }
    catch {
        res.status(400).send(err);
    }
});

// Update a specific course by ID
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