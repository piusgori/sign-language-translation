"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const mongoose_1 = __importDefault(require("mongoose"));
const main_1 = __importDefault(require("./routes/main"));
const http_error_1 = __importDefault(require("./models/http-error"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", '*');
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
    next();
});
app.use(main_1.default);
app.use((req, res, next) => {
    throw new http_error_1.default('The page you are looking for could not be found', null, 404);
});
app.use((error, req, res, next) => {
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error has occured', content: error.content || null });
});
mongoose_1.default.set('strictQuery', false).connect(process.env.MONGO_URL).then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log('Connected');
    });
}).catch((err) => {
    console.log(err);
});
