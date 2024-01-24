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
exports.updateProfileDetails = exports.getProfileDetails = exports.googleSignup = exports.googleLogin = exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const http_error_1 = __importDefault(require("../models/http-error"));
const check_unique_credentials_1 = require("../middleware/check-unique-credentials");
const user_1 = __importDefault(require("../models/user"));
const data_1 = require("../utils/data");
const axios_1 = __importDefault(require("axios"));
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
        // const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        // const passwordResult = password.match(passwordPattern);
        // if(!passwordResult) return next(new HttpError('Authentication error', 'Please input a strong password that includes an alphabet, number and special character', 422));
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
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const foundUser = yield user_1.default.findOne({ email });
        if (!foundUser)
            return next(new http_error_1.default('Validation error', 'The credentials entered are incorrect', 422));
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, foundUser.password);
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
    var _a, _b, _c, _d;
    try {
        const { code } = req.body;
        const tokenUrl = "https://oauth2.googleapis.com/token";
        const tokenOptions = {
            code,
            client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
            client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            redirect_uri: `${process.env.REACT_APP_URL}/auth/login`,
            grant_type: "authorization_code",
        };
        const tokenResponse = yield axios_1.default.post(tokenUrl, tokenOptions);
        const userResponse = yield axios_1.default.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${(_a = tokenResponse === null || tokenResponse === void 0 ? void 0 : tokenResponse.data) === null || _a === void 0 ? void 0 : _a.access_token}`, { headers: { Authorization: `Bearer ${(_b = tokenResponse === null || tokenResponse === void 0 ? void 0 : tokenResponse.data) === null || _b === void 0 ? void 0 : _b.id_token}` } });
        const userData = userResponse === null || userResponse === void 0 ? void 0 : userResponse.data;
        const { email, id } = userData;
        const foundUser = yield user_1.default.findOne({ $and: [{ email }, { googleId: id }] });
        if (!foundUser)
            return next(new http_error_1.default("Validation Error", "Invalid Login Credentials", 422));
        const accessToken = jsonwebtoken_1.default.sign({ _id: foundUser._id, email: foundUser.email }, process.env.TOKEN_SECRET, { expiresIn: data_1.tokenExpiry });
        const loggedInUser = yield user_1.default.findById(foundUser._id, { password: 0, googleId: 0 });
        res.status(200).json({ message: 'Login Successfull', user: loggedInUser['_doc'], accessToken });
    }
    catch (err) {
        console.log(((_c = err === null || err === void 0 ? void 0 : err.response) === null || _c === void 0 ? void 0 : _c.data) || ((_d = err === null || err === void 0 ? void 0 : err.response) === null || _d === void 0 ? void 0 : _d.message) || (err === null || err === void 0 ? void 0 : err.message) || err);
        return next(new http_error_1.default("Unable to login with google"));
    }
});
exports.googleLogin = googleLogin;
const googleSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _e, _f, _g, _h;
    try {
        const { code } = req.body;
        const tokenUrl = "https://oauth2.googleapis.com/token";
        const tokenOptions = {
            code,
            client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
            client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
            redirect_uri: `${process.env.REACT_APP_URL}/auth/register`,
            grant_type: "authorization_code",
        };
        const tokenResponse = yield axios_1.default.post(tokenUrl, tokenOptions);
        const userResponse = yield axios_1.default.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${(_e = tokenResponse === null || tokenResponse === void 0 ? void 0 : tokenResponse.data) === null || _e === void 0 ? void 0 : _e.access_token}`, { headers: { Authorization: `Bearer ${(_f = tokenResponse === null || tokenResponse === void 0 ? void 0 : tokenResponse.data) === null || _f === void 0 ? void 0 : _f.id_token}` } });
        const userData = userResponse === null || userResponse === void 0 ? void 0 : userResponse.data;
        const { given_name, family_name, email, id } = userData;
        const existingUser = yield (0, check_unique_credentials_1.checkEmail)(email);
        if (existingUser)
            return next(new http_error_1.default("Email Error", "Email Address Is Already In Use", 422));
        const newUser = new user_1.default({ firstName: given_name, lastName: family_name, email, googleId: id, });
        yield newUser.save();
        const accessToken = jsonwebtoken_1.default.sign({ _id: newUser._id, email: newUser.email }, process.env.TOKEN_SECRET, { expiresIn: data_1.tokenExpiry });
        const createdUser = yield user_1.default.findById(newUser._id, { password: 0, googleId: 0 });
        res.status(200).json({ message: 'Registration has been successfull', user: createdUser['_doc'], accessToken });
    }
    catch (err) {
        console.log(((_g = err === null || err === void 0 ? void 0 : err.response) === null || _g === void 0 ? void 0 : _g.data) || ((_h = err === null || err === void 0 ? void 0 : err.response) === null || _h === void 0 ? void 0 : _h.message) || (err === null || err === void 0 ? void 0 : err.message) || err);
        return next(new http_error_1.default("Unable to create account with google"));
    }
});
exports.googleSignup = googleSignup;
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
