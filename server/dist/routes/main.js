"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const main_1 = require("../controllers/main");
const auth_1 = __importDefault(require("./auth"));
const access_token_1 = __importDefault(require("../middleware/access-token"));
const admin_1 = __importDefault(require("./admin"));
const express_validator_1 = require("express-validator");
const mainRouter = (0, express_1.Router)();
mainRouter.get('/', main_1.main);
mainRouter.use('/auth', auth_1.default);
mainRouter.use('/admin', admin_1.default);
mainRouter.get('/search-user', access_token_1.default, main_1.searchUser);
mainRouter.get('/chats', access_token_1.default, main_1.getChats);
mainRouter.post('/send-message', access_token_1.default, main_1.sendMessage);
mainRouter.get('/learning', access_token_1.default, main_1.learning);
mainRouter.post('/add-request', access_token_1.default, [
    (0, express_validator_1.body)('image').isLength({ min: 1 }).withMessage('Image is required'),
    (0, express_validator_1.body)('meaning').isLength({ min: 1 }).withMessage('Meaning is required'),
], main_1.addRequest);
mainRouter.get('/notifications', access_token_1.default, main_1.notifications);
mainRouter.get('/topics', access_token_1.default, main_1.topics);
mainRouter.get('/single-topic', access_token_1.default, main_1.singleTopic);
mainRouter.post('/learn-lesson', access_token_1.default, main_1.learnLesson);
mainRouter.post('/answer-question', access_token_1.default, main_1.answerQuestion);
mainRouter.post('/complete-topic', access_token_1.default, main_1.completeTopic);
exports.default = mainRouter;
