const db = require('../db');
const {ScheduleCourseStatus, ScheduleTerm} = require('../constants/schedule');

const scheduleCourseItemSchema = new db.Schema({
    course: {
        type: db.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    status: {
        type: String,
        enum: ScheduleCourseStatus.allStatuses(),
        default: ScheduleCourseStatus.ENROLLED
    },
    addedAt: { type: Date, default: Date.now }
});

const scheduleSchema = new db.Schema({
    userId: {
        type: db.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    term: {
        type: String,
        required: true,
        enum: ScheduleTerm.allTerms()
    },
    year: {
        type: Number,
        required: true
    },
    courses: [scheduleCourseItemSchema]
}, { timestamps: true });

const Schedule = db.model('Schedule', scheduleSchema);

module.exports = Schedule;