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
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const http_error_1 = __importDefault(require("../models/http-error"));
const user_1 = __importDefault(require("../models/user"));
const admin_1 = __importDefault(require("../models/admin"));
function accessToken(req, res, next) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const token = (_b = (_a = req === null || req === void 0 ? void 0 : req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(' ')[1];
            if (!token)
                return next(new http_error_1.default('Access token error', 'Invalid or expired access token', 403));
            const decodedToken = jsonwebtoken_1.default.verify(token, process.env.TOKEN_SECRET);
            const id = decodedToken === null || decodedToken === void 0 ? void 0 : decodedToken._id.trim();
            const foundUser = yield user_1.default.findById(id, { password: 0 });
            const foundAdmin = yield admin_1.default.findById(id, { password: 0 });
            if (!foundUser && !foundAdmin)
                return next(new http_error_1.default('Access token error', 'Invalid or expired access token', 403));
            req.id = id;
            req.user = (foundUser === null || foundUser === void 0 ? void 0 : foundUser._doc) || (foundAdmin === null || foundAdmin === void 0 ? void 0 : foundAdmin._doc);
            req.isAdmin = !!foundAdmin;
            next();
        }
        catch (err) {
            console.log(err);
            return next(new http_error_1.default('Access token validation failed'));
        }
    });
}
exports.default = accessToken;
