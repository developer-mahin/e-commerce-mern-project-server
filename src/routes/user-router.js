const express = require("express");
const router = express.Router()
const userController = require("../controllers/user-controller")



router.route("/sign-up")
    .post(userController.createUser)


module.exports = router;