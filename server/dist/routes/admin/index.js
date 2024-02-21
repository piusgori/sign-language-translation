"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const access_token_1 = __importDefault(require("../../middleware/access-token"));
const admin_access_token_1 = __importDefault(require("../../middleware/admin-access-token"));
const express_validator_1 = require("express-validator");
const admin_1 = require("../../controllers/admin");
const adminMainRouter = (0, express_1.Router)();
adminMainRouter.use('/auth', auth_1.default);
adminMainRouter.post('/add-item', access_token_1.default, admin_access_token_1.default, [
    (0, express_validator_1.body)('image').isLength({ min: 1 }).withMessage('Image is required'),
    (0, express_validator_1.body)('meaning').isLength({ min: 1 }).withMessage('Meaning is required'),
], admin_1.addItem);
adminMainRouter.patch('/edit-item', access_token_1.default, admin_access_token_1.default, [
    (0, express_validator_1.body)('itemId').isLength({ min: 1 }).withMessage('Please select an item'),
    (0, express_validator_1.body)('image').isLength({ min: 1 }).withMessage('Image is required'),
    (0, express_validator_1.body)('meaning').isLength({ min: 1 }).withMessage('Meaning is required'),
], admin_1.editItem);
adminMainRouter.delete('/delete-item', access_token_1.default, admin_access_token_1.default, admin_1.deleteItem);
adminMainRouter.get('/requests', access_token_1.default, admin_access_token_1.default, admin_1.requests);
adminMainRouter.patch('/approve-item', access_token_1.default, admin_access_token_1.default, [
    (0, express_validator_1.body)('itemId').isLength({ min: 1 }).withMessage('Please select an item'),
], admin_1.approveItem);
exports.default = adminMainRouter;
