const User = require('../models/user')
const BigPromise = require('../middlewares/bigPromise')
const CustomError = require('../utils/customError');
const cookieToken = require('../utils/cookieToken');
const fileUpload = require('express-fileupload');
const mailHelper = require('../utils/emailHelper');
const cloudinary = require('cloudinary').v2
const crypto = require('crypto');
const { error } = require('console');



exports.signup = BigPromise(async (req, res, next) => {

    let result;
    // console.log(req.files)
    if (req.files) {
        let file = req.files.photo
        result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "user",
            width: 150,
            crop: "scale"
        });
    }

    const {
        name,
        email,
        password
    } = req.body;
    if (!name || !email || !password) {
        return next(new CustomError("name,email and password is required", 400));

    }

    // create a user object inside mongodb
    const user = await User.create({
        name,
        email,
        password,
        photo: {
            id: result.public_id,
            secure_url: result.secure_url

        }
    });


    cookieToken(user, res)


});

exports.login = BigPromise(async (req, res, next) => {
    const {
        email,
        password
    } = req.body;

    // check for presence of email and password
    if (!email || !password) {
        return next(new CustomError('email ans password is required', 400))
    }

    // geting user from DB
    // .select("+password") by default password is auto select
    const user = await User.findOne({
        email
    }).select("+password");
    if (!user) {
        return next(new CustomError('Email or password does not match or exit', 200))
    }

    //Compare password
    if (await user.isValidatedPassword(password)) {
        cookieToken(user, res)
    } else {
        return next(new CustomError('Email or password does not match or exit', 200))

    }
});

exports.logout = BigPromise(async (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })

    res.status(200).json({
        success: true,
        message: "Logout success"
    })
});

exports.forgotPassword = BigPromise(async (req, res, next) => {
    const {
        email
    } = req.body

    const user = await User.findOne({
        email
    })

    if (!user) {
        return next(new CustomError("User not found", 400))

    }

    const forgotToken = user.getForgotPasswordToken();

    //save the data not check
    await user.save({
        validateBeforeSave: false
    })

    const myUrl = `${req.protocol}://${req.get("host")}/api/v1/password/reset/${forgotToken}`;

    const message = `copy paste this link in your URL and hit enter \n\n ${myUrl}`;

    try {
        await mailHelper({
            email: user.email,
            subject: "LCO TStore Password reset email",
            message,

        })

        res.status(200).json({ success: true, message: "Email sent successfull" })

    } catch (error) {
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        await user.save({
            validateBeforeSave: false
        })
        return next(new CustomError(error.message, 500))

    }




});

exports.passwordReset = BigPromise(async (req, res, next) => {
    const token = req.params.token;
    console.log(`token ${token}`)
    const encryToken = crypto.createHash('sha256').update(token).digest('hex');

    console.log(encryToken);

    const user = await User.findOne({ forgotPasswordToken: encryToken, forgotPasswordExpiry: { $gt: Date.now() } });

    console.log(`user ${user}`)

    if (!user) {
        return next(new CustomError('token is expires', 400))
    }

    if (req.body.password === req.body.confirmpassword) {
        user.password = req.body.password;
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        await user.save({ validateBeforeSave: false });

        cookieToken(user, res)


    } else {
        return next(new CustomError('password and confirm password not match', 400))

    }


});

exports.getLoggedInUserDetails = BigPromise(async (req, res, next) => {
    const user = await User.findById(req.user.id);

    res.status(200).json({ success: true, user })

});

exports.changePassword = BigPromise(async (req, res, next) => {
    const userId = req.user.id;
    const user = await User.findById(userId).select("+password");

    //Matching the password                               
    const isCorrectPassword = user.isValidatedPassword(req.body.oldPassword);
    if (!isCorrectPassword) {
        return next(new CustomError('Old password is incorrect', 400))
    }
    user.password = req.body.newPassword;
    await user.save();
    cookieToken(user, res);
})

exports.updateUserDetails = BigPromise(async (req, res, next) => {
    const newData = {
        name: req.body.name,
        email: req.body.email,
    };
    const userId = req.user.id;
    if (req.files) {
        const user = await User.findById(userId);
        const imageId = user.photo.id;

        //delete photo from cloudinary
        await cloudinary.uploader.destroy(imageId);

        let file = req.files.photo
        const result = await cloudinary.uploader.upload(file.tempFilePath, {
            folder: "user",
            width: 150,
            crop: "scale"
        });

        newData.photo = {
            id: result.public_id,
            secure_url: result.secure_url

        }


    }

    const user = await User.findByIdAndUpdate(userId, newData, { new: true, runValidators: true, useFindAndModify: false });

    res.status(200).json({ success: true, user });



})



exports.adminAllUser = BigPromise(async (req, res, next) => {

    // find all users
    const users = await User.find();

    res.status(200).json({
        success: true,
        users
    })

});

exports.admingetOneUser = BigPromise(async (req, res, next) => {
    const users = await User.findById(req.params.id)
    if (!users) {
        return next(new CustomError("No users found", 400))
    }

    res.status(200).json({
        success: true,
        users
    })
})

exports.adminUpdateOneUser = BigPromise(async (req, res, next) => {
    const newsData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role,
    }

    const user = await User.findByIdAndUpdate(req.params.id, newsData, { new: true, runValidators: true, useFindAndModify: false })

    res.status(200).json({
        success: true,
        user
    })

});

exports.adminDeleteUser = BigPromise(async (req, res, next) => {
// const user = await User.findById(req.params.id);
// await user.remove();
    await User.deleteOne(req.params.id, (error) => {
        if (error) {
            next(new CustomError("Something went wrong", 400))
        } else {
            res.status(200).json({ status: true, message: "User deleted successfully" })
        }
    })
})

exports.managerAllUser = BigPromise(async (req, res, next) => {
    const users = await User.find({ role: user });

    res.status(200).json({
        success: true,
        users
    })

})