"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const main_1 = require("../controllers/main");
const auth_1 = __importDefault(require("./auth"));
const access_token_1 = __importDefault(require("../middleware/access-token"));
const mainRouter = (0, express_1.Router)();
mainRouter.get('/', main_1.main);
mainRouter.use('/auth', auth_1.default);
mainRouter.get('/search-user', access_token_1.default, main_1.searchUser);
mainRouter.get('/chats', access_token_1.default, main_1.getChats);
mainRouter.post('/send-message', access_token_1.default, main_1.sendMessage);
exports.default = mainRouter;
