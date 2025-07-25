const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');
const jwt = require('jwt-simple');
const Course = require("./models/courses");
const Teacher = require("./models/teachers");
const User = require("./models/User.js");

const app = express()
app.use(cors());

// Use body-parsing middleware to parse JSON bodies
app.use(bodyParser.json());
// Use morgan for logging HTTP requests
app.use(morgan('dev'));

const router = express.Router();
const secret = "supersecret";

// Create a new user
router.post("/user", async function (req, res) {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({ error: "Missing username or password" })
    }

    const newUser = await new User({
        username: req.body.username,
        password: req.body.password,
        status: req.body.status
    })

    try {
        await newUser.save()
        res.sendStatus(201)
    }
    catch (err) {
        res.status(400).send(err)
    }
});

router.post("/auth", async (req, res) => {
    if (!req.body.username || !req.body.password) {
        res.status(400).json({ error: "Missing username or password" })
        return
    }
    let user = await User.findOne({ username: req.body.username })
    if (!user) {
        res.status(401).json({ error: "Bad username" })
    }
    else {
        if (user.password != req.body.password) {
            res.status(401).json({ error: "Bad password" })
        }
        else {
            username2 = user.username
            const token = jwt.encode({ username: user.username }, secret)
            const auth = 1

            res.json({
                username2,
                token: token,
                auth: auth
            })
        }
    }

})

router.get("/status", async (req, res) => {
    if (!req.headers["x-auth"]) {
        return res.status(401).json({ error: "Missing X-Auth" })
    }
    const token = req.headers["x-auth"]
    try {
        const decoded = jwt.decode(token, secret)

        let users = User.find({}, "username status")
        res.json(users)
    }
    catch (ex) {
        res.status(401).json({ error: "Invalid JWT" })
    }
});

// Set up routes

// Course Router
const coursesRouter = require('./routes/coursesRouter');
app.use("/api/courses", coursesRouter);

const swagger = require('./swagger.js');

// Serve Swagger docs
app.use('/', swagger.ui.serve, swagger.ui.setup(swagger.spec));

// Uncomment to add back sample data adding
// app.get('/add_sample_data', async (req, res) => {
//   console.log('Adding sample courses...');

//   const addSampleCourses = require('./sample_data.js');

//   await addSampleCourses();

//   res.status(200).send('Sample courses added successfully');
// })

// Start web server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});