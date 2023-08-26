const mongoose = require("mongoose");
const User = require("../models/user");
const createError = require("http-errors");

exports.findUserById = async (id, option = {}) => {
  try {
    const user = User.findOne({ _id: id });
    if (!user) {
      throw createError(404, "User doesn't exist with this id");
    }
    return user;
  } catch (error) {
    if (error instanceof mongoose.Error) {
      throw createError(400, "Invalid user id");
    }
    throw error;
  }
};
