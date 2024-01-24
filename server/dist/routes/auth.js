"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../controllers/auth");
const access_token_1 = __importDefault(require("../middleware/access-token"));
const authRouter = (0, express_1.Router)();
authRouter.post('/register', [
    (0, express_validator_1.body)('firstName').isLength({ min: 1 }).withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').isLength({ min: 1 }).withMessage('Last name is required'),
    (0, express_validator_1.body)('email').isLength({ min: 1 }).isEmail().withMessage('Email address is required'),
    (0, express_validator_1.body)('password').isLength({ min: 1 }).withMessage('Password is required'),
], auth_1.register);
authRouter.post('/login', auth_1.login);
authRouter.get('/profile', access_token_1.default, auth_1.getProfileDetails);
authRouter.patch('/update-profile', [
    (0, express_validator_1.body)('firstName').isLength({ min: 1 }).withMessage('First name is required'),
    (0, express_validator_1.body)('lastName').isLength({ min: 1 }).withMessage('Last name is required'),
    (0, express_validator_1.body)('email').isLength({ min: 1 }).isEmail().withMessage('Email address is required'),
], auth_1.register);
exports.default = authRouter;
