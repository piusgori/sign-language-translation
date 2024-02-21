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
const http_error_1 = __importDefault(require("../models/http-error"));
function adminAccessToken(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (!req.isAdmin)
                return next(new http_error_1.default('Access error', 'You are forbidden to access these resources', 403));
            next();
        }
        catch (err) {
            console.log(err);
            return next(new http_error_1.default('Unable to validate admin access token'));
        }
    });
}
exports.default = adminAccessToken;
