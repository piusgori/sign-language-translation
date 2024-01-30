"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateProfileDetails = exports.getProfileDetails = exports.googleLogin = exports.login = exports.googleRegister = exports.register = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_error_1 = __importDefault(require("../models/http-error"));
const check_unique_credentials_1 = require("../middleware/check-unique-credentials");
const user_1 = __importDefault(require("../models/user"));
const data_1 = require("../utils/data");
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, password } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new http_error_1.default('Validation error', errorArray[0].msg, 422));
        }
        ;
        const foundEmail = yield (0, check_unique_credentials_1.checkEmail)(email);
        if (foundEmail)
            return next(new http_error_1.default('Validation error', 'Email address already exists', 422));
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const theUser = { firstName: firstName.trim(), email: email.trim(), lastName: lastName.trim(), password: hashedPassword };
        const newUser = new user_1.default(theUser);
        yield newUser.save();
        const accessToken = jsonwebtoken_1.default.sign({ _id: newUser._id, email: newUser.email }, process.env.TOKEN_SECRET, { expiresIn: data_1.tokenExpiry });
        const createdUser = yield user_1.default.findById(newUser._id, { password: 0, googleId: 0 });
        res.status(200).json({ message: 'Registration has been successfull', user: createdUser['_doc'], accessToken });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to register user'));
    }
});
exports.register = register;
const googleRegister = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { given_name, family_name, email, googleId } = req.body;
        const foundUser = yield user_1.default.findOne({ email });
        if (foundUser)
            return next(new http_error_1.default("Email Error", "Email Address Is Already In Use", 422));
        const newUser = new user_1.default({ firstName: given_name, lastName: family_name, email, googleId: googleId, });
        yield newUser.save();
        const foundProfile = yield user_1.default.findById(newUser._id, { password: 0, googleId: 0 });
        const token = jsonwebtoken_1.default.sign({ _id: foundProfile === null || foundProfile === void 0 ? void 0 : foundProfile._id, email }, process.env.TOKEN_SECRET, { expiresIn: data_1.tokenExpiry });
        res.status(200).json({ message: "Google signup success", user: foundProfile["_doc"], accessToken: token });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default("Unable to register with google"));
    }
});
exports.googleRegister = googleRegister;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const foundUser = yield user_1.default.findOne({ email });
        if (!foundUser)
            return next(new http_error_1.default('Validation error', 'The credentials entered are incorrect', 422));
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, (foundUser === null || foundUser === void 0 ? void 0 : foundUser.password) || '');
        if (!isPasswordCorrect)
            return next(new http_error_1.default('Validation error', 'The credentials entered are incorrect', 422));
        const accessToken = jsonwebtoken_1.default.sign({ _id: foundUser._id, email: foundUser.email }, process.env.TOKEN_SECRET, { expiresIn: data_1.tokenExpiry });
        const loggedInUser = yield user_1.default.findById(foundUser._id, { password: 0, googleId: 0 });
        res.status(200).json({ message: 'Login Successfull', user: loggedInUser['_doc'], accessToken });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to login'));
    }
});
exports.login = login;
const googleLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, googleId } = req.body;
        const foundUser = yield user_1.default.findOne({ $and: [{ email }, { googleId }] });
        if (!foundUser)
            return next(new http_error_1.default("Validation Error", "Invalid Login Credentials", 422));
        const foundProfile = foundUser["_doc"];
        const token = jsonwebtoken_1.default.sign({ _id: foundProfile._id, email }, process.env.TOKEN_SECRET, { expiresIn: data_1.tokenExpiry });
        delete foundProfile.password;
        delete foundProfile.googleId;
        res.status(200).json({ message: "Google login success", user: foundProfile, accessToken: token, });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default("Unable to login with google"));
    }
});
exports.googleLogin = googleLogin;
const getProfileDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ message: 'User details provided', user: req.user });
    }
    catch (err) {
        return next(new http_error_1.default('Unable to get profile details'));
    }
});
exports.getProfileDetails = getProfileDetails;
const updateProfileDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, email, photoURL, disabled } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new http_error_1.default('Validation error', errorArray[0].msg, 422));
        }
        ;
        if (req.user.googleId && email !== req.user.email)
            return next(new http_error_1.default('Validation error', 'Your authentication method does not allow you to change your email address', 422));
        const emailExists = yield (0, check_unique_credentials_1.checkEmail)(email, req.id);
        if (emailExists)
            return next(new http_error_1.default('Validation error', 'Email address already exists', 422));
        yield user_1.default.updateOne({ _id: req.id }, { $set: { firstName, lastName, email, photoURL, disabled } });
        res.status(200).json({ message: 'Profile details updated successfully' });
    }
    catch (err) {
        console.log(err);
    }
});
exports.updateProfileDetails = updateProfileDetails;
