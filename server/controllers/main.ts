import { NextFunction, Request, Response } from "express";
import HttpError from "../models/http-error";

export const main = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({ message: 'Sign language translation' })
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to load server'));
    }
}