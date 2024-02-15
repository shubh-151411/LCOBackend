const BigPromise = require('../middlewares/bigPromise')
const Product = require('../models/product');
const CustomError = require('../utils/customError');
const mailHelper = require('../utils/emailHelper');
const cloudinary = require('cloudinary').v2

exports.addProduct = BigPromise(async (req, res, next) => {
    let imgArry = [];
    if (!req.files) {
        return next(new CustomError("photos required", 400));
    }

    if (res.files) {

        for (let i = 0; i < req.files.photos.length; i++) {
            const result = await cloudinary.uploader.upload(req.files.photos[i].tempFilePath, {
                folder: "products",

            });

            imgArry.push({
                id:result.public_id,
                secure_url:result.secure_url
            })
        }
    }
    req.body.photos = imgArry;
    req.body.user = req.user.id;
    const product = await Product.create(req.body);
    res.status(200).json({success:true,product})

})

exports.testProduct = async (req,res) => {
    res.status(200).json({
        success: true, 
        greeting: "this is a test for product"
    });
}



