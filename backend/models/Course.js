const db = require('../db.js');

const courseSchema = new db.Schema({
    // Course code prefix. Ex. 'SDEV'
    prefix: { type: String, required: true },
    // Course code number. Ex. '255'
    number: { type: String, required: true },
    // // Full name of the course
    name: { type: String, required: true },
    // Program the course belongs to. Ex. 'Software Development'
    program: { type: String },
    // Description of the course
    description: { type: String },
    // List of as course codes that are prerequisites for this course
    prerequisites: [{ type: String }],
    // Minimum credit hours required for the course
    creditHoursMin: { type: Number, required: true },
    // Maximum credit hours allowed for the course
    creditHoursMax: { type: Number },
    // Minimum lecture hours required for the course
    lectureHoursMin: { type: Number },
    // Date that this course was last revised
    dateOfLastRevision: { type: Date, default: Date.now },
    // List of learning objectives for the course
    learningObjectives: [{ type: String }],
    // List of topics covered in the course
    topics: [{ type: String }],
    // Running number of clicks for a course's details view
    clickCount: { type: Number, default: 0 }
});

const Course = db.model("Course", courseSchema);

module.exports = Course;