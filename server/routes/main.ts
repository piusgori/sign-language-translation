import { Router } from "express";
import { addRequest, answerQuestion, completeTopic, getChats, learning, learnLesson, main, notifications, searchUser, sendMessage, singleTopic, topics } from "../controllers/main";
import authRouter from "./auth";
import accessToken from "../middleware/access-token";
import adminMainRouter from "./admin";
import { body } from "express-validator";

const mainRouter = Router();

mainRouter.get('/', main);

mainRouter.use('/auth', authRouter);

mainRouter.use('/admin', adminMainRouter);

mainRouter.get('/search-user', accessToken, searchUser);

mainRouter.get('/chats', accessToken, getChats)

mainRouter.post('/send-message', accessToken, sendMessage);

mainRouter.get('/learning', accessToken, learning);

mainRouter.post('/add-request', accessToken, [
    body('image').isLength({ min: 1 }).withMessage('Image is required'),
    body('meaning').isLength({ min: 1 }).withMessage('Meaning is required'),
], addRequest);

mainRouter.get('/notifications', accessToken, notifications);

mainRouter.get('/topics', accessToken, topics);

mainRouter.get('/single-topic', accessToken, singleTopic);

mainRouter.post('/learn-lesson', accessToken, learnLesson);

mainRouter.post('/answer-question', accessToken, answerQuestion);

mainRouter.post('/complete-topic', accessToken, completeTopic);

export default mainRouter;