import { Router } from "express";
import { body } from 'express-validator';

import { getProfileDetails, login, register } from "../controllers/auth";
import accessToken from "../middleware/access-token";

const authRouter = Router();

authRouter.post('/register', [
    body('firstName').isLength({ min: 1 }).withMessage('First name is required'),
    body('lastName').isLength({ min: 1 }).withMessage('Last name is required'),
    body('email').isLength({ min: 1 }).isEmail().withMessage('Email address is required'),
    body('password').isLength({ min: 1 }).withMessage('Password is required'),
], register);

authRouter.post('/login', login);

authRouter.get('/profile', accessToken, getProfileDetails);

authRouter.patch('/update-profile', [
    body('firstName').isLength({ min: 1 }).withMessage('First name is required'),
    body('lastName').isLength({ min: 1 }).withMessage('Last name is required'),
    body('email').isLength({ min: 1 }).isEmail().withMessage('Email address is required'),
], register);

export default authRouter;