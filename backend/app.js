const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const morgan = require('morgan');

const app = express()
app.use(cors());

// Use body-parsing middleware to parse JSON bodies
app.use(bodyParser.json());
// Use morgan for logging HTTP requests
app.use(morgan('dev'));

// Set up routes

// Course Router
const authRouter = require('./routes/authRouter.js');
app.use('/api/auth', authRouter);

const userRouter = require('./routes/userRouter.js');
app.use('/api/user', userRouter);

const coursesRouter = require('./routes/coursesRouter');
app.use("/api/courses", coursesRouter);

const cartRouter = require('./routes/cartRouter');
app.use("/api/cart", cartRouter);

const scheduleRouter = require('./routes/scheduleRouter.js');
app.use('/api/schedules', scheduleRouter)

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