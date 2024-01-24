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
exports.checkEmail = void 0;
const user_1 = __importDefault(require("../models/user"));
const checkEmail = (email, id) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        let foundUserWithEmail;
        foundUserWithEmail = id ? yield user_1.default.findOne({ $and: [{ _id: { $ne: id } }, { email }] }) : yield user_1.default.findOne({ email });
        return (!!foundUserWithEmail);
    }
    catch (err) {
        console.log(err);
    }
});
exports.checkEmail = checkEmail;
