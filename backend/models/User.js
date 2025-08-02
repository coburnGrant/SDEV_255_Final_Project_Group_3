const db = require("../db");
const { UserRole } = require('../constants/user');

const userSchema = new db.Schema({
    username: { type: String, required: true, unique: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    status: String,
    role: {
        type: String,
        enum: UserRole.allRoles(),
        default: 'student',
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields
});

const User = db.model("User", userSchema);

module.exports = User;