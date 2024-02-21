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
exports.login = exports.register = void 0;
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_error_1 = __importDefault(require("../../models/http-error"));
const admin_1 = __importDefault(require("../../models/admin"));
const register = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new http_error_1.default('Validation error', errorArray[0].msg, 422));
        }
        ;
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        const newUser = new admin_1.default({ name: name === null || name === void 0 ? void 0 : name.trim(), email: email === null || email === void 0 ? void 0 : email.trim(), password: hashedPassword });
        yield newUser.save();
        const accessToken = jsonwebtoken_1.default.sign({ _id: newUser === null || newUser === void 0 ? void 0 : newUser._id, name, email }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 * 24 });
        const registeredUser = yield admin_1.default.findById(newUser === null || newUser === void 0 ? void 0 : newUser._id, { password: 0 });
        res.status(201).json({ message: 'Admin registered successfully', user: registeredUser['_doc'], accessToken });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to register admin'));
    }
});
exports.register = register;
const login = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const foundUser = yield admin_1.default.findOne({ email });
        if (!foundUser)
            return next(new http_error_1.default('Validation error', 'Invalid login credentials', 422));
        const isPasswordCorrect = yield bcryptjs_1.default.compare(password, foundUser === null || foundUser === void 0 ? void 0 : foundUser.password);
        if (!isPasswordCorrect)
            return next(new http_error_1.default('Validation error', 'Invalid login credentials', 422));
        const accessToken = jsonwebtoken_1.default.sign({ _id: foundUser === null || foundUser === void 0 ? void 0 : foundUser._id }, process.env.TOKEN_SECRET, { expiresIn: 60 * 60 * 24 });
        const profile = foundUser['_doc'];
        delete profile.password;
        res.status(200).json({ message: 'Admin logged in successfully', user: profile, accessToken });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to login admin'));
    }
});
exports.login = login;
