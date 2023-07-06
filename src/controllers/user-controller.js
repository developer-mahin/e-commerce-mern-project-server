const mongoose = require("mongoose");
const User = require("../models/user");
const createError = require("http-errors")

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


exports.getAllUser = async (req, res, next) => {
    try {


        const search = req.query.search || "";
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 5;

        const searchRegEx = new RegExp(".*" + search + ".*", "i")



        const filter = {
            role: { $ne: "admin" },
            $or: [
                { firstName: { $regex: searchRegEx } },
                { lastName: { $regex: searchRegEx } },
                { email: { $regex: searchRegEx } }
            ]
        }

        const option = { password: 0 }
        const result = await User.find(filter, option)
            .limit(limit)
            .skip((page - 1) * limit)

        if (!result) {
            throw createError(404, "not found")
        }
        const count = await User.find(filter).countDocuments()
        res.status(200).json({
            status: "success",
            message: "successfully get the users data",
            pagination: {
                totalUser: count,
                totalPage: Math.ceil(count / limit),
                currentPage: page,
                previousPage: page - 1 > 0 ? page - 1 : null,
                nextPage: page + 1 <= Math.ceil(count / limit) ? page + 1 : null
            },
            data: result,

        })

    } catch (error) {
        next(error)
    }
}

exports.getUserById = async (req, res, next) => {
    try {

        const { id } = req.params;
        const result = await User.findOne({ _id: id }).select("-password")

        if (!result) {
            throw createError(404, "user doesn't exist from this id")
        }
        res.status(200).json({
            status: "success",
            message: "successfully get the user",
            data: result
        })

    } catch (error) {
        if (error instanceof mongoose.Error) {
            next(createError(400, "Invalid user Id"))
            return;
        }
        next(error)
    }
}