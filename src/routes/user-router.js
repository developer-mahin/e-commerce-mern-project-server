const express = require("express");
const router = express.Router()
const userController = require("../controllers/user-controller")



router.route("/sign-up")
    .post(userController.createUser)

router.route("/getAllUsers")
    .get(userController.getAllUser)

router.route("/getUserById/:id")
    .get(userController.getUserById)

module.exports = router;