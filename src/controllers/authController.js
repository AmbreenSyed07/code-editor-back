const { sendResponse, asyncErrorHandler } = require("../helpers/async-error.helper")
const Joi = require("joi");
const { findUser, createUser } = require('../services/userService');
const { hashPassword, comparePassword } = require("../helpers/bcrypt.helpers")
const { createToken }=require("../helpers/jwt.helpers")

const userSchema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
});

exports.register = async (req, res) => {
    return asyncErrorHandler(async () => {
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            return sendResponse(res, 400, false, error.details[0].message);
        }

        const { username, password } = value;

        let existingUser = await findUser(username);
        if (existingUser) {
            return sendResponse(res, 400, false, "This username already exists, try using another one or sign in.");
        }

        const hashedPassword = hashPassword(password);
        const user = await createUser({ username, password: hashedPassword });

        if (!user) {
            return sendResponse(res, 400, false, "Unable to register user.");
        }

        return sendResponse(res, 201, true, "User registered successfully.");
    }, res);
};


exports.login = async (req, res) => {
    return asyncErrorHandler(async () => {
        const { error, value } = userSchema.validate(req.body);
        if (error) {
            return sendResponse(res, 400, false, error.details[0].message);
        }

        const { username, password } = value;
        const user = await findUser(username);

        if (!user || !comparePassword(password, user.password)) {
            return sendResponse(res, 401, false, "Invalid credentials.");
        }

        const { password: hashPassword, ...userWithoutPassword } = user;
        const token = createToken({ ...userWithoutPassword });

        return sendResponse(res, 200, true, "Login successful.", {
            token,
            user: userWithoutPassword,
        });
    }, res);
};