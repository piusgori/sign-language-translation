"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const express_validator_1 = require("express-validator");
const auth_1 = require("../../controllers/admin/auth");
const adminAuthRouter = (0, express_1.Router)();
adminAuthRouter.post('/register', [
    (0, express_validator_1.body)('name').isLength({ min: 1 }).withMessage('Full is required'),
    (0, express_validator_1.body)('email').isLength({ min: 1 }).isEmail().withMessage('Email is required'),
    (0, express_validator_1.body)('password').isLength({ min: 1 }).withMessage('Password is required'),
], auth_1.register);
adminAuthRouter.post('/login', auth_1.login);
exports.default = adminAuthRouter;
