const express = require('express');
const router = express.Router();
const {home,login} =  require('../controllers/homeController');

router.route("/home").get(home)

router.route("/login").get(login)

module.exports = router;