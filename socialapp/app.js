const express = require('express')
const format = require('date-format')
const app = express();


const swaggerUi = require('swagger-ui-express');
const fs = require("fs")
const YAML = require('yaml')

const file  = fs.readFileSync('./swagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));




const PORT = 4000 || process.env.PORT

app.get("/hello",(req,res) => {
    res.send("<h1>hello world</h1>")
})

app.get("/api/v1/instagram",(req,res) =>{
 const instaSocial = {
    userName:"Shubhanshu",
    follower:"26000",
    follows:"1212",
    data:Date.now()
    
 }

 res.status(200).json(instaSocial)

});

app.get("/api/v1/:token",(req,res) =>{
    console.log(req.params.token);
    res.status(200).json({param:req.params.token})
});

// app.get("/api/v1/:token", (req, res) => {
//     console.log(req.params.token);
//     res.status(200).json({ param: req.params.token });
//   });





app.listen(PORT,() =>{
    console.log(`Server is running at ${PORT}`)
});
