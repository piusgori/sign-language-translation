import { NextFunction, Request, Response } from "express";
import HttpError from "../models/http-error";
import { TokenRequest } from "../types";
import User from "../models/user";
import Chat from "../models/chat";

export const main = async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).json({ message: 'Sign language translation' })
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to load server'));
    }
}

export const searchUser = async (req: TokenRequest, res: Response, next: NextFunction) => {
    try {
        const { email } = req.query;
        const foundUser: any = await User.findOne({ email }, { password: 0, googleId: 0 });
        if (!foundUser) return next(new HttpError('User Error', 'User Not Found', 404));
        res.status(200).json({ message: 'User found', user: foundUser?._doc })
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to search for user'));
    }
}

export const getChats = async (req: TokenRequest, res: Response, next: NextFunction) => {
    try {
        const foundChats = await Chat.find({ $or: [{ userOne: req.id }, { userTwo: req.id }] });
        res.status(200).json({ message: 'Chats found', chats: foundChats });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to get chats'));
    }
}

export const sendMessage = async (req: TokenRequest, res: Response, next: NextFunction) => {
    try {
        const { message, to, id } = req.body;

        // find user;
        const foundUser = await User.findOne({ $or: [{ _id: req.id }, { _id: to }] });
        if (!foundUser) return next(new HttpError('User error', 'User not found', 404));

        // find the chat of the user one and user two
        const foundChat = await Chat.findOne({ $or: [
            { $and: [{ userOne: req.id }, { userTwo: to }] },
            { $and: [{ userOne: to }, { userTwo: req.id }] },
        ]})
        const newMessage = { id: id, message: message.trim(), from: req.id, to, createdAt: new Date() };
        let currentChat

        if (!foundChat) {
            currentChat = new Chat({
                userOne: req.id,
                userTwo: to,
                messages: [newMessage],
            });
            await currentChat.save();
        } else if (foundChat) {
            //  add new message to existing chat
            currentChat = foundChat;
            await Chat.updateOne({ _id: foundChat._id }, { $addToSet: { messages: newMessage } });
        }
        res.status(200).json({ message: 'Message has been sent' });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to send message'));
    }
}