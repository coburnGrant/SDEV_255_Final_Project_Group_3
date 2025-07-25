const express = require("express")

var cors = require('cors')

const bodyParser = require('body-parser')
const jwt = require('jwt-simple')
const Course = require("./models/courses")
const Teacher = require("./models/teachers")
const User = require("./models/user")
const app = express()
app.use(cors())

app.use(express.json())

const router = express.Router()
const secret = "supersecret"

//create a new user
router.post("./user", async function(req, res){
    if(!req.body.username || !req.body.password){
        res.status(400).json({error: "Missing username or password"})
    }
    
    const newUser = await new User({
        username: req.body.username,
        password: req.body.password,
        status: req.body.status
    })

    try{
        await newUser.save()
        res.sendStatus(201)
    }
    catch(err){
        res.status(400).send(err)
    }
})

router.post("/auth", async(req, res)=>{
if(!req.body.username || !req.body.password){
        res.status(400).json({error: "Missing username or password"})
        return
    }
let user = await User.findOne({username: req.body.username})
    if(!user){
        res.status(401).json({error: "Bad username"})
    }
    else{
        if(user.password != req.body.password){
            res.status(401).json({error: "Bad password"})
        }
        else{
            username2 = user.username
            const token = jwt.encode({username: user.username}, secret)
            const auth = 1

            res.json({
                username2,
                token:token,
                auth:auth
            })
        }
    }

})

router.get("/status", async(req,res)=>{
    if(!req.headers["x-auth"]){
        return res.status(401).json({error: "Missing X-Auth"})
    }
    const token = req.headers["x-auth"]
    try{
    const decoded = jwt.decode(token,secret)

    let users = User.find({}, "username status")
    res.json(users)
}
catch(ex){
    res.status(401).json({error: "Invalid JWT"})
}

})

router.get("/courses", async(req,res) =>{
    try{
        const courses = await Course.find({})
        res.send(courses)
        console.log(courses)
    }
    catch (err) {
        console.log(err)
    }
})

router.get("/courses/:id", async(req,res)=>{
    try{
        const course = await Course.findById(req.params.id)
        res.json(course)
    }
    catch{
        res.status(400).send(err)
    }
})

router.post("/courses", async(req,res)=> {
    try{
        const course = await new Course(req.body)
        await course.save()
        res.status(201).json(course)
        console.log(course)
    }
    catch(err){
        res.status(400).send(err)
    }
})

router.put("/courses/:id", async(req,res)=>{
    try{
        const course = req.body
        await Course.updateOne({_id: req.params.id},course)
        console.log(course)
        res.sendStatus(204)
    }
    catch(err){
        res.status(400).send(err)
    }
})

app.use("/api", router)
app.listen(3000)