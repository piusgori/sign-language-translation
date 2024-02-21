import { NextFunction, Request, Response } from "express";
import HttpError from "../models/http-error";
import { TokenRequest } from "../types";
import User from "../models/user";
import Chat from "../models/chat";
import Item from "../models/item";
import { validationResult } from "express-validator";
import Notification from "../models/notification";

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
        const foundChats = await Chat.find({ $or: [{ userOne: req.id }, { userTwo: req.id }] }).sort({ 'lastMessage.createdAt': -1 });
        const oneUsers = foundChats.map(each => each.userOne);
        const twoUsers = foundChats.map(each => each.userTwo);
        const theUsers = await User.find({
           $or: [
                { _id: { $in: oneUsers } },
                { _id: { $in: twoUsers } },
            ]
        }, { password: 0, googleId: 0 });
        const mappedChats = foundChats.map((ch: any) => {
            const foundUserOne: any = theUsers.find((user) => user._id.toString() === ch.userOne.toString());
            const foundUserTwo: any = theUsers.find((user) => user._id.toString() === ch.userTwo.toString());
            const returnedChat = { ...ch?._doc, userOne: foundUserOne?._doc, userTwo: foundUserTwo?._doc };
            return returnedChat;
        })
        res.status(200).json({ message: 'Chats found', chats: mappedChats });
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
                lastMessage: newMessage,
                messages: [newMessage],
            });
            await currentChat.save();
        } else if (foundChat) {
            //  add new message to existing chat
            currentChat = foundChat;
            await Chat.updateOne({ _id: foundChat._id }, { $addToSet: { messages: newMessage }, $set: { lastMessage: newMessage } });
        }
        res.status(200).json({ message: 'Message has been sent' });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to send message'));
    }
}

export const learning = async (req: TokenRequest, res: Response, next: NextFunction) => {
    try {
        const items = await Item.find({ approved: true }).sort({ createdAt: -1 });
        res.status(200).json({ message: 'Items', items });
        const itemIds = items.map(item => item._id);
        await Item.updateMany({ _id: { $in: itemIds } }, { $addToSet: { views: req.id } })
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to get learning items'));
    }
}

export async function addRequest(req: TokenRequest, res: Response, next: NextFunction) {
    try {
        const { image, meaning } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new HttpError('Validation Error', errorArray[0].msg, 422));
        };
        const createdItem = { image, meaning, approved: false, requestUser: req.id } as any;
        const newItem = new Item(createdItem) as any;
        await newItem.save();
        res.status(200).json({ message: 'Item created', item: newItem['_doc'] })
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to add item'));
    }
}

export const notifications = async (req: TokenRequest, res: Response, next: NextFunction) => {
    try {
        const notifications = await Notification.find({ user: req.id }).sort({ createdAt: -1 });
        res.status(200).json({ message: 'Notifications', notifications });
        const notIds = notifications.filter(each => !each.read).map(item => item._id);
        await Notification.updateMany({ _id: { $in: notIds } }, { $set: { read: true } })
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to get learning items'));
    }
}