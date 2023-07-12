const express = require("express");
const router = express.Router()
const userController = require("../controllers/user-controller")



router.route("/sign-up")
    .post(userController.createUser)
router.route("/getAllUsers")
    .get(userController.getAllUser)
router.route("/verify")
    .post(userController.verifyAndActivateUser)


router.route("/user/:id")
    .get(userController.getUserById)
    .delete(userController.deleteUser)






module.exports = router;