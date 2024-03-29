const express = require('express');
const {signup,login,logout,forgotPassword,passwordReset,getLoggedInUserDetails,changePassword, updateUserDetails, adminAllUser, managerAllUser, adminUpdateOneUser, adminDeleteUser} = require('../controllers/userController');
const { isLoggedIn,customRole } = require('../middlewares/user');
const router = express.Router()



router.route("/signup").post(signup)
router.route("/login").post(login)
router.route("/logout").get(logout)
router.route("/forgotpassword").post(forgotPassword)
router.route("/password/reset/:token").post(passwordReset)
router.route("/userdashboard").get(isLoggedIn,getLoggedInUserDetails)
router.route("/password/update").post(isLoggedIn,changePassword)
router.route("/userdashboard/update").post(isLoggedIn,updateUserDetails)

//admin only route
router.route("/admin/users").get(isLoggedIn,customRole('admin'),adminAllUser)
router.route("/admin/user/:id").get(isLoggedIn,customRole('admin'),adminAllUser).put(isLoggedIn,customRole('admin'),adminUpdateOneUser).delete(isLoggedIn,customRole('admin'),adminDeleteUser)

//manager only route
router.route("/manager/users").get(isLoggedIn,customRole('manager'),managerAllUser)

module.exports = router