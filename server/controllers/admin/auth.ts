import { NextFunction, Request, Response } from "express";
import { validationResult } from "express-validator";
import bcrypt from 'bcryptjs';
import jwt, { Secret } from 'jsonwebtoken';

import HttpError from "../../models/http-error";
import Admin from "../../models/admin";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { name, email, password } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new HttpError('Validation error', errorArray[0].msg, 422));
        };
        const hashedPassword = await bcrypt.hash(password, 12);
        const newUser = new Admin({ name: name?.trim(), email: email?.trim(), password: hashedPassword });
        await newUser.save();
        const accessToken = jwt.sign({ _id: newUser?._id, name, email }, process.env.TOKEN_SECRET as Secret, { expiresIn: 60 * 60 * 24 });
        const registeredUser = await Admin.findById(newUser?._id, { password: 0 }) as any;
        res.status(201).json({ message: 'Admin registered successfully', user: registeredUser['_doc'], accessToken });
    } catch (err) {
        console.log(err)
        return next(new HttpError('Unable to register admin'))
    }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const foundUser = await Admin.findOne({ email }) as any;
        if (!foundUser) return next(new HttpError('Validation error', 'Invalid login credentials', 422));
        const isPasswordCorrect = await bcrypt.compare(password, foundUser?.password);
        if (!isPasswordCorrect) return next(new HttpError('Validation error', 'Invalid login credentials', 422));
        const accessToken = jwt.sign({ _id: foundUser?._id }, process.env.TOKEN_SECRET as Secret, { expiresIn: 60 * 60 * 24 });
        const profile = foundUser['_doc']
        delete profile.password;
        res.status(200).json({ message: 'Admin logged in successfully', user: profile, accessToken });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to login admin'));
    }
}