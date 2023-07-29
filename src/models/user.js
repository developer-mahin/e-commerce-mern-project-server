const mongoose = require("mongoose")
const validator = require('validator');
const bcrypt = require('bcryptjs');


const userSchema = mongoose.Schema({

    firstName: {
        type: String,
        required: [true, "User name is required"],
        trim: true,
        minlength: [3, "Name can't be less than 3 character"],
        maxLength: [31, "Name can't be less than 3 character"],
        lowercase: true
    },
    lastName: {
        type: String,
        required: [true, "User name is required"],
        trim: true,
        minlength: [3, "Name can't be less than 3 character"],
        maxLength: [31, "Name can't be less than 3 character"],
        lowercase: true
    },
    email: {
        type: String,
        required: [true, "email is required"],
        unique: true,
        trim: true,
        validator: [validator.isEmail, "Please provide a valid email"],
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, "password is required"],
        validator: (value) => validator.isStrongPassword(value, {
            minlength: 6,
            minLowerCase: 2,
            minUpperCase: 1,
            minSymbol: 1
        }),
    },
    confirmPassword: {
        type: String,
        required: [true, "password is required"],
        validator: {
            function(value) {
                return value === this.password
            },
            message: "password doesn't matched"
        }

    },
    image: {
        type: String,
    },
    address: String,
    phone: {
        type: String,
        validator: [validator.isMobilePhone, "please provide valid number"]
    },
    role: {
        type: String,
        enum: ["user", "seller", "admin"],
        default: "user"
    },
    status: {
        type: String,
        enum: ["active", "blocked", "de-active", "ban"],
        default: "active"
    }

},
    {
        timestamps: true
    }
)


userSchema.pre("save", function (next) {
    const password = this.password;
    const hashedPassword = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
    this.password = hashedPassword;
    this.confirmPassword = undefined;
    next();
})





const User = mongoose.model("User", userSchema)
module.exports = User;