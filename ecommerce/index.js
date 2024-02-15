const app = require('./app')
const connectWithDb = require('./config/db')
const cloudinary = require('cloudinary').v2;
require('dotenv').config()

// connect with database
connectWithDb();

// cloudinary config
cloudinary.config({
    cloud_name:process.env.CLOUD_NAME,
    api_key:process.env.API_KEY,
    api_secret:process.env.API_SECRET

})

app.listen(process.env.port,() => {
    console.log(`server is running on ${process.env.port}`)
})