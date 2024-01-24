import { Router } from "express";
import { main } from "../controllers/main";
import authRouter from "./auth";

const mainRouter = Router();

mainRouter.get('/', main);

mainRouter.use('/auth', authRouter);

export default mainRouter;