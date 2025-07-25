const db = require('../db.js');

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