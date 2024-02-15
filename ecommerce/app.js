require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const app = express()

//cookies and file middleware
app.use(cookieParser());
app.use(fileUpload({useTempFiles:true,tempFileDir:"/temp/"}));

//regular middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//morgan middleware 
app.use(morgan("tiny"));

//Import all route here
const home = require('./routes/home');
const user = require('./routes/user');
const product = require('./routes/product');

//router middleware
app.use("/api/v1",home);
app.use("/api/v1",user);
app.use("/api/v1",product)


module.exports = app;