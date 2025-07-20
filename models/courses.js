const db = require("../db")

const Course = db.model("Course", {
    name:{type:String, required:true},
    description: {type:String},
    credits:{type: Number, min:1, max:4},
    subject:{type: String}
})

module.exports = Course