const express = require("express");
const router = express.Router()
const userController = require("../controllers/user-controller");
const upload = require("../middleware/fileUpload");

router.route("/sign-up")
    .post(upload.single("image"), userController.createUser)
router.route("/getAllUsers")
    .get(userController.getAllUser)
router.route("/verify")
    .post(userController.verifyAndActivateUser)


router.route("/user/:id")
    .get(userController.getUserById)
    .delete(userController.deleteUser)






module.exports = router;