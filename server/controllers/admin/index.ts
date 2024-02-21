import { NextFunction, Response } from "express";
import { TokenRequest } from "../../types";
import { validationResult } from "express-validator";
import HttpError from "../../models/http-error";
import Item from "../../models/item";
import Notification from "../../models/notification";

export async function addItem(req: TokenRequest, res: Response, next: NextFunction) {
    try {
        const { image, meaning } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new HttpError('Validation Error', errorArray[0].msg, 422));
        };
        const createdItem = { image, meaning } as any;
        const newItem = new Item(createdItem) as any;
        await newItem.save();
        res.status(200).json({ message: 'Item created', item: newItem['_doc'] })
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to add item'));
    }
}

export async function editItem(req: TokenRequest, res: Response, next: NextFunction) {
    try {
        const { itemId, image, meaning } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new HttpError('Validation Error', errorArray[0].msg, 422));
        };
        const foundItem = await Item.findById(itemId);
        if (!foundItem) return next(new HttpError('Item Error', 'Item Not Found', 404));
        await Item.updateOne({ _id: itemId }, { $set: { meaning, image } });
        res.status(200).json({ message: 'Item updated' })
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to edit Item'));
    }
}

export async function deleteItem(req: TokenRequest, res: Response, next: NextFunction) {
    try {
        const { itemId } = req.query;
        const foundItem = await Item.findById(itemId);
        if (!foundItem) return next(new HttpError('Item error', 'Item not found', 404));
        await Item.deleteOne({ _id: itemId });
        res.status(200).json({ message: 'Item deleted' });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to delete Item'))
    }
}

export async function requests(req: TokenRequest, res: Response, next: NextFunction) {
    try {
        const itemRequests = await Item.find({ approved: false }).sort({ createdAt: -1 });
        res.status(200).json({ message: 'Requests', items: itemRequests });
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to get requests'))
    }
}

export async function approveItem(req: TokenRequest, res: Response, next: NextFunction) {
    try {
        const { itemId } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            return next(new HttpError('Validation Error', errorArray[0].msg, 422));
        };
        const foundItem = await Item.findById(itemId);
        if (!foundItem) return next(new HttpError('Item Error', 'Item Not Found', 404));
        await Item.updateOne({ _id: itemId }, { $set: { approved: true } });
        if (foundItem.requestUser) {
            await Notification.create({ user: foundItem.requestUser, message: `Your learning resource "${foundItem.meaning}" has been approved and can be now viewed my the whole community` });
        }
        res.status(200).json({ message: 'Item has been approved' })
    } catch (err) {
        console.log(err);
        return next(new HttpError('Unable to approve Item'));
    }
}