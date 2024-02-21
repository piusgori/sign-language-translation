import { Router } from "express";
import adminAuthRouter from "./auth";
import accessToken from "../../middleware/access-token";
import adminAccessToken from "../../middleware/admin-access-token";
import { body } from "express-validator";
import { addItem, approveItem, deleteItem, editItem, requests } from "../../controllers/admin";

const adminMainRouter = Router();

adminMainRouter.use('/auth', adminAuthRouter);

adminMainRouter.post('/add-item', accessToken, adminAccessToken, [
    body('image').isLength({ min: 1 }).withMessage('Image is required'),
    body('meaning').isLength({ min: 1 }).withMessage('Meaning is required'),
], addItem);

adminMainRouter.patch('/edit-item', accessToken, adminAccessToken, [
    body('itemId').isLength({ min: 1 }).withMessage('Please select an item'),
    body('image').isLength({ min: 1 }).withMessage('Image is required'),
    body('meaning').isLength({ min: 1 }).withMessage('Meaning is required'),
], editItem);

adminMainRouter.delete('/delete-item', accessToken, adminAccessToken, deleteItem);

adminMainRouter.get('/requests', accessToken, adminAccessToken, requests);

adminMainRouter.patch('/approve-item', accessToken, adminAccessToken, [
    body('itemId').isLength({ min: 1 }).withMessage('Please select an item'),
], approveItem);

export default adminMainRouter;