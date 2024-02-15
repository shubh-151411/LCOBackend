require('dotenv').config()
require('./config/database').connect()
const express = require('express')
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const User = require('./model/user')
const auth = require('./middleware/auth')
const app = express();

app.use(express.json());

app.get("/", (req, res) => {
    res.send("<h1> hello world from programschool.in")
});


app.post('/register', async (req, res) => {

    try {
        const {
            firstname,
            lastname,
            email,
            password
        } = req.body;

        if (!(email && password && lastname && firstname)) {
            res.status(400).send("All fields are required")
        }

        const existingUser = await User.findOne({
            email
        }); // PROMISE

        if (existingUser) {
            res.status(401).send("User already exists");
        }

        const mbCryptPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            firstName: firstname,
            lastName: lastname,
            email: email,
            password: mbCryptPassword
        });

        //token
        const token = jwt.sign({
            user_id: user._id,
            email
        }, process.env.SECRET_KEY, {
            expiresIn: "2h"
        })

        user.token = token

        //update or not

        // TODO: handle password situation
        user.password = undefined

        res.status(201).json(user)

    } catch (error) {

        console.log(error)

    }


});

app.post('/login',async(req,res) =>{
    const {email,password} = req.body

    const user = await User.findOne({email})
    if(user && await bcrypt.compare(password,user.password)){
        const token = jwt.sign({user_id:User._id,email},process.env.SECRET_KEY,{expiresIn:"2h"})
        user.token = token;
        user.password = undefined;
        
        console.log(user)
        res.send(user)
    }else{
        res.send("Incorrect email or password")

    }

    
})

app.get("/dashboard",auth,async(req,res) =>{
    res.send("Welcome to dashboard")
})





module.exports = app;