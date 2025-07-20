const mongoose = require('mongoose');

const dbURI = "mongodb+srv://jcoplen2:hJmPOpv3bmPR9ydr@courses.dea4w3h.mongodb.net/?retryWrites=true&w=majority&appName=Courses"

mongoose.connect(dbURI);

module.exports = mongoose