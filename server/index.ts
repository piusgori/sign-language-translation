import express, { Express, Request, Response, NextFunction } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';

import mainRouter from './routes/main';
import HttpError from './models/http-error';

dotenv.config();

const app: Express = express();

app.use(bodyParser.json());

app.use((req: Request, res: Response, next: NextFunction) => {
    res.setHeader("Access-Control-Allow-Origin", '*')
    res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, PUT, DELETE");
    next();
});

app.use(mainRouter);

app.use((req, res, next) => {
    throw new HttpError('The page you are looking for could not be found', null, 404)
});

app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    res.status(error.code || 500);
    res.json({ message: error.message || 'An unknown error has occured', content: error.content || null })
})

mongoose.set('strictQuery', false).connect(process.env.MONGO_URL as string).then(() => {
    app.listen(process.env.PORT || 8000, () => {
        console.log('Connected');
    })
}).catch((err) => {
    console.log(err)
})