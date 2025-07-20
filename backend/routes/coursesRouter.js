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
    try {
        const course = await new Course(req.body);
        
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
})

// Update a specific course by ID
router.put("/:id", async (req, res) => {
    try {
        const course = req.body;

        await Course.updateOne({ _id: req.params.id }, course);

        res.sendStatus(204);
    }
    catch (err) {
        res.status(400).send(err);
    }
})

module.exports = router;