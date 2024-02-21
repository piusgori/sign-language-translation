import { Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';

import { TokenRequest } from "../types";
import HttpError from '../models/http-error';
import User from '../models/user';
import Admin from '../models/admin';

export default async function accessToken (req: TokenRequest, res: Response, next: NextFunction) {
    try {
        const token = req?.headers?.authorization?.split(' ')[1];
        if(!token) return next(new HttpError('Access token error', 'Invalid or expired access token', 403));
        const decodedToken = jwt.verify(token, process.env.TOKEN_SECRET as Secret) as any;
        const id = decodedToken?._id.trim();
        const foundUser = await User.findById(id, { password: 0 }) as any;
        const foundAdmin = await Admin.findById(id, { password: 0 }) as any;
        if (!foundUser && !foundAdmin) return next(new HttpError('Access token error', 'Invalid or expired access token', 403));
        req.id = id;
        req.user = foundUser?._doc || foundAdmin?._doc;
        req.isAdmin = !!foundAdmin;
        next();
    } catch (err) {
        console.log(err);
        return next(new HttpError('Access token validation failed'))
    }
}