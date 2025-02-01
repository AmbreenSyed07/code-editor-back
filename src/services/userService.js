const { asyncHandler } = require("../helpers/async-error.helper");
const User = require("../models/userModel");

const findUser = async (username) => {
    return asyncHandler(async () => {
        const user = await User.findOne({ username }).exec();
        return user ? user.toJSON() : false;
    });
};

const createUser = async (info) => {
    return asyncHandler(async () => {
        const user = new User(info);
        const savedUser = await user.save();
        return savedUser instanceof User ? savedUser.toJSON() : false;
    });
};

module.exports = { createUser, findUser }