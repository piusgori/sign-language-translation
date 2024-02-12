import { Router } from "express";
import { getChats, main, searchUser, sendMessage } from "../controllers/main";
import authRouter from "./auth";
import accessToken from "../middleware/access-token";

const mainRouter = Router();

mainRouter.get('/', main);

mainRouter.use('/auth', authRouter);

mainRouter.get('/search-user', accessToken, searchUser);

mainRouter.get('/chats', accessToken, getChats)

mainRouter.post('/send-message', accessToken, sendMessage);

export default mainRouter;