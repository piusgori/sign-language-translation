import { Router } from "express";
import { body } from "express-validator";
import { login, register } from "../../controllers/admin/auth";

const adminAuthRouter = Router();

adminAuthRouter.post('/register', [
    body('name').isLength({ min: 1 }).withMessage('Full is required'),
    body('email').isLength({ min: 1 }).isEmail().withMessage('Email is required'),
    body('password').isLength({ min: 1 }).withMessage('Password is required'),
], register);

adminAuthRouter.post('/login', login);

export default adminAuthRouter;