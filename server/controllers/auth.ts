import { NextFunction, Request, Response } from "express";
import { check, validationResult } from 'express-validator';
import jwt, { Secret } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import HttpError from "../models/http-error";
import { checkEmail } from "../middleware/check-unique-credentials";
import User from "../models/user";
import { TokenRequest } from "../types";
import { tokenExpiry } from "../utils/data";
import axios from "axios";

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
        // const passwordPattern = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,}$/;
        // const passwordResult = password.match(passwordPattern);
        // if(!passwordResult) return next(new HttpError('Authentication error', 'Please input a strong password that includes an alphabet, number and special character', 422));
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

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        const foundUser = await User.findOne({ email });
        if (!foundUser) return next(new HttpError('Validation error','The credentials entered are incorrect', 422));
        const isPasswordCorrect = await bcrypt.compare(password, foundUser.password);
        if (!isPasswordCorrect) return next(new HttpError('Validation error','The credentials entered are incorrect', 422));
        const accessToken = jwt.sign({ _id: foundUser._id, email: foundUser.email }, process.env.TOKEN_SECRET as Secret, { expiresIn: tokenExpiry  });
        const loggedInUser = await User.findById(foundUser._id, { password: 0, googleId: 0 }) as any;
        res.status(200).json({ message: 'Login Successfull', user: loggedInUser['_doc'], accessToken });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to login'));
    }
}

export const googleLogin = async (req: TokenRequest, res: Response, next: NextFunction) => {
	try {
		const { code } = req.body;
		const tokenUrl = "https://oauth2.googleapis.com/token";
		const tokenOptions = {
			code,
			client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
			client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
			redirect_uri: `${process.env.REACT_APP_URL}/auth/login`,
			grant_type: "authorization_code",
		};
		const tokenResponse = await axios.post(tokenUrl, tokenOptions);
		const userResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokenResponse?.data?.access_token}`, { headers: { Authorization: `Bearer ${tokenResponse?.data?.id_token}` } });
		const userData = userResponse?.data;
		const { email, id } = userData;
		const foundUser = await User.findOne({ $and: [{ email }, { googleId: id }] }) as any;
		if (!foundUser) return next(new HttpError("Validation Error", "Invalid Login Credentials", 422));
		const accessToken = jwt.sign({ _id: foundUser._id, email: foundUser.email }, process.env.TOKEN_SECRET as Secret, { expiresIn: tokenExpiry  });
        const loggedInUser = await User.findById(foundUser._id, { password: 0, googleId: 0 }) as any;
        res.status(200).json({ message: 'Login Successfull', user: loggedInUser['_doc'], accessToken });
	} catch (err: any) {
		console.log(err?.response?.data || err?.response?.message || err?.message || err);
		return next(new HttpError("Unable to login with google"));
	}
};

export const googleSignup = async (req: TokenRequest, res: Response, next: NextFunction) => {
	try {
		const { code } = req.body;
		const tokenUrl = "https://oauth2.googleapis.com/token";
		const tokenOptions = {
			code,
			client_id: process.env.GOOGLE_OAUTH_CLIENT_ID,
			client_secret: process.env.GOOGLE_OAUTH_CLIENT_SECRET,
			redirect_uri: `${process.env.REACT_APP_URL}/auth/register`,
			grant_type: "authorization_code",
		};
		const tokenResponse = await axios.post(tokenUrl, tokenOptions);
		const userResponse = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokenResponse?.data?.access_token}`, { headers: { Authorization: `Bearer ${tokenResponse?.data?.id_token}` } });
		const userData = userResponse?.data;
		const { given_name, family_name, email, id } = userData;
		const existingUser = await checkEmail(email);
		if (existingUser) return next(new HttpError("Email Error", "Email Address Is Already In Use", 422));
		const newUser = new User({ firstName: given_name, lastName: family_name, email, googleId: id, });
        await newUser.save();
        const accessToken = jwt.sign({ _id: newUser._id, email: newUser.email }, process.env.TOKEN_SECRET as Secret, { expiresIn: tokenExpiry });
        const createdUser = await User.findById(newUser._id, { password: 0, googleId: 0 }) as any;
        res.status(200).json({ message: 'Registration has been successfull', user: createdUser['_doc'], accessToken })
	} catch (err: any) {
		console.log(err?.response?.data || err?.response?.message || err?.message || err);
		return next(new HttpError("Unable to create account with google"));
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