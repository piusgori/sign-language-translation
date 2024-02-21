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
exports.notifications = exports.addRequest = exports.learning = exports.sendMessage = exports.getChats = exports.searchUser = exports.main = void 0;
const http_error_1 = __importDefault(require("../models/http-error"));
const user_1 = __importDefault(require("../models/user"));
const chat_1 = __importDefault(require("../models/chat"));
const item_1 = __importDefault(require("../models/item"));
const express_validator_1 = require("express-validator");
const notification_1 = __importDefault(require("../models/notification"));
const main = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.status(200).json({ message: 'Sign language translation' });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to load server'));
    }
});
exports.main = main;
const searchUser = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.query;
        const foundUser = yield user_1.default.findOne({ email }, { password: 0, googleId: 0 });
        if (!foundUser)
            return next(new http_error_1.default('User Error', 'User Not Found', 404));
        res.status(200).json({ message: 'User found', user: foundUser === null || foundUser === void 0 ? void 0 : foundUser._doc });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to search for user'));
    }
});
exports.searchUser = searchUser;
const getChats = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const foundChats = yield chat_1.default.find({ $or: [{ userOne: req.id }, { userTwo: req.id }] }).sort({ 'lastMessage.createdAt': -1 });
        const oneUsers = foundChats.map(each => each.userOne);
        const twoUsers = foundChats.map(each => each.userTwo);
        const theUsers = yield user_1.default.find({
            $or: [
                { _id: { $in: oneUsers } },
                { _id: { $in: twoUsers } },
            ]
        }, { password: 0, googleId: 0 });
        const mappedChats = foundChats.map((ch) => {
            const foundUserOne = theUsers.find((user) => user._id.toString() === ch.userOne.toString());
            const foundUserTwo = theUsers.find((user) => user._id.toString() === ch.userTwo.toString());
            const returnedChat = Object.assign(Object.assign({}, ch === null || ch === void 0 ? void 0 : ch._doc), { userOne: foundUserOne === null || foundUserOne === void 0 ? void 0 : foundUserOne._doc, userTwo: foundUserTwo === null || foundUserTwo === void 0 ? void 0 : foundUserTwo._doc });
            return returnedChat;
        });
        res.status(200).json({ message: 'Chats found', chats: mappedChats });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to get chats'));
    }
});
exports.getChats = getChats;
const sendMessage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { message, to, id } = req.body;
        // find user;
        const foundUser = yield user_1.default.findOne({ $or: [{ _id: req.id }, { _id: to }] });
        if (!foundUser)
            return next(new http_error_1.default('User error', 'User not found', 404));
        // find the chat of the user one and user two
        const foundChat = yield chat_1.default.findOne({ $or: [
                { $and: [{ userOne: req.id }, { userTwo: to }] },
                { $and: [{ userOne: to }, { userTwo: req.id }] },
            ] });
        const newMessage = { id: id, message: message.trim(), from: req.id, to, createdAt: new Date() };
        let currentChat;
        if (!foundChat) {
            currentChat = new chat_1.default({
                userOne: req.id,
                userTwo: to,
                lastMessage: newMessage,
                messages: [newMessage],
            });
            yield currentChat.save();
        }
        else if (foundChat) {
            //  add new message to existing chat
            currentChat = foundChat;
            yield chat_1.default.updateOne({ _id: foundChat._id }, { $addToSet: { messages: newMessage }, $set: { lastMessage: newMessage } });
        }
        res.status(200).json({ message: 'Message has been sent' });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to send message'));
    }
});
exports.sendMessage = sendMessage;
const learning = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const items = yield item_1.default.find({ approved: true }).sort({ createdAt: -1 });
        res.status(200).json({ message: 'Items', items });
        const itemIds = items.map(item => item._id);
        yield item_1.default.updateMany({ _id: { $in: itemIds } }, { $addToSet: { views: req.id } });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to get learning items'));
    }
});
exports.learning = learning;
function addRequest(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { image, meaning } = req.body;
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const errorArray = errors.array();
                return next(new http_error_1.default('Validation Error', errorArray[0].msg, 422));
            }
            ;
            const createdItem = { image, meaning, approved: false, requestUser: req.id };
            const newItem = new item_1.default(createdItem);
            yield newItem.save();
            res.status(200).json({ message: 'Item created', item: newItem['_doc'] });
        }
        catch (err) {
            console.log(err);
            return next(new http_error_1.default('Unable to add item'));
        }
    });
}
exports.addRequest = addRequest;
const notifications = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const notifications = yield notification_1.default.find({ user: req.id }).sort({ createdAt: -1 });
        res.status(200).json({ message: 'Notifications', notifications });
        const notIds = notifications.filter(each => !each.read).map(item => item._id);
        yield notification_1.default.updateMany({ _id: { $in: notIds } }, { $set: { read: true } });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to get learning items'));
    }
});
exports.notifications = notifications;
