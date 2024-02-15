const { model } = require("mongoose")

const jwt = require('jsonwebtoken')

const auth = (req,res,next) =>{
    // console.log(req.header("Authorization"));
    const token = req.header("Authorization").replace("Bearer ",'')
    console.log(token);
    const decode = jwt.verify(token,process.env.SECRET_KEY)
    console.log(decode)
    return next();

}

module.exports = auth;