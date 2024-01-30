import { NextFunction, Request, Response } from "express";
import { validationResult } from 'express-validator';
import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import HttpError from "../models/http-error";
import { checkEmail } from "../middleware/check-unique-credentials";
import User from "../models/user";
import { TokenRequest } from "../types";
import { tokenExpiry } from "../utils/data";

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, password } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new HttpError('Validation error', errorArray[0].msg, 422))
        };
        const foundEmail = await checkEmail(email);
        if (foundEmail) return next(new HttpError('Validation error', 'Email address already exists', 422));
        const hashedPassword = await bcrypt.hash(password, 12);
        const theUser = { firstName: firstName.trim(), email: email.trim(), lastName: lastName.trim(), password: hashedPassword } as any;
        const newUser = new User(theUser);
        await newUser.save();
        const accessToken = jwt.sign({ _id: newUser._id, email: newUser.email }, process.env.TOKEN_SECRET as Secret, { expiresIn: tokenExpiry });
        const createdUser = await User.findById(newUser._id, { password: 0, googleId: 0 }) as any;
        res.status(200).json({ message: 'Registration has been successfull', user: createdUser['_doc'], accessToken })
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to register user'));
    }
}

export const googleRegister = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { given_name, family_name, email, googleId } = req.body;
		const foundUser = await User.findOne({ email });
		if (foundUser) return next(new HttpError("Email Error", "Email Address Is Already In Use", 422));
		const newUser = new User({ firstName: given_name, lastName: family_name, email, googleId: googleId, });
        await newUser.save();
		const foundProfile: any = await User.findById(newUser._id, { password: 0, googleId: 0 });
		const token = jwt.sign({ _id: foundProfile?._id, email }, process.env.TOKEN_SECRET as Secret, { expiresIn: tokenExpiry });
		res.status(200).json({ message: "Google signup success", user: foundProfile["_doc"], accessToken: token });
	} catch (err) {
		console.log(err);
		return next(new HttpError("Unable to register with google"));
	}
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const foundUser = await User.findOne({ email });
        if (!foundUser) return next(new HttpError('Validation error','The credentials entered are incorrect', 422));
        const isPasswordCorrect = await bcrypt.compare(password, foundUser?.password || '');
        if (!isPasswordCorrect) return next(new HttpError('Validation error','The credentials entered are incorrect', 422));
        const accessToken = jwt.sign({ _id: foundUser._id, email: foundUser.email }, process.env.TOKEN_SECRET as Secret, { expiresIn: tokenExpiry  });
        const loggedInUser = await User.findById(foundUser._id, { password: 0, googleId: 0 }) as any;
        res.status(200).json({ message: 'Login Successfull', user: loggedInUser['_doc'], accessToken });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to login'));
    }
}

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
	try {
		const { email, googleId } = req.body;
		const foundUser: any = await User.findOne({ $and: [{ email }, { googleId }] });
		if (!foundUser) return next( new HttpError("Validation Error", "Invalid Login Credentials", 422));
		const foundProfile = foundUser["_doc"];
		const token = jwt.sign({ _id: foundProfile._id, email }, process.env.TOKEN_SECRET as Secret, { expiresIn: tokenExpiry });
		delete foundProfile.password;
        delete foundProfile.googleId
		res.status(200).json({ message: "Google login success", user: foundProfile, accessToken: token,});
	} catch (err) {
		console.log(err);
		return next(new HttpError("Unable to login with google"));
	}
};

export const getProfileDetails = async(req: TokenRequest, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({ message: 'User details provided', user: req.user });
    } catch (err) {
        return next(new HttpError('Unable to get profile details'));
    }
}

export const updateProfileDetails = async (req: TokenRequest, res: Response, next: NextFunction) => {
    try {
        const { firstName, lastName, email, photoURL, disabled } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new HttpError('Validation error', errorArray[0].msg, 422))
        };
        if (req.user.googleId && email !== req.user.email) return next(new HttpError('Validation error', 'Your authentication method does not allow you to change your email address', 422));
        const emailExists = await checkEmail(email, req.id);
        if (emailExists) return next(new HttpError('Validation error', 'Email address already exists', 422));
        await User.updateOne({ _id: req.id }, { $set: { firstName, lastName, email, photoURL, disabled } });
        res.status(200).json({ message: 'Profile details updated successfully' });
    } catch (err) {
        console.log(err);
    } 
}