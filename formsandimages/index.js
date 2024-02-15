const express = require('express');
const fileUpload = require('express-fileupload')
const cloudinary = require('cloudinary').v2
var fs = require('fs');

cloudinary.config({
    cloud_name: "dntwxfowc",
    api_key: "848387461281195",
    api_secret: "niyiGG1ufCFq-Vv-Q41XSs17T6g"
  });

const app = express();

app.set("view engine","ejs");
//middleware
app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(fileUpload({useTempFiles:true,tempFileDir:"/temp/"}));

app.get("/myget",(req,res) =>{
    console.log(req.body)
    res.send(req.body)

})

app.post("/mypost",async(req,res) =>{
  
    var imagArray = [];

    if(req.files){
        for(let index = 0; index < req.files.samplefile.length;index++){
             await cloudinary.uploader.upload(req.files.samplefile[index].tempFilePath, {folder: "user"}).then((data) => {
                imagArray.push({
                    public_id:data.public_id,
                    secure_url:data.secure_url
                })
             }).catch((error) => {
                console.log(error)
             });
           

        }
       
    }


    // # single file path
    // const files = req.files.samplefile;
   // const result = await cloudinary.uploader.upload(files.tempFilePath, {folder: "user"})



    const details = {
        firstName:req.body.firstname,
        lastname:req.body.lastname,
        imagArray:imagArray
    }
    console.log(details)

    res.send(details)
})

app.get("/mygetform",(req,res) =>{
    res.render("getform")
})
app.get("/mypostform",(req,res) =>{
    res.render("postform")
})

app.listen(4000,() => {console.log("Server is running");});