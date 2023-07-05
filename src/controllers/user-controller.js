const User = require("../models/user");

exports.createUser = async (req, res, next) => {
    try {
        const data = req.body;
        const result = await User.create(data)
        res.status(201).json({
            status: "success",
            message: "successfully user created",
            data: result
        })

    } catch (error) {
        next(error)
    }
}