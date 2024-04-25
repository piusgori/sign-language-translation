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
exports.addQuiz = exports.addLesson = exports.createTopic = exports.approveItem = exports.requests = exports.deleteItem = exports.editItem = exports.addItem = void 0;
const express_validator_1 = require("express-validator");
const http_error_1 = __importDefault(require("../../models/http-error"));
const item_1 = __importDefault(require("../../models/item"));
const notification_1 = __importDefault(require("../../models/notification"));
const topic_1 = __importDefault(require("../../models/topic"));
const lesson_1 = __importDefault(require("../../models/lesson"));
const question_1 = __importDefault(require("../../models/question"));
function addItem(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { image, meaning } = req.body;
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const errorArray = errors.array();
                return next(new http_error_1.default('Validation Error', errorArray[0].msg, 422));
            }
            ;
            const createdItem = { image, meaning };
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
exports.addItem = addItem;
function editItem(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { itemId, image, meaning } = req.body;
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const errorArray = errors.array();
                return next(new http_error_1.default('Validation Error', errorArray[0].msg, 422));
            }
            ;
            const foundItem = yield item_1.default.findById(itemId);
            if (!foundItem)
                return next(new http_error_1.default('Item Error', 'Item Not Found', 404));
            yield item_1.default.updateOne({ _id: itemId }, { $set: { meaning, image } });
            res.status(200).json({ message: 'Item updated' });
        }
        catch (err) {
            console.log(err);
            return next(new http_error_1.default('Unable to edit Item'));
        }
    });
}
exports.editItem = editItem;
function deleteItem(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { itemId } = req.query;
            const foundItem = yield item_1.default.findById(itemId);
            if (!foundItem)
                return next(new http_error_1.default('Item error', 'Item not found', 404));
            yield item_1.default.deleteOne({ _id: itemId });
            res.status(200).json({ message: 'Item deleted' });
        }
        catch (err) {
            console.log(err);
            return next(new http_error_1.default('Unable to delete Item'));
        }
    });
}
exports.deleteItem = deleteItem;
function requests(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const itemRequests = yield item_1.default.find({ approved: false }).sort({ createdAt: -1 });
            res.status(200).json({ message: 'Requests', items: itemRequests });
        }
        catch (err) {
            console.log(err);
            return next(new http_error_1.default('Unable to get requests'));
        }
    });
}
exports.requests = requests;
function approveItem(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { itemId } = req.body;
            const errors = (0, express_validator_1.validationResult)(req);
            if (!errors.isEmpty()) {
                const errorArray = errors.array();
                return next(new http_error_1.default('Validation Error', errorArray[0].msg, 422));
            }
            ;
            const foundItem = yield item_1.default.findById(itemId);
            if (!foundItem)
                return next(new http_error_1.default('Item Error', 'Item Not Found', 404));
            yield item_1.default.updateOne({ _id: itemId }, { $set: { approved: true } });
            if (foundItem.requestUser) {
                yield notification_1.default.create({ user: foundItem.requestUser, message: `Your learning resource "${foundItem.meaning}" has been approved and can be now viewed my the whole community` });
            }
            res.status(200).json({ message: 'Item has been approved' });
        }
        catch (err) {
            console.log(err);
            return next(new http_error_1.default('Unable to approve Item'));
        }
    });
}
exports.approveItem = approveItem;
const createTopic = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { title, description, objectives } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new http_error_1.default('Validation error', errorArray[0].msg, 422));
        }
        const newTopic = yield topic_1.default.create({ title, description, objectives });
        res.status(200).json({ message: 'Topic created', topic: newTopic === null || newTopic === void 0 ? void 0 : newTopic._doc });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to create topic'));
    }
});
exports.createTopic = createTopic;
const addLesson = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { topic, title, content, url } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new http_error_1.default('Validation Error', errorArray[0].msg, 422));
        }
        ;
        const newLesson = yield lesson_1.default.create({ title, content, url, topic });
        res.status(200).json({ message: 'Lesson Added' });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to add lesson'));
    }
});
exports.addLesson = addLesson;
const addQuiz = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { topic, text, options, correctAnswer } = req.body;
        const errors = (0, express_validator_1.validationResult)(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new http_error_1.default('Validation Error', errorArray[0].msg, 422));
        }
        ;
        const newQuestion = yield question_1.default.create({ text, options, correctAnswer, topic });
        res.status(200).json({ message: 'Question Added' });
    }
    catch (err) {
        console.log(err);
        return next(new http_error_1.default('Unable to add question'));
    }
});
exports.addQuiz = addQuiz;
