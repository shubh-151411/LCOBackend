const express = require('express')
const swaggerUi = require('swagger-ui-express');

const app = express();

const fs = require("fs")
const YAML = require('yaml')

const file  = fs.readFileSync('./swagger.yaml', 'utf8')
const swaggerDocument = YAML.parse(file)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(express.json())

const port = 4000 || process.env.port

const arrName = [
    {id:"12",name:"Pro Backend",price:200},
    {id:"12",name:"Pro Backend",price:200},
    {id:"12",name:"Pro Backend",price:200},
    {id:"12",name:"Pro Backend",price:200},
]
app.get("/api/v1/lco",(req,res) =>{
    res.send("hello world")
});
app.get("/api/v1/lcoobject",(req,res) =>{
    res.json({id:"12",name:"Pro Backend",price:200})
}); 

app.get("/api/v1/lcoarray",(req,res) =>{
    res.send(arrName)
})





app.listen(port,() => {
    console.log(`server is running on ${port}`)
});