const mongoose = require("mongoose");
const jwt = require("jsonwebtoken")
const User = require("../models/user");
const createError = require("http-errors");
const { findUserById } = require("../utils/findUserById");
const { createJsonWebToken } = require("../utils/jsonWebToken");
const { sendEmailWithNodeMailer } = require("../utils/email");
const bcrypt = require("bcryptjs")


exports.createUser = async (req, res, next) => {
    try {
        const { firstName, lastName, email, password, confirmPassword, phone, address, role } = req.body;
        const isUserExist = await User.exists({ email })
        if (isUserExist) {
            throw new Error("User Already Exist Please Try Another Email Address")
        }

        const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10))

        const query = {
            firstName,
            lastName,
            email,
            password: hashedPassword,
            confirmPassword: hashedPassword,
            role: "user",
            status: "active"
        }

        const token = createJsonWebToken(query, process.env.JWT_TOKEN, "10m")
        const name = firstName + " " + lastName

        try {
            const emailData = {
                email: email,
                subject: "Account Activation Email",
                html: `
                <h2>Hello ${name} !</h2>
                <p>Please activate your account to click here </p>
                <a
                style="padding:10px 20px; color:green; background:cyan; border-radius:5px;text-decoration:none"
                href="${process.env.CLIENT_URL}user/activate/${token}"
                target="_blank"
                >
                Click here to activate
                </a>
                `
            }
            await sendEmailWithNodeMailer(emailData)

        } catch (error) {
            next(createError(500, "failed to send verification email "))
            return
        }

        res.status(200).json({
            success: true,
            message: "Please go to your email and compete the verification process",
            token
        })

    } catch (error) {
        next(error)
    }

}

exports.verifyAndActivateUser = async (req, res, next) => {
    try {

        const token = req.body.token;
        if (!token) {
            throw createError(404, "Not found")
        }

        try {

            const decoded = jwt.verify(token, process.env.JWT_TOKEN)
            if (!decoded) {
                throw createError(401, "unauthorized access")
            }

            const isUserExist = await User.exists({ email: decoded.email })
            if (isUserExist) {
                throw createError(400, "User already with this email address please try another email address")
            }
            const user = await User.create(decoded)
            res.status(201).json({
                success: true,
                message: "successfully created the user",
                user
            })

        } catch (error) {
            if (error.name === "TokenExpiredError") {
                throw createError(401, "Token expired")
            }
            if (error.name === "JsonWebTokenError") {
                throw createError(401, "Invalid token")
            }
            else {
                throw error
            }
        }

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


exports.deleteUser = async (req, res, next) => {
    try {

        const { id } = req.params

        const user = await findUserById(id)

        const result = await User.deleteOne({ _id: id })
        if (result.deletedCount > 0) {
            return res.status(200).json({
                status: "success",
                message: "successfully delete the user"
            })
        }
        else {
            return next(createError(400, "something went wrong"))
        }


    } catch (error) {
        next(error)
    }
}